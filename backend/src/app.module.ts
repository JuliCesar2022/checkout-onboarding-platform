import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { CustomersModule } from './modules/customers/customers.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { PaymentModule } from './modules/payment/payment.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    // Infrastructure: config, rate limiting, database
    CoreModule,
    StorageModule,

    // Business feature modules
    CategoriesModule,
    ProductsModule,
    CustomersModule,
    TransactionsModule,
    DeliveriesModule,
    PaymentModule,
  ],
})
export class AppModule {}
