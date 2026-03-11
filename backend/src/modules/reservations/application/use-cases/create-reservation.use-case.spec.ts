import { Test, TestingModule } from '@nestjs/testing';
import { CreateReservationUseCase } from './create-reservation.use-case';
import { IReservationsRepository } from '../../domain/repositories/reservations.repository';
import { IProductsRepository } from '../../../products/domain/repositories/products.repository';
import { StockReservationEntity } from '../../domain/entities/stock-reservation.entity';

describe('CreateReservationUseCase', () => {
  let useCase: CreateReservationUseCase;
  let reservationsRepo: jest.Mocked<IReservationsRepository>;
  let productsRepo: jest.Mocked<IProductsRepository>;

  beforeEach(async () => {
    reservationsRepo = {
      create: jest.fn(),
      deleteBySessionId: jest.fn(),
      findBySessionId: jest.fn(),
      findActiveByProductId: jest.fn(),
      deleteExpired: jest.fn(),
      getTotalReservedForProduct: jest.fn(),
    };

    productsRepo = {
      findById: jest.fn(),
      findPaginated: jest.fn(),
      decrementStock: jest.fn(),
      incrementStock: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateReservationUseCase,
        { provide: IReservationsRepository, useValue: reservationsRepo },
        { provide: IProductsRepository, useValue: productsRepo },
      ],
    }).compile();

    useCase = module.get<CreateReservationUseCase>(CreateReservationUseCase);
  });

  it('should create reservations successfully if stock is available', async () => {
    productsRepo.findById.mockResolvedValue({ id: 'p1', stock: 10 } as any);
    reservationsRepo.create.mockResolvedValue(
      new StockReservationEntity('r1', 'p1', 2, 's1', new Date(), new Date()),
    );

    const result = await useCase.execute('s1', [{ productId: 'p1', quantity: 2 }]);

    expect(result.isSuccess).toBe(true);
    expect(reservationsRepo.deleteBySessionId).toHaveBeenCalledWith('s1');
    expect(reservationsRepo.create).toHaveBeenCalled();
    expect(result.getValue()).toHaveLength(1);
  });

  it('should fail if product is not found', async () => {
    productsRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute('s1', [{ productId: 'invalid', quantity: 1 }]);

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toContain('no encontrado');
    expect(reservationsRepo.deleteBySessionId).toHaveBeenCalledTimes(2); // Initial + Rollback
  });

  it('should fail if stock is insufficient', async () => {
    productsRepo.findById.mockResolvedValue({ id: 'p1', stock: 1 } as any);

    const result = await useCase.execute('s1', [{ productId: 'p1', quantity: 5 }]);

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toContain('No hay suficiente stock');
  });
});
