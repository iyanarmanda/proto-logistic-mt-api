import { Injectable } from '@nestjs/common';
import { TruckRepository } from './truck.repository';

import type { Truck } from '@/generated/prisma/client';

@Injectable()
export class TruckService {
  constructor(private readonly truckRepository: TruckRepository) {}

  getAll(): Promise<Truck[]> {
    return this.truckRepository.getAll();
  }

  findUnique(truckId: string): Promise<Truck | null> {
    return this.truckRepository.findUnique(truckId);
  }
}
