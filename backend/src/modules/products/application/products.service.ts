import { Injectable } from '@nestjs/common';
import { IProductsRepository } from '../domain/repositories/products.repository';
import { ProductResponseDto } from './dto/product-response.dto';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { Result } from '../../../common/result/result';
import { ErrorCode } from '../../../common/constants/error-codes.constants';
import { PRODUCTS_ERRORS } from '../domain/constants/products.constants';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: IProductsRepository) {}

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productsRepository.findAll();
    return products.map(ProductResponseDto.fromEntity);
  }

  async findPaginated(
    query: FindProductsQueryDto,
  ): Promise<PaginatedProductsDto> {
    const { items, nextCursor } = await this.productsRepository.findPaginated({
      search: query.search,
      limit: query.limit,
      cursor: query.cursor,
      categoryId: query.categoryId,
    });

    return {
      data: items.map(ProductResponseDto.fromEntity),
      nextCursor,
      hasMore: nextCursor !== null,
    };
  }

  async findById(id: string): Promise<Result<ProductResponseDto>> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      return Result.fail(PRODUCTS_ERRORS.NOT_FOUND(id));
    }
    return Result.ok(ProductResponseDto.fromEntity(product));
  }

  async decrementStock(
    id: string,
    quantity: number,
  ): Promise<Result<ProductResponseDto>> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      return Result.fail(PRODUCTS_ERRORS.NOT_FOUND(id));
    }
    if (product.stock < quantity) {
      return Result.fail(
        PRODUCTS_ERRORS.INSUFFICIENT_STOCK(product.stock, quantity),
      );
    }
    const updated = await this.productsRepository.decrementStock(id, quantity);
    return Result.ok(ProductResponseDto.fromEntity(updated));
  }
}
