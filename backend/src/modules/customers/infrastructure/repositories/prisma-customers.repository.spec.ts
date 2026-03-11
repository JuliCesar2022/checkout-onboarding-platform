import { Test, TestingModule } from '@nestjs/testing';
import { PrismaCustomersRepository } from './prisma-customers.repository';
import { PrismaService } from '../../../../prisma/prisma.service';

describe('PrismaCustomersRepository', () => {
  let repository: PrismaCustomersRepository;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      customer: {
        findUnique: jest.fn(),
        upsert: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCustomersRepository,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaCustomersRepository>(PrismaCustomersRepository);
  });

  const mockPrismaCustomer = {
    id: 'cust-1',
    email: 'test@test.com',
    name: 'Test Customer',
    phone: '1234567890',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('findById', () => {
    it('should return a customer if found', async () => {
      prisma.customer.findUnique.mockResolvedValue(mockPrismaCustomer);
      const result = await repository.findById('cust-1');
      expect(prisma.customer.findUnique).toHaveBeenCalledWith({ where: { id: 'cust-1' } });
      expect(result).toBeDefined();
      expect(result!.id).toBe('cust-1');
    });

    it('should return null if not found', async () => {
      prisma.customer.findUnique.mockResolvedValue(null);
      const result = await repository.findById('not-found');
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a customer if found', async () => {
      prisma.customer.findUnique.mockResolvedValue(mockPrismaCustomer);
      const result = await repository.findByEmail('test@test.com');
      expect(prisma.customer.findUnique).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
      expect(result).toBeDefined();
      expect(result!.email).toBe('test@test.com');
    });

    it('should return null if not found', async () => {
      prisma.customer.findUnique.mockResolvedValue(null);
      const result = await repository.findByEmail('notfound@test.com');
      expect(result).toBeNull();
    });
  });

  describe('upsertByEmail', () => {
    it('should upsert and return the customer', async () => {
      prisma.customer.upsert.mockResolvedValue(mockPrismaCustomer);
      const result = await repository.upsertByEmail({
        email: 'test@test.com',
        name: 'Test Customer',
        phone: '1234567890',
      });

      expect(prisma.customer.upsert).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
        create: { email: 'test@test.com', name: 'Test Customer', phone: '1234567890' },
        update: { name: 'Test Customer', phone: '1234567890' },
      });
      expect(result.id).toBe('cust-1');
      expect(result.email).toBe('test@test.com');
    });
  });
});
