export interface CartItem {
  productId: string;
  name: string;
  imageUrl: string | null;
  priceInCents: number;
  quantity: number;
}
