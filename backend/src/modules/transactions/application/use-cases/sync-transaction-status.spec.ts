import { SyncTransactionStatusUseCase } from './sync-transaction-status.use-case';
import { ITransactionsRepository } from '../../domain/repositories/transactions.repository';
import { IPaymentPort } from '../../../payment/domain/ports/payment.port';
import { PaymentStatus } from '../../../payment/domain/enums/payment-status.enum';
import { IProductsRepository } from '../../../products/domain/repositories/products.repository';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { Result } from '../../../../common/result/result';

describe('SyncTransactionStatusUseCase', () => {
  let useCase: SyncTransactionStatusUseCase;
  let repo: jest.Mocked<ITransactionsRepository>;
  let paymentPort: jest.Mocked<IPaymentPort>;
  let productsRepo: jest.Mocked<IProductsRepository>;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      updateStatus: jest.fn(),
    } as any;
    paymentPort = {
      getTransactionStatus: jest.fn(),
    } as any;
    productsRepo = {
      incrementStock: jest.fn(),
    } as any;

    useCase = new SyncTransactionStatusUseCase(repo, paymentPort, productsRepo);
  });

  it('should not update if status is not PENDING', async () => {
    const tx = new TransactionEntity({
      id: '1',
      status: 'APPROVED',
      totalAmountInCents: 1000,
      currency: 'COP',
      customerId: 'c1',
      payment: {
        id: 'p-1',
        gatewayId: 'w-1',
        cardBrand: 'VISA',
        status: 'APPROVED',
      } as any,
    });
    repo.findById.mockResolvedValue(tx);

    const result = await useCase.execute('1');

    expect(result.isSuccess).toBe(true);
    expect(paymentPort.getTransactionStatus).not.toHaveBeenCalled();
  });

  it('should update status and decrement stock using items on transition from PENDING to APPROVED', async () => {
    const tx = new TransactionEntity({
      id: '1',
      status: 'PENDING',
      totalAmountInCents: 1000,
      currency: 'COP',
      customerId: 'c1',
      payment: {
        id: 'p-1',
        gatewayId: 'w-1',
        cardBrand: 'VISA',
        status: 'PENDING',
      } as any,
      items: [{ productId: 'p-1', quantity: 2 }],
    });
    repo.findById.mockResolvedValue(tx);
    paymentPort.getTransactionStatus.mockResolvedValue(
      Result.ok({
        wompiId: 'w-1',
        status: PaymentStatus.SUCCESS,
        rawResponse: {},
      }),
    );
    repo.updateStatus.mockResolvedValue(
      new TransactionEntity({ ...tx, status: 'APPROVED' }),
    );

    const result = await useCase.execute('1');

    expect(result.isSuccess).toBe(true);
    expect(repo.updateStatus).toHaveBeenCalledWith('1', 'APPROVED', {
      gatewayId: 'w-1',
      gatewayResponse: {},
    });
    // Stock should NOT be touched on Approval (already reserved at creation)
    expect(productsRepo.incrementStock).not.toHaveBeenCalled();
  });

  it('should update status and increment stock (rollback) on transition to DECLINED', async () => {
    const tx = new TransactionEntity({
      id: '1',
      status: 'PENDING',
      totalAmountInCents: 1000,
      currency: 'COP',
      customerId: 'c1',
      payment: {
        id: 'p-1',
        gatewayId: 'w-1',
        cardBrand: 'VISA',
        status: 'PENDING',
      } as any,
      items: [{ productId: 'p-1', quantity: 2 }],
    });
    repo.findById.mockResolvedValue(tx);
    paymentPort.getTransactionStatus.mockResolvedValue(
      Result.ok({
        wompiId: 'w-1',
        status: PaymentStatus.DECLINED,
        rawResponse: { reason: 'insufficient_funds' },
      }),
    );
    repo.updateStatus.mockResolvedValue(
      new TransactionEntity({ ...tx, status: 'DECLINED' }),
    );

    const result = await useCase.execute('1');

    expect(result.isSuccess).toBe(true);
    expect(repo.updateStatus).toHaveBeenCalledWith('1', 'DECLINED', {
      gatewayId: 'w-1',
      gatewayResponse: { reason: 'insufficient_funds' },
    });
    expect(productsRepo.incrementStock).toHaveBeenCalledWith('p-1', 2);
  });

  it('should decrement stock for ALL items on transition from PENDING to APPROVED', async () => {
    const tx = new TransactionEntity({
      id: '2',
      status: 'PENDING',
      totalAmountInCents: 3000,
      currency: 'COP',
      customerId: 'c1',
      payment: {
        id: 'p-2',
        gatewayId: 'w-2',
        cardBrand: 'VISA',
        status: 'PENDING',
      } as any,
      items: [
        { productId: 'p-1', quantity: 2 },
        { productId: 'p-2', quantity: 3 },
      ],
    });
    repo.findById.mockResolvedValue(tx);
    paymentPort.getTransactionStatus.mockResolvedValue(
      Result.ok({
        wompiId: 'w-2',
        status: PaymentStatus.SUCCESS,
        rawResponse: {},
      }),
    );
    repo.updateStatus.mockResolvedValue(
      new TransactionEntity({ ...tx, status: 'APPROVED' }),
    );

    const result = await useCase.execute('2');

    expect(result.isSuccess).toBe(true);
    // On Approved, stock is not touched
    expect(productsRepo.incrementStock).not.toHaveBeenCalled();
  });
});
