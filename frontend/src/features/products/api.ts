import client from '../../lib/axios';
import type { Product } from './types';

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
