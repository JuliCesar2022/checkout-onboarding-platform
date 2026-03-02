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
      decrementStock: jest.fn(),
    } as any;

    useCase = new SyncTransactionStatusUseCase(repo, paymentPort, productsRepo);
  });

  it('should not update if status is not PENDING', async () => {
    const tx = new TransactionEntity({
      id: '1',
      status: 'APPROVED',
      wompiId: 'w-1',
    });
    repo.findById.mockResolvedValue(tx);

    const result = await useCase.execute('1');

    expect(result.isSuccess).toBe(true);
    expect(paymentPort.getTransactionStatus).not.toHaveBeenCalled();
  });

  it('should update status and decrement stock on transition from PENDING to APPROVED', async () => {
    const tx = new TransactionEntity({
      id: '1',
      status: 'PENDING',
      wompiId: 'w-1',
      productId: 'p-1',
      quantity: 2,
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
    expect(repo.updateStatus).toHaveBeenCalledWith('1', 'APPROVED', 'w-1', {});
    expect(productsRepo.decrementStock).toHaveBeenCalledWith('p-1', 2);
  });
});
