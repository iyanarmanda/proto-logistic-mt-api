import { z } from 'zod';
import { MAINTENANCE_TYPES } from '../enums/maintenance-type.enum';
import { SERVICE_DESCRIPTION } from '../enums/service-description.enum';

export const createMaintenanceRecordDto = z.strictObject({
  truckId: z.string().min(1, 'Truck ID is required'),
  maintenanceDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Maintenance Date format must be yyyy-mm-dd')
    .transform((val) => new Date(val))
    .refine((date) => {
      const today = new Date();
      return date <= today;
    }, 'Maintenance Date cannot be in the future'),
  maintenanceType: z.enum(MAINTENANCE_TYPES),
  odometerReading: z.number().int(),
  laborHours: z
    .number()
    .min(0)
    .multipleOf(0.01, 'Labor Hours max decimal places allowed is 2')
    .max(
      99999999.99,
      'Labor Hours exceeds the maximum precision of Decimal(10,2)',
    ),
  laborCost: z
    .number()
    .min(0)
    .multipleOf(0.01, 'Labor Cost max decimal places allowed is 2')
    .max(
      99999999.99,
      'Labor Cost exceeds the maximum precision of Decimal(10,2)',
    ),
  partCost: z
    .number()
    .min(0)
    .multipleOf(0.01, 'Part Cost max decimal places allowed is 2')
    .max(
      99999999.99,
      'Part Cost exceeds the maximum precision of Decimal(10,2)',
    ),
  downtimeHours: z
    .number()
    .min(0)
    .multipleOf(0.01, 'Downtime Hours max decimal places allowed is 2')
    .max(
      99999999.99,
      'Downtime Hours exceeds the maximum precision of Decimal(10,2)',
    ),
  facilityLocation: z.string().min(1, 'Facility Location is required'),
  serviceDescription: z.enum(SERVICE_DESCRIPTION),
});

export type CreateMaintenanceRecordDto = z.infer<
  typeof createMaintenanceRecordDto
>;
