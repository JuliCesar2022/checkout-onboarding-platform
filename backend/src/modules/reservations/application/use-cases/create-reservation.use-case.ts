import { Injectable } from '@nestjs/common';
import { Result } from '../../../../common/result/result';
import { IReservationsRepository } from '../../domain/repositories/reservations.repository';
import { IProductsRepository } from '../../../products/domain/repositories/products.repository';
import {
  RESERVATION_TTL_MS,
  RESERVATIONS_ERRORS,
} from '../../domain/constants/reservations.constants';
import { StockReservationEntity } from '../../domain/entities/stock-reservation.entity';

export interface ReserveItemInput {
  productId: string;
  quantity: number;
}

@Injectable()
export class CreateReservationUseCase {
  constructor(
    private readonly reservationsRepo: IReservationsRepository,
    private readonly productsRepo: IProductsRepository,
  ) {}

  async execute(
    sessionId: string,
    items: ReserveItemInput[],
  ): Promise<Result<StockReservationEntity[]>> {
    // Release any existing reservation for this session first (idempotent upsert)
    await this.reservationsRepo.deleteBySessionId(sessionId);

    const expiresAt = new Date(Date.now() + RESERVATION_TTL_MS);
    const created: StockReservationEntity[] = [];

    for (const item of items) {
      const product = await this.productsRepo.findById(item.productId);
      if (!product) {
        // Rollback reservations already made in this loop
        await this.reservationsRepo.deleteBySessionId(sessionId);
        return Result.fail(RESERVATIONS_ERRORS.PRODUCT_NOT_FOUND);
      }

      // Available stock = actual stock - total currently reserved by OTHERS
      const totalReserved =
        await this.reservationsRepo.getTotalReservedForProduct(item.productId);
      const availableStock = Math.max(0, product.stock - totalReserved);

      if (availableStock < item.quantity) {
        await this.reservationsRepo.deleteBySessionId(sessionId);
        return Result.fail(
          RESERVATIONS_ERRORS.INSUFFICIENT_STOCK(availableStock, item.quantity),
        );
      }

      const reservation = await this.reservationsRepo.create({
        productId: item.productId,
        quantity: item.quantity,
        sessionId,
        expiresAt,
      });
      created.push(reservation);
    }

    return Result.ok(created);
  }
}
