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
    categoryId,
  }: FindProductsPaginatedParams): Promise<PaginatedResult<ProductEntity>> {
    const whereCondition: any = {};

    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    if (categoryId) {
      // If the category has children, include products from all children too
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
        include: { children: { select: { id: true } } },
      });
      const childIds = (category as any)?.children?.map((c: any) => c.id) ?? [];
      if (childIds.length > 0) {
        whereCondition.categoryId = { in: childIds };
      } else {
        whereCondition.categoryId = categoryId;
      }
    }

    // Fetch one extra to determine if there is a next page
    const rows = await this.prisma.product.findMany({
      where:
        Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
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
