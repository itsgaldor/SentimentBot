// Command registry for Discord slash commands
import { Collection, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import * as pingCommand from './ping.js';

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const commands = new Collection<string, Command>();

commands.set(pingCommand.data.name, {
  data: pingCommand.data,
  execute: pingCommand.execute,
});
