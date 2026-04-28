import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { MaintenanceRecordService } from './maintenance-record.service';
import { createMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';

import type { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';
import type { CreatedResponse } from './interfaces/response.interface';

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
  ): Promise<CreatedResponse> {
    const data = await this.maintenanceRecordService.create(body);

    return {
      message: 'Maintenance recorded successfully',
      data,
    };
  }
}
