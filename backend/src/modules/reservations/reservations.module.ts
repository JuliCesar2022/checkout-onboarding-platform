import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { RedisModule } from '../storage/redis/redis.module';
import { CreateReservationUseCase } from './application/use-cases/create-reservation.use-case';
import { ReleaseReservationUseCase } from './application/use-cases/release-reservation.use-case';
import { CleanupExpiredReservationsService } from './application/services/cleanup-expired.service';
import { RedisReservationsRepository } from './infrastructure/repositories/prisma-reservations.repository';
import { ReservationsController } from './infrastructure/controllers/reservations.controller';
import { IReservationsRepository } from './domain/repositories/reservations.repository';

@Module({
  imports: [RedisModule, ProductsModule],
  controllers: [ReservationsController],
  providers: [
    { provide: IReservationsRepository, useClass: RedisReservationsRepository },
    CreateReservationUseCase,
    ReleaseReservationUseCase,
    CleanupExpiredReservationsService,
  ],
  exports: [IReservationsRepository],
})
export class ReservationsModule {}
