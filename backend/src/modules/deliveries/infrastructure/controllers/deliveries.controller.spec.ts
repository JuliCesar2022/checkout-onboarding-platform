import { Test, TestingModule } from '@nestjs/testing';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from '../../application/deliveries.service';
import { Result } from '../../../../common/result/result';

describe('DeliveriesController', () => {
  let controller: DeliveriesController;
  let service: any;

  beforeEach(async () => {
    service = {
      findByTransactionId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveriesController],
      providers: [
        {
          provide: DeliveriesService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<DeliveriesController>(DeliveriesController);
  });

  describe('findByTransactionId', () => {
    it('should return delivery data if found', async () => {
      const mockDelivery = {
        transactionId: 'tx-1',
        shippingAddress: '123 Main St',
        deliveryMethod: 'STANDARD',
        status: 'PENDING',
      };
      service.findByTransactionId.mockResolvedValue(Result.ok(mockDelivery));

      const result = await controller.findByTransactionId('tx-1');

      expect(service.findByTransactionId).toHaveBeenCalledWith('tx-1');
      expect(result).toEqual(mockDelivery);
    });
  });
});
