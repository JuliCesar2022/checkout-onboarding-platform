import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IPaymentPort } from './domain/ports/payment.port';
import { WompiAdapter } from './infrastructure/adapters/wompi.adapter';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: IPaymentPort,
      useClass: WompiAdapter,
    },
  ],
  exports: [IPaymentPort],
})
export class PaymentModule {}
