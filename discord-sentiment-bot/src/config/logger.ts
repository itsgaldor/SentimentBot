// Pino logger configuration
import pino from 'pino';

function createLogger() {
  try {
    // Use process.env directly here to avoid circular dependency
    // getEnv() will be called properly in index.ts before logger is used
    const nodeEnv = process.env.NODE_ENV || 'development';
    const logLevel = process.env.LOG_LEVEL || 'info';

    return pino({
      level: logLevel,
      transport:
        nodeEnv === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'HH:MM:ss.l',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    });
  } catch (error) {
    // Fallback logger if initialization fails
    return pino({
      level: 'info',
    });
  }
}

export const logger = createLogger();
