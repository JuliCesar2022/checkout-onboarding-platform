import { Test, TestingModule } from '@nestjs/testing';
import { StorageModule } from './storage.module';
import { ConfigModule } from '@nestjs/config';
import { IStorageProvider } from './domain/interfaces/storage-provider.interface';

describe('StorageModule', () => {
  it('should be defined and compilable', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StorageModule, ConfigModule.forRoot()],
    })
    .overrideProvider(IStorageProvider)
    .useValue({})
    .compile();

    expect(module).toBeDefined();
  });
});
