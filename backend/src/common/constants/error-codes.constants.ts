/**
 * Standard Error Codes for the Backend
 * Used by Result<T, E> to provide machine-readable error reasons.
 */
export enum ErrorCode {
  // Generic
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',

  // Pagination
  INVALID_CURSOR = 'INVALID_CURSOR',

  // Features (Can be extended or moved to specific modules if they grow too large)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
}
