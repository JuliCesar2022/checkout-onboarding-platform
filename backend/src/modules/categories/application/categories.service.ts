import { Injectable, NotFoundException } from '@nestjs/common';
import { ICategoriesRepository } from '../domain/repositories/categories.repository';
import { CategoryResponseDto } from './dto/category-response.dto';
import { Result } from '../../../common/result/result';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: ICategoriesRepository) {}

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesRepository.findAll();
    return categories.map(CategoryResponseDto.fromEntity);
  }

  async findById(id: string): Promise<Result<CategoryResponseDto>> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      return Result.fail(`Category with id "${id}" not found`);
    }
    return Result.ok(CategoryResponseDto.fromEntity(category));
  }
}
