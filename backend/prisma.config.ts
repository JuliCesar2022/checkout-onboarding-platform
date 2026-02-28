import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Prisma 7 Configuration
 * Datasource URL goes here, NOT in schema.prisma
 */

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
