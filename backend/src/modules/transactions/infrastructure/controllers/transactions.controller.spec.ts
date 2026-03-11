import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from '../../application/transactions.service';
import { Result } from '../../../../common/result/result';
import { CreateTransactionDto } from '../../application/dto/create-transaction.dto';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: any;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      syncStatus: jest.fn(),
      findById: jest.fn(),
      findByReference: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  describe('create', () => {
    it('should create a transaction and return response', async () => {
      const dto = new CreateTransactionDto();
      const mockResult = { id: 'tx-1', status: 'PENDING' };
      service.create.mockResolvedValue(Result.ok(mockResult));

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('syncStatus', () => {
    it('should sync a transaction and return response', async () => {
      const mockResult = { id: 'tx-1', status: 'APPROVED' };
      service.syncStatus.mockResolvedValue(Result.ok(mockResult));

      const result = await controller.syncStatus('tx-1');
      expect(service.syncStatus).toHaveBeenCalledWith('tx-1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('findById', () => {
    it('should return a transaction by id', async () => {
      const mockResult = { id: 'tx-1', status: 'PENDING' };
      service.findById.mockResolvedValue(Result.ok(mockResult));

      const result = await controller.findById('tx-1');
      expect(service.findById).toHaveBeenCalledWith('tx-1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('findByReference', () => {
    it('should return a transaction by reference', async () => {
      const mockResult = { id: 'tx-1', reference: 'ref-1', status: 'PENDING' };
      service.findByReference.mockResolvedValue(Result.ok(mockResult));

      const result = await controller.findByReference('ref-1');
      expect(service.findByReference).toHaveBeenCalledWith('ref-1');
      expect(result).toEqual(mockResult);
    });
  });
});
