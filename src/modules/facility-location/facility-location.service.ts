import { Injectable } from '@nestjs/common';
import { FacilityLocationRepository } from './facility-location.repository';

import type { FacilityLocation } from '@/generated/prisma/client';

@Injectable()
export class FacilityLocationService {
  constructor(
    private readonly facilityLocationRepository: FacilityLocationRepository,
  ) {}

  getAll(): Promise<FacilityLocation[]> {
    return this.facilityLocationRepository.getAll();
  }

  findUnique(truckId: string): Promise<FacilityLocation | null> {
    return this.facilityLocationRepository.findUnique(truckId);
  }
}
