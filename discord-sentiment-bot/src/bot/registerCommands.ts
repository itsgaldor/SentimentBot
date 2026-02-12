// Command registration helper for Discord slash commands
import { REST, Routes } from 'discord.js';
import { getEnv } from '../config/env.js';
import { commands } from './commands/index.js';

export async function registerCommands(guildId: string): Promise<void> {
  const env = getEnv();

  const rest = new REST().setToken(env.DISCORD_TOKEN);

  const commandsData = commands.map((command) => command.data.toJSON());

  try {
    await rest.put(Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, guildId), {
      body: commandsData,
    });
  } catch (error) {
    throw new Error(`Failed to register commands: ${error instanceof Error ? error.message : String(error)}`);
  }
}
