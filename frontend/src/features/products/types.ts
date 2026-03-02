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

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  children: Category[];
}

export interface PaginatedProducts {
  data: Product[];
  nextCursor: string | null;
  hasMore: boolean;
}
