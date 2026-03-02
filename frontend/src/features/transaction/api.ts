import client from "../../lib/axios";
import type {
  Transaction,
  TransactionStatus,
  DeliveryAddress,
} from "../../shared/interfaces";

interface CreateTransactionPayload {
  wompiCardToken: string;
  wompiAcceptanceToken: string;
  amountInCents: number;
  currency: "COP";
  customerEmail: string;
  reference: string;
  productId: string;
  quantity: number;
  deliveryAddress: DeliveryAddress;
}

export const transactionsApi = {
  createTransaction: async (
    payload: CreateTransactionPayload,
  ): Promise<Transaction> => {
    // TODO: implement
    const response = await client.post<Transaction>("/transactions", payload);
    return response.data;
  },

  getTransactionStatus: async (
    id: string,
  ): Promise<{ status: TransactionStatus }> => {
    // TODO: implement
    const response = await client.get<{ status: TransactionStatus }>(
      `/transactions/${id}`,
    );
    return response.data;
  },
};
