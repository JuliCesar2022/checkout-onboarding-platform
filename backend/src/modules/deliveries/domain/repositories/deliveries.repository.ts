import type { DeliveryEntity } from '../entities/delivery.entity';

export interface CreateDeliveryData {
  transactionId: string;
  productId: string;
  customerId: string;
  address: string;
  addressDetail?: string;
  city: string;
  state: string;
  postalCode?: string;
}

export abstract class IDeliveriesRepository {
  abstract create(data: CreateDeliveryData): Promise<DeliveryEntity>;
  abstract findByTransactionId(
    transactionId: string,
  ): Promise<DeliveryEntity | null>;
}
