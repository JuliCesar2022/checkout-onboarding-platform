export type TransactionStatus =
  | "APPROVED"
  | "DECLINED"
  | "PENDING"
  | "ERROR"
  | "VOIDED";

export interface Transaction {
  id: string;
  status: TransactionStatus;
  reference: string;
  amountInCents: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitTransactionPayload {
  productId: string;
  quantity: number;
  cardData: {
    token: string;
    brand: string;
    lastFour: string;
    installments?: number;
  };
  deliveryData: {
    address: string;
    addressDetail?: string;
    city: string;
    state: string;
    postalCode?: string;
  };
  customerData: {
    email: string;
    name: string;
    phone?: string;
  };
  acceptanceToken: string;
  acceptPersonalAuth: string;
}

export interface TransactionResult {
  id: string;
  reference: string;
  status: TransactionStatus;
  amountInCents: number;
  productAmountInCents?: number;
  baseFeeInCents?: number;
  deliveryFeeInCents?: number;
}
