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
          totalAmountInCents: data.totalAmountInCents,
          customerId: data.customerId,
          sessionId: data.sessionId,
          payment: data.paymentDetails
            ? {
                create: {
                  cardBrand: data.paymentDetails.cardBrand,
                  cardLastFour: data.paymentDetails.cardLastFour,
                },
              }
            : undefined,
          breakdown: {
            create: data.breakdown.map((b) => ({
              concept: b.concept,
              amountInCents: b.amountInCents,
            })),
          },
        },
        include: { items: true },
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
        // We need to re-fetch or manually add items to the object because createMany won't add them.
        // Let's just re-fetch inside the transaction for safety
        return tx.transaction.findUnique({
          where: { id: transaction.id },
          include: { items: true, payment: true, breakdown: true },
        });
      }

      return transaction;
    });
    return TransactionMapper.toDomain(created!);
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { items: true, payment: true, breakdown: true },
    });
    return transaction ? TransactionMapper.toDomain(transaction) : null;
  }
  async findByReference(reference: string): Promise<TransactionEntity | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { reference },
      include: { items: true, payment: true, breakdown: true },
    });
    return transaction ? TransactionMapper.toDomain(transaction) : null;
  }

  async findBySessionId(sessionId: string): Promise<TransactionEntity[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { sessionId },
      include: { items: true, payment: true, breakdown: true },
    });
    return transactions.map(TransactionMapper.toDomain);
  }

  async findPending(): Promise<TransactionEntity[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { status: 'PENDING' },
      include: { items: true, payment: true, breakdown: true },
    });
    return transactions.map(TransactionMapper.toDomain);
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    paymentDetails?: {
      gatewayId?: string;
      gatewayResponse?: Record<string, unknown>;
    },
  ): Promise<TransactionEntity> {
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        status,
        payment: paymentDetails
          ? {
              upsert: {
                create: {
                  gatewayId: paymentDetails.gatewayId,
                  gatewayResponse: paymentDetails.gatewayResponse as
                    | Prisma.InputJsonValue
                    | undefined,
                },
                update: {
                  gatewayId: paymentDetails.gatewayId,
                  gatewayResponse: paymentDetails.gatewayResponse as
                    | Prisma.InputJsonValue
                    | undefined,
                },
              },
            }
          : undefined,
      },
      include: { items: true, payment: true, breakdown: true },
    });
    return TransactionMapper.toDomain(transaction);
  }
}
