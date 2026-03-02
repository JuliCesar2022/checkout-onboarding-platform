import { TransactionsService } from './transactions.service';
import { ITransactionsRepository } from '../domain/repositories/transactions.repository';
import { CreateTransactionUseCase } from './use-cases/create-transaction.use-case';
import { SyncTransactionStatusUseCase } from './use-cases/sync-transaction-status.use-case';
import { TransactionEntity } from '../domain/entities/transaction.entity';
import { Result } from '../../../common/result/result';
import { TRANSACTIONS_ERRORS } from '../domain/constants/transactions.constants';

jest.mock('./use-cases/create-transaction.use-case');
jest.mock('./use-cases/sync-transaction-status.use-case');

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repo: jest.Mocked<ITransactionsRepository>;
  let createUseCase: jest.Mocked<CreateTransactionUseCase>;
  let syncUseCase: jest.Mocked<SyncTransactionStatusUseCase>;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      findByReference: jest.fn(),
      create: jest.fn(),
      findPending: jest.fn(),
      updateStatus: jest.fn(),
    } as any;

    createUseCase = { execute: jest.fn() } as any;
    syncUseCase = { execute: jest.fn() } as any;

    service = new TransactionsService(repo, createUseCase, syncUseCase);
  });

  describe('findById', () => {
    it('should return transaction if found', async () => {
      const entity = new TransactionEntity({ id: '123', wompiId: 'w1' });
      repo.findById.mockResolvedValue(entity);

      const result = await service.findById('123');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().id).toBe('123');
    });

    it('should return failure if not found', async () => {
      repo.findById.mockResolvedValue(null);

      const result = await service.findById('123');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe(TRANSACTIONS_ERRORS.NOT_FOUND('123'));
    });
  });

  describe('findByReference', () => {
    it('should return transaction if found', async () => {
      const entity = new TransactionEntity({
        reference: 'REF-1',
        wompiId: 'w1',
      });
      repo.findByReference.mockResolvedValue(entity);

      const result = await service.findByReference('REF-1');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().reference).toBe('REF-1');
    });
  });

  describe('syncStatus', () => {
    it('should delegate to syncUseCase', async () => {
      const entity = new TransactionEntity({ id: '123', status: 'APPROVED' });
      syncUseCase.execute.mockResolvedValue(Result.ok(entity));

      const result = await service.syncStatus('123');

      expect(result.isSuccess).toBe(true);
      expect(syncUseCase.execute).toHaveBeenCalledWith('123');
    });
  });
});
