import { Injectable } from '@nestjs/common';

import type { HealthResponse } from './interfaces/response.interface';

@Injectable()
export class HealthService {
  apiCheck(): HealthResponse {
    return {
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
