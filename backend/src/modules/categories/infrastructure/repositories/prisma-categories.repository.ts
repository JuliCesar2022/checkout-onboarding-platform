import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ICategoriesRepository } from '../../domain/repositories/categories.repository';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CategoryMapper } from '../mappers/category.mapper';
import { CATEGORIES_CONFIG } from '../../domain/constants/categories.constants';

@Injectable()
export class PrismaCategoriesRepository implements ICategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CategoryEntity[]> {
    // Return only top-level categories (parents + children nested), sorted by name
    const categories = await this.prisma.category.findMany({
      where: { parentId: null },
      orderBy: {
        [CATEGORIES_CONFIG.DEFAULT_SORT_FIELD]:
          CATEGORIES_CONFIG.DEFAULT_SORT_ORDER,
      },
      include: {
        children: {
          orderBy: {
            [CATEGORIES_CONFIG.DEFAULT_SORT_FIELD]:
              CATEGORIES_CONFIG.DEFAULT_SORT_ORDER,
          },
        },
      },
    });
    return categories.map(CategoryMapper.toDomain);
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: {
            [CATEGORIES_CONFIG.DEFAULT_SORT_FIELD]:
              CATEGORIES_CONFIG.DEFAULT_SORT_ORDER,
          },
        },
      },
    });
    return category ? CategoryMapper.toDomain(category) : null;
  }
}
