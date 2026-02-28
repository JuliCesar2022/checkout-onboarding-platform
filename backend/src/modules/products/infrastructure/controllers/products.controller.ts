import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from '../../application/products.service';
import { ProductResponseDto } from '../../application/dto/product-response.dto';
import { PaginatedProductsDto } from '../../application/dto/paginated-products.dto';
import { FindProductsQueryDto } from '../../application/dto/find-products-query.dto';
import { PublicEndpoint } from '../../../../common/decorators/throttle.decorators';
import { unwrap } from '../../../../common/helpers/result-to-http.helper';

@ApiTags('products')
@Controller('products')
@PublicEndpoint() // Read-only: 100 req/min per IP
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get paginated products with optional search',
    description:
      'Returns a page of products. Pass `cursor` (the `nextCursor` from a previous response) to fetch the next page. Supports infinite scroll.',
  })
  @ApiResponse({ status: 200, type: PaginatedProductsDto })
  async findAll(
    @Query() query: FindProductsQueryDto,
  ): Promise<PaginatedProductsDto> {
    return this.productsService.findPaginated(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findById(@Param('id') id: string): Promise<ProductResponseDto> {
    return unwrap(await this.productsService.findById(id), 'not_found');
  }
}
