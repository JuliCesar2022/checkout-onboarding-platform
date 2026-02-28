import client from './client';
import type { CardData } from '../types/checkout.types';

interface TokenizeCardPayload {
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
}

interface TokenizeCardResult {
  token: string;
  brand: CardData['brand'];
  lastFour: string;
}

export const checkoutApi = {
  /** Fetches Wompi merchant acceptance token (required before tokenization) */
  fetchAcceptanceToken: async (): Promise<{ token: string; permalink: string }> => {
    // TODO: implement
    const response = await client.get('/checkout/acceptance-token');
    return response.data;
  },

  /** Proxied through backend to Wompi card tokenization endpoint */
  tokenizeCard: async (payload: TokenizeCardPayload): Promise<TokenizeCardResult> => {
    // TODO: implement
    const response = await client.post<TokenizeCardResult>('/checkout/tokenize-card', payload);
    return response.data;
  },
};
