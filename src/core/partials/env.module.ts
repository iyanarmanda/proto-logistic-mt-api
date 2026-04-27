import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => {
        const schema = z.object({
          PORT: z.preprocess(
            (val) => (val ? Number(val) : undefined),
            z.number().default(3000),
          ),
          NODE_ENV: z
            .enum(['production', 'development', 'test'])
            .default('production'),

          DATABASE_URL: z.string(),

          CORS_ORIGIN: z.string(),
        });
        return schema.parse(env);
      },
    }),
  ],
})
export class EnvModule {}
