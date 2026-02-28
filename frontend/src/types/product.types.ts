export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents (COP)
  imageUrl: string;
  stock: number;
  category?: string;
}
