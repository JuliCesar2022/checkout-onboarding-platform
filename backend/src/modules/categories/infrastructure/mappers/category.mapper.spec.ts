import { CategoryMapper } from './category.mapper';
import { CategoryEntity } from '../../domain/entities/category.entity';
import type { Category as PrismaCategory } from '@prisma/client';

describe('CategoryMapper', () => {
  const mockPrismaCategory = {
    id: 'cat-1',
    slug: 'electronics',
    name: 'Electronics',
    description: 'Gadgets and more',
    imageUrl: 'http://image.com/cat.jpg',
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as PrismaCategory;

  it('should map a simple prisma category to domain entity', () => {
    const entity = CategoryMapper.toDomain(mockPrismaCategory);

    expect(entity).toBeInstanceOf(CategoryEntity);
    expect(entity.id).toBe(mockPrismaCategory.id);
    expect(entity.name).toBe(mockPrismaCategory.name);
    expect(entity.children).toEqual([]);
  });

  it('should map a category with children recursively', () => {
    const prismaWithChildren = {
      ...mockPrismaCategory,
      children: [
        {
          id: 'cat-1-1',
          slug: 'phones',
          name: 'Phones',
          description: null,
          imageUrl: null,
          parentId: 'cat-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const entity = CategoryMapper.toDomain(prismaWithChildren as any);

    expect(entity.children.length).toBe(1);
    expect(entity.children[0]).toBeInstanceOf(CategoryEntity);
    expect(entity.children[0].id).toBe('cat-1-1');
    expect(entity.children[0].parentId).toBe('cat-1');
  });

  it('should handle null description and imageUrl', () => {
    const minimalPrisma = {
      ...mockPrismaCategory,
      description: null,
      imageUrl: null,
    } as PrismaCategory;

    const entity = CategoryMapper.toDomain(minimalPrisma);

    expect(entity.description).toBeNull();
    expect(entity.imageUrl).toBeNull();
  });
});
