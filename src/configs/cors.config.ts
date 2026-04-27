import { ConfigService } from '@nestjs/config';

import type { FastifyCorsOptions } from '@fastify/cors';

export const CorsConfig = (
  configService: ConfigService,
): FastifyCorsOptions => {
  const origin = configService.getOrThrow<string>('CORS_ORIGIN');

  return {
    origin: origin.includes(',') ? origin.split(',') : origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  };
};
