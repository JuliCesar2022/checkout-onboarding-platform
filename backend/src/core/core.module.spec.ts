import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from './core.module';

describe('CoreModule', () => {
  beforeAll(() => {
    process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
    process.env.WOMPI_PUBLIC_KEY = 'pub_test_dummy';
    process.env.WOMPI_PRIVATE_KEY = 'prv_test_dummy';
    process.env.WOMPI_INTEGRITY_KEY = 'int_test_dummy';
  });

  it('should be defined and compilable', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();

    expect(module).toBeDefined();
  });
});
