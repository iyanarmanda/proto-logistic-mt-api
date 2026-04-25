import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

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

  app.useLogger(app.get(Logger));

  app.setGlobalPrefix('api');

  // app.useGlobalFilters(new PrismaExceptionFilter());

  const PORT = configService.get<number>('PORT', 3000);
  await app.listen(PORT, '0.0.0.0');
}
bootstrap().catch((err) => {
  console.error('Bootstrap failed', err);
  process.exit(1);
});
