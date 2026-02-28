import type { Product as PrismaProduct } from '@prisma/client';
import { ProductEntity } from '../../domain/entities/product.entity';
export class ProductMapper {
  static toDomain(prisma: PrismaProduct): ProductEntity {
    return new ProductEntity({
      id: prisma.id,
      sku: prisma.sku,
      name: prisma.name,
      description: prisma.description,
      categoryId: prisma.categoryId,
      imageUrl: prisma.imageUrl,
      priceInCents: prisma.priceInCents,
      stock: prisma.stock,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    });
  }
}
