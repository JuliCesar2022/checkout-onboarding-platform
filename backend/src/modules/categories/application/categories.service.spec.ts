import { CategoriesService } from './categories.service';
import { ICategoriesRepository } from '../domain/repositories/categories.repository';
import { CategoryEntity } from '../domain/entities/category.entity';
import { ErrorCode } from '../../../common/constants/error-codes.constants';
import { CATEGORIES_ERRORS } from '../domain/constants/categories.constants';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: jest.Mocked<ICategoriesRepository>;

  const mockCategory = new CategoryEntity({
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    children: [],
  });

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    } as any;

    service = new CategoriesService(repository);
  });

  describe('findAll', () => {
    it('should return all categories mapped to DTOs', async () => {
      repository.findAll.mockResolvedValue([mockCategory]);

      const result = await service.findAll();

      expect(result.length).toBe(1);
      expect(result[0].id).toBe(mockCategory.id);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a category when it exists', async () => {
      repository.findById.mockResolvedValue(mockCategory);

      const result = await service.findById('cat-1');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().id).toBe(mockCategory.id);
    });

    it('should return a failure Result when category does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      const result = await service.findById('non-existent');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe(
        CATEGORIES_ERRORS.NOT_FOUND('non-existent'),
      );
    });
  });
});
