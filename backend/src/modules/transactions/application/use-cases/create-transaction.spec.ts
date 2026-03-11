import { CreateTransactionUseCase } from './create-transaction.use-case';
import { ITransactionsRepository } from '../../domain/repositories/transactions.repository';
import { IProductsRepository } from '../../../products/domain/repositories/products.repository';
import { ICustomersRepository } from '../../../customers/domain/repositories/customers.repository';
import { IDeliveriesRepository } from '../../../deliveries/domain/repositories/deliveries.repository';
import { IPaymentPort } from '../../../payment/domain/ports/payment.port';
import { PaymentStatus } from '../../../payment/domain/enums/payment-status.enum';
import { Result } from '../../../../common/result/result';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { TRANSACTIONS_ERRORS } from '../../domain/constants/transactions.constants';
import { IFinancialConfig } from '../../domain/ports/financial-config.port';
import { IUuidGenerator } from '../../../../common/interfaces/uuid-generator.interface';
import { IReservationsRepository } from '../../../reservations/domain/repositories/reservations.repository';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let transactionsRepo: jest.Mocked<ITransactionsRepository>;
  let productsRepo: jest.Mocked<IProductsRepository>;
  let customersRepo: jest.Mocked<ICustomersRepository>;
  let deliveriesRepo: jest.Mocked<IDeliveriesRepository>;
  let paymentPort: jest.Mocked<IPaymentPort>;
  let config: jest.Mocked<IFinancialConfig>;
  let reservationsRepo: jest.Mocked<IReservationsRepository>;
  let uuidGenerator: jest.Mocked<IUuidGenerator>;

  beforeEach(() => {
    transactionsRepo = {
      create: jest.fn(),
      updateStatus: jest.fn(),
      findBySessionId: jest.fn().mockResolvedValue([]),
    } as any;
    productsRepo = { findById: jest.fn(), decrementStock: jest.fn() } as any;
    customersRepo = { upsertByEmail: jest.fn() } as any;
    deliveriesRepo = { create: jest.fn() } as any;
    paymentPort = { charge: jest.fn() } as any;
    config = {
      getTransactionFeeInCents: jest.fn(),
      getDeliveryFeeInCents: jest.fn(),
    } as any;
    reservationsRepo = { deleteBySessionId: jest.fn() } as any;
    uuidGenerator = { generate: jest.fn() } as any;

    useCase = new CreateTransactionUseCase(
      transactionsRepo,
      productsRepo,
      customersRepo,
      deliveriesRepo,
      paymentPort,
      config,
      reservationsRepo,
      uuidGenerator,
    );
  });

  // ─── Single-product (backward-compat) ─────────────────────────────────────

  it('should fail if product not found', async () => {
    productsRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute({
      items: [{ productId: '1', quantity: 1 }],
      sessionId: 's1',
    } as any);

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe(TRANSACTIONS_ERRORS.PRODUCT_NOT_FOUND);
  });

  it('should fail if insufficient stock', async () => {
    productsRepo.findById.mockResolvedValue({ stock: 5 } as any);

    const result = await useCase.execute({
      items: [{ productId: '1', quantity: 10 }],
      sessionId: 's1',
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
    config.getTransactionFeeInCents.mockReturnValue(100);
    config.getDeliveryFeeInCents.mockReturnValue(500);
    uuidGenerator.generate.mockReturnValue('uuid-123');

    const tx = new TransactionEntity({ id: 't1', reference: 'REF-1' });
    transactionsRepo.create.mockResolvedValue(tx);

    paymentPort.charge.mockResolvedValue(
      Result.ok({
        wompiId: 'w1',
        status: PaymentStatus.SUCCESS,
        rawResponse: {},
      }),
    );

    transactionsRepo.updateStatus.mockResolvedValue(
      new TransactionEntity({ ...tx, status: 'APPROVED' }),
    );

    const dto = {
      items: [{ productId: 'p1', quantity: 1 }],
      sessionId: 's1',
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

  // ─── Multi-product cart ────────────────────────────────────────────────────

  it('should fail if any item in the cart has insufficient stock', async () => {
    const product1 = { id: 'p1', stock: 10, priceInCents: 1000 };
    const product2 = { id: 'p2', stock: 1, priceInCents: 2000 };

    productsRepo.findById
      .mockResolvedValueOnce(product1 as any)
      .mockResolvedValueOnce(product2 as any);

    const result = await useCase.execute({
      sessionId: 's1',
      items: [
        { productId: 'p1', quantity: 2 },
        { productId: 'p2', quantity: 5 }, // <-- exceeds stock of 1
      ],
      customerData: { email: 'a@b.com', name: 'A' },
      cardData: { brand: 'VISA', lastFour: '1234' },
      deliveryData: { address: 'Calle 1' },
      acceptanceToken: 'tok',
      acceptPersonalAuth: 'auth',
    } as any);

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe(
      TRANSACTIONS_ERRORS.INSUFFICIENT_STOCK(1, 5),
    );
  });

  it('should decrement stock for ALL items on multi-product success', async () => {
    const product1 = { id: 'p1', stock: 10, priceInCents: 1000 };
    const product2 = { id: 'p2', stock: 10, priceInCents: 2000 };

    productsRepo.findById
      .mockResolvedValueOnce(product1 as any)
      .mockResolvedValueOnce(product2 as any);

    customersRepo.upsertByEmail.mockResolvedValue({ id: 'c1' } as any);
    config.getTransactionFeeInCents.mockReturnValue(100);
    config.getDeliveryFeeInCents.mockReturnValue(500);
    uuidGenerator.generate.mockReturnValue('uuid-multi');

    const tx = new TransactionEntity({ id: 't1', reference: 'REF-MULTI' });
    transactionsRepo.create.mockResolvedValue(tx);

    paymentPort.charge.mockResolvedValue(
      Result.ok({
        wompiId: 'w1',
        status: PaymentStatus.SUCCESS,
        rawResponse: {},
      }),
    );

    transactionsRepo.updateStatus.mockResolvedValue(
      new TransactionEntity({ ...tx, status: 'APPROVED' }),
    );

    const result = await useCase.execute({
      sessionId: 's1',
      items: [
        { productId: 'p1', quantity: 2 },
        { productId: 'p2', quantity: 3 },
      ],
      customerData: { email: 'a@b.com', name: 'A' },
      cardData: { brand: 'VISA', lastFour: '4242' },
      deliveryData: { address: 'Calle 1' },
      acceptanceToken: 'tok',
      acceptPersonalAuth: 'auth',
    } as any);

    expect(result.isSuccess).toBe(true);
    // Both products must have had their stock decremented
    expect(productsRepo.decrementStock).toHaveBeenCalledWith('p1', 2);
    expect(productsRepo.decrementStock).toHaveBeenCalledWith('p2', 3);
    expect(productsRepo.decrementStock).toHaveBeenCalledTimes(2);
  });


});
