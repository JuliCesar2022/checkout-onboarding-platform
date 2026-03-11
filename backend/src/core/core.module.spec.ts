import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from './core.module';

describe('CoreModule', () => {
  it('should be defined and compilable', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();

    expect(module).toBeDefined();
  });
});
