// Database health check utility
import { getPool } from './pool.js';
import { logger } from '../config/logger.js';

export async function pingDatabase(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT NOW()');
    logger.info({ msg: 'db_ping_ok', timestamp: result.rows[0].now });
  } finally {
    client.release();
  }
}
