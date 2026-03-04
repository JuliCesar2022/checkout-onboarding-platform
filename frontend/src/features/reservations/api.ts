import client from "../../lib/axios";

export interface ReserveItem {
  productId: string;
  quantity: number;
}

export interface ReservationResponse {
  sessionId: string;
  expiresAt: string; // ISO string
  expiresInMs: number; // milliseconds until expiry
  items: ReserveItem[];
}

export const reservationsApi = {
  /**
   * Creates (or refreshes) a stock reservation for the given sessionId.
   * Returns the TTL so the frontend can show a countdown.
   */
  createReservation: async (
    sessionId: string,
    items: ReserveItem[],
  ): Promise<ReservationResponse> => {
    const { data } = await client.post<ReservationResponse>("/reservations", {
      sessionId,
      items,
    });
    return data;
  },

  /**
   * Releases the reservation immediately (e.g., user cancels checkout).
   * Fire-and-forget is fine — TTL will clean up anyway.
   */
  releaseReservation: async (sessionId: string): Promise<void> => {
    try {
      await client.delete(`/reservations/${sessionId}`);
    } catch {
      // Non-critical: Redis TTL handles cleanup
    }
  },
};
