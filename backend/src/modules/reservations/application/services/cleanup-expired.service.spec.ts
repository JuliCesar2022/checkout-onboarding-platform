import { Test, TestingModule } from '@nestjs/testing';
import { CleanupExpiredReservationsService } from './cleanup-expired.service';
import { IReservationsRepository } from '../../domain/repositories/reservations.repository';

describe('CleanupExpiredReservationsService', () => {
  let service: CleanupExpiredReservationsService;
  let repository: any;

  beforeEach(async () => {
    repository = {
      deleteExpired: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CleanupExpiredReservationsService,
        {
          provide: IReservationsRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<CleanupExpiredReservationsService>(CleanupExpiredReservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repository.deleteExpired during cleanup', async () => {
    repository.deleteExpired.mockResolvedValue(5);
    
    // We spy on console.log if we want to verify the output, but it's not strictly necessary for coverage
    const spy = jest.spyOn(console, 'log').mockImplementation();

    await service.cleanupExpired();

    expect(repository.deleteExpired).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Deleted 5 expired reservation(s)'));
    
    spy.mockRestore();
  });

  it('should not log if no reservations were deleted', async () => {
    repository.deleteExpired.mockResolvedValue(0);
    const spy = jest.spyOn(console, 'log').mockImplementation();

    await service.cleanupExpired();

    expect(repository.deleteExpired).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });
});
