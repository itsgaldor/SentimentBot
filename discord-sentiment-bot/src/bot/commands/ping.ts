// Ping command implementation
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with pong');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.reply('pong');
}
