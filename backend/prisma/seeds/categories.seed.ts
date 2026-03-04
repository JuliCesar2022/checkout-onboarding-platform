import type { PrismaClient, Category } from '@prisma/client';

// Parent categories (groups shown in showcases)
const PARENT_CATEGORIES = [
  {
    name: 'Laptops & Accessories',
    slug: 'LAPTOPS_ACCESSORIES',
    description: 'Laptops, MacBooks and peripherals',
    imageUrl:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  },
  {
    name: 'Gaming',
    slug: 'GAMING',
    description: 'Consoles, controllers and gaming gear',
    imageUrl:
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80',
  },
  {
    name: 'Smartphones & Wearables',
    slug: 'SMARTPHONES_WEARABLES',
    description: 'Phones, VR headsets and accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80',
  },
];

// Child categories mapped to their parent slug
const CHILD_CATEGORIES: Array<{
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentSlug: string;
}> = [
  // Laptops & Accessories
  {
    name: 'Gaming Laptops',
    slug: 'GAMING LAPTOPS',
    description: 'High-performance gaming laptops',
    imageUrl:
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&q=80',
    parentSlug: 'LAPTOPS_ACCESSORIES',
  },
  {
    name: 'MacBooks',
    slug: 'MACBOOKS',
    description: 'Apple MacBook lineup',
    imageUrl:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    parentSlug: 'LAPTOPS_ACCESSORIES',
  },
  {
    name: 'Accesorios',
    slug: 'ACCESORIOS',
    description: 'Gaming peripherals and accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80',
    parentSlug: 'LAPTOPS_ACCESSORIES',
  },
  // Gaming
  {
    name: 'PlayStation',
    slug: 'PLAYSTATION',
    description: 'Sony PlayStation consoles and accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80',
    parentSlug: 'GAMING',
  },
  {
    name: 'Xbox',
    slug: 'XBOX',
    description: 'Microsoft Xbox consoles and accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1628277611952-bb60845a3eeb?w=400&q=80',
    parentSlug: 'GAMING',
  },
  {
    name: 'Nintendo',
    slug: 'NINTENDO',
    description: 'Nintendo consoles and accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&q=80',
    parentSlug: 'GAMING',
  },
  {
    name: 'Hardware',
    slug: 'HARDWARE',
    description: 'PC components and hardware',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    parentSlug: 'GAMING',
  },
  // Smartphones & Wearables
  {
    name: 'Celulares',
    slug: 'CELULARES',
    description: 'Smartphones and mobile phones',
    imageUrl:
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80',
    parentSlug: 'SMARTPHONES_WEARABLES',
  },
  {
    name: 'Realidad Virtual',
    slug: 'REALIDAD VIRTUAL',
    description: 'VR headsets and accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&q=80',
    parentSlug: 'SMARTPHONES_WEARABLES',
  },
];

export async function seedCategories(
  prisma: PrismaClient,
): Promise<Map<string, Category>> {
  const categoriesMap = new Map<string, Category>();

  // 1. Upsert parent categories first
  for (const cat of PARENT_CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        imageUrl: cat.imageUrl,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        imageUrl: cat.imageUrl,
      },
    });
    categoriesMap.set(cat.slug, created);
    console.log(`  [categories] Parent: ${cat.name}`);
  }

  // 2. Upsert child categories linked to their parent
  for (const cat of CHILD_CATEGORIES) {
    const parent = categoriesMap.get(cat.parentSlug);
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        imageUrl: cat.imageUrl,
        parentId: parent?.id ?? null,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        imageUrl: cat.imageUrl,
        parentId: parent?.id ?? null,
      },
    });
    categoriesMap.set(cat.slug, created);
    console.log(`  [categories] Child: ${cat.name} → ${cat.parentSlug}`);
  }

  return categoriesMap;
}
