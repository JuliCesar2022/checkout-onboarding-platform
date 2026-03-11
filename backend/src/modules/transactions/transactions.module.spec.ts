import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsModule } from './transactions.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

describe('TransactionsModule', () => {
  it('should be defined and compilable', async () => {
    // Because TransactionsModule imports other modules that need providers,
    // we can test basic instantiation by providing the required global overrides or just compiling it.
    const module: TestingModule = await Test.createTestingModule({
      imports: [TransactionsModule, PrismaModule, ConfigModule.forRoot()],
    }).compile();

    expect(module).toBeDefined();
  });
});
