import { Module, Global } from '@nestjs/common';
import { EnvModule } from './partials/env.module';
import { LoggerModule } from './partials/logger.module';
import { ThrottlerConfigModule } from './partials/throttler-config.module';

@Global()
@Module({
  imports: [EnvModule, LoggerModule, ThrottlerConfigModule],
  exports: [EnvModule, LoggerModule, ThrottlerConfigModule],
})
export class CoreModule {}
