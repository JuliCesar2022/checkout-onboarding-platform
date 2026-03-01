export const ROUTES = {
  PRODUCTS: '/',
  PRODUCT_DETAIL: '/products/:id',
  CHECKOUT: '/checkout',
  TRANSACTION_STATUS: '/status',
} as const;

export function productDetailPath(id: string) {
  return `/products/${id}`;
}
