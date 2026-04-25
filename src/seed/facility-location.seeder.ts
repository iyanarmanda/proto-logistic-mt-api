import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { facilityLocationData } from './data/facility-location.data';

@Injectable()
export class FacilityLocationSeeder implements OnModuleInit {
  private readonly logger = new Logger(FacilityLocationSeeder.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.run();
  }

  async run(): Promise<void> {
    this.logger.log('Checking database for FacilityLocation data...');

    try {
      const count = await this.prisma.facilityLocation.count();
      if (count > 0) {
        this.logger.log('FacilityLocation already exist, skipping seed');
        return;
      }

      await this.prisma.facilityLocation.createMany({
        data: facilityLocationData,
      });
      this.logger.log('FacilityLocation seeded successfully');
    } catch (err) {
      this.logger.log('Failed to seed FacilityLocation data', err);
    }
  }
}
