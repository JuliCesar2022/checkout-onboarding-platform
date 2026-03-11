import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PrismaProductsRepository } from './prisma-products.repository';
import { REDIS_CLIENT } from '../../../storage/redis/redis.module';

describe('PrismaProductsRepository', () => {
  let repository: PrismaProductsRepository;
  let prisma: any;
  let redis: any;

  const mockProduct = {
    id: 'prod-1',
    name: 'Test Product',
    description: 'Description',
    price: 1000,
    stock: 10,
    categoryId: 'cat-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      product: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      category: {
        findUnique: jest.fn(),
      },
    };

    redis = {
      keys: jest.fn(),
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaProductsRepository,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: REDIS_CLIENT,
          useValue: redis,
        },
      ],
    }).compile();

    repository = module.get<PrismaProductsRepository>(PrismaProductsRepository);
  });

  describe('findById', () => {
    it('should return product with remaining stock (subtracting reservations)', async () => {
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      redis.keys.mockResolvedValue(['reserved:prod-1:session-1']);
      redis.get.mockResolvedValue('3');

      const result = await repository.findById('prod-1');

      expect(result?.id).toBe('prod-1');
      expect(result?.stock).toBe(7); // 10 - 3
    });

    it('should return null if product not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      const result = await repository.findById('non-existent');
      expect(result).toBeNull();
    });

    it('should return physical stock if redis fails', async () => {
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      redis.keys.mockRejectedValue(new Error('Redis down'));

      const result = await repository.findById('prod-1');

      expect(result?.stock).toBe(10);
    });
  });

  describe('decrementStock', () => {
    it('should update stock with atomic check', async () => {
      prisma.product.update.mockResolvedValue({ ...mockProduct, stock: 8 });

      const result = await repository.decrementStock('prod-1', 2);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: {
          id: 'prod-1',
          stock: { gte: 2 },
        },
        data: { stock: { decrement: 2 } },
      });
      expect(result.stock).toBe(8);
    });
  });

  describe('findPaginated', () => {
    it('should return paginated products with reservations subtracted', async () => {
      prisma.product.findMany.mockResolvedValue([mockProduct]);
      redis.keys.mockResolvedValue([]);
      
      const params = { limit: 10 };
      const result = await repository.findPaginated(params);

      expect(result.items).toHaveLength(1);
      expect(result.nextCursor).toBeNull();
    });

    it('should filter by category and include children if category has children', async () => {
      prisma.category.findUnique.mockResolvedValue({
        id: 'cat-parent',
        children: [{ id: 'cat-child-1' }],
      });
      prisma.product.findMany.mockResolvedValue([]);

      await repository.findPaginated({ categoryId: 'cat-parent', limit: 10 });

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { categoryId: { in: ['cat-parent', 'cat-child-1'] } },
        })
      );
    });
  });
});
