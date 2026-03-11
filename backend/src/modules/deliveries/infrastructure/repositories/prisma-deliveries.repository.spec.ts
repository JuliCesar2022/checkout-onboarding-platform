import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PrismaDeliveriesRepository } from './prisma-deliveries.repository';

describe('PrismaDeliveriesRepository', () => {
  let repository: PrismaDeliveriesRepository;
  let prisma: any;

  const mockDelivery = {
    id: 'del-1',
    transactionId: 'tx-1',
    customerId: 'cust-1',
    address: 'Calle 123',
    addressDetail: 'Apt 101',
    city: 'Bogota',
    state: 'Cundinamarca',
    postalCode: '110111',
    country: 'Colombia',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      delivery: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaDeliveriesRepository,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaDeliveriesRepository>(PrismaDeliveriesRepository);
  });

  describe('create', () => {
    it('should create a delivery record', async () => {
      prisma.delivery.create.mockResolvedValue(mockDelivery);

      const data = {
        transactionId: 'tx-1',
        customerId: 'cust-1',
        address: 'Calle 123',
        addressDetail: 'Apt 101',
        city: 'Bogota',
        state: 'Cundinamarca',
        postalCode: '110111',
      };

      const result = await repository.create(data);

      expect(prisma.delivery.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          transactionId: 'tx-1',
          city: 'Bogota',
        }),
      });
      expect(result.id).toBe('del-1');
    });
  });

  describe('findByTransactionId', () => {
    it('should return delivery if found', async () => {
      prisma.delivery.findUnique.mockResolvedValue(mockDelivery);

      const result = await repository.findByTransactionId('tx-1');

      expect(prisma.delivery.findUnique).toHaveBeenCalledWith({
        where: { transactionId: 'tx-1' },
      });
      expect(result?.id).toBe('del-1');
    });

    it('should return null if not found', async () => {
      prisma.delivery.findUnique.mockResolvedValue(null);
      const result = await repository.findByTransactionId('tx-non-existent');
      expect(result).toBeNull();
    });
  });
});
