import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesModule } from './categories.module';
import { PrismaModule } from '../../prisma/prisma.module';

describe('CategoriesModule', () => {
  it('should be defined and compilable', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CategoriesModule, PrismaModule],
    }).compile();

    expect(module).toBeDefined();
  });
});
