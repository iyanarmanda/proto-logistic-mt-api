import { Test, TestingModule } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { of, throwError } from 'rxjs';
import { MaintenanceRecordService } from './maintenance-record.service';
import { MaintenanceRecordRepository } from './maintenance-record.repository';
import { TruckService } from '@/modules/truck/truck.service';
import { FacilityLocationService } from '@/modules/facility-location/facility-location.service';

import type { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';

describe('MaintenanceRecordService', () => {
  let service: MaintenanceRecordService;

  // Mocks
  const mockHttpService = { post: jest.fn() };
  const mockRepository = { findLatestByTruckId: jest.fn(), create: jest.fn() };
  const mockTruckService = { findUnique: jest.fn() };
  const mockLocationService = { findUnique: jest.fn() };
  const mockConfigService = { getOrThrow: jest.fn() };
  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setContext: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceRecordService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: MaintenanceRecordRepository, useValue: mockRepository },
        { provide: TruckService, useValue: mockTruckService },
        { provide: FacilityLocationService, useValue: mockLocationService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PinoLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<MaintenanceRecordService>(MaintenanceRecordService);
    mockConfigService.getOrThrow.mockReturnValue('http://ai-service');
  });

  const validDto: CreateMaintenanceRecordDto = {
    truckId: 'TRK00001',
    maintenanceDate: new Date('2026-04-29'),
    maintenanceType: 'Preventive',
    odometerReading: 10000,
    laborHours: 2,
    laborCost: 200,
    partCost: 300,
    downtimeHours: 4,
    facilityLocation: 'Kansas City',
    serviceDescription: 'Routine Preventive',
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('success cases', () => {
    describe('create', () => {
      it('should create maintenance record successfully', async () => {
        mockTruckService.findUnique.mockResolvedValue({
          id: 1,
          truckId: 'TRK00001',
        });
        mockLocationService.findUnique.mockResolvedValue({
          id: 1,
          name: 'Kansas City',
        });
        mockRepository.findLatestByTruckId.mockResolvedValue(null);

        const aiResponse = {
          data: { is_anomaly: false, anomaly_score: 0.1, metadata: {} },
        };
        mockHttpService.post.mockReturnValue(of(aiResponse));

        const savedRecord = { id: 99, ...validDto };
        mockRepository.create.mockResolvedValue(savedRecord);

        const result = await service.create(validDto);

        expect(mockTruckService.findUnique).toHaveBeenCalledWith(
          validDto.truckId,
        );
        expect(mockRepository.create).toHaveBeenCalledWith(validDto);
        expect(mockLogger.info).toHaveBeenCalledWith(
          expect.objectContaining({
            event: 'MAINTENANCE_RECORD_CREATE',
            action: 'CREATE_MAINTENANCE_RECORD',
            maintenanceRecordIdTarget: 99,
            success: true,
          }),
          'Maintenance Record created',
        );
        expect(result).toHaveProperty('aiAnalysis');
      });

      it('should return anomaly data without saving to db if AI detects anomaly', async () => {
        mockTruckService.findUnique.mockResolvedValue({ id: 1 });
        mockLocationService.findUnique.mockResolvedValue({ id: 1 });
        mockRepository.findLatestByTruckId.mockResolvedValue(null);

        const aiResponse = {
          data: {
            is_anomaly: true,
            anomaly_score: -0.8,
            metadata: { reason: 'Outlier' },
          },
        };
        mockHttpService.post.mockReturnValue(of(aiResponse));

        const result = await service.create(validDto);

        expect(result).toEqual({
          is_anomaly: true,
          anomaly_score: -0.8,
          metadata: { reason: 'Outlier' },
        });
        expect(mockRepository.create).not.toHaveBeenCalled();
      });
    });
  });

  describe('fail cases', () => {
    describe('create', () => {
      it('should throw NotFoundException if truck does not exist', async () => {
        mockTruckService.findUnique.mockResolvedValue(null);

        await expect(service.create(validDto)).rejects.toThrow(
          NotFoundException,
        );

        expect(mockLogger.warn).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'CHECK_TRUCK_ID',
            truckIdTarget: validDto.truckId,
            success: false,
          }),
          'Missing Truck ID on create',
        );
      });

      it('should throw NotFoundException if facility location does not exist', async () => {
        mockTruckService.findUnique.mockResolvedValue({ id: 1 });
        mockLocationService.findUnique.mockResolvedValue(null);

        await expect(service.create(validDto)).rejects.toThrow(
          NotFoundException,
        );

        expect(mockLogger.warn).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'CHECK_LOCATION',
            facilityLocationTarget: validDto.facilityLocation,
            success: false,
          }),
          'Missing Facility Location on create',
        );
      });

      it('should throw InternalServerErrorException if AI Service is down', async () => {
        mockTruckService.findUnique.mockResolvedValue({ id: 1 });
        mockLocationService.findUnique.mockResolvedValue({ id: 1 });
        mockHttpService.post.mockReturnValue(
          throwError(() => new Error('Connection Refused')),
        );

        await expect(service.create(validDto)).rejects.toThrow(
          InternalServerErrorException,
        );

        expect(mockLogger.error).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'AI_SERVICE_CALL',
            success: false,
          }),
          'AI Service call failed',
        );
      });
    });
  });
});
