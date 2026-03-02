import { ProductMapper } from './product.mapper';
import { ProductEntity } from '../../domain/entities/product.entity';

describe('ProductMapper', () => {
  const mockPrismaProduct = {
    id: '1',
    sku: 'SKU-001',
    name: 'Test Product',
    description: 'Test Desc',
    categoryId: 'cat-123',
    imageUrl: 'http://img.png',
    priceInCents: 5000,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should map Prisma object to ProductEntity correctly', () => {
    const entity = ProductMapper.toDomain(mockPrismaProduct);

    expect(entity).toBeInstanceOf(ProductEntity);
    expect(entity.id).toBe(mockPrismaProduct.id);
    expect(entity.sku).toBe(mockPrismaProduct.sku);
    expect(entity.priceInCents).toBe(mockPrismaProduct.priceInCents);
    expect(entity.priceInCOP).toBe(50);
  });
});
