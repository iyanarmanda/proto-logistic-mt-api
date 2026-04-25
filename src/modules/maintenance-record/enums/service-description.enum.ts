export const SERVICE_DESCRIPTION = [
  'Routine Inspection',
  'Routine Preventive',
  'Routine Repair',
  'Routine Tire',
  'Routine Brake',
  'Routine Engine',
  'Routine Transmission',

  'Scheduled Inspection',
  'Scheduled Preventive',
  'Scheduled Repair',
  'Scheduled Tire',
  'Scheduled Brake',
  'Scheduled Engine',
  'Scheduled Transmission',

  'Emergency Inspection',
  'Emergency Preventive',
  'Emergency Repair',
  'Emergency Tire',
  'Emergency Brake',
  'Emergency Engine',
  'Emergency Transmission',
] as const;

export type ServiceDescription = (typeof SERVICE_DESCRIPTION)[number];
