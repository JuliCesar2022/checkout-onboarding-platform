export type TransactionStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'DECLINED'
  | 'ERROR'
  | 'VOIDED';

export class TransactionEntity {
  id: string;
  reference: string;
  status: TransactionStatus;
  totalAmountInCents: number;
  currency: string;
  customerId: string;
  sessionId: string | null;
  payment?: import('./payment.entity').PaymentEntity;
  breakdown?: import('./financial-breakdown.entity').FinancialBreakdownEntity[];
  items?: { productId: string; quantity: number }[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<TransactionEntity>) {
    Object.assign(this, partial);
  }

  get isApproved(): boolean {
    return this.status === 'APPROVED';
  }

  get isPending(): boolean {
    return this.status === 'PENDING';
  }
}
