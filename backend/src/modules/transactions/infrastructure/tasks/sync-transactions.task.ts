import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ITransactionsRepository } from '../../domain/repositories/transactions.repository';
import { SyncTransactionStatusUseCase } from '../../application/use-cases/sync-transaction-status.use-case';
import { TRANSACTIONS_CONFIG } from '../../domain/constants/transactions.constants';

@Injectable()
export class SyncTransactionsTask {
  private readonly logger = new Logger(SyncTransactionsTask.name);

  constructor(
    private readonly transactionsRepo: ITransactionsRepository,
    private readonly syncTransactionStatusUseCase: SyncTransactionStatusUseCase,
  ) {}

  @Cron(TRANSACTIONS_CONFIG.SYNC_CRON_EXPRESSION)
  async handleCron() {
    this.logger.debug('Running background transaction sync...');

    try {
      const pendingTransactions = await this.transactionsRepo.findPending();

      if (pendingTransactions.length === 0) {
        return;
      }

      this.logger.log(
        `Found ${pendingTransactions.length} pending transactions to sync.`,
      );

      for (const transaction of pendingTransactions) {
        try {
          const result = await this.syncTransactionStatusUseCase.execute(
            transaction.id,
          );

          if (result.isSuccess) {
            const updated = result.getValue();
            if (updated.status !== 'PENDING') {
              this.logger.log(
                `Transaction ${transaction.id} synced: ${updated.status}`,
              );
            }
          } else {
            this.logger.warn(
              `Failed to sync transaction ${transaction.id}: ${result.getError()}`,
            );
          }
        } catch (error) {
          this.logger.error(
            `Error syncing transaction ${transaction.id}`,
            error,
          );
        }
      }
    } catch (error) {
      this.logger.error('Error fetching pending transactions', error);
    }
  }
}
