import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CategoryEntity } from '../../domain/entities/category.entity';

export class CategoryResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() slug: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() description: string | null;
  @ApiPropertyOptional() imageUrl: string | null;
  @ApiPropertyOptional() parentId: string | null;
  @ApiPropertyOptional({ type: () => [CategoryResponseDto] }) children: CategoryResponseDto[];

  static fromEntity(entity: CategoryEntity): CategoryResponseDto {
    const dto = new CategoryResponseDto();
    dto.id = entity.id;
    dto.slug = entity.slug;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.imageUrl = entity.imageUrl;
    dto.parentId = entity.parentId ?? null;
    dto.children = (entity.children ?? []).map(CategoryResponseDto.fromEntity);
    return dto;
  }
}
