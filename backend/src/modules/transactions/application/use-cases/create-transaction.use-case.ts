import { Injectable } from '@nestjs/common';
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
import { FINANCIAL_CONSTANTS } from '../../domain/constants/financial.constant';
import { IUuidGenerator } from '../../../../common/interfaces/uuid-generator.interface';
import { IFinancialConfig } from '../../domain/ports/financial-config.port';

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
    private readonly config: IFinancialConfig,
    private readonly reservationsRepo: IReservationsRepository,
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  async execute(
    dto: CreateTransactionDto,
  ): Promise<Result<TransactionResponseDto>> {
    const {
      items: cartItems,
      sessionId,
      customerData,
      deliveryData,
      cardData,
    } = dto;

    const idempotency = await this.checkIdempotency(sessionId);
    if (idempotency) return idempotency;

    // Step 2: Validate every product and check stock
    const itemsResult = await this.resolveAndReserveItems(cartItems);
    if (itemsResult.isFailure) return Result.fail(itemsResult.getError());

    const resolvedItems = itemsResult.getValue();

    // Step 3: Upsert customer
    const customer = await this.customersRepo.upsertByEmail({
      ...customerData,
    });

    // Step 4: Calculate fees & breakdown
    const financials = this.calculateFinancials(resolvedItems);

    // Step 5: Create PENDING transaction + delivery record
    const reference = `TXN-${this.uuidGenerator.generate()}`;
    const transaction = await this.transactionsRepo.create({
      reference,
      customerId: customer.id,
      items: resolvedItems,
      sessionId,
      ...financials,
      paymentDetails: {
        cardBrand: cardData.brand,
        cardLastFour: cardData.lastFour,
      },
    });

    await this.createDeliveryRecord(transaction.id, customer.id, deliveryData);

    // Step 6: Process Payment (Wompi)
    const paymentResult = await this.processPayment(
      transaction,
      financials.totalAmountInCents,
      dto,
    );

    return this.finalize(paymentResult, resolvedItems, sessionId);
  }

  private async checkIdempotency(
    sessionId?: string,
  ): Promise<Result<TransactionResponseDto> | null> {
    if (!sessionId) return null;

    const existing = await this.transactionsRepo.findBySessionId(sessionId);
    const approved = existing.find((t) => t.status === 'APPROVED');
    if (approved) return Result.ok(TransactionResponseDto.fromEntity(approved));

    const pending = existing.find((t) => t.status === 'PENDING');
    if (pending) return Result.ok(TransactionResponseDto.fromEntity(pending));

    return null;
  }

  private async resolveAndReserveItems(
    cartItems: CreateTransactionDto['items'],
  ): Promise<Result<CartItemData[]>> {
    const resolvedItems: CartItemData[] = [];

    for (const item of cartItems) {
      const product = await this.productsRepo.findById(item.productId);
      if (!product) return Result.fail(TRANSACTIONS_ERRORS.PRODUCT_NOT_FOUND);

      if (product.stock < item.quantity) {
        return Result.fail(
          TRANSACTIONS_ERRORS.INSUFFICIENT_STOCK(product.stock, item.quantity),
        );
      }

      await this.productsRepo.decrementStock(item.productId, item.quantity);

      resolvedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPriceInCents: product.priceInCents,
      });
    }

    return Result.ok(resolvedItems);
  }

  private calculateFinancials(resolvedItems: CartItemData[]) {
    const transactionFeeInCents = this.config.getTransactionFeeInCents();
    const deliveryFeeInCents = this.config.getDeliveryFeeInCents();

    const subtotal = resolvedItems.reduce(
      (sum, item) => sum + item.unitPriceInCents * item.quantity,
      0,
    );

    const totalAmountInCents =
      subtotal + transactionFeeInCents + deliveryFeeInCents;

    return {
      totalAmountInCents,
      breakdown: [
        { concept: 'SUBTOTAL', amountInCents: subtotal },
        { concept: 'SHIPPING', amountInCents: deliveryFeeInCents },
        { concept: 'TRANSACTION_FEE', amountInCents: transactionFeeInCents },
      ],
    };
  }

  private async rollbackStock(items: CartItemData[]) {
    for (const item of items) {
      await this.productsRepo.incrementStock(item.productId, item.quantity);
    }
  }

  private async processPayment(
    transaction: any,
    totalAmountInCents: number,
    dto: CreateTransactionDto,
  ): Promise<Result<any>> {
    const reference = transaction.reference;

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
      return Result.fail(paymentResult.getError());
    }

    const wompiResult = paymentResult.getValue();
    const paymentStatus = wompiResult.status;

    let finalStatus: TransactionStatus = 'ERROR';
    if (paymentStatus === PaymentStatus.SUCCESS) finalStatus = 'APPROVED';
    if (paymentStatus === PaymentStatus.DECLINED) finalStatus = 'DECLINED';
    if (paymentStatus === PaymentStatus.PENDING) finalStatus = 'PENDING';

    const updatedTransaction = await this.transactionsRepo.updateStatus(
      transaction.id,
      finalStatus,
      {
        gatewayId: wompiResult.wompiId,
        gatewayResponse: wompiResult.rawResponse,
      },
    );

    return Result.ok(updatedTransaction);
  }

  private async createDeliveryRecord(
    transactionId: string,
    customerId: string,
    deliveryData: CreateTransactionDto['deliveryData'],
  ) {
    const normalize = (str?: string) => str?.trim().toUpperCase();

    return this.deliveriesRepo.create({
      transactionId,
      customerId,
      address: normalize(deliveryData.address)!,
      addressDetail: normalize(deliveryData.addressDetail),
      city: normalize(deliveryData.city)!,
      state: normalize(deliveryData.state)!,
      postalCode: deliveryData.postalCode,
    });
  }

  private async finalize(
    paymentResult: Result<any>,
    resolvedItems: CartItemData[],
    sessionId?: string,
  ): Promise<Result<TransactionResponseDto>> {
    // 1. Technical Failure Handling
    if (paymentResult.isFailure) {
      await this.rollbackStock(resolvedItems);
      return Result.fail(
        TRANSACTIONS_ERRORS.PAYMENT_FAILED(paymentResult.getError() as string),
      );
    }

    const updatedTransaction = paymentResult.getValue();

    // 2. Business Failure Handling (Declined/Error status)
    if (
      updatedTransaction.status === 'DECLINED' ||
      updatedTransaction.status === 'ERROR'
    ) {
      await this.rollbackStock(resolvedItems);
    }

    // 3. Cleanup Persistence Logic (Session)
    if (sessionId) {
      try {
        await this.reservationsRepo.deleteBySessionId(sessionId);
      } catch {
        /* non-critical */
      }
    }

    return Result.ok(TransactionResponseDto.fromEntity(updatedTransaction));
  }
}
