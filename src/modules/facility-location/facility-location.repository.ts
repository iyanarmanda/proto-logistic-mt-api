import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';

import type { FacilityLocation } from '@/generated/prisma/client';

@Injectable()
export class FacilityLocationRepository {
  constructor(private readonly prisma: PrismaService) {}

  getAll(): Promise<FacilityLocation[]> {
    return this.prisma.facilityLocation.findMany();
  }

  findUnique(name: string): Promise<FacilityLocation | null> {
    return this.prisma.facilityLocation.findUnique({
      where: { name },
    });
  }
}
