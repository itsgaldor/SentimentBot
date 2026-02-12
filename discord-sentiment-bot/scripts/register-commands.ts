// Script to register Discord slash commands
import 'dotenv/config';
import { getEnv } from '../src/config/env.js';
import { registerCommands } from '../src/bot/registerCommands.js';
import { logger } from '../src/config/logger.js';

async function main(): Promise<void> {
  try {
    const env = getEnv();
    logger.info({ msg: 'registering_commands', guildId: env.DEV_GUILD_ID });
    await registerCommands(env.DEV_GUILD_ID);
    logger.info({ msg: 'commands_registered_successfully' });
    process.exit(0);
  } catch (error) {
    logger.error({
      msg: 'command_registration_failed',
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

main();
