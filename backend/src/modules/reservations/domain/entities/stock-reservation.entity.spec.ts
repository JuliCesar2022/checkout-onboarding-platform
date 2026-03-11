import { StockReservationEntity } from './stock-reservation.entity';

describe('StockReservationEntity', () => {
  it('should create a reservation entity correctly', () => {
    const expiresAt = new Date(Date.now() + 10000);
    const createdAt = new Date();
    const entity = new StockReservationEntity(
      'id-1',
      'p-1',
      5,
      'sess-1',
      expiresAt,
      createdAt,
    );

    expect(entity.id).toBe('id-1');
    expect(entity.productId).toBe('p-1');
    expect(entity.quantity).toBe(5);
    expect(entity.sessionId).toBe('sess-1');
    expect(entity.expiresAt).toEqual(expiresAt);
  });

  it('should identify as expired if date is in the past', () => {
    const expiresAt = new Date(Date.now() - 10000);
    const entity = new StockReservationEntity(
      'id-1',
      'p-1',
      5,
      'sess-1',
      expiresAt,
      new Date(),
    );

    expect(entity.isExpired).toBe(true);
    expect(entity.msUntilExpiry).toBe(0);
  });

  it('should identify as active if date is in the future', () => {
    const expiresAt = new Date(Date.now() + 10000);
    const entity = new StockReservationEntity(
      'id-1',
      'p-1',
      5,
      'sess-1',
      expiresAt,
      new Date(),
    );

    expect(entity.isExpired).toBe(false);
    expect(entity.msUntilExpiry).toBeGreaterThan(0);
  });
});
