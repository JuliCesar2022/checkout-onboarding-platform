import { CreateTransactionUseCase } from './create-transaction.use-case';
import { ITransactionsRepository } from '../../domain/repositories/transactions.repository';
import { IProductsRepository } from '../../../products/domain/repositories/products.repository';
import { ICustomersRepository } from '../../../customers/domain/repositories/customers.repository';
import { IDeliveriesRepository } from '../../../deliveries/domain/repositories/deliveries.repository';
import { IPaymentPort } from '../../../payment/domain/ports/payment.port';
import { ConfigService } from '@nestjs/config';
import { Result } from '../../../../common/result/result';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { TRANSACTIONS_ERRORS } from '../../domain/constants/transactions.constants';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let transactionsRepo: jest.Mocked<ITransactionsRepository>;
  let productsRepo: jest.Mocked<IProductsRepository>;
  let customersRepo: jest.Mocked<ICustomersRepository>;
  let deliveriesRepo: jest.Mocked<IDeliveriesRepository>;
  let paymentPort: jest.Mocked<IPaymentPort>;
  let config: jest.Mocked<ConfigService>;

  beforeEach(() => {
    transactionsRepo = { create: jest.fn(), updateStatus: jest.fn() } as any;
    productsRepo = { findById: jest.fn(), decrementStock: jest.fn() } as any;
    customersRepo = { upsertByEmail: jest.fn() } as any;
    deliveriesRepo = { create: jest.fn() } as any;
    paymentPort = { charge: jest.fn() } as any;
    config = { get: jest.fn() } as any;

    useCase = new CreateTransactionUseCase(
      transactionsRepo,
      productsRepo,
      customersRepo,
      deliveriesRepo,
      paymentPort,
      config,
    );
  });

  it('should fail if product not found', async () => {
    productsRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute({ productId: '1' } as any);

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe(TRANSACTIONS_ERRORS.PRODUCT_NOT_FOUND);
  });

  it('should fail if insufficient stock', async () => {
    productsRepo.findById.mockResolvedValue({ stock: 5 } as any);

    const result = await useCase.execute({
      productId: '1',
      quantity: 10,
    } as any);

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe(
      TRANSACTIONS_ERRORS.INSUFFICIENT_STOCK(5, 10),
    );
  });

  it('should process payment, create transaction and decrement stock on success', async () => {
    const product = { id: 'p1', stock: 10, priceInCents: 1000 };
    productsRepo.findById.mockResolvedValue(product as any);
    customersRepo.upsertByEmail.mockResolvedValue({ id: 'c1' } as any);
    config.get.mockReturnValue(100);

    const tx = new TransactionEntity({ id: 't1', reference: 'REF-1' });
    transactionsRepo.create.mockResolvedValue(tx);

    paymentPort.charge.mockResolvedValue(
      Result.ok({
        wompiId: 'w1',
        status: 'APPROVED',
        rawResponse: {},
      }),
    );

    transactionsRepo.updateStatus.mockResolvedValue(
      new TransactionEntity({ ...tx, status: 'APPROVED' }),
    );

    const dto = {
      productId: 'p1',
      quantity: 1,
      customerData: { email: 'test@test.com', name: 'Test' },
      cardData: { brand: 'VISA', lastFour: '4242' },
      deliveryData: { address: 'Calle 1' },
      acceptanceToken: 'token',
      acceptPersonalAuth: 'auth',
    };

    const result = await useCase.execute(dto as any);

    expect(result.isSuccess).toBe(true);
    expect(transactionsRepo.create).toHaveBeenCalled();
    expect(paymentPort.charge).toHaveBeenCalled();
    expect(productsRepo.decrementStock).toHaveBeenCalledWith('p1', 1);
  });
});
