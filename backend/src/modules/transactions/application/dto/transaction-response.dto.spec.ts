import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { TransactionResponseDto } from './transaction-response.dto';

describe('TransactionResponseDto', () => {
  it('should map from entity correctly', () => {
    const entity = new TransactionEntity({
      id: 'txn-123',
      reference: 'REF-123',
      status: 'APPROVED',
      totalAmountInCents: 50000,
      currency: 'COP',
      payment: {
        id: 'pay-123',
        gatewayId: 'wompi-123',
        cardBrand: 'VISA',
        cardLastFour: '4242',
        transactionId: 'txn-123',
        amountInCents: 50000,
        currency: 'COP',
        rawResponse: {},
        status: 'SUCCESS',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
      customerId: 'cust-123',
      createdAt: new Date(),
    });

    const dto = TransactionResponseDto.fromEntity(entity);

    expect(dto.id).toBe(entity.id);
    expect(dto.reference).toBe(entity.reference);
    expect(dto.status).toBe(entity.status);
    expect(dto.totalAmountInCents).toBe(entity.totalAmountInCents);
    expect(dto.cardBrand).toBe(entity.payment?.cardBrand);
    expect(dto.cardLastFour).toBe(entity.payment?.cardLastFour);
  });
});
