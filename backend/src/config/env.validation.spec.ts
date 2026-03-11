import { validateEnv } from './env.validation';

describe('env.validation', () => {
  const validConfig = {
    NODE_ENV: 'development',
    PORT: '3000',
    DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
    WOMPI_PUBLIC_KEY: 'pub_test_123',
    WOMPI_PRIVATE_KEY: 'prv_test_456',
    WOMPI_INTEGRITY_KEY: 'int_test_789',
    FRONTEND_URL: 'http://localhost:5173',
    REDIS_URL: 'redis://localhost:6379',
  };

  it('should validate a correct configuration', () => {
    const result = validateEnv(validConfig);
    expect(result.PORT).toBe(3000);
    expect(result.NODE_ENV).toBe('development');
  });

  it('should throw an error if required fields are missing', () => {
    const incompleteConfig = { PORT: '3000' };
    expect(() => validateEnv(incompleteConfig)).toThrow(/Environment validation failed/);
  });

  it('should throw an error if fields have invalid formats', () => {
    const invalidConfig = {
      ...validConfig,
      DATABASE_URL: 'not-a-url',
    };
    expect(() => validateEnv(invalidConfig)).toThrow(/DATABASE_URL/);
  });

  it('should use default values for optional fields', () => {
    const { PORT, ...minimalConfig } = validConfig;
    const result = validateEnv(minimalConfig as any);
    expect(result.PORT).toBe(3000); // Default value
  });

  it('should coerce numeric strings to numbers', () => {
    const result = validateEnv({
      ...validConfig,
      TRANSACTION_FEE_IN_CENTS: '500',
    });
    expect(result.TRANSACTION_FEE_IN_CENTS).toBe(500);
  });
});
