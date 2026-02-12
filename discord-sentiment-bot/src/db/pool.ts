// PostgreSQL connection pool management
import { Pool } from 'pg';
import { getEnv } from '../config/env.js';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (pool) {
    return pool;
  }

  const env = getEnv();
  pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
