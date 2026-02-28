import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionsController } from './infrastructure/controllers/transactions.controller';
import { TransactionsService } from './application/transactions.service';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { ITransactionsRepository } from './domain/repositories/transactions.repository';
import { PrismaTransactionsRepository } from './infrastructure/repositories/prisma-transactions.repository';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [ConfigModule, ProductsModule, CustomersModule, DeliveriesModule, PaymentModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    CreateTransactionUseCase,
    {
      provide: ITransactionsRepository,
      useClass: PrismaTransactionsRepository,
    },
  ],
})
export class TransactionsModule {}
