import { StockReservationEntity } from '../entities/stock-reservation.entity';

export interface CreateReservationData {
  productId: string;
  quantity: number;
  sessionId: string;
  expiresAt: Date;
}

export abstract class IReservationsRepository {
  abstract create(data: CreateReservationData): Promise<StockReservationEntity>;
  abstract findBySessionId(
    sessionId: string,
  ): Promise<StockReservationEntity[]>;
  abstract findActiveByProductId(
    productId: string,
  ): Promise<StockReservationEntity[]>;
  abstract deleteBySessionId(sessionId: string): Promise<void>;
  abstract deleteExpired(): Promise<number>;
  /** Returns total reserved qty for a product (non-expired) */
  abstract getTotalReservedForProduct(productId: string): Promise<number>;
}
