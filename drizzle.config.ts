import { defineConfig } from 'drizzle-kit';

// DATABASE_URL comes from Vercel Postgres (Storage tab -> Create Database,
// or `vercel postgres create`) via `vercel env pull` into .env.local for
// local development. See .env.example for details.
export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
