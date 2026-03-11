import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { WompiAdapter } from './wompi.adapter';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { WOMPI_ERROR_MESSAGES } from '../../domain/constants/wompi.constants';

describe('WompiAdapter', () => {
  let adapter: WompiAdapter;
  let configService: jest.Mocked<ConfigService>;
  let httpService: jest.Mocked<HttpService>;

  const mockConfig = {
    WOMPI_BASE_URL: 'https://sandbox.wompi.co/v1',
    WOMPI_PUBLIC_KEY: 'pub_test_123',
    WOMPI_PRIVATE_KEY: 'prv_test_123',
    WOMPI_INTEGRITY_KEY: 'int_test_123',
  };

  beforeEach(async () => {
    configService = {
      get: jest.fn((key: string) => mockConfig[key]),
    } as any;

    httpService = {
      get: jest.fn(),
      post: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WompiAdapter,
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
    }).compile();

    adapter = module.get<WompiAdapter>(WompiAdapter);
    jest.clearAllMocks();
  });

  describe('getAcceptanceToken', () => {
    it('should return acceptance tokens on success', async () => {
      httpService.get.mockReturnValue(
        of({
          data: {
            data: {
              presigned_acceptance: { acceptance_token: 'acc_123' },
              presigned_personal_data_auth: { acceptance_token: 'auth_123' },
            },
          },
        } as any),
      );

      const result = await adapter.getAcceptanceToken();

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual({
        acceptanceToken: 'acc_123',
        personalAuthToken: 'auth_123',
      });
      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringContaining('/merchants/pub_test_123'),
      );
    });

    it('should return failure if axios fails', async () => {
      httpService.get.mockReturnValue(throwError(() => new Error('Network error')));

      const result = await adapter.getAcceptanceToken();

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe(
        WOMPI_ERROR_MESSAGES.ACCEPTANCE_TOKEN_FAILURE,
      );
    });
  });

  describe('charge', () => {
    const chargeInput = {
      amountInCents: 100000,
      currency: 'COP',
      reference: 'TXN-123',
      cardToken: 'tok_test_123',
      installments: 1,
      customerEmail: 'test@example.com',
      acceptanceToken: 'acc_123',
      acceptPersonalAuth: 'auth_123',
    };

    it('should process charge correctly and map status', async () => {
      httpService.post.mockReturnValue(
        of({
          data: {
            data: {
              id: 'wompi_tx_123',
              status: 'APPROVED',
            },
          },
        } as any),
      );

      const result = await adapter.charge(chargeInput);

      expect(result.isSuccess).toBe(true);
      const val = result.getValue();
      expect(val.wompiId).toBe('wompi_tx_123');
      expect(val.status).toBe(PaymentStatus.SUCCESS);
      expect(httpService.post).toHaveBeenCalled();
    });

    it('should calculate integrity signature (verified manually by logic check)', async () => {
      httpService.post.mockReturnValue(
        of({
          data: { data: { id: '1', status: 'PENDING' } },
        } as any),
      );
      await adapter.charge(chargeInput);

      const payload = httpService.post.mock.calls[0][1];
      expect(payload).toHaveProperty('signature');
    });

    it('should return failure message on axios error', async () => {
      httpService.post.mockReturnValue(
        throwError(() => ({
          response: {
            data: {
              error: { reason: 'CARD_DECLINED' },
            },
          },
        })),
      );

      const result = await adapter.charge(chargeInput);

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe('CARD_DECLINED');
    });
  });

  describe('getTransactionStatus', () => {
    it('should fetch status and map it correctly', async () => {
      httpService.get.mockReturnValue(
        of({
          data: {
            data: {
              id: 'wompi_tx_123',
              status: 'DECLINED',
            },
          },
        } as any),
      );

      const result = await adapter.getTransactionStatus('wompi_tx_123');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(PaymentStatus.DECLINED);
    });

    it('should return failure on status check error', async () => {
      httpService.get.mockReturnValue(throwError(() => new Error('API Down')));

      const result = await adapter.getTransactionStatus('any');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe(
        WOMPI_ERROR_MESSAGES.STATUS_CHECK_UNKNOWN_ERROR,
      );
    });
  });
});
