import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { TransactionResponseDto } from './transaction-response.dto';

describe('TransactionResponseDto', () => {
  it('should map from entity correctly', () => {
    const entity = new TransactionEntity({
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
      createdAt: new Date(),
    });

    const dto = TransactionResponseDto.fromEntity(entity);

    expect(dto.id).toBe(entity.id);
    expect(dto.reference).toBe(entity.reference);
    expect(dto.status).toBe(entity.status);
    expect(dto.amountInCents).toBe(entity.amountInCents);
    expect(dto.cardBrand).toBe(entity.cardBrand);
    expect(dto.cardLastFour).toBe(entity.cardLastFour);
    expect(dto.productId).toBe(entity.productId);
  });
});
