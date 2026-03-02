import checkoutReducer, {
  openCheckoutForm,
  saveCardData,
  saveDeliveryAddress,
  setFees,
  setQuantity,
  updateCartItemQuantity,
  proceedToSummary,
  startProcessing,
  completeCheckout,
  setWompiAcceptanceToken,
  setCheckoutError,
  resetCheckout,
} from "./checkoutSlice";
import type { CheckoutStep } from "../../../shared/interfaces";

describe("checkoutSlice", () => {
  const initialState = {
    step: "IDLE" as CheckoutStep,
    selectedProductId: null,
    quantity: 1,
    cartItems: [],
    cardData: null,
    deliveryAddress: null,
    fees: null,
    wompiAcceptanceToken: null,
    error: null,
  };

  test("should return the initial state", () => {
    expect(checkoutReducer(undefined, { type: "" })).toEqual(initialState);
  });

  test("should handle openCheckoutForm", () => {
    const payload = {
      productId: "p1",
      quantity: 2,
      cartItems: [
        {
          productId: "p1",
          name: "P1",
          priceInCents: 100,
          imageUrl: "",
          quantity: 2,
        },
      ],
    };
    const state = checkoutReducer(initialState, openCheckoutForm(payload));
    expect(state.step).toBe("FORM");
    expect(state.selectedProductId).toBe("p1");
    expect(state.quantity).toBe(2);
    expect(state.cartItems).toEqual(payload.cartItems);
    expect(state.error).toBe(null);
  });

  test("should handle saveCardData", () => {
    const cardData = {
      number: "1234123412341111",
      holderName: "John Doe",
      expiryMonth: "12",
      expiryYear: "25",
      brand: "VISA" as const,
      token: "tok_test",
    };
    const state = checkoutReducer(initialState, saveCardData(cardData));
    expect(state.cardData).toEqual(cardData);
  });

  test("should handle saveDeliveryAddress", () => {
    const address = {
      recipientName: "John Doe",
      email: "john@example.com",
      addressLine1: "Main St 123",
      city: "Bogota",
      department: "Cundinamarca",
      phoneNumber: "1234567",
      addressDetail: "Apt 101",
    };
    const state = checkoutReducer(initialState, saveDeliveryAddress(address));
    expect(state.deliveryAddress).toEqual(address);
  });

  test("should handle setFees", () => {
    const fees = {
      productAmount: 100,
      baseFee: 10,
      deliveryFee: 5,
      totalAmount: 115,
    };
    const state = checkoutReducer(initialState, setFees(fees));
    expect(state.fees).toEqual(fees);
  });

  test("should handle proceedToSummary", () => {
    const state = checkoutReducer(
      { ...initialState, error: "some error" },
      proceedToSummary(),
    );
    expect(state.step).toBe("SUMMARY");
    expect(state.error).toBe(null);
  });

  test("should handle setQuantity and reset fees", () => {
    const stateWithFees = {
      ...initialState,
      fees: { totalAmount: 100 } as any,
    };
    const state = checkoutReducer(stateWithFees, setQuantity(5));
    expect(state.quantity).toBe(5);
    expect(state.fees).toBe(null);
  });

  test("should handle updateCartItemQuantity and reset fees", () => {
    const previousState = {
      ...initialState,
      cartItems: [{ productId: "p1", quantity: 1 } as any],
      fees: { totalAmount: 100 } as any,
    };
    const state = checkoutReducer(
      previousState,
      updateCartItemQuantity({ productId: "p1", quantity: 3 }),
    );
    expect(state.cartItems[0].quantity).toBe(3);
    expect(state.fees).toBe(null);
  });

  test("should handle setCheckoutError", () => {
    const state = checkoutReducer(
      initialState,
      setCheckoutError("Payment failed"),
    );
    expect(state.error).toBe("Payment failed");
    expect(state.step).toBe("SUMMARY");
  });

  test("should handle resetCheckout", () => {
    const dirtyState = {
      ...initialState,
      step: "SUMMARY" as CheckoutStep,
      quantity: 10,
    };
    const state = checkoutReducer(dirtyState, resetCheckout());
    expect(state).toEqual(initialState);
  });
});
