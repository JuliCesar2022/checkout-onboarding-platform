export const TRANSACTIONS_ERRORS = {
  NOT_FOUND: (id: string) => `Transaction with id "${id}" not found`,
  REFERENCE_NOT_FOUND: (ref: string) =>
    `Transaction with reference "${ref}" not found`,
  NO_WOMPI_ID: 'Transaction does not have a Wompi ID to sync',
  PRODUCT_NOT_FOUND: 'Product not found',
  INSUFFICIENT_STOCK: (available: number, requested: number) =>
    `Insufficient stock. Available: ${available}, requested: ${requested}`,
  PAYMENT_FAILED: (reason: string) => `Payment failed: ${reason}`,
} as const;

export const TRANSACTIONS_CONFIG = {
  SYNC_CRON_EXPRESSION: '*/5 * * * *', // Every 5 minutes
  PENDING_EXPIRATION_MINUTES: 30,
} as const;
