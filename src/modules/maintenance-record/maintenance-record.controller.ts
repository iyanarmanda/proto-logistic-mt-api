import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { MaintenanceRecordService } from './maintenance-record.service';
import { createMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';
import { getAllQueryMaintenanceRecordDto } from './dtos/get-all-query-maintenance-rercord.dto';

import type { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';
import type { GetAllQueryMaintenanceRecordDto } from './dtos/get-all-query-maintenance-rercord.dto';
import type {
  AnomalyResponse,
  CreatedResponse,
  GetAllResponse,
} from './interfaces/response.interface';

@Controller('maintenance')
export class MaintenanceRecordController {
  constructor(
    private readonly maintenanceRecordService: MaintenanceRecordService,
  ) {}

  @UseGuards(ThrottlerGuard)
  @Post()
  async create(
    @Body(new ZodValidationPipe(createMaintenanceRecordDto))
    body: CreateMaintenanceRecordDto,
  ): Promise<CreatedResponse | AnomalyResponse> {
    const maintenanceRecord = await this.maintenanceRecordService.create(body);

    if ('is_anomaly' in maintenanceRecord) {
      return {
        message: 'Maintenance record is marked as an anomaly',
        data: maintenanceRecord,
      };
    }

    return {
      message: 'Maintenance recorded successfully',
      data: maintenanceRecord,
    };
  }

  @Get()
  async getAll(
    @Query(new ZodValidationPipe(getAllQueryMaintenanceRecordDto))
    query: GetAllQueryMaintenanceRecordDto,
  ): Promise<GetAllResponse> {
    return await this.maintenanceRecordService.getAll(query);
  }
}
