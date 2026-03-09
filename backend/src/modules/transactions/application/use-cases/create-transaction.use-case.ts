import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Result } from '../../../../common/result/result';
import { ITransactionsRepository } from '../../domain/repositories/transactions.repository';
import { IProductsRepository } from '../../../products/domain/repositories/products.repository';
import { ICustomersRepository } from '../../../customers/domain/repositories/customers.repository';
import { IPaymentPort } from '../../../payment/domain/ports/payment.port';
import { IDeliveriesRepository } from '../../../deliveries/domain/repositories/deliveries.repository';
import { IReservationsRepository } from '../../../reservations/domain/repositories/reservations.repository';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import type { Env } from '../../../../config/env.validation';

import { PaymentStatus } from '../../../payment/domain/enums/payment-status.enum';
import { TRANSACTIONS_ERRORS } from '../../domain/constants/transactions.constants';
import { TransactionStatus } from '../../domain/entities/transaction.entity';
import type { CartItemData } from '../../domain/repositories/transactions.repository';

/**
 * ProcessPayment Use Case — Railway Oriented Programming
 *
 * Steps (each returns Result, stops on failure):
 *   1. Resolve item list (single product OR cart items)
 *   2. Validate every product exists and has sufficient stock
 *   3. Upsert customer
 *   4. Calculate fees
 *   5. Create PENDING transaction + delivery record in DB
 *   6. Call Wompi to charge card
 *   7. Update transaction with Wompi result
 *   8. If APPROVED immediately: decrement stock for ALL items
 *      (If PENDING: stock decrement happens in SyncTransactionStatusUseCase on approval)
 */
