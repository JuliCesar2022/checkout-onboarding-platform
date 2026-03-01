import type { PrismaClient, Category } from '@prisma/client';

export const INITIAL_CATEGORIES = [
  'Hardware',
  'PlayStation',
  'Xbox',
  'Nintendo',
  'Gaming Laptops',
  'Accesorios',
  'MacBooks',
  'Celulares',
  'Realidad Virtual',
] as const;

export async function seedCategories(
  prisma: PrismaClient,
): Promise<Map<string, Category>> {
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
