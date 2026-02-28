import { ApiProperty } from '@nestjs/swagger';
import type { CustomerEntity } from '../../domain/entities/customer.entity';

export class CustomerResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() name: string;
  @ApiProperty({ nullable: true }) phone: string | null;

  static fromEntity(entity: CustomerEntity): CustomerResponseDto {
    const dto = new CustomerResponseDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.name = entity.name;
    dto.phone = entity.phone;
    return dto;
  }
}
