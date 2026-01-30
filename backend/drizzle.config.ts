import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' }); // Explicitly load .env

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is not set in .env or environment variables.');
}
if (!TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN is not set in .env or environment variables.');
}

export default {
  schema: './schema.ts',
  out: './drizzle', // Directory for migrations
  driver: 'libsql',
  dbCredentials: {
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  },
} satisfies Config;