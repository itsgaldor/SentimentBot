// Guild join event handler - handles new server additions
import { Events, Guild, Client } from 'discord.js';
import { getPool } from '../../db/pool.js';
import { logger } from '../../config/logger.js';

export function setupGuildCreateEvent(client: Client): void {
  client.on(Events.GuildCreate, async (guild: Guild) => {
    try {
      const pool = getPool();
      await pool.query(
        `INSERT INTO guild_config (guild_id, created_at, updated_at)
         VALUES ($1, NOW(), NOW())
         ON CONFLICT (guild_id)
         DO UPDATE SET updated_at = NOW()`,
        [guild.id]
      );

      logger.info({
        msg: 'guild_upserted',
        guildId: guild.id,
        guildName: guild.name,
      });
    } catch (error) {
      logger.error({
        msg: 'guild_upsert_failed',
        guildId: guild.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}
