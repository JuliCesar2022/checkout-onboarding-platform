export class CustomerEntity {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<CustomerEntity>) {
    Object.assign(this, partial);
  }
}
