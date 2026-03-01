import type { PrismaClient, Category } from '@prisma/client';

export const INITIAL_CATEGORIES: Array<{ name: string; imageUrl?: string }> = [
  { name: 'Hardware', imageUrl: 'categories/hardware.png' },
  { name: 'PlayStation', imageUrl: 'categories/playstation.png' },
  { name: 'Xbox', imageUrl: 'categories/xbox.png' },
  { name: 'Nintendo', imageUrl: 'categories/nintendo.png' },
  { name: 'Gaming Laptops', imageUrl: 'categories/gaming-laptops.png' },
  { name: 'Accesorios', imageUrl: 'categories/accesorios.png' },
  { name: 'MacBooks', imageUrl: 'categories/macbook.png' },
  { name: 'Celulares', imageUrl: 'categories/celulares.png' },
  { name: 'Realidad Virtual', imageUrl: 'categories/realidad-virtual.png' },
];

export async function seedCategories(
  prisma: PrismaClient,
): Promise<Map<string, Category>> {
  const categoriesMap = new Map<string, Category>();

  for (const cat of INITIAL_CATEGORIES) {
    const { name, imageUrl } = cat;
    const slug = name.toUpperCase();
    const created = await prisma.category.upsert({
      where: { slug },
      update: {
        name,
        description: `${name} products`,
        imageUrl: imageUrl ?? null,
      },
      create: {
        name,
        slug,
        description: `${name} products`,
        imageUrl: imageUrl ?? null,
      },
    });
    categoriesMap.set(slug, created);
    console.log(`  [categories] Created: ${name}`);
  }

  return categoriesMap;
}
