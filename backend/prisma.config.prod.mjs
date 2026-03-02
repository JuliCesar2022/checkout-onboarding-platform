// Production Prisma config (ESM) — used only inside Docker by prisma migrate deploy.
// The main prisma.config.ts is used for local dev with ts-node.
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
