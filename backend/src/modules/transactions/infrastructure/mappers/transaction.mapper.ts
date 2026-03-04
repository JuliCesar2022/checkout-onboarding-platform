import type { Transaction as PrismaTransaction } from '@prisma/client';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import type { TransactionStatus } from '../../domain/entities/transaction.entity';

export class TransactionMapper {
  static toDomain(prisma: any): TransactionEntity {
    return new TransactionEntity({
      id: prisma.id,
      reference: prisma.reference,
      wompiId: prisma.wompiId,
      status: prisma.status as TransactionStatus,
      amountInCents: prisma.amountInCents,
      currency: prisma.currency,
      cardBrand: prisma.cardBrand,
      cardLastFour: prisma.cardLastFour,
      productAmountInCents: prisma.productAmountInCents,
      baseFeeInCents: prisma.baseFeeInCents,
      deliveryFeeInCents: prisma.deliveryFeeInCents,
      productId: prisma.productId,
      quantity: prisma.quantity,
      customerId: prisma.customerId,
      sessionId: prisma.sessionId,
      wompiResponse: prisma.wompiResponse as Record<string, unknown> | null,
      items: prisma.items?.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    });
  }
}
