import client from '../../lib/axios';
import type { Product, PaginatedProducts, Category } from './types';

export const productsApi = {
  fetchProducts: async (cursor?: string, limit = 20): Promise<PaginatedProducts> => {
    const params: Record<string, string | number> = { limit };
    if (cursor) params.cursor = cursor;
    const response = await client.get<PaginatedProducts>('/products', { params });
    return response.data;
  },

  fetchProductById: async (id: string): Promise<Product> => {
    const response = await client.get<Product>(`/products/${id}`);
    return response.data;
  },

  fetchCategories: async (): Promise<Category[]> => {
    const response = await client.get<Category[]>('/categories');
    return response.data;
  },
};
