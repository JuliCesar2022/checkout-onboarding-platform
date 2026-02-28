import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

/**
 * Reusable base DTO for cursor-based pagination query params.
 * Extend this class and add module-specific filters (e.g. `search`).
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Number of items per page (default 12, max 50)',
    example: 12,
    default: 12,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 12;

  @ApiPropertyOptional({
    description:
      'ID of the last item received — pass as cursor to get the next page',
    example: 'uuid-of-last-seen-item',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  cursor?: string;
}
