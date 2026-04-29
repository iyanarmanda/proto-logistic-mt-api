import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';

import type { MaintenanceRecord } from '@/generated/prisma/client';

@Injectable()
export class MaintenanceRecordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateMaintenanceRecordDto): Promise<MaintenanceRecord> {
    return await this.prisma.maintenanceRecord.create({
      data: {
        maintenanceDate: body.maintenanceDate,
        odometerReading: body.odometerReading,
        laborHours: body.laborHours,
        laborCost: body.laborCost,
        partCost: body.partCost,
        totalCost: Number(body.laborCost) + Number(body.partCost),
        downtimeHours: body.downtimeHours,
        maintenanceType: body.maintenanceType,
        serviceDescription: body.serviceDescription,
        truck: {
          connect: {
            truckId: body.truckId,
          },
        },
        facilityLocation: {
          connect: {
            name: body.facilityLocation,
          },
        },
      },
    });
  }

  async findLatestByTruckId(truckId: string) {
    return await this.prisma.maintenanceRecord.findFirst({
      where: {
        truck: {
          truckId,
        },
      },
      orderBy: {
        maintenanceDate: 'desc',
      },
    });
  }
}
