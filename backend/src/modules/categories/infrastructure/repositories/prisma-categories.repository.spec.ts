import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PrismaCategoriesRepository } from './prisma-categories.repository';
import { CategoryMapper } from '../mappers/category.mapper';

describe('PrismaCategoriesRepository', () => {
  let repository: PrismaCategoriesRepository;
  let prisma: any;

  const mockCategories = [
    {
      id: 'cat-1',
      name: 'Electronics',
      parentId: null,
      children: [],
    },
  ];

  beforeEach(async () => {
    prisma = {
      category: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCategoriesRepository,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaCategoriesRepository>(PrismaCategoriesRepository);
  });

  describe('findAll', () => {
    it('should return top-level categories with children', async () => {
      prisma.category.findMany.mockResolvedValue(mockCategories);

      const result = await repository.findAll();

      expect(prisma.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { parentId: null },
          include: { children: expect.any(Object) },
        })
      );
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Electronics');
    });
  });

  describe('findById', () => {
    it('should return category if found', async () => {
      prisma.category.findUnique.mockResolvedValue(mockCategories[0]);

      const result = await repository.findById('cat-1');

      expect(prisma.category.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'cat-1' },
        })
      );
      expect(result?.id).toBe('cat-1');
    });

    it('should return null if not found', async () => {
      prisma.category.findUnique.mockResolvedValue(null);
      const result = await repository.findById('non-existent');
      expect(result).toBeNull();
    });
  });
});
