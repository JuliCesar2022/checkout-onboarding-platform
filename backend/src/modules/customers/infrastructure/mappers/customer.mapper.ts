import type { Customer as PrismaCustomer } from '@prisma/client';
import { CustomerEntity } from '../../domain/entities/customer.entity';

export class CustomerMapper {
  static toDomain(prisma: PrismaCustomer): CustomerEntity {
    return new CustomerEntity({
      id: prisma.id,
      email: prisma.email,
      name: prisma.name,
      phone: prisma.phone,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    });
  }
}
