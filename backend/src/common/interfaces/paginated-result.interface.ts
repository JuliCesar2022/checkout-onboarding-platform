/**
 * Generic domain-layer interfaces for cursor-based pagination.
 * Import these in any module's repository port.
 */

export interface FindPaginatedParams {
  limit: number;
  cursor?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
}
