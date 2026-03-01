import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import {
  IPaymentPort,
  ChargeCardInput,
  ChargeCardOutput,
} from '../../domain/ports/payment.port';
import { Result } from '../../../../common/result/result';
import type { Env } from '../../../../config/env.validation';
import type { TransactionStatus } from '../../../transactions/domain/entities/transaction.entity';

import {
  WOMPI_STATUS_MAP,
  WOMPI_ENDPOINTS,
  WOMPI_ERROR_MESSAGES,
  WOMPI_PAYMENT_METHODS,
  WOMPI_DEFAULT_CURRENCY,
} from '../../domain/constants/wompi.constants';

@Injectable()
export class WompiAdapter implements IPaymentPort {
  private readonly logger = new Logger(WompiAdapter.name);
  private readonly baseUrl: string;
  private readonly privateKey: string;
  private readonly integrityKey: string;

  constructor(private readonly config: ConfigService<Env>) {
    this.baseUrl = this.config.get('WOMPI_BASE_URL', { infer: true })!;
    this.privateKey = this.config.get('WOMPI_PRIVATE_KEY', { infer: true })!;
    this.integrityKey = this.config.get('WOMPI_INTEGRITY_KEY', {
      infer: true,
    })!;
  }

  async getAcceptanceToken(): Promise<
    Result<{ acceptanceToken: string; personalAuthToken: string }>
  > {
    try {
      const publicKey = this.config.get('WOMPI_PUBLIC_KEY', { infer: true });
      const { data } = await axios.get(
        `${this.baseUrl}${WOMPI_ENDPOINTS.MERCHANTS}/${publicKey}`,
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
      // Calculate Wompi integrity signature: SHA256(reference + amountInCents + currency + integrityKey)
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

      const { data } = await axios.post(
        `${this.baseUrl}${WOMPI_ENDPOINTS.TRANSACTIONS}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const transaction = data.data;
      const wompiStatus: string = transaction?.status ?? 'ERROR';
      const mappedStatus: TransactionStatus =
        WOMPI_STATUS_MAP[wompiStatus] ?? 'ERROR';

      return Result.ok({
        wompiId: transaction.id,
        status: mappedStatus,
        rawResponse: data as Record<string, unknown>,
      });
    } catch (error: unknown) {
      this.logger.error('Wompi charge failed', error);
      const message = axios.isAxiosError(error)
        ? ((error.response?.data as { error?: { reason?: string } })?.error
            ?.reason ?? error.message)
        : WOMPI_ERROR_MESSAGES.PAYMENT_UNKNOWN_ERROR;
      return Result.fail(message);
    }
  }

  async getTransactionStatus(
    wompiId: string,
  ): Promise<Result<ChargeCardOutput>> {
    try {
      const { data } = await axios.get(
        `${this.baseUrl}${WOMPI_ENDPOINTS.TRANSACTIONS}/${wompiId}`,
        {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
          },
        },
      );

      const transaction = data.data;
      const wompiStatus: string = transaction?.status ?? 'ERROR';
      const mappedStatus: TransactionStatus =
        WOMPI_STATUS_MAP[wompiStatus] ?? 'ERROR';

      return Result.ok({
        wompiId: transaction.id,
        status: mappedStatus,
        rawResponse: data as Record<string, unknown>,
      });
    } catch (error: unknown) {
      this.logger.error(`Wompi status check failed for ${wompiId}`, error);
      const message = axios.isAxiosError(error)
        ? (JSON.stringify(error.response?.data) ?? error.message)
        : WOMPI_ERROR_MESSAGES.STATUS_CHECK_UNKNOWN_ERROR;
      return Result.fail(message);
    }
  }
}
