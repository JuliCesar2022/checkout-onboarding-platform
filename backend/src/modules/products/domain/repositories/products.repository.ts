import type { ProductEntity } from '../entities/product.entity';
import type {
  FindPaginatedParams,
  PaginatedResult,
} from '../../../../common/interfaces/paginated-result.interface';

/** Products-specific pagination params: adds `search` on top of the common base. */
export interface FindProductsPaginatedParams extends FindPaginatedParams {
  search?: string;
  categoryId?: string;
}

/** Port — abstract interface. Prisma implementation lives in infrastructure. */
export abstract class IProductsRepository {
  abstract findById(
    id: string,
    sessionId?: string,
  ): Promise<ProductEntity | null>;
  abstract decrementStock(id: string, quantity: number): Promise<ProductEntity>;
  abstract incrementStock(id: string, quantity: number): Promise<ProductEntity>;
  abstract findPaginated(
    params: FindProductsPaginatedParams,
    sessionId?: string,
  ): Promise<PaginatedResult<ProductEntity>>;
}
