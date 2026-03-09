import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IFinancialConfig } from '../../domain/ports/financial-config.port';
import { FINANCIAL_CONSTANTS } from '../../domain/constants/financial.constant';
import type { Env } from '../../../../config/env.validation';

/**
 * Adapter that bridges the NestJS ConfigService with our domain-specific configuration port.
 */
@Injectable()
export class NestFinancialConfigAdapter implements IFinancialConfig {
  constructor(private readonly config: ConfigService<Env>) {}

  getTransactionFeeInCents(): number {
    return (
      this.config.get<number>('TRANSACTION_FEE_IN_CENTS') ??
      FINANCIAL_CONSTANTS.DEFAULT.TRANSACTION_FEE_IN_CENTS
    );
  }

  getDeliveryFeeInCents(): number {
    return (
      this.config.get<number>('DELIVERY_FEE_IN_CENTS') ??
      FINANCIAL_CONSTANTS.DEFAULT.DELIVERY_FEE_IN_CENTS
    );
  }
}
