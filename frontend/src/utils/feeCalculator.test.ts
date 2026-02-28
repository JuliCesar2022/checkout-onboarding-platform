import { computeFees } from './feeCalculator';
import { BASE_FEE_CENTS, DELIVERY_FEE_CENTS } from '../constants/fees';

describe('computeFees', () => {
  it('calculates total correctly for quantity 1', () => {
    const result = computeFees(1_000_000, 1);
    expect(result.productAmount).toBe(1_000_000);
    expect(result.baseFee).toBe(BASE_FEE_CENTS);
    expect(result.deliveryFee).toBe(DELIVERY_FEE_CENTS);
    expect(result.totalAmount).toBe(1_000_000 + BASE_FEE_CENTS + DELIVERY_FEE_CENTS);
  });

  it('multiplies product amount by quantity', () => {
    const result = computeFees(500_000, 3);
    expect(result.productAmount).toBe(1_500_000);
  });

  it('handles zero quantity', () => {
    const result = computeFees(1_000_000, 0);
    expect(result.productAmount).toBe(0);
    expect(result.totalAmount).toBe(BASE_FEE_CENTS + DELIVERY_FEE_CENTS);
  });
});
