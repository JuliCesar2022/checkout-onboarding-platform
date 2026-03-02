import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { IProductsRepository } from '../domain/repositories/products.repository';
import { ErrorCode } from '../../../common/constants/error-codes.constants';
import { Result } from '../../../common/result/result';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: jest.Mocked<IProductsRepository>;

  const mockProduct = {
    id: '1',
    sku: 'TEST-SKU',
    name: 'Test Product',
    description: 'Desc',
    categoryId: 'cat-1',
    imageUrl: null,
    priceInCents: 1000,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    isAvailable: true,
    priceInCOP: 10,
  };

  beforeEach(async () => {
    const mockRepo = {
      findById: jest.fn(),
      findPaginated: jest.fn(),
      decrementStock: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: IProductsRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get(IProductsRepository);
  });

  describe('findById', () => {
    it('should return a product if found', async () => {
      repository.findById.mockResolvedValue(mockProduct as any);

      const result = await service.findById('1');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().id).toBe('1');
      expect(repository.findById).toHaveBeenCalledWith('1');
    });

    it('should return ErrorCode.NOT_FOUND if not found', async () => {
      repository.findById.mockResolvedValue(null);

      const result = await service.findById('999');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe(ErrorCode.NOT_FOUND);
    });
  });

  describe('decrementStock', () => {
    it('should decrement stock successfully if enough available', async () => {
      repository.findById.mockResolvedValue(mockProduct as any);
      repository.decrementStock.mockResolvedValue({
        ...mockProduct,
        stock: 5,
      } as any);

      const result = await service.decrementStock('1', 5);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().stock).toBe(5);
      expect(repository.decrementStock).toHaveBeenCalledWith('1', 5);
    });

    it('should fail if not enough stock', async () => {
      repository.findById.mockResolvedValue(mockProduct as any);

      const result = await service.decrementStock('1', 20);

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toContain('Insufficient stock');
    });

    it('should return NOT_FOUND if product does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      const result = await service.decrementStock('999', 1);

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe(ErrorCode.NOT_FOUND);
    });
  });
});
