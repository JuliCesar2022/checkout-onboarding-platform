import type { PrismaClient } from '@prisma/client';

const data = [
  {
    // TEST CASE 1: PREMIUM — high price, low stock → VIP customer conversion
    sku: 'HP-AUDIO-001',
    name: 'Wireless Headphones Pro',
    category: 'AUDIO' as const,
    description:
      'Premium noise-cancelling wireless headphones with 30-hour battery life. Active noise cancellation with 10 levels.',
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    priceInCents: 29900000, // 299,000 COP
    stock: 2,
  },
  {
    // TEST CASE 2: MID-RANGE — normal price, normal stock
    sku: 'KB-PERIPH-001',
    name: 'Mechanical Keyboard RGB',
    category: 'PERIPHERALS' as const,
    description:
      'Compact 75% mechanical keyboard with Cherry MX switches and per-key RGB lighting. Hot-swappable switches.',
    imageUrl:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    priceInCents: 18500000, // 185,000 COP
    stock: 8,
  },
  {
    // TEST CASE 3: BUDGET — low price, high stock → high volume orders
    sku: 'HUB-NET-001',
    name: 'USB-C Hub 7-in-1',
    category: 'NETWORKING' as const,
    description:
      'Multiport adapter with 4K HDMI, 3x USB-A, SD card reader, and 100W PD charging. Aluminum construction.',
    imageUrl:
      'https://images.unsplash.com/photo-1593640408182-31c228b42b8c?w=400',
    priceInCents: 8900000, // 89,000 COP
    stock: 50,
  },
  {
    // TEST CASE 4: CRITICAL STOCK — stock = 1 → "Last unit" badge in UI
    sku: 'MOUSE-PERIPH-001',
    name: 'Ergonomic Mouse',
    category: 'PERIPHERALS' as const,
    description:
      'Vertical ergonomic mouse designed to reduce wrist strain. Silent clicks, 6 programmable buttons, wireless.',
    imageUrl:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    priceInCents: 12500000, // 125,000 COP
    stock: 1,
  },
  {
    // TEST CASE 5: OUT OF STOCK — stock = 0 → "Pay" button disabled in UI
    sku: 'WEBCAM-PERIPH-001',
    name: '4K Webcam',
    category: 'PERIPHERALS' as const,
    description:
      'Ultra HD 4K webcam with auto-focus, built-in noise-cancelling mic, and privacy shutter. USB 3.0.',
    imageUrl:
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
    priceInCents: 22000000, // 220,000 COP
    stock: 0,
  },
  {
    // BONUS: ULTRA-BUDGET — impulse buy candidate
    sku: 'CABLE-NET-001',
    name: 'Premium USB-C Cable 2m',
    category: 'NETWORKING' as const,
    description:
      '100W USB-C to USB-C cable with fast charging and data transfer. Nylon braided, durable.',
    imageUrl:
      'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400',
    priceInCents: 2500000, // 25,000 COP
    stock: 100,
  },
];

export async function seedProducts(prisma: PrismaClient): Promise<void> {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create standard categories
  const categoriesMap = new Map<string, string>();
  for (const name of ['Audio', 'Peripherals', 'Networking']) {
    const slug = name.toUpperCase();
    const created = await prisma.category.create({
      data: { name, slug, description: `${name} products` },
    });
    categoriesMap.set(slug, created.id);
    console.log(`  [categories] Created: ${name}`);
  }

  for (const productData of data) {
    const { category, ...rest } = productData;
    const categoryId = categoriesMap.get(category);

    if (!categoryId) {
      throw new Error(`Category ${category} not found during seeding`);
    }

    await prisma.product.create({
      data: {
        ...rest,
        category: { connect: { id: categoryId } },
      },
    });
    console.log(`  [products] Created: ${rest.sku} — ${rest.name}`);
  }
}
