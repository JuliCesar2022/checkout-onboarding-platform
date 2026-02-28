import { Module } from '@nestjs/common';
import { CategoriesController } from './infrastructure/controllers/categories.controller';
import { CategoriesService } from './application/categories.service';
import { ICategoriesRepository } from './domain/repositories/categories.repository';
import { PrismaCategoriesRepository } from './infrastructure/repositories/prisma-categories.repository';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: ICategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
  ],
  exports: [CategoriesService, ICategoriesRepository],
})
export class CategoriesModule {}
