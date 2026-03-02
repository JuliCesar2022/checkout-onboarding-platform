import client from "../../lib/axios";
import type {
  CardData,
  SubmitTransactionPayload,
  TransactionResult,
} from "../../shared/interfaces";
import axios from "axios";

// ─── Interfaces ──────────────────────────────────────────────────────────────

// Tokenize types remain internal as they are only used here
interface TokenizeCardPayload {
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
}

interface TokenizeCardResult {
  token: string;
  brand: CardData["brand"];
  lastFour: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const checkoutApi = {
  /**
   * Fetches Wompi acceptance + personal auth tokens via our backend proxy.
   * Required by Wompi before any transaction.
   */
  fetchAcceptanceToken: async (): Promise<{
    acceptanceToken: string;
    personalAuthToken: string;
  }> => {
    const response = await client.get("/checkout/acceptance-token");
    return response.data;
  },

  /**
   * Tokenizes the card DIRECTLY against Wompi using the public key.
   * The full card data never touches our backend.
   */
  tokenizeCard: async (
    payload: TokenizeCardPayload,
  ): Promise<TokenizeCardResult> => {
    const wompiUrl = import.meta.env.VITE_WOMPI_BASE_URL;
    const pubKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;

    if (!wompiUrl || !pubKey) {
      throw new Error(
        "Wompi env vars are missing (VITE_WOMPI_BASE_URL / VITE_WOMPI_PUBLIC_KEY)",
      );
    }

    const wompiPayload = {
      number: payload.number.replace(/\s+/g, ""),
      cvc: payload.cvc,
      exp_month: payload.expMonth,
      exp_year: payload.expYear,
      card_holder: payload.cardHolder,
    };

    console.log(
      "🔐 Tokenizando tarjeta con Wompi...",
      `**** ${wompiPayload.number.slice(-4)}`,
    );

    try {
      const response = await axios.post(
        `${wompiUrl}/tokens/cards`,
        wompiPayload,
        {
          headers: { Authorization: `Bearer ${pubKey}` },
        },
      );

      const data = response.data.data;

      console.log("✅ Token generado:", data.id);

      return {
        token: data.id,
        brand: data.brand.toUpperCase() as CardData["brand"],
        lastFour: data.last_four || payload.number.slice(-4),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Wompi Tokenization Error:", error.response?.data);
        throw new Error(
          error.response?.data?.error?.messages?.number?.[0] ||
            "Error al tokenizar la tarjeta",
        );
      }
      throw error;
    }
  },

  /**
   * Submits the transaction to OUR backend.
   * Backend will use the private key to charge the tokenized card via Wompi.
   */
  submitTransaction: async (
    payload: SubmitTransactionPayload,
  ): Promise<TransactionResult> => {
    console.log("🚀 Enviando transacción al backend...", {
      productId: payload.productId,
      card: `${payload.cardData.brand} **** ${payload.cardData.lastFour}`,
      customer: payload.customerData.email,
    });

    const response = await client.post<TransactionResult>(
      "/transactions",
      payload,
    );

    console.log("✅ Respuesta del backend:", {
      id: response.data.id,
      status: response.data.status,
      reference: response.data.reference,
    });

    return response.data;
  },

  /**
   * Polls the backend to sync the transaction status with Wompi.
   */
  syncTransactionStatus: async (
    transactionId: string,
  ): Promise<TransactionResult> => {
    const response = await client.get<TransactionResult>(
      `/transactions/${transactionId}/sync`,
    );
    return response.data;
  },
};
