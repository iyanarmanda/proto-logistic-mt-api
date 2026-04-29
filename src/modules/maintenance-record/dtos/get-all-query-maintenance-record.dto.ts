import { z } from 'zod';
import { clamp } from '@/common/lib/clamp';
import { emptyStringToNull } from '@/common/validators/empty-string-to-null.validator';

export const getAllQueryMaintenanceRecordDto = z.strictObject({
  page: z.coerce
    .number()
    .transform((v) => Math.floor(v))
    .transform(clamp(1, Infinity))
    .default(1),
  limit: z.coerce
    .number()
    .transform((v) => Math.floor(v))
    .transform(clamp(1, 100))
    .default(25),

  sort: z.preprocess(
    (v) => (v === 'asc' || v === 'desc' ? v : null),
    z.enum(['asc', 'desc']).nullable().default(null),
  ),

  filter: emptyStringToNull.default(null),
});

export type GetAllQueryMaintenanceRecordDto = z.infer<
  typeof getAllQueryMaintenanceRecordDto
>;
