import type { MaintenanceRecord } from '@/generated/prisma/client';

export interface AIServiceResponse {
  is_anomaly: boolean;
  anomaly_score: number;
  metadata: unknown;
  error?: string;
}

export interface MaintenanceRecordWithAI extends MaintenanceRecord {
  aiAnalysis: {
    isAnomaly: boolean;
    anomalyScore: number;
    metadata: unknown;
  };
}
