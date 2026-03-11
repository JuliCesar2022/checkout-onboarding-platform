import { Test, TestingModule } from '@nestjs/testing';
import { StorageController } from './storage.controller';
import { StorageService } from '../../application/storage.service';

describe('StorageController', () => {
  let controller: StorageController;
  let storageService: any;

  beforeEach(async () => {
    storageService = {
      uploadFile: jest.fn(),
      getFileUrl: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [
        {
          provide: StorageService,
          useValue: storageService,
        },
      ],
    }).compile();

    controller = module.get<StorageController>(StorageController);
  });

  describe('uploadFile', () => {
    it('should upload a file and return the result', async () => {
      const mockFile = {
        originalname: 'test.png',
        size: 1024,
      };

      storageService.uploadFile.mockResolvedValue('general/test.png');
      storageService.getFileUrl.mockReturnValue('http://localhost:3000/uploads/general/test.png');

      const result: any = await controller.uploadFile(mockFile as Express.Multer.File, 'general');

      expect(storageService.uploadFile).toHaveBeenCalledWith(mockFile, 'general');
      expect(storageService.getFileUrl).toHaveBeenCalledWith('general/test.png');
      
      expect(result.path).toBe('general/test.png');
      expect(result.url).toBe('http://localhost:3000/uploads/general/test.png');
      expect(result.filename).toBe('test.png');
      expect(result.size).toBe(1024);
    });
  });
});
