import client from "../../lib/axios";
import type { Product, PaginatedProducts, Category } from "./types";

export const productsApi = {
  fetchProducts: async (
    params: { cursor?: string; limit?: number; categoryId?: string; search?: string } = {},
  ): Promise<PaginatedProducts> => {
    const queryParams: Record<string, string | number> = {
      limit: params.limit ?? 20,
    };
    if (params.cursor) queryParams.cursor = params.cursor;
    if (params.categoryId) queryParams.categoryId = params.categoryId;
    if (params.search) queryParams.search = params.search;
    const response = await client.get<PaginatedProducts>("/products", {
      params: queryParams,
    });
    return response.data;
  },

  fetchProductById: async (id: string): Promise<Product> => {
    const response = await client.get<Product>(`/products/${id}`);
    return response.data;
  },

  fetchCategories: async (): Promise<Category[]> => {
    const response = await client.get<Category[]>("/categories");
    return response.data;
  },
};
