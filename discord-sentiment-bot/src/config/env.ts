// Environment variable validation using Zod
import { z } from 'zod';

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, 'DISCORD_TOKEN is required'),
  DISCORD_CLIENT_ID: z.string().min(1, 'DISCORD_CLIENT_ID is required'),
  DEV_GUILD_ID: z.string().min(1, 'DEV_GUILD_ID is required'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  NODE_ENV: z.enum(['development', 'production'], {
    errorMap: () => ({ message: 'NODE_ENV must be "development" or "production"' }),
  }),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).optional().default('info'),
});

export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

export function getEnv(): Env {
  if (validatedEnv) {
    return validatedEnv;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join('\n');
    throw new Error(`Environment validation failed:\n${errors}`);
  }

  validatedEnv = result.data;
  return validatedEnv;
}
