import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  IProductsRepository,
  FindProductsPaginatedParams,
} from '../../domain/repositories/products.repository';
import type { PaginatedResult } from '../../../../common/interfaces/paginated-result.interface';
import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class PrismaProductsRepository implements IProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return products.map(ProductMapper.toDomain);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product ? ProductMapper.toDomain(product) : null;
  }

  async decrementStock(id: string, quantity: number): Promise<ProductEntity> {
    const product = await this.prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
    return ProductMapper.toDomain(product);
  }

  async findPaginated({
    search,
    limit,
    cursor,
  }: FindProductsPaginatedParams): Promise<PaginatedResult<ProductEntity>> {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    // Fetch one extra to determine if there is a next page
    const rows = await this.prisma.product.findMany({
      where,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'asc' },
    });

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return {
      items: items.map(ProductMapper.toDomain),
      nextCursor,
    };
  }
}
