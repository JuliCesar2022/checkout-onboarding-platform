import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL URL'),
  WOMPI_PRIVATE_KEY: z.string().min(1, 'WOMPI_PRIVATE_KEY is required'),
  WOMPI_PUBLIC_KEY: z.string().min(1, 'WOMPI_PUBLIC_KEY is required'),
  WOMPI_INTEGRITY_KEY: z.string().min(1, 'WOMPI_INTEGRITY_KEY is required'),
  WOMPI_BASE_URL: z
    .string()
    .url()
    .default('https://api-sandbox.co.uat.wompi.dev/v1'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  BASE_FEE_IN_CENTS: z.coerce.number().default(150000),     // 1500 COP
  DELIVERY_FEE_IN_CENTS: z.coerce.number().default(1000000), // 10000 COP
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    const formatted = result.error.format();
    throw new Error(
      `Environment validation failed:\n${JSON.stringify(formatted, null, 2)}`,
    );
  }
  return result.data;
}
