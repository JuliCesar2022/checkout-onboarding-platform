import type { PrismaClient } from '@prisma/client';

const data = [
  {
    sku: 'HW-MB-001',
    name: 'ASUS ROG Maximus Z790',
    category: 'HARDWARE' as const,
    description:
      'High-end gaming motherboard with Intel Z790 chipset, DDR5 support, and PCIe 5.0.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
    priceInCents: 65000000,
    stock: 5,
  },
  {
    sku: 'PS-CON-001',
    name: 'PlayStation 5 Console',
    category: 'PLAYSTATION' as const,
    description:
      'The latest Sony PlayStation 5 with Ultra HD Blu-ray disc drive and DualSense wireless controller.',
    imageUrl:
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
    priceInCents: 250000000,
    stock: 10,
  },
  {
    sku: 'XB-CON-001',
    name: 'Xbox Series X',
    category: 'XBOX' as const,
    description:
      'The fastest, most powerful Xbox ever. Play thousands of titles from four generations of consoles.',
    imageUrl:
      'https://images.unsplash.com/photo-1621259182978-f09e5e2ca791?w=400',
    priceInCents: 230000000,
    stock: 8,
  },
  {
    sku: 'NT-CON-001',
    name: 'Nintendo Switch OLED',
    category: 'NINTENDO' as const,
    description:
      '7-inch OLED screen, 64 GB internal storage, and enhanced audio in handheld and tabletop modes.',
    imageUrl:
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400',
    priceInCents: 150000000,
    stock: 15,
  },
  {
    sku: 'LP-ROG-001',
    name: 'ASUS ROG Strix G16',
    category: 'GAMING LAPTOPS' as const,
    description:
      'Gaming laptop with Intel Core i9, NVIDIA GeForce RTX 4070, and 165Hz QHD display.',
    imageUrl:
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
    priceInCents: 180000000,
    stock: 3,
  },
  {
    sku: 'AC-HDS-001',
    name: 'HyperX Cloud II Wireless',
    category: 'ACCESORIOS' as const,
    description:
      'Legendary comfort and sound with 7.1 virtual surround sound and detachable noise-cancelling microphone.',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
    priceInCents: 12000000,
    stock: 20,
  },
  {
    sku: 'MB-AIR-001',
    name: 'MacBook Air M3',
    category: 'MACBOOKS' as const,
    description:
      'Supercharged by M3 chip, 13.6-inch Liquid Retina display, and up to 18 hours of battery life.',
    imageUrl:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    priceInCents: 110000000,
    stock: 7,
  },
];

export async function seedProducts(
  prisma: PrismaClient,
  categoriesMap: Map<string, any>,
): Promise<void> {
  await prisma.product.deleteMany();

  for (const productData of data) {
    const { category, ...rest } = productData;
    const categoryModel = categoriesMap.get(category);

    if (!categoryModel) {
      throw new Error(`Category ${category} not found during seeding`);
    }

    await prisma.product.create({
      data: {
        ...rest,
        category: { connect: { id: categoryModel.id } },
      },
    });
    console.log(`  [products] Created: ${rest.sku} — ${rest.name}`);
  }
}
