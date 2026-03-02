import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { IStorageProvider } from '../domain/interfaces/storage-provider.interface';

describe('StorageService', () => {
  let service: StorageService;
  let provider: jest.Mocked<IStorageProvider>;

  beforeEach(async () => {
    provider = {
      save: jest.fn(),
      delete: jest.fn(),
      getUrl: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: IStorageProvider,
          useValue: provider,
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should upload file', async () => {
    const file = { originalname: 'test.jpg' } as any;
    provider.save.mockResolvedValue('general/test.jpg');

    const result = await service.uploadFile(file, 'general');

    expect(result).toBe('general/test.jpg');
    expect(provider.save).toHaveBeenCalledWith(file, 'general');
  });

  it('should delete file', async () => {
    await service.deleteFile('path/to/file.jpg');
    expect(provider.delete).toHaveBeenCalledWith('path/to/file.jpg');
  });

  it('should get file URL', () => {
    provider.getUrl.mockReturnValue('http://localhost:3000/uploads/test.jpg');
    const url = service.getFileUrl('test.jpg');
    expect(url).toBe('http://localhost:3000/uploads/test.jpg');
  });
});
