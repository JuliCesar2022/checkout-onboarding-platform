import { Transaction as PrismaTransaction } from '@prisma/client';
import { TransactionMapper } from './transaction.mapper';

describe('TransactionMapper', () => {
  it('should map prisma transaction to domain entity', () => {
    const prismaTx: PrismaTransaction = {
      id: 'txn-123',
      reference: 'REF-123',
      wompiId: 'wompi-123',
      status: 'APPROVED',
      amountInCents: 50000,
      currency: 'COP',
      cardBrand: 'VISA',
      cardLastFour: '4242',
      productAmountInCents: 40000,
      baseFeeInCents: 5000,
      deliveryFeeInCents: 5000,
      productId: 'prod-123',
      quantity: 1,
      customerId: 'cust-123',
      wompiResponse: { some: 'data' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = TransactionMapper.toDomain(prismaTx);

    expect(entity.id).toBe(prismaTx.id);
    expect(entity.reference).toBe(prismaTx.reference);
    expect(entity.status).toBe(prismaTx.status);
    expect(entity.wompiResponse).toEqual(prismaTx.wompiResponse);
  });
});
