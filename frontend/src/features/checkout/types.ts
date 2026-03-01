export type CardBrand = 'VISA' | 'MASTERCARD' | null;

export interface CardData {
  number: string; // masked for display e.g. '4111 **** **** 1111'
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  brand: CardBrand;
  token: string | null; // Wompi tokenization result
  // CVV is NEVER stored in state or localStorage
}

export interface DeliveryAddress {
  recipientName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  department: string;
  phoneNumber: string;
}

export interface FeeBreakdown {
  productAmount: number;
  baseFee: number;
  deliveryFee: number;
  totalAmount: number;
}

export type CheckoutStep = 'IDLE' | 'FORM' | 'SUMMARY' | 'PROCESSING' | 'COMPLETE';
