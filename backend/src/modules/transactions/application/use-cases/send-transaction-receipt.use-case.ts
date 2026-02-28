import { Injectable } from '@nestjs/common';
import { Result } from '../../../../common/result/result';
import { INotificationPort } from '../../domain/ports/notification.port';
import { TransactionEntity } from '../../domain/entities/transaction.entity';

/**
 * EXAMPLE: USE CASE using PORT
 *
 * This use case demonstrates how to use the INotificationPort
 * without knowing whether we're using SendGrid, Mailgun, or a mock.
 *
 * The port is injected via dependency injection.
 * To change email provider: swap the adapter in TransactionsModule, nothing else changes.
 */

@Injectable()
export class SendTransactionReceiptUseCase {
  constructor(private readonly notificationPort: INotificationPort) {}

  async execute(transaction: TransactionEntity, customerEmail: string) {
    try {
      const result = await this.notificationPort.sendEmail({
        to: customerEmail,
        subject: `Payment Receipt — Transaction #${transaction.reference}`,
        body: `
          Hi,

          Your payment has been processed successfully.

          Transaction Details:
          - ID: ${transaction.id}
          - Reference: ${transaction.reference}
          - Amount: $${(transaction.amountInCents / 100).toFixed(2)}
          - Status: ${transaction.status}

          Thank you!
        `,
      });

      return Result.ok({
        messageId: result.messageId,
        sentAt: result.sentAt,
      });
    } catch (error) {
      return Result.fail(
        `Failed to send receipt: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
