import productsReducer, {
  selectProduct,
  setActiveCategory,
  setSearchQuery,
  updateProductStock,
  fetchProducts,
  fetchMoreProducts,
  fetchCategories,
} from "./productsSlice";

// Mock the API
jest.mock("../api");

describe("productsSlice", () => {
  const initialState = {
    items: [],
    categories: [],
    selectedProductId: null,
    activeCategoryId: null,
    searchQuery: "",
    status: "idle" as const,
    error: null,
    lastFetchedAt: null,
    nextCursor: null,
    hasMore: false,
  };

  test("should return the initial state", () => {
    expect(productsReducer(undefined, { type: "" })).toEqual(initialState);
  });

  test("should handle selectProduct", () => {
    const state = productsReducer(initialState, selectProduct("123"));
    expect(state.selectedProductId).toBe("123");
  });

  test("should handle setActiveCategory", () => {
    const state = productsReducer(
      { ...initialState, searchQuery: "some query" },
      setActiveCategory("cat1"),
    );
    expect(state.activeCategoryId).toBe("cat1");
    expect(state.searchQuery).toBe(""); // should clear search
  });

  test("should handle setSearchQuery", () => {
    const state = productsReducer(
      { ...initialState, activeCategoryId: "cat1" },
      setSearchQuery("iphone"),
    );
    expect(state.searchQuery).toBe("iphone");
    expect(state.activeCategoryId).toBe(null); // should clear category
  });

  test("should handle updateProductStock", () => {
    const previousState = {
      ...initialState,
      items: [
        {
          id: "1",
          name: "P1",
          stock: 10,
          priceInCents: 100,
          imageUrl: "",
          categoryId: "c1",
          description: "",
          isAvailable: true,
        },
      ],
    };
    const state = productsReducer(
      previousState,
      updateProductStock({ productId: "1", newStock: 5 }),
    );
    expect(state.items[0].stock).toBe(5);
  });

  describe("extraReducers", () => {
    test("fetchProducts.pending", () => {
      const state = productsReducer(initialState, {
        type: fetchProducts.pending.type,
      });
      expect(state.status).toBe("loading");
      expect(state.error).toBe(null);
    });

    test("fetchProducts.fulfilled", () => {
      const payload = {
        data: [{ id: "1", name: "P1" }],
        nextCursor: "next-123",
        hasMore: true,
      };
      const state = productsReducer(initialState, {
        type: fetchProducts.fulfilled.type,
        payload,
      });
      expect(state.status).toBe("succeeded");
      expect(state.items).toEqual(payload.data);
      expect(state.nextCursor).toBe("next-123");
      expect(state.hasMore).toBe(true);
      expect(state.lastFetchedAt).not.toBeNull();
    });

    test("fetchProducts.rejected", () => {
      const state = productsReducer(initialState, {
        type: fetchProducts.rejected.type,
        error: { message: "Network Error" },
      });
      expect(state.status).toBe("failed");
      expect(state.error).toBe("Network Error");
    });

    test("fetchMoreProducts.fulfilled", () => {
      const previousState = {
        ...initialState,
        items: [{ id: "1", name: "P1" } as any],
      };
      const payload = {
        data: [{ id: "2", name: "P2" }],
        nextCursor: "next-456",
        hasMore: false,
      };
      const state = productsReducer(previousState, {
        type: fetchMoreProducts.fulfilled.type,
        payload,
      });
      expect(state.items).toHaveLength(2);
      expect(state.items[1].id).toBe("2");
      expect(state.nextCursor).toBe("next-456");
      expect(state.hasMore).toBe(false);
    });

    test("fetchCategories.fulfilled", () => {
      const categories = [{ id: "c1", name: "Cat 1", slug: "cat-1" }];
      const state = productsReducer(initialState, {
        type: fetchCategories.fulfilled.type,
        payload: categories,
      });
      expect(state.categories).toEqual(categories);
    });
  });
});
