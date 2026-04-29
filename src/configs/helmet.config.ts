// import { FastifyHelmetOptions } from '@fastify/helmet';
// import { ConfigService } from '@nestjs/config';

// export const helmetConfig = (
//   configService: ConfigService,
// ): FastifyHelmetOptions => {
//   const NODE_ENV = configService.get<string>('NODE_ENV', 'production');
//   const isDev = NODE_ENV === 'development';

//   return {
//     contentSecurityPolicy: isDev ? false : undefined,
//   };
// };
