import { DeliveryMapper } from './delivery.mapper';
import { Delivery as PrismaDelivery } from '@prisma/client';

describe('DeliveryMapper', () => {
  const mockPrismaDelivery: PrismaDelivery = {
    id: 'del-1',
    address: 'Calle 123',
    addressDetail: 'Apt 101',
    city: 'Bogota',
    state: 'Cundinamarca',
    postalCode: '110111',
    country: 'Colombia',
    transactionId: 'tx-1',
    customerId: 'cust-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should map prisma delivery to domain entity', () => {
    const domain = DeliveryMapper.toDomain(mockPrismaDelivery);

    expect(domain.id).toBe(mockPrismaDelivery.id);
    expect(domain.address).toBe(mockPrismaDelivery.address);
    expect(domain.addressDetail).toBe(mockPrismaDelivery.addressDetail);
    expect(domain.city).toBe(mockPrismaDelivery.city);
    expect(domain.state).toBe(mockPrismaDelivery.state);
    expect(domain.postalCode).toBe(mockPrismaDelivery.postalCode);
    expect(domain.country).toBe(mockPrismaDelivery.country);
    expect(domain.transactionId).toBe(mockPrismaDelivery.transactionId);
    expect(domain.customerId).toBe(mockPrismaDelivery.customerId);
  });

  it('should handle optional fields correctly', () => {
    const minimalPrisma: PrismaDelivery = {
      ...mockPrismaDelivery,
      addressDetail: null,
      postalCode: null,
    };

    const domain = DeliveryMapper.toDomain(minimalPrisma);

    expect(domain.addressDetail).toBeUndefined();
    expect(domain.postalCode).toBeUndefined();
  });
});
