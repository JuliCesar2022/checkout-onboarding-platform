import { ApiProperty } from '@nestjs/swagger';
import type { Type } from '@nestjs/common';

/**
 * Factory that generates a typed paginated response class compatible with Swagger.
 * Usage:
 *   export class PaginatedProductsDto extends PaginatedResponseDto(ProductResponseDto) {}
 */
export function PaginatedResponseDto<TItem>(ItemClass: Type<TItem>) {
  class PaginatedResponseDtoClass {
    @ApiProperty({ type: [ItemClass] })
    data: TItem[];

    @ApiProperty({
      nullable: true,
      description:
        'Pass this value as `cursor` in the next request to get the following page. Null when no more pages.',
      example: 'uuid-of-last-item',
    })
    nextCursor: string | null;

    @ApiProperty({
      description: 'Whether there are more items after this page',
      example: true,
    })
    hasMore: boolean;
  }

  return PaginatedResponseDtoClass;
}
