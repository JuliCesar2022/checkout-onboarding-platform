import { ApiProperty } from '@nestjs/swagger';
import type { ProductEntity } from '../../domain/entities/product.entity';

export class ProductResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiProperty({ nullable: true }) imageUrl: string | null;
  @ApiProperty() priceInCents: number;
  @ApiProperty() stock: number;
  @ApiProperty() isAvailable: boolean;
  @ApiProperty() categoryId: string;

  static fromEntity(entity: ProductEntity): ProductResponseDto {
    const dto = new ProductResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.imageUrl = entity.imageUrl;
    dto.priceInCents = entity.priceInCents;
    dto.stock = entity.stock;
    dto.isAvailable = entity.isAvailable;
    dto.categoryId = entity.categoryId;
    return dto;
  }
}
