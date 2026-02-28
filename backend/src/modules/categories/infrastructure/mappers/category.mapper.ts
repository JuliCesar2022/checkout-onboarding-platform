import type { Category as PrismaCategory } from '@prisma/client';
import { CategoryEntity } from '../../domain/entities/category.entity';

export class CategoryMapper {
  static toDomain(prisma: PrismaCategory): CategoryEntity {
    return new CategoryEntity({
      id: prisma.id,
      slug: prisma.slug,
      name: prisma.name,
      description: prisma.description,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    });
  }
}
