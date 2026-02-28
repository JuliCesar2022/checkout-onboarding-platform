import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { TransactionStatus } from '../../types/transaction.types';

interface TransactionState {
  id: string | null;
  status: TransactionStatus | null;
  reference: string | null;
  amountInCents: number | null;
  createdAt: string | null;
  loadingState: 'idle' | 'submitting' | 'polling' | 'settled';
  error: string | null;
}

const initialState: TransactionState = {
  id: null,
  status: null,
  reference: null,
  amountInCents: null,
  createdAt: null,
  loadingState: 'idle',
  error: null,
};

// TODO: implement — calls POST /api/transactions
export const submitTransaction = createAsyncThunk(
  'transaction/submit',
  async (_payload: unknown) => {
    // const response = await transactionsApi.createTransaction(payload);
    // return response;
    return { id: '', status: 'PENDING' as TransactionStatus, reference: '', amountInCents: 0, createdAt: '' };
  },
);

// TODO: implement — polls GET /api/transactions/:id every 3 seconds
export const pollTransactionStatus = createAsyncThunk(
  'transaction/poll',
  async (_transactionId: string) => {
    // const response = await transactionsApi.getTransactionStatus(transactionId);
    // return response.status;
    return 'PENDING' as TransactionStatus;
  },
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    resetTransaction() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitTransaction.pending, (state) => {
        state.loadingState = 'submitting';
        state.error = null;
      })
      .addCase(submitTransaction.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.status = action.payload.status;
        state.reference = action.payload.reference;
        state.amountInCents = action.payload.amountInCents;
        state.createdAt = action.payload.createdAt;
        state.loadingState = 'polling';
      })
      .addCase(submitTransaction.rejected, (state, action) => {
        state.loadingState = 'settled';
        state.status = 'ERROR';
        state.error = action.error.message ?? 'Transaction failed';
      })
      .addCase(pollTransactionStatus.fulfilled, (state, action) => {
        state.status = action.payload;
        if (action.payload !== 'PENDING') {
          state.loadingState = 'settled';
        }
      });
  },
});

export const { resetTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
