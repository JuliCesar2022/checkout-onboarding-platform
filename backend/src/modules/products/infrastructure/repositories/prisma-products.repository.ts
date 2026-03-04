import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  IProductsRepository,
  FindProductsPaginatedParams,
} from '../../domain/repositories/products.repository';
import type { PaginatedResult } from '../../../../common/interfaces/paginated-result.interface';
import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { REDIS_CLIENT } from '../../../storage/redis/redis.module';

@Injectable()
export class PrismaProductsRepository implements IProductsRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async findById(
    id: string,
    sessionId?: string,
  ): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) return null;
    const reserved = await this.getReservedQty(id, sessionId);
    return ProductMapper.toDomain({
      ...product,
      stock: Math.max(0, product.stock - reserved),
    });
  }

  /** Sum active Redis reservations for a product, optionally excluding current session */
  private async getReservedQty(
    productId: string,
    excludeSessionId?: string,
  ): Promise<number> {
    try {
      const keys = await this.redis.keys(`reserved:${productId}:*`);
      if (!keys.length) return 0;
      let total = 0;
      for (const key of keys) {
        // key format: "reserved:{productId}:{sessionId}"
        if (excludeSessionId && key.endsWith(`:${excludeSessionId}`)) {
          continue;
        }
        const qty = await this.redis.get(key);
        if (qty !== null) total += parseInt(qty, 10);
      }
      return total;
    } catch {
      // Redis unavailable — serve physical stock, don't fail
      return 0;
    }
  }

  async decrementStock(id: string, quantity: number): Promise<ProductEntity> {
    const product = await this.prisma.product.update({
      where: {
        id,
        stock: { gte: quantity }, // Atomic safety check
      },
      data: { stock: { decrement: quantity } },
    });
    return ProductMapper.toDomain(product);
  }

  async incrementStock(id: string, quantity: number): Promise<ProductEntity> {
    const product = await this.prisma.product.update({
      where: { id },
      data: { stock: { increment: quantity } },
    });
    return ProductMapper.toDomain(product);
  }

  async findPaginated(
    { search, limit, cursor, categoryId }: FindProductsPaginatedParams,
    sessionId?: string,
  ): Promise<PaginatedResult<ProductEntity>> {
    const whereCondition: any = {};

    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    if (categoryId) {
      // If the category has children, include products from the parent and all children
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
        include: { children: { select: { id: true } } },
      });
      const childIds = (category as any)?.children?.map((c: any) => c.id) ?? [];
      if (childIds.length > 0) {
        whereCondition.categoryId = { in: [categoryId, ...childIds] };
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

    // Subtract active Redis reservations from stock for each product
    const itemsWithRealStock = await Promise.all(
      items.map(async (row) => {
        const reserved = await this.getReservedQty(row.id, sessionId);
        return { ...row, stock: Math.max(0, row.stock - reserved) };
      }),
    );

    return {
      items: itemsWithRealStock.map(ProductMapper.toDomain),
      nextCursor,
    };
  }
}
