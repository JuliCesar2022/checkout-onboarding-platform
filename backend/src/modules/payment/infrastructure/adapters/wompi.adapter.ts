import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import {
  IPaymentPort,
  ChargeCardInput,
  ChargeCardOutput,
} from '../../domain/ports/payment.port';
import { Result } from '../../../../common/result/result';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import type { Env } from '../../../../config/env.validation';

import {
  WOMPI_STATUS_MAP,
  WOMPI_ENDPOINTS,
  WOMPI_ERROR_MESSAGES,
  WOMPI_PAYMENT_METHODS,
} from '../../domain/constants/wompi.constants';

@Injectable()
export class WompiAdapter implements IPaymentPort {
  private readonly logger = new Logger(WompiAdapter.name);
  private readonly privateKey: string;
  private readonly integrityKey: string;
  private readonly publicKey: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService<Env>,
  ) {
    this.privateKey = this.config.get('WOMPI_PRIVATE_KEY', { infer: true })!;
    this.integrityKey = this.config.get('WOMPI_INTEGRITY_KEY', { infer: true })!;
    this.publicKey = this.config.get('WOMPI_PUBLIC_KEY', { infer: true })!;
  }

  async getAcceptanceToken(): Promise<
    Result<{ acceptanceToken: string; personalAuthToken: string }>
  > {
    try {
      const { data } = await firstValueFrom(
        this.http.get(`${WOMPI_ENDPOINTS.MERCHANTS}/${this.publicKey}`),
      );

      const presignedAcceptance = data.data?.presigned_acceptance;
      const presignedPersonalDataAuth = data.data?.presigned_personal_data_auth;

      return Result.ok({
        acceptanceToken: presignedAcceptance?.acceptance_token ?? '',
        personalAuthToken: presignedPersonalDataAuth?.acceptance_token ?? '',
      });
    } catch (error) {
      this.logger.error('Failed to get acceptance token from Wompi', error);
      return Result.fail(WOMPI_ERROR_MESSAGES.ACCEPTANCE_TOKEN_FAILURE);
    }
  }

  async charge(input: ChargeCardInput): Promise<Result<ChargeCardOutput>> {
    try {
      // SHA256(reference + amountInCents + currency + integrityKey)
      const signatureInput = `${input.reference}${input.amountInCents}${input.currency}${this.integrityKey}`;
      const signature = crypto
        .createHash('sha256')
        .update(signatureInput)
        .digest('hex');

      const payload = {
        amount_in_cents: input.amountInCents,
        currency: input.currency,
        customer_email: input.customerEmail,
        reference: input.reference,
        acceptance_token: input.acceptanceToken,
        accept_personal_auth: input.acceptPersonalAuth,
        signature,
        payment_method: {
          type: WOMPI_PAYMENT_METHODS.CARD,
          token: input.cardToken,
          installments: input.installments,
        },
      };

      const { data } = await firstValueFrom(
        this.http.post(WOMPI_ENDPOINTS.TRANSACTIONS, payload, {
          headers: { Authorization: `Bearer ${this.privateKey}` },
        }),
      );

      const transaction = data.data;
      const wompiStatus: string = transaction?.status ?? 'ERROR';
      const mappedStatus: PaymentStatus =
        WOMPI_STATUS_MAP[wompiStatus] ?? PaymentStatus.ERROR;

      return Result.ok({
        wompiId: transaction.id,
        status: mappedStatus,
        rawResponse: data as Record<string, unknown>,
      });
    } catch (error: unknown) {
      this.logger.error('Wompi charge failed', error);
      const message = this.extractErrorMessage(error, WOMPI_ERROR_MESSAGES.PAYMENT_UNKNOWN_ERROR);
      return Result.fail(message);
    }
  }

  async getTransactionStatus(wompiId: string): Promise<Result<ChargeCardOutput>> {
    try {
      const { data } = await firstValueFrom(
        this.http.get(`${WOMPI_ENDPOINTS.TRANSACTIONS}/${wompiId}`, {
          headers: { Authorization: `Bearer ${this.privateKey}` },
        }),
      );

      const transaction = data.data;
      const wompiStatus: string = transaction?.status ?? 'ERROR';
      const mappedStatus: PaymentStatus =
        WOMPI_STATUS_MAP[wompiStatus] ?? PaymentStatus.ERROR;

      return Result.ok({
        wompiId: transaction.id,
        status: mappedStatus,
        rawResponse: data as Record<string, unknown>,
      });
    } catch (error: unknown) {
      this.logger.error(`Wompi status check failed for ${wompiId}`, error);
      const message = this.extractErrorMessage(error, WOMPI_ERROR_MESSAGES.STATUS_CHECK_UNKNOWN_ERROR);
      return Result.fail(message);
    }
  }

  /** Extracts a human-readable message from an axios error or unknown error. */
  private extractErrorMessage(error: unknown, fallback: string): string {
    if (
      error !== null &&
      typeof error === 'object' &&
      'response' in error
    ) {
      const axiosError = error as { response?: { data?: { error?: { reason?: string } } }; message?: string };
      return (
        axiosError.response?.data?.error?.reason ??
        axiosError.message ??
        fallback
      );
    }
    return fallback;
  }
}
