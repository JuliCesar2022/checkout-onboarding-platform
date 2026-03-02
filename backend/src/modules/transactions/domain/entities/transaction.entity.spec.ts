import { TransactionEntity } from './transaction.entity';

describe('TransactionEntity', () => {
  it('should create a transaction entity correctly', () => {
    const transactionData = {
      id: 'txn-123',
      reference: 'TXN-REF-123',
      status: 'PENDING' as const,
      amountInCents: 10000,
      currency: 'COP',
      productId: 'prod-123',
      quantity: 1,
      customerId: 'cust-123',
    };

    const transaction = new TransactionEntity(transactionData);

    expect(transaction.id).toBe(transactionData.id);
    expect(transaction.reference).toBe(transactionData.reference);
    expect(transaction.status).toBe('PENDING');
    expect(transaction.amountInCents).toBe(10000);
  });

  it('should identify as approved correctly', () => {
    const approvedTx = new TransactionEntity({ status: 'APPROVED' });
    const pendingTx = new TransactionEntity({ status: 'PENDING' });

    expect(approvedTx.isApproved).toBe(true);
    expect(pendingTx.isApproved).toBe(false);
  });

  it('should identify as pending correctly', () => {
    const pendingTx = new TransactionEntity({ status: 'PENDING' });
    const declinedTx = new TransactionEntity({ status: 'DECLINED' });

    expect(pendingTx.isPending).toBe(true);
    expect(declinedTx.isPending).toBe(false);
  });
});
