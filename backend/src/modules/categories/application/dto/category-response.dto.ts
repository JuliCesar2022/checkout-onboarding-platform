import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CategoryEntity } from '../../domain/entities/category.entity';

export class CategoryResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() slug: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() description: string | null;

  static fromEntity(entity: CategoryEntity): CategoryResponseDto {
    const dto = new CategoryResponseDto();
    dto.id = entity.id;
    dto.slug = entity.slug;
    dto.name = entity.name;
    dto.description = entity.description;
    return dto;
  }
}
