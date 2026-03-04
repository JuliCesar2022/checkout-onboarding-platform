import { Injectable } from '@nestjs/common';
import { IReservationsRepository } from '../../domain/repositories/reservations.repository';

@Injectable()
export class ReleaseReservationUseCase {
  constructor(private readonly reservationsRepo: IReservationsRepository) {}

  async execute(sessionId: string): Promise<void> {
    await this.reservationsRepo.deleteBySessionId(sessionId);
  }
}
