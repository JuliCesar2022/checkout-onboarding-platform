import type { CategoryEntity } from '../entities/category.entity';

export abstract class ICategoriesRepository {
  abstract findAll(): Promise<CategoryEntity[]>;
  abstract findById(id: string): Promise<CategoryEntity | null>;
}
