import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  IDeliveriesRepository,
  CreateDeliveryData,
} from '../../domain/repositories/deliveries.repository';
import { DeliveryEntity } from '../../domain/entities/delivery.entity';
import { DeliveryMapper } from '../mappers/delivery.mapper';

@Injectable()
export class PrismaDeliveriesRepository implements IDeliveriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDeliveryData): Promise<DeliveryEntity> {
    const delivery = await this.prisma.delivery.create({
      data: {
        transactionId: data.transactionId,
        productId: data.productId,
        customerId: data.customerId,
        address: data.address,
        addressDetail: data.addressDetail,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
      },
    });
    return DeliveryMapper.toDomain(delivery);
  }

  async findByTransactionId(
    transactionId: string,
  ): Promise<DeliveryEntity | null> {
    const delivery = await this.prisma.delivery.findUnique({
      where: { transactionId },
    });
    return delivery ? DeliveryMapper.toDomain(delivery) : null;
  }
}
