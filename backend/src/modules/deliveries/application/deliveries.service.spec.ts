import { Test, TestingModule } from '@nestjs/testing';
import { DeliveriesService } from './deliveries.service';
import { IDeliveriesRepository } from '../domain/repositories/deliveries.repository';
import { DeliveryEntity } from '../domain/entities/delivery.entity';

describe('DeliveriesService', () => {
  let service: DeliveriesService;
  let repository: jest.Mocked<IDeliveriesRepository>;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findByTransactionId: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveriesService,
        {
          provide: IDeliveriesRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<DeliveriesService>(DeliveriesService);
  });

  describe('findByTransactionId', () => {
    it('should return delivery if found', async () => {
      const entity = new DeliveryEntity({
        id: '1',
        transactionId: 'tx_123',
        address: 'Calle 123',
        city: 'Medellin',
      });
      repository.findByTransactionId.mockResolvedValue(entity);

      const result = await service.findByTransactionId('tx_123');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().transactionId).toBe('tx_123');
    });

    it('should return failure if not found', async () => {
      repository.findByTransactionId.mockResolvedValue(null);

      const result = await service.findByTransactionId('non_existent');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toContain('No delivery found');
    });
  });
});
