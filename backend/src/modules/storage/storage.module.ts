import { Module, Global } from '@nestjs/common';
import { StorageService } from './application/storage.service';
import { IStorageProvider } from './domain/interfaces/storage-provider.interface';
import { LocalStorageProvider } from './infrastructure/providers/local-storage.provider';
import { StorageController } from './infrastructure/controllers/storage.controller';

@Global()
@Module({
  controllers: [StorageController],
  providers: [
    StorageService,
    {
      provide: IStorageProvider,
      useClass: LocalStorageProvider,
    },
  ],
  exports: [StorageService, IStorageProvider],
})
export class StorageModule {}
