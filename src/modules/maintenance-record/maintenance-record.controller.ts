import { Body, Controller, Post } from '@nestjs/common';
import { MaintenanceRecordService } from './maintenance-record.service';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { createMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';

import type { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';
import type { CreatedResponse } from './interfaces/response.interface';

@Controller('maintenance')
export class MaintenanceRecordController {
  constructor(
    private readonly maintenanceRecordService: MaintenanceRecordService,
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createMaintenanceRecordDto))
    body: CreateMaintenanceRecordDto,
  ): Promise<CreatedResponse> {
    const data = await this.maintenanceRecordService.create(body);

    return {
      message: 'Maintenance recorded successfully',
      data,
    };
  }
}
