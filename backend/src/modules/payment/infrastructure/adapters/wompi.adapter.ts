import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  IPaymentPort,
  ChargeCardInput,
  ChargeCardOutput,
} from '../../domain/ports/payment.port';
import { Result } from '../../../../common/result/result';
import type { Env } from '../../../../config/env.validation';
import type { TransactionStatus } from '../../../transactions/domain/entities/transaction.entity';

const WOMPI_STATUS_MAP: Record<string, TransactionStatus> = {
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
  VOIDED: 'VOIDED',
  ERROR: 'ERROR',
  PENDING: 'PENDING',
};

@Injectable()
export class WompiAdapter implements IPaymentPort {
  private readonly logger = new Logger(WompiAdapter.name);
  private readonly baseUrl: string;
  private readonly privateKey: string;

  constructor(private readonly config: ConfigService<Env>) {
    this.baseUrl = this.config.get('WOMPI_BASE_URL', { infer: true })!;
    this.privateKey = this.config.get('WOMPI_PRIVATE_KEY', { infer: true })!;
  }

  async getAcceptanceToken(): Promise<
    Result<{ acceptanceToken: string; personalAuthToken: string }>
  > {
    try {
      const publicKey = this.config.get('WOMPI_PUBLIC_KEY', { infer: true });
      const { data } = await axios.get(`${this.baseUrl}/merchants/${publicKey}`);
      const presignedAcceptance = data.data?.presigned_acceptance;
      const presignedPersonalDataAuth =
        data.data?.presigned_personal_data_auth;

      return Result.ok({
        acceptanceToken: presignedAcceptance?.acceptance_token ?? '',
        personalAuthToken:
          presignedPersonalDataAuth?.acceptance_token ?? '',
      });
    } catch (error) {
      this.logger.error('Failed to get acceptance token from Wompi', error);
      return Result.fail('Could not retrieve acceptance token from Wompi');
    }
  }

  async charge(input: ChargeCardInput): Promise<Result<ChargeCardOutput>> {
    try {
      const payload = {
        amount_in_cents: input.amountInCents,
        currency: input.currency,
        customer_email: input.customerEmail,
        reference: input.reference,
        acceptance_token: input.acceptanceToken,
        accept_personal_auth: input.acceptPersonalAuth,
        payment_method: {
          type: 'CARD',
          token: input.cardToken,
          installments: input.installments,
        },
      };

      const { data } = await axios.post(`${this.baseUrl}/transactions`, payload, {
        headers: {
          Authorization: `Bearer ${this.privateKey}`,
          'Content-Type': 'application/json',
        },
      });

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
      const message =
        axios.isAxiosError(error)
          ? (error.response?.data as { error?: { reason?: string } })?.error
              ?.reason ?? error.message
          : 'Unknown payment error';
      return Result.fail(message);
    }
  }
}
