// Shared Drizzle/Neon client for every api/*.ts serverless function that
// touches the database. Neon's HTTP driver has no connection pool to manage
// (unlike a traditional pg.Pool), so it's safe to build fresh per
// invocation — no cold-start connection-setup penalty and no risk of
// exhausting Postgres's connection limit under concurrent invocations.
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../../db/schema.js';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL is not set. See .env.example.');
}

const sql = neon(url);
export const db = drizzle(sql, { schema });
