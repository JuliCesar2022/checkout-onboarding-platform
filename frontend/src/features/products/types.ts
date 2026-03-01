export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  priceInCents: number;
  stock: number;
  isAvailable: boolean;
  categoryId: string;
}

export interface PaginatedProducts {
  data: Product[];
  nextCursor: string | null;
  hasMore: boolean;
}
