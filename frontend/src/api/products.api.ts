import client from './client';
import type { Product } from '../types/product.types';

export const productsApi = {
  fetchProducts: async (): Promise<Product[]> => {
    // TODO: implement
    const response = await client.get<Product[]>('/products');
    return response.data;
  },

  fetchProductById: async (id: string): Promise<Product> => {
    // TODO: implement
    const response = await client.get<Product>(`/products/${id}`);
    return response.data;
  },
};
