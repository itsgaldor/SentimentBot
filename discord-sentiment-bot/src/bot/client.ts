// Discord client initialization
import { Client, GatewayIntentBits } from 'discord.js';
import { getEnv } from '../config/env.js';

export function createClient(): Client {
  const env = getEnv();

  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  return client;
}
