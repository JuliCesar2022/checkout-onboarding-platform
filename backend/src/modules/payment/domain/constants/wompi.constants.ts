import { PaymentStatus } from '../enums/payment-status.enum';

export const WOMPI_STATUS_MAP: Record<string, PaymentStatus> = {
  APPROVED: PaymentStatus.SUCCESS,
  DECLINED: PaymentStatus.DECLINED,
  VOIDED: PaymentStatus.ERROR, // Or a specific status if needed
  ERROR: PaymentStatus.ERROR,
  PENDING: PaymentStatus.PENDING,
};

export const WOMPI_ENDPOINTS = {
  TRANSACTIONS: '/transactions',
  MERCHANTS: '/merchants',
};

export const WOMPI_ERROR_MESSAGES = {
  ACCEPTANCE_TOKEN_FAILURE: 'Could not retrieve acceptance token from Wompi',
  PAYMENT_UNKNOWN_ERROR: 'Unknown payment error',
  STATUS_CHECK_UNKNOWN_ERROR: 'Unknown status check error',
};

export const WOMPI_PAYMENT_METHODS = {
  CARD: 'CARD',
};

export const WOMPI_DEFAULT_CURRENCY = 'COP';
