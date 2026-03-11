import { Test, TestingModule } from '@nestjs/testing';
import { RedisReservationsRepository } from './prisma-reservations.repository';
import { REDIS_CLIENT } from '../../../storage/redis/redis.module';
import { StockReservationEntity } from '../../domain/entities/stock-reservation.entity';

describe('RedisReservationsRepository', () => {
  let repository: RedisReservationsRepository;
  let redis: any;

  beforeEach(async () => {
    redis = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      keys: jest.fn(),
      ttl: jest.fn(),
      pipeline: jest.fn().mockReturnValue({
        set: jest.fn(),
        del: jest.fn(),
        exec: jest.fn().mockResolvedValue([]),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisReservationsRepository,
        { provide: REDIS_CLIENT, useValue: redis },
      ],
    }).compile();

    repository = module.get<RedisReservationsRepository>(RedisReservationsRepository);
  });

  describe('create', () => {
    it('should store reservation keys in redis', async () => {
      redis.get.mockResolvedValue(null);
      const data = {
        productId: 'p1',
        quantity: 2,
        sessionId: 's1',
        expiresAt: new Date(Date.now() + 1000),
      };

      const result = await repository.create(data);

      expect(redis.pipeline).toHaveBeenCalled();
      expect(result.sessionId).toBe('s1');
      expect(result.productId).toBe('p1');
    });
  });

  describe('findBySessionId', () => {
    it('should return reservations array from redis blob', async () => {
      const blob = JSON.stringify({
        sessionId: 's1',
        items: [{ productId: 'p1', quantity: 2 }],
        expiresAt: new Date().toISOString(),
      });
      redis.get.mockResolvedValue(blob);

      const result = await repository.findBySessionId('s1');

      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe('p1');
    });

    it('should return empty array if no blob found', async () => {
      redis.get.mockResolvedValue(null);
      const result = await repository.findBySessionId('s2');
      expect(result).toEqual([]);
    });
  });

  describe('deleteBySessionId', () => {
    it('should del both session key and product keys', async () => {
      const blob = JSON.stringify({
        items: [{ productId: 'p1' }, { productId: 'p2' }],
      });
      redis.get.mockResolvedValue(blob);

      await repository.deleteBySessionId('s1');

      expect(redis.pipeline).toHaveBeenCalled();
    });
  });
});
