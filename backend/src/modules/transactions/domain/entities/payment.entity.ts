export class PaymentEntity {
  id: string;
  transactionId: string;
  gatewayId: string | null;
  cardBrand: string | null;
  cardLastFour: string | null;
  gatewayResponse: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<PaymentEntity>) {
    Object.assign(this, partial);
  }
}
