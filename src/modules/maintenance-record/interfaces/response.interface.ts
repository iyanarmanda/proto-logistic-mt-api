import type { MessageResponse } from '@/common/interfaces/response.interface';
import type { MaintenanceRecord } from '@/generated/prisma/client';

export interface CreatedResponse extends MessageResponse {
  data: MaintenanceRecord;
}
