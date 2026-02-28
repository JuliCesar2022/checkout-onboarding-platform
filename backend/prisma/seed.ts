import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const products = [
  {
    name: 'Wireless Headphones Pro',
    description:
      'Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    priceInCents: 29900000, // 299,000 COP
    stock: 10,
  },
  {
    name: 'Mechanical Keyboard RGB',
    description:
      'Compact 75% mechanical keyboard with Cherry MX switches and per-key RGB lighting.',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    priceInCents: 18500000, // 185,000 COP
    stock: 8,
  },
  {
    name: 'USB-C Hub 7-in-1',
    description:
      'Multiport adapter with 4K HDMI, 3x USB-A, SD card reader, and 100W PD charging.',
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c228b42b8c?w=400',
    priceInCents: 8900000, // 89,000 COP
    stock: 25,
  },
  {
    name: 'Ergonomic Mouse',
    description:
      'Vertical ergonomic mouse designed to reduce wrist strain. Silent clicks, 6 programmable buttons.',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    priceInCents: 12500000, // 125,000 COP
    stock: 15,
  },
  {
    name: '4K Webcam',
    description:
      'Ultra HD 4K webcam with auto-focus, built-in noise-cancelling mic, and privacy shutter.',
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
    priceInCents: 22000000, // 220,000 COP
    stock: 6,
  },
];

async function main() {
  console.log('Seeding database...');

  // Clear existing products
  await prisma.product.deleteMany();

  // Insert dummy products
  for (const product of products) {
    await prisma.product.create({ data: product });
    console.log(`  Created: ${product.name}`);
  }

  console.log(`Seed complete. ${products.length} products inserted.`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
