import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { TruckController } from './truck.controller';
import { TruckService } from './truck.service';
import { TruckRepository } from './truck.repository';

@Module({
  controllers: [TruckController],
  providers: [PrismaService, TruckService, TruckRepository],
  exports: [TruckService],
})
export class TruckModule {}
