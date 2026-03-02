import transactionReducer, {
  setTransactionResult,
  resetTransaction,
  submitTransaction,
  pollTransactionStatus,
} from "./transactionSlice";
import type { TransactionStatus } from "../../../shared/interfaces";

describe("transactionSlice", () => {
  const initialState = {
    id: null,
    status: null,
    reference: null,
    amountInCents: null,
    createdAt: null,
    loadingState: "idle" as const,
    error: null,
  };

  test("should return the initial state", () => {
    expect(transactionReducer(undefined, { type: "" })).toEqual(initialState);
  });

  test("should handle setTransactionResult", () => {
    const payload = {
      id: "tr_123",
      status: "APPROVED" as TransactionStatus,
      reference: "REF_001",
      amountInCents: 50000,
    };
    const state = transactionReducer(
      initialState,
      setTransactionResult(payload),
    );
    expect(state.id).toBe("tr_123");
    expect(state.status).toBe("APPROVED");
    expect(state.loadingState).toBe("settled");
  });

  test("should handle resetTransaction", () => {
    const dirtyState = {
      ...initialState,
      id: "123",
      status: "PENDING" as TransactionStatus,
    };
    const state = transactionReducer(dirtyState, resetTransaction());
    expect(state).toEqual(initialState);
  });

  describe("extraReducers", () => {
    test("submitTransaction.pending", () => {
      const state = transactionReducer(initialState, {
        type: submitTransaction.pending.type,
      });
      expect(state.loadingState).toBe("submitting");
      expect(state.status).toBe(null);
      expect(state.error).toBe(null);
    });

    test("submitTransaction.fulfilled", () => {
      const payload = {
        id: "tr_123",
        status: "PENDING" as TransactionStatus,
        reference: "REF_1",
        amountInCents: 100,
      };
      const state = transactionReducer(initialState, {
        type: submitTransaction.fulfilled.type,
        payload,
      });
      expect(state.id).toBe("tr_123");
      expect(state.loadingState).toBe("polling");
    });

    test("submitTransaction.rejected", () => {
      const state = transactionReducer(initialState, {
        type: submitTransaction.rejected.type,
        error: { message: "API Error" },
      });
      expect(state.status).toBe("ERROR");
      expect(state.loadingState).toBe("settled");
      expect(state.error).toBe("API Error");
    });

    test("pollTransactionStatus.fulfilled (final status)", () => {
      const payload = {
        id: "tr_123",
        status: "APPROVED" as TransactionStatus,
        reference: "REF_1",
        amountInCents: 100,
      };
      const state = transactionReducer(
        { ...initialState, loadingState: "polling" as const },
        { type: pollTransactionStatus.fulfilled.type, payload },
      );
      expect(state.status).toBe("APPROVED");
      expect(state.loadingState).toBe("settled");
    });

    test("pollTransactionStatus.fulfilled (still pending)", () => {
      const payload = {
        id: "tr_123",
        status: "PENDING" as TransactionStatus,
        reference: "REF_1",
        amountInCents: 100,
      };
      const state = transactionReducer(
        { ...initialState, loadingState: "polling" as const },
        { type: pollTransactionStatus.fulfilled.type, payload },
      );
      expect(state.status).toBe("PENDING");
      expect(state.loadingState).toBe("polling"); // should stay in polling
    });
  });
});
