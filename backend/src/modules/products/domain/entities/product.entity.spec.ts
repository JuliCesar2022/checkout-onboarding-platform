import { ProductEntity } from './product.entity';

describe('ProductEntity', () => {
  const mockData = {
    id: '1',
    sku: 'TEST-SKU',
    name: 'Test Product',
    description: 'Test Description',
    categoryId: 'cat-1',
    imageUrl: 'http://image.com',
    priceInCents: 10000,
    stock: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should calculate price in COP correctly', () => {
    const product = new ProductEntity(mockData);
    expect(product.priceInCOP).toBe(100);
  });

  describe('isAvailable', () => {
    it('should return true if stock is greater than 0', () => {
      const product = new ProductEntity({ ...mockData, stock: 1 });
      expect(product.isAvailable).toBe(true);
    });

    it('should return false if stock is 0', () => {
      const product = new ProductEntity({ ...mockData, stock: 0 });
      expect(product.isAvailable).toBe(false);
    });
  });

  it('should support partially initialized values via constructor', () => {
    const name = 'Only Name';
    const product = new ProductEntity({ name });
    expect(product.name).toBe(name);
    expect(product.id).toBeUndefined();
  });
});
