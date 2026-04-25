import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';

import type { Truck } from '@/generated/prisma/client';

@Injectable()
export class TruckRepository {
  constructor(private readonly prisma: PrismaService) {}

  getAll(): Promise<Truck[]> {
    return this.prisma.truck.findMany();
  }

  findUnique(truckId: string): Promise<Truck | null> {
    return this.prisma.truck.findUnique({
      where: { truckId },
    });
  }
}
