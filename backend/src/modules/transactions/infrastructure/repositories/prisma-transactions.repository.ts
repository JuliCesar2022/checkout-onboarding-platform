import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  ITransactionsRepository,
  CreateTransactionData,
} from '../../domain/repositories/transactions.repository';
import {
  TransactionEntity,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class PrismaTransactionsRepository implements ITransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTransactionData): Promise<TransactionEntity> {
    const created = await this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          reference: data.reference,
          amountInCents: data.amountInCents,
          productAmountInCents: data.productAmountInCents,
          baseFeeInCents: data.baseFeeInCents,
          deliveryFeeInCents: data.deliveryFeeInCents,
          productId: data.productId,
          quantity: data.quantity,
          customerId: data.customerId,
          cardBrand: data.cardBrand,
          cardLastFour: data.cardLastFour,
        },
      });

      if (data.items && data.items.length > 0) {
        await tx.transactionItem.createMany({
          data: data.items.map((item) => ({
            transactionId: transaction.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPriceInCents: item.unitPriceInCents,
          })),
        });
      }

      return transaction;
    });
    return TransactionMapper.toDomain(created);
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { items: true },
    });
    return transaction ? TransactionMapper.toDomain(transaction) : null;
  }

  async findByReference(reference: string): Promise<TransactionEntity | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { reference },
      include: { items: true },
    });
    return transaction ? TransactionMapper.toDomain(transaction) : null;
  }

  async findPending(): Promise<TransactionEntity[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { status: 'PENDING' },
      include: { items: true },
    });
    return transactions.map(TransactionMapper.toDomain);
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    wompiId?: string,
    wompiResponse?: Record<string, unknown>,
  ): Promise<TransactionEntity> {
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        status,
        wompiId,
        wompiResponse: wompiResponse as Prisma.InputJsonValue | undefined,
      },
    });
    return TransactionMapper.toDomain(transaction);
  }
}
