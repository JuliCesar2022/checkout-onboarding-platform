import { Module } from '@nestjs/common';
import { ProductsController } from './infrastructure/controllers/products.controller';
import { ProductsService } from './application/products.service';
import { IProductsRepository } from './domain/repositories/products.repository';
import { PrismaProductsRepository } from './infrastructure/repositories/prisma-products.repository';
import { RedisModule } from '../storage/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: IProductsRepository,
      useClass: PrismaProductsRepository,
    },
  ],
  exports: [ProductsService, IProductsRepository],
})
export class ProductsModule {}
