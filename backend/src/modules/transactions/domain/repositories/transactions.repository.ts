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
  totalAmountInCents: number;
  customerId: string;
  /** Financial breakdown (Subtotal, Shipping, etc.) */
  breakdown: {
    concept: string;
    amountInCents: number;
  }[];
  /** Initial payment details (e.g. card brand/last four) */
  paymentDetails?: {
    cardBrand?: string;
    cardLastFour?: string;
  };
  /** Line items — always required */
  items: CartItemData[];
  sessionId?: string;
}

export abstract class ITransactionsRepository {
  abstract create(data: CreateTransactionData): Promise<TransactionEntity>;
  abstract findById(id: string): Promise<TransactionEntity | null>;
  abstract findByReference(
    reference: string,
  ): Promise<TransactionEntity | null>;
  abstract findBySessionId(sessionId: string): Promise<TransactionEntity[]>;
  abstract findPending(): Promise<TransactionEntity[]>;
  abstract updateStatus(
    id: string,
    status: TransactionStatus,
    paymentDetails?: {
      gatewayId?: string;
      gatewayResponse?: Record<string, unknown>;
    },
  ): Promise<TransactionEntity>;
}
