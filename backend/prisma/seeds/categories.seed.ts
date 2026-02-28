import type { PrismaClient, Category } from '@prisma/client';

export const INITIAL_CATEGORIES = [
  'Audio',
  'Peripherals',
  'Networking',
] as const;

export async function seedCategories(
  prisma: PrismaClient,
): Promise<Map<string, Category>> {
  await prisma.category.deleteMany();

  const categoriesMap = new Map<string, Category>();

  for (const name of INITIAL_CATEGORIES) {
    const slug = name.toUpperCase();
    const created = await prisma.category.create({
      data: { name, slug, description: `${name} products` },
    });
    categoriesMap.set(slug, created);
    console.log(`  [categories] Created: ${name}`);
  }

  return categoriesMap;
}
