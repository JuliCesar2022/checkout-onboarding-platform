import type { Category as PrismaCategory } from '@prisma/client';
import { CategoryEntity } from '../../domain/entities/category.entity';

type PrismaCategoryWithChildren = PrismaCategory & {
  children?: PrismaCategory[];
};

export class CategoryMapper {
  static toDomain(prisma: PrismaCategoryWithChildren): CategoryEntity {
    return new CategoryEntity({
      id: prisma.id,
      slug: prisma.slug,
      name: prisma.name,
      description: prisma.description,
      imageUrl: prisma.imageUrl,
      parentId: prisma.parentId,
      children: (prisma.children ?? []).map(CategoryMapper.toDomain),
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    });
  }
}
