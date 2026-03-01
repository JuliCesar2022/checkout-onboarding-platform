import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';

export class FindProductsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by name or description (case-insensitive)',
    example: 'headphone',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by category ID',
    example: 'uuid-string',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
