export class DeliveryEntity {
  id: string;
  address: string;
  addressDetail?: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  transactionId: string;
  productId: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<DeliveryEntity>) {
    Object.assign(this, partial);
  }
}
