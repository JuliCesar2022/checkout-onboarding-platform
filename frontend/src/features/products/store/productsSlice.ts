import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product, Category } from "../../../shared/interfaces";
import { productsApi } from "../api";
import type { RootState } from "../../../store/rootReducer";

interface ProductsState {
  items: Product[];
  categories: Category[];
  selectedProductId: string | null;
  activeCategoryId: string | null;
  searchQuery: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lastFetchedAt: number | null;
  nextCursor: string | null;
  hasMore: boolean;
}

const initialState: ProductsState = {
  items: [],
  categories: [],
  selectedProductId: null,
  activeCategoryId: null,
  searchQuery: "",
  status: "idle",
  error: null,
  lastFetchedAt: null,
  nextCursor: null,
  hasMore: false,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const categoryId = state.products.activeCategoryId || undefined;
    const search = state.products.searchQuery || undefined;
    return productsApi.fetchProducts({ categoryId, search });
  },
);

export const fetchMoreProducts = createAsyncThunk(
  "products/fetchMore",
  async (cursor: string, { getState }) => {
    const state = getState() as RootState;
    const categoryId = state.products.activeCategoryId || undefined;
    const search = state.products.searchQuery || undefined;
    return productsApi.fetchProducts({ cursor, categoryId, search });
  },
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async () => {
    return productsApi.fetchCategories();
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    selectProduct(state, action: PayloadAction<string>) {
      state.selectedProductId = action.payload;
    },
    setActiveCategory(state, action: PayloadAction<string | null>) {
      state.activeCategoryId = action.payload;
      state.searchQuery = ""; // clear search when category changes
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.activeCategoryId = null; // clear category when searching
    },
    updateProductStock(
      state,
      action: PayloadAction<{ productId: string; newStock: number }>,
    ) {
      const product = state.items.find(
        (p) => p.id === action.payload.productId,
      );
      if (product) product.stock = action.payload.newStock;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.nextCursor = action.payload.nextCursor;
        state.hasMore = action.payload.hasMore;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch products";
      })
      .addCase(fetchMoreProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMoreProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(...action.payload.data);
        state.nextCursor = action.payload.nextCursor;
        state.hasMore = action.payload.hasMore;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchMoreProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load more products";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const {
  selectProduct,
  setActiveCategory,
  setSearchQuery,
  updateProductStock,
} = productsSlice.actions;
export default productsSlice.reducer;
