import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 600_000,
          limit: 10,
        },
      ],

      errorMessage: 'Limit reached, try again later',
    }),
  ],
})
export class ThrottlerConfigModule {}
