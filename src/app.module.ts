import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { HealthModule } from './modules/health/health.module';
import { TruckModule } from './modules/truck/truck.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [CoreModule, HealthModule, TruckModule, SeedModule],
})
export class AppModule {}
