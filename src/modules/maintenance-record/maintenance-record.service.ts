import { Injectable, NotFoundException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { BaseService } from '@/common/services/base.service';
import { TruckService } from '@/modules/truck/truck.service';
import { FacilityLocationService } from '@/modules/facility-location/facility-location.service';
import { MaintenanceRecordRepository } from './maintenance-record.repository';

import type { MaintenanceRecord } from '@/generated/prisma/client';
import type { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';

@Injectable()
export class MaintenanceRecordService extends BaseService {
  constructor(
    private readonly maintenanceRecordRepository: MaintenanceRecordRepository,
    private readonly truckService: TruckService,
    private readonly facilityLocationService: FacilityLocationService,
    readonly logger: PinoLogger,
  ) {
    super(logger);
  }

  async create(body: CreateMaintenanceRecordDto): Promise<MaintenanceRecord> {
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

    return maintenanceRecord;
  }
}
