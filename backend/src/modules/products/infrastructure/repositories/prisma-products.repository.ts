import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IProductsRepository } from '../../domain/repositories/products.repository';
import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class PrismaProductsRepository implements IProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return products.map(ProductMapper.toDomain);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product ? ProductMapper.toDomain(product) : null;
  }

  async decrementStock(id: string, quantity: number): Promise<ProductEntity> {
    const product = await this.prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
    return ProductMapper.toDomain(product);
  }
}
