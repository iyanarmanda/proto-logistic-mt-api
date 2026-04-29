import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { PinoLogger } from 'nestjs-pino';
import { firstValueFrom } from 'rxjs';
import { BaseService } from '@/common/services/base.service';
import { TruckService } from '@/modules/truck/truck.service';
import { FacilityLocationService } from '@/modules/facility-location/facility-location.service';
import { MaintenanceRecordRepository } from './maintenance-record.repository';

import type { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';
import type { GetAllQueryMaintenanceRecordDto } from './dtos/get-all-query-maintenance-rercord.dto';
import type {
  AIServiceResponse,
  MaintenanceRecordWithAI,
} from './interfaces/ai.interface';
import type { GetAllResponse } from './interfaces/response.interface';

@Injectable()
export class MaintenanceRecordService extends BaseService {
  private readonly AI_API_URL: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly maintenanceRecordRepository: MaintenanceRecordRepository,
    private readonly truckService: TruckService,
    private readonly facilityLocationService: FacilityLocationService,
    private readonly configService: ConfigService,
    readonly logger: PinoLogger,
  ) {
    super(logger);
    this.AI_API_URL = this.configService.getOrThrow<string>('AI_API_URL');
  }

  async create(
    body: CreateMaintenanceRecordDto,
  ): Promise<MaintenanceRecordWithAI | AIServiceResponse> {
    // validate truckId if provided
    const truck = await this.truckService.findUnique(body.truckId);
    if (!truck) {
      this.logger.warn(
        {
          event: 'MAINTENANCE_RECORD_CREATE',
          action: 'CHECK_TRUCK_ID',
          truckIdTarget: body.truckId,
          success: false,
        },
        'Missing Truck ID on create',
      );
      throw new NotFoundException('Truck ID does not exist');
    }

    // validate facilityLocation if provided
    const facilityLocation = await this.facilityLocationService.findUnique(
      body.facilityLocation,
    );
    if (!facilityLocation) {
      this.logger.warn(
        {
          event: 'MAINTENANCE_RECORD_CREATE',
          action: 'CHECK_LOCATION',
          facilityLocationTarget: body.facilityLocation,
          success: false,
        },
        'Missing Facility Location on create',
      );
      throw new NotFoundException('Facility Location does not exist');
    }

    // calculate days since last maintenance record for the same truck
    const lastRecord =
      await this.maintenanceRecordRepository.findLatestByTruckId(body.truckId);
    let daysSinceLast = 0;
    if (lastRecord) {
      const current = new Date(body.maintenanceDate);
      const previous = new Date(lastRecord.maintenanceDate);
      const diffTime = Math.abs(current.getTime() - previous.getTime());
      daysSinceLast = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const aiPayload = {
      truck_id: body.truckId,
      maintenance_date: body.maintenanceDate,
      service_description: body.serviceDescription,
      maintenance_type: body.maintenanceType,
      odometer_reading: body.odometerReading,
      labor_hours: body.laborHours,
      labor_cost: body.laborCost,
      parts_cost: body.partCost,
      total_cost: Number(body.laborCost) + Number(body.partCost),
      facility_location: body.facilityLocation,
      downtime_hours: body.downtimeHours,
      days_since_last: daysSinceLast,
    };

    // call AI service for anomaly detection and log the response
    let aiResponse: AIServiceResponse;
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<AIServiceResponse>(
          `${this.AI_API_URL}/predict`,
          aiPayload,
        ),
      );

      if (data.error) {
        this.logger.warn(
          {
            event: 'MAINTENANCE_RECORD_CREATE',
            action: 'AI_SERVICE_PREDICTION',
            error: data.error,
            success: false,
          },
          'AI Service returned an error during prediction',
        );
        throw new BadRequestException(data.error);
      }

      if (data.is_anomaly) {
        return {
          is_anomaly: data.is_anomaly,
          anomaly_score: data.anomaly_score,
          metadata: data.metadata,
        };
      }

      aiResponse = data;
    } catch (err) {
      this.logger.error(
        {
          event: 'MAINTENANCE_RECORD_CREATE',
          action: 'AI_SERVICE_CALL',
          error: err instanceof Error ? err.message : String(err),
          success: false,
        },
        'AI Service call failed',
      );
      throw new InternalServerErrorException('AI Service is unavailable');
    }

    // save maintenance record to database
    const maintenanceRecord =
      await this.maintenanceRecordRepository.create(body);

    this.logger.info(
      {
        event: 'MAINTENANCE_RECORD_CREATE',
        action: 'CREATE_MAINTENANCE_RECORD',
        maintenanceRecordIdTarget: maintenanceRecord.id,
        success: true,
      },
      'Maintenance Record created',
    );

    return {
      ...maintenanceRecord,
      aiAnalysis: {
        isAnomaly: aiResponse.is_anomaly,
        anomalyScore: aiResponse.anomaly_score,
        metadata: aiResponse.metadata,
      },
    };
  }

  async getAll(
    query: GetAllQueryMaintenanceRecordDto,
  ): Promise<GetAllResponse> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 25;

    return await this.maintenanceRecordRepository.findAllMaintenanceRecords({
      page,
      limit,
      sort: query.sort,
      filter: query.filter,
    });
  }
}
