import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { ICustomersRepository } from '../domain/repositories/customers.repository';
import { CustomerEntity } from '../domain/entities/customer.entity';

describe('CustomersService', () => {
  let service: CustomersService;
  let repository: jest.Mocked<ICustomersRepository>;

  beforeEach(async () => {
    repository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      upsertByEmail: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: ICustomersRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  describe('upsertByEmail', () => {
    it('should upsert and return customer DTO', async () => {
      const entity = new CustomerEntity({
        id: '1',
        email: 'test@example.com',
        name: 'Test Customer',
        phone: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      repository.upsertByEmail.mockResolvedValue(entity);

      const dto = {
        email: 'test@example.com',
        name: 'Test Customer',
        phone: '1234567890',
      };
      const result = await service.upsertByEmail(dto);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().email).toBe('test@example.com');
      expect(repository.upsertByEmail).toHaveBeenCalledWith(dto);
    });
  });

  describe('findById', () => {
    it('should return customer if found', async () => {
      const entity = new CustomerEntity({ id: '1', email: 'test@example.com' });
      repository.findById.mockResolvedValue(entity);

      const result = await service.findById('1');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().id).toBe('1');
    });

    it('should return failure if not found', async () => {
      repository.findById.mockResolvedValue(null);

      const result = await service.findById('999');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toContain('not found');
    });
  });
});
