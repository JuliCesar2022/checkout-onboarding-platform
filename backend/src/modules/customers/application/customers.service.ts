import { Injectable } from '@nestjs/common';
import { ICustomersRepository } from '../domain/repositories/customers.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { Result } from '../../../common/result/result';

@Injectable()
export class CustomersService {
  constructor(private readonly customersRepository: ICustomersRepository) {}

  async upsertByEmail(
    dto: CreateCustomerDto,
  ): Promise<Result<CustomerResponseDto>> {
    const customer = await this.customersRepository.upsertByEmail({
      email: dto.email,
      name: dto.name,
      phone: dto.phone,
    });
    return Result.ok(CustomerResponseDto.fromEntity(customer));
  }

  async findById(id: string): Promise<Result<CustomerResponseDto>> {
    const customer = await this.customersRepository.findById(id);
    if (!customer) {
      return Result.fail(`Customer with id "${id}" not found`);
    }
    return Result.ok(CustomerResponseDto.fromEntity(customer));
  }
}