@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly transactionsRepo: ITransactionsRepository,
    private readonly productsRepo: IProductsRepository,
    private readonly customersRepo: ICustomersRepository,
    private readonly deliveriesRepo: IDeliveriesRepository,
    private readonly paymentPort: IPaymentPort,
    private readonly config: ConfigService<Env>,
    private readonly reservationsRepo: IReservationsRepository,
  ) {}

  async execute(
    dto: CreateTransactionDto,
  ): Promise<Result<TransactionResponseDto>> {
    // Step 1: Resolve items list — always use the items array
    const cartItems = dto.items;

    // Step 1.5: Idempotency check.
    // If we have a sessionId, look for existing PENDING or APPROVED transactions.
    if (dto.sessionId) {
      const existing = await this.transactionsRepo.findBySessionId(
        dto.sessionId,
      );

      const approved = existing.find((t) => t.status === 'APPROVED');
      if (approved)
        return Result.ok(TransactionResponseDto.fromEntity(approved));

      const pending = existing.find((t) => t.status === 'PENDING');
      if (pending) return Result.ok(TransactionResponseDto.fromEntity(pending));
    }

    // Step 2: Validate every product and check stock
    const resolvedItems: CartItemData[] = [];
    for (const item of cartItems) {
      const product = await this.productsRepo.findById(item.productId);
      if (!product) {
        return Result.fail(TRANSACTIONS_ERRORS.PRODUCT_NOT_FOUND);
      }
      if (product.stock < item.quantity) {
        return Result.fail(
          TRANSACTIONS_ERRORS.INSUFFICIENT_STOCK(product.stock, item.quantity),
        );
      }
      // ATOMIC RESERVATION: Decrement stock right now.
      // This will throw if stock is insufficient due to the `gte` check in repo.
      await this.productsRepo.decrementStock(item.productId, item.quantity);

      resolvedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPriceInCents: product.priceInCents,
      });
    }

    // Primary product for Delivery relation (first item or the explicit productId)
    const primaryProductId = cartItems[0].productId;
    const primaryQuantity = cartItems[0].quantity;

    // Step 3: Upsert customer
    const customer = await this.customersRepo.upsertByEmail({
      email: dto.customerData.email,
      name: dto.customerData.name,
      phone: dto.customerData.phone,
    });

    // Step 4: Calculate fees
    const baseFeeInCents =
      this.config.get<number>('BASE_FEE_IN_CENTS', { infer: true }) ?? 150000;
    const deliveryFeeInCents =
      this.config.get<number>('DELIVERY_FEE_IN_CENTS', { infer: true }) ??
      1000000;

    // Sum product amount across ALL items
    const productAmountInCents = resolvedItems.reduce(
      (sum, i) => sum + i.unitPriceInCents * i.quantity,
      0,
    );
    const totalAmountInCents =
      productAmountInCents + baseFeeInCents + deliveryFeeInCents;

    // Step 5: Create PENDING transaction + delivery record
    const reference = `TXN-${crypto.randomUUID()}`;
    const transaction = await this.transactionsRepo.create({
      reference,
      totalAmountInCents,
      customerId: customer.id,
      breakdown: [
        { concept: 'SUBTOTAL', amountInCents: productAmountInCents },
        { concept: 'SHIPPING', amountInCents: deliveryFeeInCents },
        { concept: 'PLATFORM_COMMISSION', amountInCents: baseFeeInCents },
      ],
      paymentDetails: {
        cardBrand: dto.cardData.brand,
        cardLastFour: dto.cardData.lastFour,
      },
      items: resolvedItems,
      sessionId: dto.sessionId,
    });

    const normalize = (str?: string) => str?.trim().toUpperCase();

    await this.deliveriesRepo.create({
      transactionId: transaction.id,
      productId: primaryProductId,
      customerId: customer.id,
      address: normalize(dto.deliveryData.address)!,
      addressDetail: normalize(dto.deliveryData.addressDetail),
      city: normalize(dto.deliveryData.city)!,
      state: normalize(dto.deliveryData.state)!,
      postalCode: dto.deliveryData.postalCode,
    });

    // Step 6: Call Wompi
    const paymentResult = await this.paymentPort.charge({
      amountInCents: totalAmountInCents,
      currency: 'COP',
      reference,
      cardToken: dto.cardData.token,
      installments: dto.cardData.installments ?? 1,
      customerEmail: dto.customerData.email,
      acceptanceToken: dto.acceptanceToken,
      acceptPersonalAuth: dto.acceptPersonalAuth,
    });

    if (paymentResult.isFailure) {
      await this.transactionsRepo.updateStatus(transaction.id, 'ERROR');
      // ROLLBACK STOCK: Return items to inventory if payment fails
      for (const item of resolvedItems) {
        await this.productsRepo.incrementStock(item.productId, item.quantity);
      }
      return Result.fail(
        TRANSACTIONS_ERRORS.PAYMENT_FAILED(paymentResult.getError() as string),
      );
    }

    const wompiResult = paymentResult.getValue();
    const paymentStatus = wompiResult.status;

    // Map PaymentStatus -> TransactionStatus
    let finalStatus: TransactionStatus = 'ERROR';
    if (paymentStatus === PaymentStatus.SUCCESS) finalStatus = 'APPROVED';
    if (paymentStatus === PaymentStatus.DECLINED) finalStatus = 'DECLINED';
    if (paymentStatus === PaymentStatus.PENDING) finalStatus = 'PENDING';

    // If DECLINED immediately by Wompi, also rollback stock
    if (finalStatus === 'DECLINED' || finalStatus === 'ERROR') {
      for (const item of resolvedItems) {
        await this.productsRepo.incrementStock(item.productId, item.quantity);
      }
    }

    // Step 7: Update transaction with Wompi result
    const updatedTransaction = await this.transactionsRepo.updateStatus(
      transaction.id,
      finalStatus,
      {
        gatewayId: wompiResult.wompiId,
        gatewayResponse: wompiResult.rawResponse,
      },
    );

    // Step 8: Release Redis reservation once stock is committed or confirmed
    if (dto.sessionId) {
      try {
        await this.reservationsRepo.deleteBySessionId(dto.sessionId);
      } catch {
        /* non-critical: reservation TTL will expire on its own */
      }
    }

    return Result.ok(TransactionResponseDto.fromEntity(updatedTransaction));
  }
}
