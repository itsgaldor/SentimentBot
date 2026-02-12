// Slash command interaction handler
import { Events, Interaction, Client } from 'discord.js';
import { commands } from '../commands/index.js';
import { logger } from '../../config/logger.js';

export function setupInteractionCreateEvent(client: Client): void {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = commands.get(interaction.commandName);

    if (!command) {
      logger.warn({
        msg: 'unknown_command',
        commandName: interaction.commandName,
        guildId: interaction.guildId,
        userId: interaction.user.id,
      });
      return;
    }

    try {
      await command.execute(interaction);

      logger.info({
        msg: 'command_handled',
        command: interaction.commandName,
        guildId: interaction.guildId ?? null,
        userId: interaction.user.id,
      });
    } catch (error) {
      logger.error({
        msg: 'command_error',
        command: interaction.commandName,
        guildId: interaction.guildId ?? null,
        userId: interaction.user.id,
        error: error instanceof Error ? error.message : String(error),
      });

      const reply = interaction.replied || interaction.deferred ? interaction.followUp : interaction.reply;

      await reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      }).catch(() => {
        // Ignore errors when replying fails
      });
    }
  });
}
