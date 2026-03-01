import { Injectable } from '@nestjs/common';
import { IStorageProvider } from '../domain/interfaces/storage-provider.interface';

@Injectable()
export class StorageService {
  constructor(private readonly storageProvider: IStorageProvider) {}

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'general',
  ): Promise<string> {
    return this.storageProvider.save(file, folder);
  }

  async deleteFile(path: string): Promise<void> {
    return this.storageProvider.delete(path);
  }

  getFileUrl(path: string): string {
    return this.storageProvider.getUrl(path);
  }
}
