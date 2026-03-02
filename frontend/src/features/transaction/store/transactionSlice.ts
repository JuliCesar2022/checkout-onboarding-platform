import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TransactionStatus } from "../types";
import { checkoutApi } from "../../checkout/api";
import type {
  SubmitTransactionPayload,
  TransactionResult,
} from "../../checkout/api";

interface TransactionState {
  id: string | null;
  status: TransactionStatus | null;
  reference: string | null;
  amountInCents: number | null;
  createdAt: string | null;
  loadingState: "idle" | "submitting" | "polling" | "settled";
  error: string | null;
}

const initialState: TransactionState = {
  id: null,
  status: null,
  reference: null,
  amountInCents: null,
  createdAt: null,
  loadingState: "idle",
  error: null,
};

export const submitTransaction = createAsyncThunk(
  "transaction/submit",
  async (
    payload: Omit<
      SubmitTransactionPayload,
      "acceptanceToken" | "acceptPersonalAuth"
    >,
  ) => {
    const { acceptanceToken, personalAuthToken } =
      await checkoutApi.fetchAcceptanceToken();

    const response = await checkoutApi.submitTransaction({
      ...payload,
      acceptanceToken,
      acceptPersonalAuth: personalAuthToken,
    });

    return response;
  },
);

export const pollTransactionStatus = createAsyncThunk<
  TransactionResult,
  string,
  { rejectValue: string }
>("transaction/poll", async (transactionId: string, { rejectWithValue }) => {
  let retries = 0;
  const maxRetries = 10;
  const delay = 3000;

  let result: TransactionResult | null = null;

  while (retries < maxRetries) {
    try {
      result = await checkoutApi.syncTransactionStatus(transactionId);
      if (result.status !== "PENDING") {
        return result;
      }
    } catch (err) {
      // Continue polling on network error
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
    retries++;
  }

  if (result) return result;
  return rejectWithValue("Timeout waiting for transaction status");
});

interface SetTransactionPayload {
  id: string;
  status: TransactionStatus;
  reference: string;
  amountInCents: number;
}

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactionResult(state, action: PayloadAction<SetTransactionPayload>) {
      state.id = action.payload.id;
      state.status = action.payload.status;
      state.reference = action.payload.reference;
      state.amountInCents = action.payload.amountInCents;
      state.loadingState = "settled";
    },
    resetTransaction() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitTransaction.pending, (state) => {
        state.loadingState = "submitting";
        state.error = null;
      })
      .addCase(submitTransaction.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.status = action.payload.status as TransactionStatus;
        state.reference = action.payload.reference;
        state.amountInCents = action.payload.amountInCents;
        state.loadingState = "polling";
      })
      .addCase(submitTransaction.rejected, (state, action) => {
        state.loadingState = "settled";
        state.status = "ERROR";
        state.error = action.error.message ?? "Transaction failed";
      })
      .addCase(pollTransactionStatus.fulfilled, (state, action) => {
        state.status = action.payload.status as TransactionStatus;
        if (action.payload.status !== "PENDING") {
          state.loadingState = "settled";
        }
      })
      .addCase(pollTransactionStatus.rejected, (state, action) => {
        state.loadingState = "settled";
        state.status = "ERROR";
        state.error =
          action.payload || action.error.message || "Polling failed";
      });
  },
});

export const { setTransactionResult, resetTransaction } =
  transactionSlice.actions;
export default transactionSlice.reducer;
