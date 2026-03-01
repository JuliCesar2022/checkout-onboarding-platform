import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IPaymentPort } from './domain/ports/payment.port';
import { WompiAdapter } from './infrastructure/adapters/wompi.adapter';
import { PaymentController } from './infrastructure/controllers/payment.controller';

@Module({
  imports: [ConfigModule],
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
