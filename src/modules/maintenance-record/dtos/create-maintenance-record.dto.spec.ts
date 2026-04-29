import { createMaintenanceRecordDto } from './create-maintenance-record.dto';

describe('CreateMaintenanceRecordDto', () => {
  const validData = {
    truckId: 'TRK00001',
    maintenanceDate: '2026-04-25',
    maintenanceType: 'Repair',
    odometerReading: 50000,
    laborHours: 5.5,
    laborCost: 500.0,
    partCost: 1250.75,
    downtimeHours: 2.0,
    facilityLocation: 'Los Angeles',
    serviceDescription: 'Routine Repair',
  };

  it('should be defined', () => {
    expect(createMaintenanceRecordDto).toBeDefined();
  });

  describe('Success Cases', () => {
    it('should pass with correct data', () => {
      const result = createMaintenanceRecordDto.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.maintenanceDate).toBeInstanceOf(Date);
        expect(result.data.truckId).toBe(validData.truckId);
      }
    });

    it('should pass with inetger values for decimal fields', () => {
      const dataWithIntegers = { ...validData, laborCost: 1000 };
      const result = createMaintenanceRecordDto.safeParse(dataWithIntegers);
      expect(result.success).toBe(true);
    });
  });

  describe('Fail Cases', () => {
    it('should fail if required field is empty', () => {
      const result = createMaintenanceRecordDto.safeParse({
        ...validData,
        truckId: '',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Truck ID is required');
    });

    it('should fail if maintenanceDate format is invalid (yyyy/mm/dd)', () => {
      const result = createMaintenanceRecordDto.safeParse({
        ...validData,
        maintenanceDate: '2026/04/25',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Maintenance Date format must be yyyy-mm-dd',
      );
    });

    it('should fail if maintenanceDate is in the future', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const result = createMaintenanceRecordDto.safeParse({
        ...validData,
        maintenanceDate: tomorrowStr,
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Maintenance Date cannot be in the future',
      );
    });

    it('should fail if enum fields is not in enum', () => {
      const result = createMaintenanceRecordDto.safeParse({
        ...validData,
        maintenanceType: 'Change Truck',
      });
      expect(result.success).toBe(false);
    });

    it('should fail if decimal fields has more than 2 decimal places', () => {
      const result = createMaintenanceRecordDto.safeParse({
        ...validData,
        laborHours: 5.555,
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Labor Hours max decimal places allowed is 2',
      );
    });

    it('should fail if decimal fields exceeds maximum precision', () => {
      const result = createMaintenanceRecordDto.safeParse({
        ...validData,
        laborCost: 100000000.0,
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Labor Cost exceeds the maximum precision of Decimal(10,2)',
      );
    });

    it('should fail if odometerReading is not an integer', () => {
      const result = createMaintenanceRecordDto.safeParse({
        ...validData,
        odometerReading: 50000.5,
      });
      expect(result.success).toBe(false);
    });

    it('should fail if mandatory fields are missing', () => {
      const result = createMaintenanceRecordDto.safeParse({
        truckId: 'TRK00001',
        maintenanceDate: '2026-04-25',
      });
      expect(result.success).toBe(false);
    });

    it('should fail if there are extra properties (strictObject)', () => {
      const result = createMaintenanceRecordDto.safeParse({
        ...validData,
        extra: 'cat',
      });
      expect(result.success).toBe(false);
    });
  });
});
