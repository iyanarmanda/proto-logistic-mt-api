import type { MaintenanceRecord } from '@/generated/prisma/client';
import type { MessageResponse } from '@/common/interfaces/response.interface';
import type {
  AIServiceResponse,
  MaintenanceRecordWithAI,
} from './ai.interface';

export interface CreatedResponse extends MessageResponse {
  data: MaintenanceRecordWithAI;
}

export interface AnomalyResponse {
  message: string;
  data: AIServiceResponse;
}

export interface GetAllResponse {
  data: MaintenanceRecord[];
  meta: {
    totalData: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}
