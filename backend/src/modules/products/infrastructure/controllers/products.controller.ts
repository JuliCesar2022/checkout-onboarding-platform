import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from '../../application/products.service';
import { ProductResponseDto } from '../../application/dto/product-response.dto';
import { PublicEndpoint } from '../../../../common/decorators/throttle.decorators';
import { unwrap } from '../../../../common/helpers/result-to-http.helper';

@ApiTags('products')
@Controller('products')
@PublicEndpoint()  // Read-only: 100 req/min per IP
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all products with current stock' })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async findAll(): Promise<ProductResponseDto[]> {
    return this.productsService.findAll();
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
