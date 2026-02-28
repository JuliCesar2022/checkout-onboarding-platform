import { BASE_FEE_CENTS, DELIVERY_FEE_CENTS } from '../constants/fees';
import type { FeeBreakdown } from '../types/checkout.types';

export function computeFees(productPriceInCents: number, quantity: number): FeeBreakdown {
  const productAmount = productPriceInCents * quantity;
  return {
    productAmount,
    baseFee: BASE_FEE_CENTS,
    deliveryFee: DELIVERY_FEE_CENTS,
    totalAmount: productAmount + BASE_FEE_CENTS + DELIVERY_FEE_CENTS,
  };
}
