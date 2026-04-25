import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { truckData } from './data/truck.data';

@Injectable()
export class TruckSeeder implements OnModuleInit {
  private readonly logger = new Logger(TruckSeeder.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.run();
  }

  async run(): Promise<void> {
    this.logger.log('Checking database for Truck data...');

    try {
      const count = await this.prisma.truck.count();
      if (count > 0) {
        this.logger.log('Truck already exist, skipping seed');
        return;
      }

      await this.prisma.truck.createMany({ data: truckData });
      this.logger.log('Truck seeded successfully');
    } catch (err) {
      this.logger.log('Failed to seed Truck data', err);
    }
  }
}
