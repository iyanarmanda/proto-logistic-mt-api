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
