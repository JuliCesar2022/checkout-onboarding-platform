import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IReservationsRepository } from '../../domain/repositories/reservations.repository';

@Injectable()
export class CleanupExpiredReservationsService {
  constructor(private readonly reservationsRepo: IReservationsRepository) {}

  /** Runs every 5 minutes to purge expired reservations */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanupExpired(): Promise<void> {
    const deleted = await this.reservationsRepo.deleteExpired();
    if (deleted > 0) {
      console.log(
        `[ReservationCleanup] Deleted ${deleted} expired reservation(s).`,
      );
    }
  }
}
