import type { PrismaClient } from '@prisma/client';

const data = [
  // ── HARDWARE ──
  {
    sku: 'HW-MB-001',
    name: 'ASUS ROG Maximus Z790',
    category: 'HARDWARE' as const,
    description: 'High-end gaming motherboard with Intel Z790 chipset, DDR5 support, and PCIe 5.0.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    priceInCents: 65000000,
    stock: 5,
  },
  {
    sku: 'HW-GPU-001',
    name: 'NVIDIA GeForce RTX 4090',
    category: 'HARDWARE' as const,
    description: 'Flagship GPU with 24 GB GDDR6X, ray tracing and DLSS 3 for ultimate 4K gaming.',
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80',
    priceInCents: 550000000,
    stock: 3,
  },
  // ── PLAYSTATION ──
  {
    sku: 'PS-CON-001',
    name: 'PlayStation 5 Console',
    category: 'PLAYSTATION' as const,
    description: 'The latest Sony PlayStation 5 with Ultra HD Blu-ray disc drive and DualSense wireless controller.',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80',
    priceInCents: 250000000,
    stock: 10,
  },
  {
    sku: 'PS-CTR-001',
    name: 'DualSense Edge Controller',
    category: 'PLAYSTATION' as const,
    description: 'Ultra-customizable wireless controller with swappable modules and back buttons.',
    imageUrl: 'https://images.unsplash.com/photo-1592840062661-a5a7f78e2056?w=600&q=80',
    priceInCents: 35000000,
    stock: 18,
  },
  // ── XBOX ──
  {
    sku: 'XB-CON-001',
    name: 'Xbox Series X',
    category: 'XBOX' as const,
    description: 'The fastest, most powerful Xbox ever. Play thousands of titles from four generations of consoles.',
    imageUrl: 'https://images.unsplash.com/photo-1621259182978-f09e5e2ca791?w=600&q=80',
    priceInCents: 230000000,
    stock: 8,
  },
  {
    sku: 'XB-CTR-001',
    name: 'Xbox Elite Series 2 Controller',
    category: 'XBOX' as const,
    description: 'Pro controller with hair trigger locks, wrap-around rubberized grip and adjustable tension thumbsticks.',
    imageUrl: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&q=80',
    priceInCents: 45000000,
    stock: 12,
  },
  // ── NINTENDO ──
  {
    sku: 'NT-CON-001',
    name: 'Nintendo Switch OLED',
    category: 'NINTENDO' as const,
    description: '7-inch OLED screen, 64 GB internal storage, and enhanced audio in handheld and tabletop modes.',
    imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&q=80',
    priceInCents: 150000000,
    stock: 15,
  },
  {
    sku: 'NT-CTR-001',
    name: 'Nintendo Joy-Con Neon',
    category: 'NINTENDO' as const,
    description: 'Neon red and blue Joy-Con controllers with HD rumble and motion controls.',
    imageUrl: 'https://images.unsplash.com/photo-1619364726002-a2b8f5657ae4?w=600&q=80',
    priceInCents: 28000000,
    stock: 25,
  },
  // ── GAMING LAPTOPS ──
  {
    sku: 'LP-ROG-001',
    name: 'ASUS ROG Strix G16',
    category: 'GAMING LAPTOPS' as const,
    description: 'Gaming laptop with Intel Core i9, NVIDIA GeForce RTX 4070, and 165Hz QHD display.',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
    priceInCents: 180000000,
    stock: 3,
  },
  {
    sku: 'LP-RZR-001',
    name: 'Razer Blade 16',
    category: 'GAMING LAPTOPS' as const,
    description: 'Ultra-thin gaming laptop with RTX 4080, dual-mode Mini LED display and per-key RGB.',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    priceInCents: 280000000,
    stock: 4,
  },
  // ── ACCESORIOS ──
  {
    sku: 'AC-HDS-001',
    name: 'HyperX Cloud II Wireless',
    category: 'ACCESORIOS' as const,
    description: 'Legendary comfort and sound with 7.1 virtual surround sound and detachable noise-cancelling microphone.',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80',
    priceInCents: 12000000,
    stock: 20,
  },
  {
    sku: 'AC-MSE-001',
    name: 'Logitech G Pro X Superlight 2',
    category: 'ACCESORIOS' as const,
    description: 'Ultra-lightweight wireless gaming mouse at 60g with HERO 2 25K sensor.',
    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80',
    priceInCents: 9500000,
    stock: 30,
  },
  // ── MACBOOKS ──
  {
    sku: 'MB-AIR-001',
    name: 'MacBook Air M3',
    category: 'MACBOOKS' as const,
    description: 'Supercharged by M3 chip, 13.6-inch Liquid Retina display, and up to 18 hours of battery life.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    priceInCents: 110000000,
    stock: 7,
  },
  {
    sku: 'MB-PRO-001',
    name: 'MacBook Pro 14" M3 Pro',
    category: 'MACBOOKS' as const,
    description: 'M3 Pro chip, Liquid Retina XDR display, 11-core CPU and 14-core GPU.',
    imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80',
    priceInCents: 185000000,
    stock: 5,
  },
  // ── CELULARES ──
  {
    sku: 'CEL-IP-001',
    name: 'iPhone 16 Pro Max',
    category: 'CELULARES' as const,
    description: 'A18 Pro chip, 6.9-inch Super Retina XDR display, titanio y cámara de 48 MP con Fusion Camera.',
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80',
    priceInCents: 280000000,
    stock: 12,
  },
  {
    sku: 'CEL-SAM-001',
    name: 'Samsung Galaxy S25 Ultra',
    category: 'CELULARES' as const,
    description: 'Snapdragon 8 Elite, pantalla Dynamic AMOLED 2X de 6.9" y S Pen integrado.',
    imageUrl: 'https://images.unsplash.com/photo-1662947995689-7a8a37cd4949?w=600&q=80',
    priceInCents: 260000000,
    stock: 9,
  },
  // ── REALIDAD VIRTUAL ──
  {
    sku: 'VR-MET-001',
    name: 'Meta Quest 3',
    category: 'REALIDAD VIRTUAL' as const,
    description: 'Mixed reality headset with Snapdragon XR2 Gen 2, 2064×2208 per eye and infinite virtual display.',
    imageUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&q=80',
    priceInCents: 120000000,
    stock: 8,
  },
  {
    sku: 'VR-SON-001',
    name: 'PlayStation VR2',
    category: 'REALIDAD VIRTUAL' as const,
    description: 'OLED display 2000×2040 per eye, foveated rendering, Sense controllers y feedback adaptativo.',
    imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&q=80',
    priceInCents: 145000000,
    stock: 6,
  },
];

