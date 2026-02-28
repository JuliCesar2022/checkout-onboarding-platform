import { Module } from '@nestjs/common';
import { DeliveriesController } from './infrastructure/controllers/deliveries.controller';
import { DeliveriesService } from './application/deliveries.service';
import { IDeliveriesRepository } from './domain/repositories/deliveries.repository';
import { PrismaDeliveriesRepository } from './infrastructure/repositories/prisma-deliveries.repository';

@Module({
  controllers: [DeliveriesController],
  providers: [
    DeliveriesService,
    {
      provide: IDeliveriesRepository,
      useClass: PrismaDeliveriesRepository,
    },
  ],
  exports: [DeliveriesService, IDeliveriesRepository],
})
export class DeliveriesModule {}
