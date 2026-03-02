import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  openCart,
  closeCart,
} from "./cartSlice";

describe("cartSlice", () => {
  const initialState = {
    items: [],
    isOpen: false,
  };

  test("should return the initial state", () => {
    expect(cartReducer(undefined, { type: "" })).toEqual(initialState);
  });

  test("should handle addToCart (new item)", () => {
    const newItem = {
      productId: "1",
      name: "Product 1",
      priceInCents: 1000,
      imageUrl: "test.png",
    };
    const state = cartReducer(initialState, addToCart(newItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({ ...newItem, quantity: 1 });
    expect(state.isOpen).toBe(true);
  });

  test("should handle addToCart (existing item)", () => {
    const item = {
      productId: "1",
      name: "Product 1",
      priceInCents: 1000,
      imageUrl: "test.png",
      quantity: 1,
    };
    const previousState = {
      items: [item],
      isOpen: false,
    };
    const state = cartReducer(previousState, addToCart(item));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  test("should handle removeFromCart", () => {
    const previousState = {
      items: [
        {
          productId: "1",
          name: "P1",
          priceInCents: 10,
          imageUrl: "",
          quantity: 1,
        },
        {
          productId: "2",
          name: "P2",
          priceInCents: 20,
          imageUrl: "",
          quantity: 1,
        },
      ],
      isOpen: true,
    };
    const state = cartReducer(previousState, removeFromCart("1"));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].productId).toBe("2");
  });

  test("should handle updateQuantity", () => {
    const previousState = {
      items: [
        {
          productId: "1",
          name: "P1",
          priceInCents: 10,
          imageUrl: "",
          quantity: 1,
        },
      ],
      isOpen: true,
    };
    const state = cartReducer(
      previousState,
      updateQuantity({ productId: "1", quantity: 5 }),
    );
    expect(state.items[0].quantity).toBe(5);
  });

  test("should handle updateQuantity (minimum 1)", () => {
    const previousState = {
      items: [
        {
          productId: "1",
          name: "P1",
          priceInCents: 10,
          imageUrl: "",
          quantity: 5,
        },
      ],
      isOpen: true,
    };
    const state = cartReducer(
      previousState,
      updateQuantity({ productId: "1", quantity: 0 }),
    );
    expect(state.items[0].quantity).toBe(1);
  });

  test("should handle clearCart", () => {
    const previousState = {
      items: [
        {
          productId: "1",
          name: "P1",
          priceInCents: 10,
          imageUrl: "",
          quantity: 1,
        },
      ],
      isOpen: true,
    };
    const state = cartReducer(previousState, clearCart());
    expect(state.items).toHaveLength(0);
  });

  test("should handle openCart and closeCart", () => {
    let state = cartReducer(initialState, openCart());
    expect(state.isOpen).toBe(true);
    state = cartReducer(state, closeCart());
    expect(state.isOpen).toBe(false);
  });
});
