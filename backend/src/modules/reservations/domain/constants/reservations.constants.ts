export const RESERVATION_TTL_MINUTES = 15;
export const RESERVATION_TTL_MS = RESERVATION_TTL_MINUTES * 60 * 1000;

export const RESERVATIONS_ERRORS = {
  INSUFFICIENT_STOCK: (available: number, requested: number) =>
    `No hay suficiente stock disponible. Disponible: ${available}, solicitado: ${requested}`,
  PRODUCT_NOT_FOUND: 'Producto no encontrado',
};
