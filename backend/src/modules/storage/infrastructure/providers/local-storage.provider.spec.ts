import { Test, TestingModule } from '@nestjs/testing';
import { LocalStorageProvider } from './local-storage.provider';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

jest.mock('fs/promises');

describe('LocalStorageProvider', () => {
  let provider: LocalStorageProvider;
  let configService: any;

  beforeEach(async () => {
    configService = {
      get: jest.fn().mockReturnValue('http://localhost:3000'),
    };

    (fs.access as jest.Mock).mockResolvedValue(undefined);
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    (fs.unlink as jest.Mock).mockResolvedValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStorageProvider,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    provider = module.get<LocalStorageProvider>(LocalStorageProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save file and return relative path', async () => {
      const mockFile = {
        originalname: 'test file.png',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const result = await provider.save(mockFile, 'test-folder');

      expect(fs.mkdir).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
      
      // Check that it returned a normalized path with timestamp
      expect(result).toMatch(/^test-folder\/\d+-test-file\.png$/);
    });
  });

  describe('delete', () => {
    it('should delete file if exists', async () => {
      await provider.delete('test-folder/file.png');
      expect(fs.unlink).toHaveBeenCalled();
    });

    it('should handle error if deletion fails', async () => {
      (fs.unlink as jest.Mock).mockRejectedValue(new Error('File not found'));
      
      // Should not throw
      await expect(provider.delete('missing-file.png')).resolves.not.toThrow();
    });
  });

  describe('getUrl', () => {
    it('should return the full URL for the file', () => {
      const url = provider.getUrl('general/file.png');
      expect(url).toBe('http://localhost:3000/uploads/general/file.png');
    });
  });
});
