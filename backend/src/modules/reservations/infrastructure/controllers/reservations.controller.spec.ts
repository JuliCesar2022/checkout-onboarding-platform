import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { CreateReservationUseCase } from '../../application/use-cases/create-reservation.use-case';
import { ReleaseReservationUseCase } from '../../application/use-cases/release-reservation.use-case';
import { Result } from '../../../../common/result/result';
import { StockReservationEntity } from '../../domain/entities/stock-reservation.entity';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let createUseCase: any;
  let releaseUseCase: any;

  beforeEach(async () => {
    createUseCase = {
      execute: jest.fn(),
    };
    releaseUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        { provide: CreateReservationUseCase, useValue: createUseCase },
        { provide: ReleaseReservationUseCase, useValue: releaseUseCase },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
  });

  describe('create', () => {
    it('should create reservations and return DTO', async () => {
      const mockEntities = [
        new StockReservationEntity(
          'res-1',
          'prod-1',
          2,
          'sess-1',
          new Date(),
          new Date(),
        ),
      ];
      createUseCase.execute.mockResolvedValue(Result.ok(mockEntities));

      const dto = {
        sessionId: 'sess-1',
        items: [{ productId: 'prod-1', quantity: 2 }],
      };

      const result = await controller.create(dto as any);

      expect(createUseCase.execute).toHaveBeenCalledWith('sess-1', dto.items);
      expect(result.sessionId).toBe('sess-1');
      expect(result.items).toHaveLength(1);
    });
  });

  describe('release', () => {
    it('should call release use case', async () => {
      releaseUseCase.execute.mockResolvedValue(Result.ok(undefined));

      await controller.release('sess-1');

      expect(releaseUseCase.execute).toHaveBeenCalledWith('sess-1');
    });
  });
});
