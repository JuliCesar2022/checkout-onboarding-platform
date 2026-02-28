export class DeliveryEntity {
  id: string;
  address: string;
  city: string;
  state: string;
  postalCode: string | null;
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
