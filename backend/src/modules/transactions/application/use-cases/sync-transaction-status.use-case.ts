import { Injectable } from '@nestjs/common';
import { Result } from '../../../../common/result/result';
import { ITransactionsRepository } from '../../domain/repositories/transactions.repository';
import { IPaymentPort } from '../../../payment/domain/ports/payment.port';
import { IProductsRepository } from '../../../products/domain/repositories/products.repository';
import { TransactionEntity } from '../../domain/entities/transaction.entity';

import { PaymentStatus } from '../../../payment/domain/enums/payment-status.enum';
import { TransactionStatus } from '../../domain/entities/transaction.entity';
import { TRANSACTIONS_ERRORS } from '../../domain/constants/transactions.constants';

@Injectable()
export class SyncTransactionStatusUseCase {
  constructor(
    private readonly transactionsRepo: ITransactionsRepository,
    private readonly paymentPort: IPaymentPort,
    private readonly productsRepo: IProductsRepository,
  ) {}

  async execute(transactionId: string): Promise<Result<TransactionEntity>> {
    const transaction = await this.transactionsRepo.findById(transactionId);
    if (!transaction) {
      return Result.fail(TRANSACTIONS_ERRORS.NOT_FOUND(transactionId));
    }

    if (!transaction.wompiId) {
      return Result.fail(TRANSACTIONS_ERRORS.NO_WOMPI_ID);
    }

    // Only sync if it's PENDING (no need to sync if already approved/declined)
    if (transaction.status !== 'PENDING') {
      return Result.ok(transaction);
    }

    const wompiResult = await this.paymentPort.getTransactionStatus(
      transaction.wompiId,
    );

    if (wompiResult.isFailure) {
      // If we failed to get status, don't update our DB status, just return failure
      return Result.fail(wompiResult.getError());
    }

    const { status: paymentStatus, rawResponse } = wompiResult.getValue();

    // Map PaymentStatus -> TransactionStatus
    let newStatus: TransactionStatus = 'ERROR';
    if (paymentStatus === PaymentStatus.SUCCESS) newStatus = 'APPROVED';
    if (paymentStatus === PaymentStatus.DECLINED) newStatus = 'DECLINED';
    if (paymentStatus === PaymentStatus.PENDING) newStatus = 'PENDING';

    if (newStatus === transaction.status) {
      // Status hasn't changed
      return Result.ok(transaction);
    }

    // Update DB with the new status
    const updatedTransaction = await this.transactionsRepo.updateStatus(
      transaction.id,
      newStatus,
      transaction.wompiId, // still the same
      rawResponse, // latest Wompi response
    );

    // Decrement stock when transitioning PENDING → APPROVED
    if (newStatus === 'APPROVED') {
      await this.productsRepo.decrementStock(
        transaction.productId,
        transaction.quantity,
      );
    }

    return Result.ok(updatedTransaction);
  }
}
