import { Transaction as PrismaTransaction } from '@prisma/client';
import { TransactionMapper } from './transaction.mapper';

describe('TransactionMapper', () => {
  it('should map prisma transaction to domain entity', () => {
    const prismaTx: any = {
      id: 'txn-123',
      reference: 'REF-123',
      status: 'APPROVED',
      totalAmountInCents: 50000,
      currency: 'COP',
      customerId: 'cust-123',
      payment: {
        id: 'pay-123',
        gatewayId: 'wompi-123',
        cardBrand: 'VISA',
        cardLastFour: '4242',
        gatewayResponse: { some: 'data' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = TransactionMapper.toDomain(prismaTx);

    expect(entity.id).toBe(prismaTx.id);
    expect(entity.reference).toBe(prismaTx.reference);
    expect(entity.status).toBe(prismaTx.status);
    expect(entity.payment?.gatewayId).toBe(prismaTx.payment.gatewayId);
  });
});
