import { PrismaService } from '@/common/services/prisma.service';
import { Module } from '@nestjs/common';
import { TruckSeeder } from './truck.seeder';

@Module({
  providers: [PrismaService, TruckSeeder],
})
export class SeedModule {}
