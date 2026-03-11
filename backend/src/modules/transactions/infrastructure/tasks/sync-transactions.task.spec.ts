import { Test, TestingModule } from '@nestjs/testing';
import { SyncTransactionsTask } from './sync-transactions.task';
import { ITransactionsRepository } from '../../domain/repositories/transactions.repository';
import { SyncTransactionStatusUseCase } from '../../application/use-cases/sync-transaction-status.use-case';
import { Result } from '../../../../common/result/result';

describe('SyncTransactionsTask', () => {
  let task: SyncTransactionsTask;
  let transactionsRepo: any;
  let syncUseCase: any;

  beforeEach(async () => {
    transactionsRepo = {
      findPending: jest.fn(),
    };
    syncUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncTransactionsTask,
        {
          provide: ITransactionsRepository,
          useValue: transactionsRepo,
        },
        {
          provide: SyncTransactionStatusUseCase,
          useValue: syncUseCase,
        },
      ],
    }).compile();

    task = module.get<SyncTransactionsTask>(SyncTransactionsTask);
  });

  it('should process pending transactions', async () => {
    const mockPending = [{ id: 'tx-1' }, { id: 'tx-2' }];
    transactionsRepo.findPending.mockResolvedValue(mockPending);
    syncUseCase.execute.mockResolvedValue(Result.ok({ id: 'tx-1', status: 'APPROVED' }));

    await task.handleCron();

    expect(transactionsRepo.findPending).toHaveBeenCalled();
    expect(syncUseCase.execute).toHaveBeenCalledTimes(2);
  });

  it('should handle empty pending list', async () => {
    transactionsRepo.findPending.mockResolvedValue([]);
    await task.handleCron();
    expect(syncUseCase.execute).not.toHaveBeenCalled();
  });

  it('should handle errors in individual syncs', async () => {
    transactionsRepo.findPending.mockResolvedValue([{ id: 'tx-1' }]);
    syncUseCase.execute.mockRejectedValue(new Error('Sync failed'));

    await expect(task.handleCron()).resolves.not.toThrow();
  });

  it('should handle result failure', async () => {
    transactionsRepo.findPending.mockResolvedValue([{ id: 'tx-1' }]);
    syncUseCase.execute.mockResolvedValue(Result.fail('Gateway error'));

    await task.handleCron();

    expect(syncUseCase.execute).toHaveBeenCalled();
  });
});
