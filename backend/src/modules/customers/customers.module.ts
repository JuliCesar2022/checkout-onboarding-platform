import { Module } from '@nestjs/common';
import { CustomersController } from './infrastructure/controllers/customers.controller';
import { CustomersService } from './application/customers.service';
import { ICustomersRepository } from './domain/repositories/customers.repository';
import { PrismaCustomersRepository } from './infrastructure/repositories/prisma-customers.repository';

@Module({
  controllers: [CustomersController],
  providers: [
    CustomersService,
    {
      provide: ICustomersRepository,
      useClass: PrismaCustomersRepository,
    },
  ],
  exports: [CustomersService],
})
export class CustomersModule {}
