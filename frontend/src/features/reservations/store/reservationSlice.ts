import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { reservationsApi } from "../api";
import type { ReserveItem } from "../api";

// ─── Session ID ───────────────────────────────────────────────────────────────
// One stable ID per browser session (survives React re-renders, not page reloads
// for the TTL — that's fine; TTL is 15 min on the server).
function getOrCreateSessionId(): string {
  const key = "checkout_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

// ─── State ────────────────────────────────────────────────────────────────────
interface ReservationState {
  sessionId: string;
  status: "idle" | "reserving" | "active" | "expired" | "error";
  expiresAt: string | null; // ISO string
  expiresInMs: number | null; // for initial countdown seed
  error: string | null;
}

const initialState: ReservationState = {
  sessionId: "",
  status: "idle",
  expiresAt: null,
  expiresInMs: null,
  error: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────
export const createReservation = createAsyncThunk<
  { sessionId: string; expiresAt: string; expiresInMs: number },
  { items: ReserveItem[] },
  { rejectValue: string }
>("reservation/create", async ({ items }, { getState, rejectWithValue }) => {
  const state = (getState() as { reservation: ReservationState }).reservation;
  const sessionId = state.sessionId || getOrCreateSessionId();
  try {
    const res = await reservationsApi.createReservation(sessionId, items);
    return {
      sessionId: res.sessionId,
      expiresAt: res.expiresAt,
      expiresInMs: res.expiresInMs,
    };
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "No hay stock disponible";
    return rejectWithValue(message);
  }
});

export const releaseReservation = createAsyncThunk(
  "reservation/release",
  async (_, { getState }) => {
    const state = (getState() as { reservation: ReservationState }).reservation;
    if (state.sessionId) {
      await reservationsApi.releaseReservation(state.sessionId);
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    initSessionId(state) {
      if (!state.sessionId) {
        state.sessionId = getOrCreateSessionId();
      }
    },
    markExpired(state) {
      state.status = "expired";
    },
    resetReservation() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReservation.pending, (state) => {
        state.status = "reserving";
        state.error = null;
        // Ensure sessionId is set even before the response
        if (!state.sessionId) state.sessionId = getOrCreateSessionId();
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.status = "active";
        state.sessionId = action.payload.sessionId;
        state.expiresAt = action.payload.expiresAt;
        state.expiresInMs = action.payload.expiresInMs;
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || "Error al reservar el stock";
      })
      .addCase(releaseReservation.fulfilled, (state) => {
        state.status = "idle";
        state.expiresAt = null;
        state.expiresInMs = null;
      });
  },
});

export const { initSessionId, markExpired, resetReservation } =
  reservationSlice.actions;
export default reservationSlice.reducer;
