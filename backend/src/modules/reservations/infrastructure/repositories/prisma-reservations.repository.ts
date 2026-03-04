import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../../storage/redis/redis.module';
import {
  IReservationsRepository,
  CreateReservationData,
} from '../../domain/repositories/reservations.repository';
import { StockReservationEntity } from '../../domain/entities/stock-reservation.entity';

/**
 * Redis key structure:
 *   reservation:{sessionId}         → JSON blob (full reservation data), TTL 900s
 *   reserved:{productId}:{sessionId}→ quantity (string), TTL 900s
 *
 * Calculating reserved qty per product:
 *   KEYS reserved:{productId}:* → sum values (fast enough at this scale)
 */
@Injectable()
export class RedisReservationsRepository implements IReservationsRepository {
  private readonly TTL_SECONDS = 15 * 60; // 900 seconds

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async create(data: CreateReservationData): Promise<StockReservationEntity> {
    const pipeline = this.redis.pipeline();

    // Store per-product key for fast quantity lookup
    const productKey = `reserved:${data.productId}:${data.sessionId}`;
    pipeline.set(productKey, String(data.quantity), 'EX', this.TTL_SECONDS);

    // Upsert session blob (update or create)
    const sessionKey = `reservation:${data.sessionId}`;
    const existingRaw = await this.redis.get(sessionKey);
    const existing = existingRaw
      ? JSON.parse(existingRaw)
      : {
          sessionId: data.sessionId,
          items: [],
          expiresAt: data.expiresAt.toISOString(),
        };

    const itemIndex = existing.items.findIndex(
      (i: any) => i.productId === data.productId,
    );
    if (itemIndex >= 0) {
      existing.items[itemIndex].quantity = data.quantity;
    } else {
      existing.items.push({
        productId: data.productId,
        quantity: data.quantity,
      });
    }
    existing.expiresAt = data.expiresAt.toISOString();

    pipeline.set(sessionKey, JSON.stringify(existing), 'EX', this.TTL_SECONDS);
    await pipeline.exec();

    return new StockReservationEntity(
      `${data.sessionId}:${data.productId}`,
      data.productId,
      data.quantity,
      data.sessionId,
      data.expiresAt,
      new Date(),
    );
  }

  async findBySessionId(sessionId: string): Promise<StockReservationEntity[]> {
    const raw = await this.redis.get(`reservation:${sessionId}`);
    if (!raw) return [];
    const blob = JSON.parse(raw);
    const expiresAt = new Date(blob.expiresAt);
    return (blob.items as any[]).map(
      (item) =>
        new StockReservationEntity(
          `${sessionId}:${item.productId}`,
          item.productId,
          item.quantity,
          sessionId,
          expiresAt,
          new Date(),
        ),
    );
  }

  async findActiveByProductId(
    productId: string,
  ): Promise<StockReservationEntity[]> {
    // Scan for all product keys for this productId
    const keys = await this.redis.keys(`reserved:${productId}:*`);
    if (!keys.length) return [];

    const results: StockReservationEntity[] = [];
    for (const key of keys) {
      const qty = await this.redis.get(key);
      if (qty === null) continue;
      const sessionId = key.split(':')[2]; // reserved:{productId}:{sessionId}
      const ttl = await this.redis.ttl(key);
      const expiresAt = new Date(Date.now() + ttl * 1000);
      results.push(
        new StockReservationEntity(
          `${sessionId}:${productId}`,
          productId,
          parseInt(qty, 10),
          sessionId,
          expiresAt,
          new Date(),
        ),
      );
    }
    return results;
  }

  async deleteBySessionId(sessionId: string): Promise<void> {
    // Get current reservation to know which product keys to delete
    const raw = await this.redis.get(`reservation:${sessionId}`);
    const pipeline = this.redis.pipeline();
    pipeline.del(`reservation:${sessionId}`);

    if (raw) {
      const blob = JSON.parse(raw);
      for (const item of blob.items as any[]) {
        pipeline.del(`reserved:${item.productId}:${sessionId}`);
      }
    }
    await pipeline.exec();
  }

  async deleteExpired(): Promise<number> {
    // Redis handles TTL expiry automatically — nothing to do here
    return 0;
  }

  async getTotalReservedForProduct(productId: string): Promise<number> {
    const keys = await this.redis.keys(`reserved:${productId}:*`);
    if (!keys.length) return 0;

    let total = 0;
    for (const key of keys) {
      const qty = await this.redis.get(key);
      if (qty !== null) total += parseInt(qty, 10);
    }
    return total;
  }
}
