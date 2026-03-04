import { ApiProperty } from '@nestjs/swagger';
import type { StockReservationEntity } from '../../domain/entities/stock-reservation.entity';

export class ReservationResponseDto {
  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  expiresAt: string;

  @ApiProperty()
  expiresInMs: number;

  @ApiProperty({ type: [Object] })
  items: Array<{ productId: string; quantity: number }>;

  static fromEntities(
    entities: StockReservationEntity[],
  ): ReservationResponseDto {
    const first = entities[0];
    return {
      sessionId: first.sessionId,
      expiresAt: first.expiresAt.toISOString(),
      expiresInMs: first.msUntilExpiry,
      items: entities.map((e) => ({
        productId: e.productId,
        quantity: e.quantity,
      })),
    };
  }
}
