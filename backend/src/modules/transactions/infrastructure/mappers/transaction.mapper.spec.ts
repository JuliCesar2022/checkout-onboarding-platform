import { TransactionMapper } from './transaction.mapper';

describe('TransactionMapper', () => {
  it('should map prisma transaction with all relations to domain entity', () => {
    const now = new Date();
    const prismaTx: any = {
      id: 'txn-123',
      reference: 'REF-123',
      status: 'APPROVED',
      totalAmountInCents: 50000,
      currency: 'COP',
      customerId: 'cust-123',
      sessionId: 'sess-123',
      payment: {
        id: 'pay-123',
        transactionId: 'txn-123',
        gatewayId: 'wompi-123',
        cardBrand: 'VISA',
        cardLastFour: '4242',
        gatewayResponse: { some: 'data' },
        createdAt: now,
        updatedAt: now,
      },
      breakdown: [
        {
          id: 'b1',
          transactionId: 'txn-123',
          concept: 'SUBTOTAL',
          amountInCents: 45000,
        },
      ],
      items: [{ productId: 'p1', quantity: 2 }],
      createdAt: now,
      updatedAt: now,
    };

    const entity = TransactionMapper.toDomain(prismaTx);

    expect(entity.id).toBe(prismaTx.id);
    expect(entity.reference).toBe(prismaTx.reference);
    expect(entity.status).toBe(prismaTx.status);
    expect(entity.sessionId).toBe('sess-123');
    
    // Payment mapping
    expect(entity.payment).toBeDefined();
    expect(entity.payment?.id).toBe(prismaTx.payment.id);
    expect(entity.payment?.gatewayId).toBe(prismaTx.payment.gatewayId);

    // Breakdown mapping
    expect(entity.breakdown).toHaveLength(1);
    expect(entity.breakdown?.[0].concept).toBe('SUBTOTAL');
    expect(entity.breakdown?.[0].amountInCents).toBe(45000);

    // Items mapping
    expect(entity.items).toHaveLength(1);
    expect(entity.items?.[0].productId).toBe('p1');
    expect(entity.items?.[0].quantity).toBe(2);
  });

  it('should map prisma transaction without optional relations', () => {
    const prismaTx: any = {
      id: 'txn-456',
      reference: 'REF-456',
      status: 'PENDING',
      totalAmountInCents: 1000,
      currency: 'COP',
      customerId: 'cust-456',
      payment: null,
      breakdown: [],
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = TransactionMapper.toDomain(prismaTx);

    expect(entity.payment).toBeUndefined();
    expect(entity.breakdown).toEqual([]);
    expect(entity.items).toEqual([]);
  });
});
