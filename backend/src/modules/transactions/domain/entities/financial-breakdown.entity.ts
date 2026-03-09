export class FinancialBreakdownEntity {
  id: string;
  transactionId: string;
  concept: string;
  amountInCents: number;

  constructor(partial: Partial<FinancialBreakdownEntity>) {
    Object.assign(this, partial);
  }
}
