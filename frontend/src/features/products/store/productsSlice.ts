import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types';

interface ProductsState {
  items: Product[];
  selectedProductId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number | null; // unix ms, for cache invalidation
}

const initialState: ProductsState = {
  items: [],
  selectedProductId: null,
  status: 'idle',
  error: null,
  lastFetchedAt: null,
};

// TODO: implement — calls GET /api/products
export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  // const response = await productsApi.fetchProducts();
  // return response;
  return [] as Product[];
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    selectProduct(state, action: PayloadAction<string>) {
      state.selectedProductId = action.payload;
    },
    updateProductStock(state, action: PayloadAction<{ productId: string; newStock: number }>) {
      const product = state.items.find((p) => p.id === action.payload.productId);
      if (product) product.stock = action.payload.newStock;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch products';
      });
  },
});

export const { selectProduct, updateProductStock } = productsSlice.actions;
export default productsSlice.reducer;
