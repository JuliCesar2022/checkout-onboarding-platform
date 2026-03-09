import type { Transaction as PrismaTransaction } from '@prisma/client';
import {
  TransactionEntity,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { FinancialBreakdownEntity } from '../../domain/entities/financial-breakdown.entity';

export class TransactionMapper {
  static toDomain(prisma: any): TransactionEntity {
    return new TransactionEntity({
      id: prisma.id,
      reference: prisma.reference,
      status: prisma.status as TransactionStatus,
      totalAmountInCents: prisma.totalAmountInCents,
      currency: prisma.currency,
      customerId: prisma.customerId,
      sessionId: prisma.sessionId,
      payment: prisma.payment
        ? new PaymentEntity({
            id: prisma.payment.id,
            transactionId: prisma.payment.transactionId,
            gatewayId: prisma.payment.gatewayId,
            cardBrand: prisma.payment.cardBrand,
            cardLastFour: prisma.payment.cardLastFour,
            gatewayResponse: prisma.payment.gatewayResponse as Record<
              string,
              unknown
            > | null,
            createdAt: prisma.payment.createdAt,
            updatedAt: prisma.payment.updatedAt,
          })
        : undefined,
      breakdown: prisma.breakdown?.map(
        (b: any) =>
          new FinancialBreakdownEntity({
            id: b.id,
            transactionId: b.transactionId,
            concept: b.concept,
            amountInCents: b.amountInCents,
          }),
      ),
      items: prisma.items?.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    });
  }
}
