import { Controller, Get } from '@nestjs/common';
import { FacilityLocationService } from './facility-location.service';

import type { FacilityLocation } from '@/generated/prisma/client';

@Controller('facility-location')
export class FacilityLocationController {
  constructor(private readonly truckService: FacilityLocationService) {}

  @Get()
  getAll(): Promise<FacilityLocation[]> {
    return this.truckService.getAll();
  }
}
