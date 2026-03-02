import type { Delivery as PrismaDelivery } from '@prisma/client';
import { DeliveryEntity } from '../../domain/entities/delivery.entity';

export class DeliveryMapper {
  static toDomain(prisma: PrismaDelivery): DeliveryEntity {
    return new DeliveryEntity({
      id: prisma.id,
      address: prisma.address,
      addressDetail: prisma.addressDetail ?? undefined,
      city: prisma.city,
      state: prisma.state,
      postalCode: prisma.postalCode ?? undefined,
      country: prisma.country,
      transactionId: prisma.transactionId,
      productId: prisma.productId,
      customerId: prisma.customerId,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    });
  }
}
