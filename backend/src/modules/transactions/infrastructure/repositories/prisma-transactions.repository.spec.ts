import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PrismaTransactionsRepository } from './prisma-transactions.repository';
import { TransactionMapper } from '../mappers/transaction.mapper';

describe('PrismaTransactionsRepository', () => {
  let repository: PrismaTransactionsRepository;
  let prisma: any;

  const mockPrismaTx = {
    id: 't1',
    reference: 'REF1',
    status: 'PENDING',
    totalAmountInCents: 1000,
    currency: 'COP',
    items: [],
    payment: null,
    breakdown: [],
  };

  beforeEach(async () => {
    prisma = {
      transaction: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      transactionItem: {
        createMany: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaTransactionsRepository,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaTransactionsRepository>(PrismaTransactionsRepository);
  });

  describe('create', () => {
    it('should create a transaction with items', async () => {
      const data: any = {
        reference: 'REF1',
        totalAmountInCents: 1000,
        customerId: 'c1',
        breakdown: [{ concept: 'SUBTOTAL', amountInCents: 1000 }],
        items: [{ productId: 'p1', quantity: 1, unitPriceInCents: 1000 }],
      };

      prisma.transaction.create.mockResolvedValue({ id: 't1', ...data });
      prisma.transaction.findUnique.mockResolvedValue({
        id: 't1',
        ...data,
        items: [{ productId: 'p1', quantity: 1 }],
      });

      const result = await repository.create(data);

      expect(prisma.transaction.create).toHaveBeenCalled();
      expect(prisma.transactionItem.createMany).toHaveBeenCalled();
      expect(result.id).toBe('t1');
    });

    it('should create a transaction without items', async () => {
      const data: any = {
        reference: 'REF2',
        totalAmountInCents: 500,
        customerId: 'c2',
        breakdown: [],
        items: [],
      };

      prisma.transaction.create.mockResolvedValue({ id: 't2', ...data });

      const result = await repository.create(data);

      expect(prisma.transaction.create).toHaveBeenCalled();
      expect(prisma.transactionItem.createMany).not.toHaveBeenCalled();
      expect(result.id).toBe('t2');
    });
  });

  describe('findById', () => {
    it('should return transaction if found', async () => {
      prisma.transaction.findUnique.mockResolvedValue(mockPrismaTx);
      const result = await repository.findById('t1');
      expect(result?.id).toBe('t1');
    });

    it('should return null if not found', async () => {
      prisma.transaction.findUnique.mockResolvedValue(null);
      const result = await repository.findById('999');
      expect(result).toBeNull();
    });
  });

  describe('findByReference', () => {
    it('should find by reference', async () => {
      prisma.transaction.findUnique.mockResolvedValue(mockPrismaTx);
      const result = await repository.findByReference('REF1');
      expect(result?.reference).toBe('REF1');
    });
  });

  describe('updateStatus', () => {
    it('should update status and payment details', async () => {
      const updatedTx = { ...mockPrismaTx, status: 'APPROVED' };
      prisma.transaction.update.mockResolvedValue(updatedTx);

      const result = await repository.updateStatus('t1', 'APPROVED', {
        gatewayId: 'w1',
        gatewayResponse: { ok: true },
      });

      expect(prisma.transaction.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 't1' },
          data: expect.objectContaining({ status: 'APPROVED' }),
        })
      );
      expect(result.status).toBe('APPROVED');
    });
  });
});
