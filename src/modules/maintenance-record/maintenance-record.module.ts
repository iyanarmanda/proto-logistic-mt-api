import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { TruckModule } from '@/modules/truck/truck.module';
import { FacilityLocationModule } from '@/modules/facility-location/facility-location.module';
import { MaintenanceRecordController } from './maintenance-record.controller';
import { MaintenanceRecordService } from './maintenance-record.service';
import { MaintenanceRecordRepository } from './maintenance-record.repository';

@Module({
  imports: [TruckModule, FacilityLocationModule],
  controllers: [MaintenanceRecordController],
  providers: [
    PrismaService,
    MaintenanceRecordService,
    MaintenanceRecordRepository,
  ],
})
export class MaintenanceRecordModule {}
