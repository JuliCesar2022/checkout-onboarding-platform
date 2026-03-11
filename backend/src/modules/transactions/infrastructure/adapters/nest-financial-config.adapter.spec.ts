import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NestFinancialConfigAdapter } from './nest-financial-config.adapter';
import { FINANCIAL_CONSTANTS } from '../../domain/constants/financial.constant';

describe('NestFinancialConfigAdapter', () => {
  let adapter: NestFinancialConfigAdapter;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    configService = {
      get: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NestFinancialConfigAdapter,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    adapter = module.get<NestFinancialConfigAdapter>(NestFinancialConfigAdapter);
  });

  describe('getTransactionFeeInCents', () => {
    it('should return value from config if exists', () => {
      configService.get.mockReturnValue(2500);
      expect(adapter.getTransactionFeeInCents()).toBe(2500);
    });

    it('should return default constant if config is null', () => {
      configService.get.mockReturnValue(null);
      expect(adapter.getTransactionFeeInCents()).toBe(
        FINANCIAL_CONSTANTS.DEFAULT.TRANSACTION_FEE_IN_CENTS
      );
    });
  });

  describe('getDeliveryFeeInCents', () => {
    it('should return value from config', () => {
      configService.get.mockReturnValue(5000);
      expect(adapter.getDeliveryFeeInCents()).toBe(5000);
    });
  });
});
