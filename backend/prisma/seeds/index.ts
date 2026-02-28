import type { PrismaClient } from '@prisma/client';
import { seedProducts } from './products.seed';

/**
 * Seed Orchestrator
 * Register all seed functions here in order of execution.
 * Seeds run sequentially to respect foreign key constraints.
 *
 * To add a new seed:
 *   1. Create `prisma/seeds/your-entity.seed.ts`
 *   2. Export a `seedYourEntity(prisma: PrismaClient)` function
 *   3. Import it here and add it to the `seeds` array below
 */

type SeedFn = (prisma: PrismaClient) => Promise<void>;

const seeds: { name: string; fn: SeedFn }[] = [
  { name: 'products', fn: seedProducts },
  // { name: 'customers', fn: seedCustomers }, // Add when needed
  // { name: 'transactions', fn: seedTransactions }, // Only for dev fixtures
];

export async function runAllSeeds(prisma: PrismaClient): Promise<void> {
  for (const seed of seeds) {
    console.log(`\nRunning seed: ${seed.name}`);
    await seed.fn(prisma);
  }
}
