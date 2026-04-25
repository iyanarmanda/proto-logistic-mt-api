import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { FacilityLocationController } from './facility-location.controller';
import { FacilityLocationService } from './facility-location.service';
import { FacilityLocationRepository } from './facility-location.repository';

@Module({
  controllers: [FacilityLocationController],
  providers: [
    PrismaService,
    FacilityLocationService,
    FacilityLocationRepository,
  ],
  exports: [FacilityLocationService],
})
export class FacilityLocationModule {}
