// Application entry point for Discord Sentiment Bot
import { getEnv } from './config/env.js';
import { logger } from './config/logger.js';
import { pingDatabase } from './db/ping.js';
import { closePool } from './db/pool.js';
import { createClient } from './bot/client.js';
import { setupReadyEvent } from './bot/events/ready.js';
import { setupGuildCreateEvent } from './bot/events/guildCreate.js';
import { setupInteractionCreateEvent } from './bot/events/interactionCreate.js';

async function bootstrap(): Promise<void> {
  try {
    // Validate environment variables
    getEnv();
    logger.info({ msg: 'env_validated' });

    // Initialize database connection and ping
    await pingDatabase();

    // Create and configure Discord client
    const client = createClient();

    // Setup event handlers
    setupReadyEvent(client);
    setupGuildCreateEvent(client);
    setupInteractionCreateEvent(client);

    // Start the bot
    const env = getEnv();
    await client.login(env.DISCORD_TOKEN);
  } catch (error) {
    logger.fatal({
      msg: 'bootstrap_failed',
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info({ msg: 'shutting_down' });
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info({ msg: 'shutting_down' });
  await closePool();
  process.exit(0);
});

bootstrap();
