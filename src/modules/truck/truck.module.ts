import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { TruckController } from './truck.controller';
import { TruckService } from './truck.service';
import { TruckRepository } from './truck.repository';

@Module({
  imports: [],
  controllers: [TruckController],
  providers: [PrismaService, TruckService, TruckRepository],
})
export class TruckModule {}