const CATEGORY_IMAGE_POOL = {
  'HARDWARE': [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80',
    'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&q=80',
    'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=600&q=80',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80',
  ],
  'PLAYSTATION': [
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80',
    'https://images.unsplash.com/photo-1592840062661-a5a7f78e2056?w=600&q=80',
    'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=600&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
  ],
  'XBOX': [
    'https://images.unsplash.com/photo-1621259182978-f09e5e2ca791?w=600&q=80',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&q=80',
    'https://images.unsplash.com/photo-1593640408182-31c228b29976?w=600&q=80',
  ],
  'NINTENDO': [
    'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&q=80',
    'https://images.unsplash.com/photo-1619364726002-a2b8f5657ae4?w=600&q=80',
    'https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?w=600&q=80',
  ],
  'GAMING LAPTOPS': [
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80',
  ],
  'ACCESORIOS': [
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80',
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80',
  ],
  'MACBOOKS': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80',
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&q=80',
  ],
  'CELULARES': [
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80',
    'https://images.unsplash.com/photo-1662947995689-7a8a37cd4949?w=600&q=80',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80',
  ],
  'REALIDAD VIRTUAL': [
    'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&q=80',
    'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&q=80',
    'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=600&q=80',
  ],
};

const EXTRA_PRODUCTS_PER_CATEGORY = 30;

export async function seedProducts(
  prisma: PrismaClient,
  categoriesMap: Map<string, any>,
): Promise<void> {
  const generatedData: any[] = [];

  const categoryKeys = Array.from(categoriesMap.keys());

  for (const category of categoryKeys) {
    for (let i = 1; i <= EXTRA_PRODUCTS_PER_CATEGORY; i++) {
      generatedData.push({
        sku: `${category.replace(/\s+/g, '').substring(0, 4).toUpperCase()}-GEN-${i.toString().padStart(3, '0')}`,
        name: `Producto Genérico ${category} #${i}`,
        category: category,
        description: `Este es un producto generado automáticamente para la categoría ${category}, ideal para complementar tu compra.`,
        imageUrl: CATEGORY_IMAGE_POOL[category as keyof typeof CATEGORY_IMAGE_POOL]?.[i % CATEGORY_IMAGE_POOL[category as keyof typeof CATEGORY_IMAGE_POOL].length] ?? `https://picsum.photos/seed/${category.replace(/\s+/g, '')}${i}/400/400`,
        priceInCents: Math.floor(Math.random() * 900000) * 100 + 5000000, // random price between 50k and 95m cop approx, nicely rounded
        stock: Math.floor(Math.random() * 50) + 5,
      });
    }
  }

  const allProducts = [...data, ...generatedData];

  for (const productData of allProducts) {
    const { category, ...rest } = productData;
    const categoryModel = categoriesMap.get(category);

    if (!categoryModel) {
      console.warn(
        `Category ${category} not found during seeding for product ${rest.sku}`,
      );
      continue;
    }

    await prisma.product.upsert({
      where: { sku: rest.sku },
      update: {
        name: rest.name,
        description: rest.description,
        imageUrl: rest.imageUrl,
        priceInCents: rest.priceInCents,
        stock: rest.stock,
        category: { connect: { id: categoryModel.id } },
      },
      create: {
        sku: rest.sku,
        name: rest.name,
        description: rest.description,
        imageUrl: rest.imageUrl,
        priceInCents: rest.priceInCents,
        stock: rest.stock,
        category: { connect: { id: categoryModel.id } },
      },
    });
  }
  console.log(`  [products] Seeded ${allProducts.length} successfully.`);
}
