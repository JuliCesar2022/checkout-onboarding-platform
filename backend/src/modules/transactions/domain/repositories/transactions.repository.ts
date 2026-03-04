import type {
  TransactionEntity,
  TransactionStatus,
} from '../entities/transaction.entity';

export interface CartItemData {
  productId: string;
  quantity: number;
  unitPriceInCents: number;
}

export interface CreateTransactionData {
  reference: string;
  amountInCents: number;
  productAmountInCents: number;
  baseFeeInCents: number;
  deliveryFeeInCents: number;
  /** Primary product (used for Delivery relation and single-product flow) */
  productId: string;
  quantity: number;
  customerId: string;
  cardBrand?: string;
  cardLastFour?: string;
  /** Line items — populated when cart has >1 distinct product type */
  items?: CartItemData[];
}

export abstract class ITransactionsRepository {
  abstract create(data: CreateTransactionData): Promise<TransactionEntity>;
  abstract findById(id: string): Promise<TransactionEntity | null>;
  abstract findByReference(
    reference: string,
  ): Promise<TransactionEntity | null>;
  abstract findPending(): Promise<TransactionEntity[]>;
  abstract updateStatus(
    id: string,
    status: TransactionStatus,
    wompiId?: string,
    wompiResponse?: Record<string, unknown>,
  ): Promise<TransactionEntity>;
}
