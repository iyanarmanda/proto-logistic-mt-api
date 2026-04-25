import { Injectable, NotFoundException } from '@nestjs/common';
import { TruckService } from '@/modules/truck/truck.service';
import { FacilityLocationService } from '@/modules/facility-location/facility-location.service';
import { MaintenanceRecordRepository } from './maintenance-record.repository';

import type { MaintenanceRecord } from '@/generated/prisma/client';
import type { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';

@Injectable()
export class MaintenanceRecordService {
  constructor(
    private readonly maintenanceRecordRepository: MaintenanceRecordRepository,
    private readonly truckService: TruckService,
    private readonly facilityLocationService: FacilityLocationService,
  ) {}

  async create(body: CreateMaintenanceRecordDto): Promise<MaintenanceRecord> {
    const truck = await this.truckService.findUnique(body.truckId);
    if (!truck) throw new NotFoundException('Truck ID does not exist');

    const facilityLocation = await this.facilityLocationService.findUnique(
      body.facilityLocation,
    );
    if (!facilityLocation)
      throw new NotFoundException('Facility Location does not exist');

    return await this.maintenanceRecordRepository.create(body);
  }
}
