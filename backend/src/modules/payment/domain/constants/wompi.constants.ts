import type { TransactionStatus } from '../../../../modules/transactions/domain/entities/transaction.entity';

export const WOMPI_STATUS_MAP: Record<string, TransactionStatus> = {
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
  VOIDED: 'VOIDED',
  ERROR: 'ERROR',
  PENDING: 'PENDING',
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
