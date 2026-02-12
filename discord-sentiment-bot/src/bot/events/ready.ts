// Bot ready event handler
import { Events, Client } from 'discord.js';
import { logger } from '../../config/logger.js';

export function setupReadyEvent(client: Client): void {
  client.once(Events.ClientReady, (readyClient) => {
    logger.info({
      msg: 'discord_ready',
      userId: readyClient.user.id,
      username: readyClient.user.username,
    });
  });
}
