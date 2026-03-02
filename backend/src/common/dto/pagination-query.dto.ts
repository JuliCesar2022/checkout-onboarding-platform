import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { PAGINATION_CONSTANTS } from '../constants/pagination.constants';

/**
 * Reusable base DTO for cursor-based pagination query params.
 * Extend this class and add module-specific filters (e.g. `search`).
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: `Number of items per page (default ${PAGINATION_CONSTANTS.DEFAULT_LIMIT}, max ${PAGINATION_CONSTANTS.MAX_LIMIT})`,
    example: PAGINATION_CONSTANTS.DEFAULT_LIMIT,
    default: PAGINATION_CONSTANTS.DEFAULT_LIMIT,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(PAGINATION_CONSTANTS.MIN_LIMIT)
  @Max(PAGINATION_CONSTANTS.MAX_LIMIT)
  limit: number;

  @ApiPropertyOptional({
    description:
      'ID or token of the last item received — pass as cursor to get the next page',
    example: 'uuid-of-last-seen-item',
  })
  @IsOptional()
  @IsString()
  cursor?: string;
}
