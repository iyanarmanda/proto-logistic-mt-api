import { Controller, Get } from '@nestjs/common';
import { TruckService } from './truck.service';

import type { Truck } from '@/generated/prisma/client';

@Controller('truck')
export class TruckController {
  constructor(private readonly truckService: TruckService) {}

  @Get()
  getAll(): Promise<Truck[]> {
    return this.truckService.getAll();
  }
}
