export class StockReservationEntity {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly sessionId: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
  ) {}

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  get msUntilExpiry(): number {
    return Math.max(0, this.expiresAt.getTime() - Date.now());
  }
}
