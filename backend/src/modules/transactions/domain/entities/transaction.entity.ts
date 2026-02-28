export type TransactionStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'DECLINED'
  | 'ERROR'
  | 'VOIDED';

export class TransactionEntity {
  id: string;
  reference: string;
  wompiId: string | null;
  status: TransactionStatus;
  amountInCents: number;
  currency: string;
  cardBrand: string | null;
  cardLastFour: string | null;
  productAmountInCents: number;
  baseFeeInCents: number;
  deliveryFeeInCents: number;
  productId: string;
  quantity: number;
  customerId: string;
  wompiResponse: Record<string, unknown> | null;
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
