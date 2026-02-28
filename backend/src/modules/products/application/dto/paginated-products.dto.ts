import { PaginatedResponseDto } from '../../../../common/dto/paginated-response.dto';
import { ProductResponseDto } from './product-response.dto';

export class PaginatedProductsDto extends PaginatedResponseDto(
  ProductResponseDto,
) {}
