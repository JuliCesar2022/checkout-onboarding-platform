import type { PrismaClient, Category } from '@prisma/client';

// Parent categories (groups shown in showcases)
const PARENT_CATEGORIES = [
  {
    name: 'Laptops & Accessories',
    slug: 'LAPTOPS_ACCESSORIES',
    description: 'Laptops, MacBooks and peripherals',
    imageUrl: 'categories/laptops-accessories.png',
  },
  {
    name: 'Gaming',
    slug: 'GAMING',
    description: 'Consoles, controllers and gaming gear',
    imageUrl: 'categories/gaming.png',
  },
  {
    name: 'Smartphones & Wearables',
    slug: 'SMARTPHONES_WEARABLES',
    description: 'Phones, VR headsets and accessories',
    imageUrl: 'categories/smartphones-wearables.png',
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
    imageUrl: 'categories/gaming-laptops.png',
    parentSlug: 'LAPTOPS_ACCESSORIES',
  },
  {
    name: 'MacBooks',
    slug: 'MACBOOKS',
    description: 'Apple MacBook lineup',
    imageUrl: 'categories/macbook.png',
    parentSlug: 'LAPTOPS_ACCESSORIES',
  },
  {
    name: 'Accesorios',
    slug: 'ACCESORIOS',
    description: 'Gaming peripherals and accessories',
    imageUrl: 'categories/accesorios.png',
    parentSlug: 'LAPTOPS_ACCESSORIES',
  },
  // Gaming
  {
    name: 'PlayStation',
    slug: 'PLAYSTATION',
    description: 'Sony PlayStation consoles and accessories',
    imageUrl: 'categories/playstation.png',
    parentSlug: 'GAMING',
  },
  {
    name: 'Xbox',
    slug: 'XBOX',
    description: 'Microsoft Xbox consoles and accessories',
    imageUrl: 'categories/xbox.png',
    parentSlug: 'GAMING',
  },
  {
    name: 'Nintendo',
    slug: 'NINTENDO',
    description: 'Nintendo consoles and accessories',
    imageUrl: 'categories/nintendo.png',
    parentSlug: 'GAMING',
  },
  {
    name: 'Hardware',
    slug: 'HARDWARE',
    description: 'PC components and hardware',
    imageUrl: 'categories/hardware.png',
    parentSlug: 'GAMING',
  },
  // Smartphones & Wearables
  {
    name: 'Celulares',
    slug: 'CELULARES',
    description: 'Smartphones and mobile phones',
    imageUrl: 'categories/celulares.png',
    parentSlug: 'SMARTPHONES_WEARABLES',
  },
  {
    name: 'Realidad Virtual',
    slug: 'REALIDAD VIRTUAL',
    description: 'VR headsets and accessories',
    imageUrl: 'categories/realidad-virtual.png',
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
      update: { name: cat.name, description: cat.description, imageUrl: cat.imageUrl },
      create: { slug: cat.slug, name: cat.name, description: cat.description, imageUrl: cat.imageUrl },
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
