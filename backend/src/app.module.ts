import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { CustomersModule } from './modules/customers/customers.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { RedisModule } from './modules/storage/redis/redis.module';

@Module({
  imports: [
    // Infrastructure: config, rate limiting, database, storage
    CoreModule,
    RedisModule,

    // Business feature modules
    CategoriesModule,
    ProductsModule,
    CustomersModule,
    TransactionsModule,
    PaymentModule,
    ReservationsModule,
  ],
})
export class AppModule {}
