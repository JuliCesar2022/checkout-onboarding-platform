import { CreateReservationDto } from './create-reservation.dto';
import { ReservationResponseDto } from './reservation-response.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { StockReservationEntity } from '../../domain/entities/stock-reservation.entity';

describe('Reservations DTOs', () => {
  describe('CreateReservationDto', () => {
    it('should validate a valid DTO', async () => {
      const data = {
        sessionId: 'sess-1',
        items: [
          {
            productId: '123e4567-e89b-12d3-a456-426614174000', // valid UUID
            quantity: 2,
          },
        ],
      };
      const dto = plainToInstance(CreateReservationDto, data);
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if quantity is less than 1', async () => {
      const data = {
        sessionId: 'sess-1',
        items: [
          {
            productId: '123e4567-e89b-12d3-a456-426614174000',
            quantity: 0,
          },
        ],
      };
      const dto = plainToInstance(CreateReservationDto, data);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('ReservationResponseDto', () => {
    it('should map entities correctly to response dto', () => {
      const entity = new StockReservationEntity(
        'res-1',
        'prod-1',
        2,
        'sess-1',
        new Date(),
        new Date(),
      );
      const dto = ReservationResponseDto.fromEntities([entity]);
      expect(dto.sessionId).toBe('sess-1');
      expect(dto.items).toHaveLength(1);
      expect(dto.items[0].productId).toBe('prod-1');
      expect(dto.items[0].quantity).toBe(2);
    });
  });
});
