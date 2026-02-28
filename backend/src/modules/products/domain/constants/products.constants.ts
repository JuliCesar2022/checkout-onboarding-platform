export const PRODUCTS_ERRORS = {
  NOT_FOUND: (id: string) => `Product with id "${id}" not found`,
  INSUFFICIENT_STOCK: (available: number, requested: number) =>
    `Insufficient stock. Available: ${available}, requested: ${requested}`,
} as const;
