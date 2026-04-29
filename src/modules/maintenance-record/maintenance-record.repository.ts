import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';

import type { MaintenanceRecord } from '@/generated/prisma/client';
import type { GetAllQueryMaintenanceRecordDto } from './dtos/get-all-query-maintenance-record.dto';
import type { GetAllResponse } from './interfaces/response.interface';

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

  async findAllMaintenanceRecords(
    query: GetAllQueryMaintenanceRecordDto,
  ): Promise<GetAllResponse> {
    const { page, limit, sort, filter } = query;

    const skip = (page - 1) * limit;

    const where = filter
      ? {
          truck: {
            truckId: filter,
          },
        }
      : {};

    const [data, totalCount] = await Promise.all([
      this.prisma.maintenanceRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          maintenanceDate: sort || 'desc',
        },
        include: {
          truck: true,
          facilityLocation: true,
        },
      }),
      this.prisma.maintenanceRecord.count({ where }),
    ]);

    return {
      data,
      meta: {
        totalData: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        page,
        limit,
      },
    };
  }
}
