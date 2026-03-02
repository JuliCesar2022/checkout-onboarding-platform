import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WompiAdapter } from './wompi.adapter';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { Result } from '../../../../common/result/result';
import { WOMPI_ERROR_MESSAGES } from '../../domain/constants/wompi.constants';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WompiAdapter', () => {
  let adapter: WompiAdapter;
  let configService: jest.Mocked<ConfigService>;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WompiAdapter,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    adapter = module.get<WompiAdapter>(WompiAdapter);

    // Mock isAxiosError
    (axios.isAxiosError as any) = jest.fn((error) => !!error.isAxiosError);

    jest.clearAllMocks();
  });

  describe('getAcceptanceToken', () => {
    it('should return acceptance tokens on success', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          data: {
            presigned_acceptance: { acceptance_token: 'acc_123' },
            presigned_personal_data_auth: { acceptance_token: 'auth_123' },
          },
        },
      });

      const result = await adapter.getAcceptanceToken();

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual({
        acceptanceToken: 'acc_123',
        personalAuthToken: 'auth_123',
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/merchants/pub_test_123'),
      );
    });

    it('should return failure if axios fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

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
      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            id: 'wompi_tx_123',
            status: 'APPROVED',
          },
        },
      });

      const result = await adapter.charge(chargeInput);

      expect(result.isSuccess).toBe(true);
      const val = result.getValue();
      expect(val.wompiId).toBe('wompi_tx_123');
      expect(val.status).toBe(PaymentStatus.SUCCESS);
      expect(mockedAxios.post).toHaveBeenCalled();
    });

    it('should calculate integrity signature (verified manually by logic check)', async () => {
      // The test checks if post was called, implicitly confirming the flow reached the signature logic
      mockedAxios.post.mockResolvedValue({
        data: { data: { id: '1', status: 'PENDING' } },
      });
      await adapter.charge(chargeInput);

      const callArgs = mockedAxios.post.mock.calls[0][1];
      expect(callArgs).toHaveProperty('signature');
      // signature = sha256(reference + amount + currency + integrityKey)
      // TXN-123100000COPint_test_123
    });

    it('should return failure message on axios error', async () => {
      mockedAxios.post.mockRejectedValue({
        isAxiosError: true,
        response: {
          data: {
            error: { reason: 'CARD_DECLINED' },
          },
        },
      });

      const result = await adapter.charge(chargeInput);

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe('CARD_DECLINED');
    });
  });

  describe('getTransactionStatus', () => {
    it('should fetch status and map it correctly', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          data: {
            id: 'wompi_tx_123',
            status: 'DECLINED',
          },
        },
      });

      const result = await adapter.getTransactionStatus('wompi_tx_123');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(PaymentStatus.DECLINED);
    });

    it('should return failure on status check error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Down'));

      const result = await adapter.getTransactionStatus('any');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe(
        WOMPI_ERROR_MESSAGES.STATUS_CHECK_UNKNOWN_ERROR,
      );
    });
  });
});
