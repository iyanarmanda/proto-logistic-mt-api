import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { SeedModule } from './seed/seed.module';
import { HealthModule } from './modules/health/health.module';
import { TruckModule } from './modules/truck/truck.module';
import { FacilityLocationModule } from './modules/facility-location/facility-location.module';
import { MaintenanceRecordModule } from './modules/maintenance-record/maintenance-record.module';

@Module({
  imports: [
    CoreModule,
    SeedModule,
    HealthModule,
    TruckModule,
    FacilityLocationModule,
    MaintenanceRecordModule,
  ],
})
export class AppModule {}
