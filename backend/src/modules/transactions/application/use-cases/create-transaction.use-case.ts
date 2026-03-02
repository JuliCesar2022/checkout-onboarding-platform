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

/**
 * ProcessPayment Use Case — Railway Oriented Programming
 *
 * Steps (each returns Result, stops on failure):
 *   1. Validate product exists and has stock
 *   2. Upsert customer
 *   3. Calculate fees
 *   4. Create PENDING transaction + delivery record in DB (address captured now)
 *   5. Call Wompi to charge card
 *   6. Update transaction with Wompi result
 *   7. If APPROVED immediately: decrement stock
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
    // Step 1: Validate product
    const product = await this.productsRepo.findById(dto.productId);
    if (!product) {
      return Result.fail(TRANSACTIONS_ERRORS.PRODUCT_NOT_FOUND);
    }
    if (product.stock < dto.quantity) {
      return Result.fail(
        TRANSACTIONS_ERRORS.INSUFFICIENT_STOCK(product.stock, dto.quantity),
      );
    }

    // Step 2: Upsert customer
    const customer = await this.customersRepo.upsertByEmail({
      email: dto.customerData.email,
      name: dto.customerData.name,
      phone: dto.customerData.phone,
    });

    // Step 3: Calculate fees
    const baseFeeInCents =
      this.config.get<number>('BASE_FEE_IN_CENTS', { infer: true }) ?? 150000;
    const deliveryFeeInCents =
      this.config.get<number>('DELIVERY_FEE_IN_CENTS', { infer: true }) ??
      1000000;
    const productAmountInCents = product.priceInCents * dto.quantity;
    const totalAmountInCents =
      productAmountInCents + baseFeeInCents + deliveryFeeInCents;

    // Step 4: Create PENDING transaction + delivery record
    // Delivery is persisted now while we still have the address from the request.
    // Stock decrement happens only on APPROVED (here if immediate, or in sync use case if polled).
    const reference = `TXN-${crypto.randomUUID()}`;
    const transaction = await this.transactionsRepo.create({
      reference,
      amountInCents: totalAmountInCents,
      productAmountInCents,
      baseFeeInCents,
      deliveryFeeInCents,
      productId: dto.productId,
      quantity: dto.quantity,
      customerId: customer.id,
      cardBrand: dto.cardData.brand,
      cardLastFour: dto.cardData.lastFour,
    });

    const normalize = (str?: string) => str?.trim().toUpperCase();

    await this.deliveriesRepo.create({
      transactionId: transaction.id,
      productId: dto.productId,
      customerId: customer.id,
      address: normalize(dto.deliveryData.address)!,
      addressDetail: normalize(dto.deliveryData.addressDetail),
      city: normalize(dto.deliveryData.city)!,
      state: normalize(dto.deliveryData.state)!,
      postalCode: dto.deliveryData.postalCode,
    });

    // Step 5: Call Wompi
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
      // Update transaction to ERROR so frontend knows
      await this.transactionsRepo.updateStatus(transaction.id, 'ERROR');
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

    // Step 6: Update transaction with Wompi result
    const updatedTransaction = await this.transactionsRepo.updateStatus(
      transaction.id,
      finalStatus,
      wompiResult.wompiId,
      wompiResult.rawResponse,
    );

    // Step 7: If already APPROVED on first response → decrement stock immediately.
    // If PENDING, the sync use case handles decrement when Wompi later confirms.
    if (finalStatus === 'APPROVED') {
      await this.productsRepo.decrementStock(dto.productId, dto.quantity);
    }

    return Result.ok(TransactionResponseDto.fromEntity(updatedTransaction));
  }
}
