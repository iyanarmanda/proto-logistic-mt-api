import { PrismaService } from '@/common/services/prisma.service';
import { Module } from '@nestjs/common';
import { TruckSeeder } from './truck.seeder';
import { FacilityLocationSeeder } from './facility-location.seeder';

@Module({
  providers: [PrismaService, TruckSeeder, FacilityLocationSeeder],
})
export class SeedModule {}
