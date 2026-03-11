import { Test, TestingModule } from '@nestjs/testing';
import { ReleaseReservationUseCase } from './release-reservation.use-case';
import { IReservationsRepository } from '../../domain/repositories/reservations.repository';

describe('ReleaseReservationUseCase', () => {
  let useCase: ReleaseReservationUseCase;
  let reservationsRepo: jest.Mocked<IReservationsRepository>;

  beforeEach(async () => {
    reservationsRepo = {
      deleteBySessionId: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReleaseReservationUseCase,
        { provide: IReservationsRepository, useValue: reservationsRepo },
      ],
    }).compile();

    useCase = module.get<ReleaseReservationUseCase>(ReleaseReservationUseCase);
  });

  it('should call repository to delete by sessionId', async () => {
    await useCase.execute('sess-123');
    expect(reservationsRepo.deleteBySessionId).toHaveBeenCalledWith('sess-123');
  });
});
