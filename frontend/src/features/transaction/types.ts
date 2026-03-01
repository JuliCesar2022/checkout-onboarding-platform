export type TransactionStatus = 'APPROVED' | 'DECLINED' | 'PENDING' | 'ERROR';

export interface Transaction {
  id: string;
  status: TransactionStatus;
  reference: string;
  amountInCents: number;
  createdAt: string;
  updatedAt: string;
}
