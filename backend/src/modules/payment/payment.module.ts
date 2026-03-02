import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { IPaymentPort } from './domain/ports/payment.port';
import { WompiAdapter } from './infrastructure/adapters/wompi.adapter';
import { PaymentController } from './infrastructure/controllers/payment.controller';
import type { Env } from '../../config/env.validation';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env>) => ({
        baseURL: config.get('WOMPI_BASE_URL', { infer: true }),
        timeout: 10_000,
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
  ],
  controllers: [PaymentController],
  providers: [
    {
      provide: IPaymentPort,
      useClass: WompiAdapter,
    },
  ],
  exports: [IPaymentPort],
})
export class PaymentModule {}
