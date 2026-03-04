import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Result } from '../../../../common/result/result';
import { ITransactionsRepository } from '../../domain/repositories/transactions.repository';
import { IProductsRepository } from '../../../products/domain/repositories/products.repository';
import { ICustomersRepository } from '../../../customers/domain/repositories/customers.repository';
import { IPaymentPort } from '../../../payment/domain/ports/payment.port';
import { IDeliveriesRepository } from '../../../deliveries/domain/repositories/deliveries.repository';
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
  ) {}

  async execute(
    dto: CreateTransactionDto,
  ): Promise<Result<TransactionResponseDto>> {
    // Step 1: Resolve items list.
    // If `items` array is provided (multi-product cart), use it.
    // Otherwise fall back to the classic single-product fields.
    const cartItems: Array<{ productId: string; quantity: number }> =
      dto.items && dto.items.length > 0
        ? dto.items
        : [{ productId: dto.productId, quantity: dto.quantity }];

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
      amountInCents: totalAmountInCents,
      productAmountInCents,
      baseFeeInCents,
      deliveryFeeInCents,
      // Primary product (for Delivery FK and single-product backward-compat)
      productId: primaryProductId,
      quantity: primaryQuantity,
      customerId: customer.id,
      cardBrand: dto.cardData.brand,
      cardLastFour: dto.cardData.lastFour,
      // Full item list for multi-product support
      items: resolvedItems.length > 1 ? resolvedItems : undefined,
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
      wompiResult.wompiId,
      wompiResult.rawResponse,
    );

    // Step 8: Decrement stock logic was moved to Step 2 (Atomic Reservation)
    // No action needed here as stock is already reserved.

    return Result.ok(TransactionResponseDto.fromEntity(updatedTransaction));
  }
}
