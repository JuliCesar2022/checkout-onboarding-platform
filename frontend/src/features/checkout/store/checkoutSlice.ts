import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  CardData,
  CheckoutStep,
  DeliveryAddress,
  FeeBreakdown,
} from '../types';

interface CheckoutState {
  step: CheckoutStep;
  selectedProductId: string | null;
  quantity: number;
  cardData: Omit<CardData, never> | null; // CVV is never stored here
  deliveryAddress: DeliveryAddress | null;
  fees: FeeBreakdown | null;
  wompiAcceptanceToken: string | null;
  error: string | null;
}

const initialState: CheckoutState = {
  step: 'IDLE',
  selectedProductId: null,
  quantity: 1,
  cardData: null,
  deliveryAddress: null,
  fees: null,
  wompiAcceptanceToken: null,
  error: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    openCheckoutForm(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) {
      state.step = 'FORM';
      state.selectedProductId = action.payload.productId;
      state.quantity = action.payload.quantity;
      state.error = null;
    },
    saveCardData(state, action: PayloadAction<Omit<CardData, never>>) {
      state.cardData = action.payload;
    },
    saveDeliveryAddress(state, action: PayloadAction<DeliveryAddress>) {
      state.deliveryAddress = action.payload;
    },
    setFees(state, action: PayloadAction<FeeBreakdown>) {
      state.fees = action.payload;
    },
    proceedToSummary(state) {
      state.step = 'SUMMARY';
      state.error = null;
    },
    startProcessing(state) {
      state.step = 'PROCESSING';
      state.error = null;
    },
    completeCheckout(state) {
      state.step = 'COMPLETE';
    },
    setWompiAcceptanceToken(state, action: PayloadAction<string>) {
      state.wompiAcceptanceToken = action.payload;
    },
    setQuantity(state, action: PayloadAction<number>) {
      state.quantity = Math.max(1, action.payload);
      state.fees = null; // reset fees so they get recalculated
    },
    setCheckoutError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.step = 'SUMMARY'; // return to summary on error
    },
    resetCheckout() {
      return initialState;
    },
  },
});

export const {
  openCheckoutForm,
  saveCardData,
  saveDeliveryAddress,
  setFees,
  setQuantity,
  proceedToSummary,
  startProcessing,
  completeCheckout,
  setWompiAcceptanceToken,
  setCheckoutError,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
