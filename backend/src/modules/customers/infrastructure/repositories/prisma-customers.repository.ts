import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ICustomersRepository } from '../../domain/repositories/customers.repository';
import { CustomerEntity } from '../../domain/entities/customer.entity';
import { CustomerMapper } from '../mappers/customer.mapper';

@Injectable()
export class PrismaCustomersRepository implements ICustomersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<CustomerEntity | null> {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    return customer ? CustomerMapper.toDomain(customer) : null;
  }

  async findByEmail(email: string): Promise<CustomerEntity | null> {
    const customer = await this.prisma.customer.findUnique({ where: { email } });
    return customer ? CustomerMapper.toDomain(customer) : null;
  }

  async upsertByEmail(data: {
    email: string;
    name: string;
    phone?: string;
  }): Promise<CustomerEntity> {
    const customer = await this.prisma.customer.upsert({
      where: { email: data.email },
      create: { email: data.email, name: data.name, phone: data.phone },
      update: { name: data.name, phone: data.phone },
    });
    return CustomerMapper.toDomain(customer);
  }
}
