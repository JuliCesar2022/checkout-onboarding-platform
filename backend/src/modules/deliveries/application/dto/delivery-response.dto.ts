import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { DeliveryEntity } from '../../domain/entities/delivery.entity';

export class DeliveryResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() address: string;
  @ApiPropertyOptional() addressDetail: string | null;
  @ApiProperty() city: string;
  @ApiProperty() state: string;
  @ApiProperty({ nullable: true }) postalCode: string | null;
  @ApiProperty() country: string;
  @ApiProperty() transactionId: string;
  @ApiProperty() productId: string;
  @ApiProperty() customerId: string;
  @ApiProperty() createdAt: Date;

  static fromEntity(entity: DeliveryEntity): DeliveryResponseDto {
    const dto = new DeliveryResponseDto();
    dto.id = entity.id;
    dto.address = entity.address;
    dto.addressDetail = entity.addressDetail ?? null;
    dto.city = entity.city;
    dto.state = entity.state;
    dto.postalCode = entity.postalCode ?? null;
    dto.country = entity.country;
    dto.transactionId = entity.transactionId;
    dto.productId = entity.productId;
    dto.customerId = entity.customerId;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}
