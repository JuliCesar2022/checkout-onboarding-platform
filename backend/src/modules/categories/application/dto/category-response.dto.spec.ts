import { CategoryResponseDto } from './category-response.dto';
import { CategoryEntity } from '../../domain/entities/category.entity';

describe('CategoryResponseDto', () => {
  it('should map from entity to DTO correctly', () => {
    const entity = new CategoryEntity({
      id: '1',
      name: 'Parent',
      slug: 'parent',
      description: 'Desc',
      imageUrl: 'img.jpg',
      parentId: null,
      children: [
        new CategoryEntity({
          id: '2',
          name: 'Child',
          slug: 'child',
          parentId: '1',
        }),
      ],
    });

    const dto = CategoryResponseDto.fromEntity(entity);

    expect(dto.id).toBe(entity.id);
    expect(dto.name).toBe(entity.name);
    expect(dto.children.length).toBe(1);
    expect(dto.children[0].id).toBe('2');
    expect(dto.children[0].parentId).toBe('1');
  });

  it('should handle entity with null parentId', () => {
    const entity = new CategoryEntity({
      id: '1',
      name: 'Root',
      parentId: null,
    });
    const dto = CategoryResponseDto.fromEntity(entity);
    expect(dto.parentId).toBeNull();
  });
});
