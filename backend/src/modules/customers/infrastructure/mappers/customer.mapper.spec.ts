import { CustomerMapper } from './customer.mapper';
import { Customer as PrismaCustomer } from '@prisma/client';

describe('CustomerMapper', () => {
  it('should map Prisma customer to domain entity', () => {
    const prismaCustomer: PrismaCustomer = {
      id: 'cust-1',
      email: 'test@test.com',
      name: 'Test User',
      phone: '123456789',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-02'),
    };

    const domainEntity = CustomerMapper.toDomain(prismaCustomer);

    expect(domainEntity.id).toBe(prismaCustomer.id);
    expect(domainEntity.email).toBe(prismaCustomer.email);
    expect(domainEntity.name).toBe(prismaCustomer.name);
    expect(domainEntity.phone).toBe(prismaCustomer.phone);
    expect(domainEntity.createdAt).toBe(prismaCustomer.createdAt);
    expect(domainEntity.updatedAt).toBe(prismaCustomer.updatedAt);
  });
});
