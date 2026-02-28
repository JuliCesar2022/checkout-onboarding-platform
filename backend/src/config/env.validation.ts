import * as zod from 'zod';

/**
 * Environment variables schema with validation
 * Validates at startup — fails fast if config is incomplete or invalid
 */
const envSchema = zod.object({
  // ─── Node.js ────────────────────────────────────────────────────────────
  NODE_ENV: zod
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: zod.coerce.number().default(3000),

  // ─── Database (PostgreSQL) ───────────────────────────────────────────────
  DATABASE_URL: zod.string().url(),

  // ─── Wompi Payment Gateway ──────────────────────────────────────────────
  WOMPI_PUBLIC_KEY: zod
    .string()
    .min(1)
    .describe('Wompi public key for frontend tokenization'),

  WOMPI_PRIVATE_KEY: zod
    .string()
    .min(1)
    .describe('Wompi private key for backend transactions'),

  WOMPI_INTEGRITY_KEY: zod
    .string()
    .min(1)
    .describe('Wompi integrity key for webhook verification'),

  WOMPI_BASE_URL: zod
    .string()
    .url()
    .default('https://api-sandbox.co.uat.wompi.dev/v1')
    .describe('Wompi API base URL (sandbox or production)'),

  // ─── Frontend / CORS ─────────────────────────────────────────────────────
  FRONTEND_URL: zod
    .string()
    .url()
    .default('http://localhost:5173')
    .describe('Frontend URL for CORS configuration'),

  // ─── Business Rules / Fees ──────────────────────────────────────────────
  BASE_FEE_IN_CENTS: zod
    .coerce.number()
    .default(150000)
    .describe('Base transaction fee in COP cents (1,500 COP)'),

  DELIVERY_FEE_IN_CENTS: zod
    .coerce.number()
    .default(1000000)
    .describe('Delivery fee in COP cents (10,000 COP)'),
});

export type Env = zod.infer<typeof envSchema>;

/**
 * Validate environment variables at startup
 * @throws Error if validation fails
 */
export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  • ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(
      `\n❌ Environment validation failed:\n${issues}\n`,
    );
  }

  return result.data;
}
