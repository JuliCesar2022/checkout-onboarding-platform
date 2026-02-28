import type { ProductEntity } from '../entities/product.entity';

/** Port — abstract interface. Prisma implementation lives in infrastructure. */
export abstract class IProductsRepository {
  abstract findAll(): Promise<ProductEntity[]>;
  abstract findById(id: string): Promise<ProductEntity | null>;
  abstract decrementStock(id: string, quantity: number): Promise<ProductEntity>;
}
