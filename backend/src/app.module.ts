import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ProductsModule } from './modules/products/products.module';
import { CustomersModule } from './modules/customers/customers.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    // Infrastructure: config, rate limiting, database
    CoreModule,

    // Business feature modules
    ProductsModule,
    CustomersModule,
    TransactionsModule,
    DeliveriesModule,
    PaymentModule,
  ],
})
export class AppModule {}
