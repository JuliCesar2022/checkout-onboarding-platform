import { CategoryEntity } from './category.entity';

describe('CategoryEntity', () => {
  it('should create a category with provided values', () => {
    const data = {
      id: '1',
      name: 'Electronics',
      slug: 'electronics',
      description: 'Test',
      imageUrl: 'test.jpg',
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new CategoryEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.name).toBe(data.name);
    expect(entity.children).toEqual([]); // Default value
  });

  it('should initialize children as empty array if not provided', () => {
    const entity = new CategoryEntity({ id: '1', name: 'Test' });
    expect(entity.children).toEqual([]);
  });

  it('should preserve children if provided', () => {
    const child = new CategoryEntity({ id: '2', name: 'Child' });
    const parent = new CategoryEntity({
      id: '1',
      name: 'Parent',
      children: [child],
    });

    expect(parent.children.length).toBe(1);
    expect(parent.children[0]).toBe(child);
  });
});
