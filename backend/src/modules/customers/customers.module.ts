import { Module } from '@nestjs/common';
import { CustomersService } from './application/customers.service';
import { ICustomersRepository } from './domain/repositories/customers.repository';
import { PrismaCustomersRepository } from './infrastructure/repositories/prisma-customers.repository';

@Module({
  controllers: [],
  providers: [
    CustomersService,
    {
      provide: ICustomersRepository,
      useClass: PrismaCustomersRepository,
    },
  ],
  exports: [CustomersService, ICustomersRepository],
})
export class CustomersModule {}
