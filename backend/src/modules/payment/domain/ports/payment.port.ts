import type { Result } from '../../../../common/result/result';
import { PaymentStatus } from '../enums/payment-status.enum';

export interface ChargeCardInput {
  amountInCents: number;
  currency: string;
  reference: string;
  cardToken: string;
  installments: number;
  customerEmail: string;
  acceptanceToken: string;
  acceptPersonalAuth: string;
}

export interface ChargeCardOutput {
  wompiId: string;
  status: PaymentStatus;
  rawResponse: Record<string, unknown>;
}

/**
 * Payment Port — abstract interface (Hexagonal)
 * WompiAdapter is the concrete implementation.
 * Swap for any other gateway without touching domain/application.
 */
export abstract class IPaymentPort {
  abstract charge(input: ChargeCardInput): Promise<Result<ChargeCardOutput>>;
  abstract getAcceptanceToken(): Promise<
    Result<{ acceptanceToken: string; personalAuthToken: string }>
  >;
  abstract getTransactionStatus(
    wompiId: string,
  ): Promise<Result<ChargeCardOutput>>;
}
