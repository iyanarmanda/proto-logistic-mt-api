export const MAINTENANCE_TYPES = [
  'Inspection',
  'Preventive',
  'Repair',
  'Tire',
  'Brake',
  'Engine',
  'Transmission',
] as const;

export type MaintenanceType = (typeof MAINTENANCE_TYPES)[number];
