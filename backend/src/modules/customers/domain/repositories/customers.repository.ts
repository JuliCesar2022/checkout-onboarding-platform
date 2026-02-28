import type { CustomerEntity } from '../entities/customer.entity';

export abstract class ICustomersRepository {
  abstract findById(id: string): Promise<CustomerEntity | null>;
  abstract findByEmail(email: string): Promise<CustomerEntity | null>;
  abstract upsertByEmail(data: {
    email: string;
    name: string;
    phone?: string;
  }): Promise<CustomerEntity>;
}
