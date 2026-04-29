import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import { CorsConfig } from './configs/cors.config';
import { PrismaExceptionFilter } from './configs/filters/prisma-exception.filter';
import { AppModule } from './app.module';
import helmet from '@fastify/helmet';

import type { NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );

  const configService = app.get(ConfigService);
  const NODE_ENV = configService.get<string>('NODE_ENV', 'production');
  const PORT = configService.get<number>('PORT', 3000);

  app.useLogger(app.get(Logger));

  await app.register(helmet, {
    contentSecurityPolicy: NODE_ENV === 'development' ? false : undefined,
  });

  app.setGlobalPrefix('api');

  app.enableCors(CorsConfig(configService));

  app.useGlobalFilters(new PrismaExceptionFilter());

  await app.listen(PORT, '0.0.0.0');
}
bootstrap().catch((err) => {
  console.error('Bootstrap failed', err);
  process.exit(1);
});
