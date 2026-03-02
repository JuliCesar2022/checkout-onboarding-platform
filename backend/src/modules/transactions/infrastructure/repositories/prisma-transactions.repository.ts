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
    const transaction = await this.prisma.transaction.create({
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
    return TransactionMapper.toDomain(transaction);
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    return transaction ? TransactionMapper.toDomain(transaction) : null;
  }

  async findByReference(reference: string): Promise<TransactionEntity | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { reference },
    });
    return transaction ? TransactionMapper.toDomain(transaction) : null;
  }

  async findPending(): Promise<TransactionEntity[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { status: 'PENDING' },
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
