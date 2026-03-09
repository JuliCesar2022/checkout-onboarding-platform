import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IUuidGenerator } from '../../common/interfaces/uuid-generator.interface';
import { CryptoUuidAdapter } from '../../common/adapters/crypto-uuid.adapter';
import { TransactionsController } from './infrastructure/controllers/transactions.controller';
import { TransactionsService } from './application/transactions.service';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { SyncTransactionStatusUseCase } from './application/use-cases/sync-transaction-status.use-case';
import { ITransactionsRepository } from './domain/repositories/transactions.repository';
import { PrismaTransactionsRepository } from './infrastructure/repositories/prisma-transactions.repository';
import { INotificationPort } from './domain/ports/notification.port';
import { EmailNotificationAdapter } from './infrastructure/adapters/email-notification.adapter';
import { SyncTransactionsTask } from './infrastructure/tasks/sync-transactions.task';
import { IFinancialConfig } from './domain/ports/financial-config.port';
import { NestFinancialConfigAdapter } from './infrastructure/adapters/nest-financial-config.adapter';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { PaymentModule } from '../payment/payment.module';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [
    ConfigModule,
    ProductsModule,
    CustomersModule,
    DeliveriesModule,
    PaymentModule,
    ReservationsModule,
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    CreateTransactionUseCase,
    SyncTransactionStatusUseCase,
    SyncTransactionsTask,
    {
      provide: ITransactionsRepository,
      useClass: PrismaTransactionsRepository,
    },
    {
      provide: INotificationPort,
      useClass: EmailNotificationAdapter,
    },
    {
      provide: IUuidGenerator,
      useClass: CryptoUuidAdapter,
    },
    {
      provide: IFinancialConfig,
      useClass: NestFinancialConfigAdapter,
    },
  ],
})
export class TransactionsModule {}
