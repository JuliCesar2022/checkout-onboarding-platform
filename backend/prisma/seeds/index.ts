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

import { seedCategories } from './categories.seed';

export async function runAllSeeds(prisma: PrismaClient): Promise<void> {
  console.log(`\nRunning seed: categories`);
  const categoriesMap = await seedCategories(prisma);

  console.log(`\nRunning seed: products`);
  await seedProducts(prisma, categoriesMap);
}
