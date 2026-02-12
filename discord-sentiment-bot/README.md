# Discord Sentiment Bot

A Discord bot with multi-tenant per-guild isolation, built with TypeScript, Discord.js v14, and PostgreSQL.

> Repository: [https://github.com/itsgaldor/SentimentBot](https://github.com/itsgaldor/SentimentBot)

## Features

- Multi-tenant architecture with per-guild isolation
- PostgreSQL database with migrations
- Structured logging with Pino
- Environment variable validation with Zod
- TypeScript with strict mode
- Slash command support

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+ (or Docker for local development)
- Discord Application and Bot Token

## Discord Setup

### 1. Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name (e.g., "Sentiment Bot")
4. Go to the "Bot" section
5. Click "Add Bot" and confirm
6. Under "Token", click "Reset Token" and copy the token (this is your `DISCORD_TOKEN`)
7. Under "Privileged Gateway Intents", enable "Server Members Intent" if needed (not required for v0.0)
8. Go to "OAuth2" > "General"
9. Copy the "Application ID" (this is your `DISCORD_CLIENT_ID`)

### 2. Invite Bot to Your Server

1. Go to "OAuth2" > "URL Generator"
2. Select scopes:
   - `bot`
   - `applications.commands`
3. Select bot permissions (minimal recommended):
   - Send Messages
   - Use Slash Commands
4. Copy the generated URL and open it in your browser
5. Select your development server and authorize
6. Copy the Server ID (right-click server name > "Copy Server ID") - this is your `DEV_GUILD_ID`

## Local Setup

### 1. Start PostgreSQL

Using Docker Compose (recommended):

```bash
docker compose up -d
```

Or use an existing PostgreSQL instance and update `DATABASE_URL` accordingly.

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in all required values:

```env
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
DEV_GUILD_ID=your_dev_guild_id_here
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/discord_sentiment
NODE_ENV=development
LOG_LEVEL=info
```

### 3. Install Dependencies

```bash
npm ci
```

### 4. Run Migrations

```bash
npm run migrate:up
```

### 5. Register Commands

```bash
npm run commands:register
```

This registers slash commands to your `DEV_GUILD_ID` server.

### 6. Start Development Server

```bash
npm run dev
```

The bot will start and connect to Discord. You should see logs indicating:
- Environment validation success
- Database ping success
- Discord ready event with bot username

### 7. Test the Bot

In your Discord server (the one matching `DEV_GUILD_ID`), type `/ping` and the bot should reply with "pong".

## Available Commands

- `/ping` - Replies with "pong"

## NPM Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Run the built application
- `npm run commands:register` - Register slash commands to DEV_GUILD_ID
- `npm run migrate:up` - Run all pending migrations
- `npm run migrate:down` - Rollback the last migration
- `npm run migrate:create <name>` - Create a new migration file

## Project Structure

```
discord-sentiment-bot/
├── src/
│   ├── index.ts                 # Application entry point
│   ├── config/
│   │   ├── env.ts              # Environment validation
│   │   └── logger.ts           # Pino logger instance
│   ├── db/
│   │   ├── pool.ts             # PostgreSQL connection pool
│   │   └── ping.ts             # Database health check
│   └── bot/
│       ├── client.ts           # Discord client initialization
│       ├── registerCommands.ts # Command registration helper
│       ├── commands/
│       │   ├── index.ts        # Command registry
│       │   └── ping.ts         # Ping command implementation
│       └── events/
│           ├── ready.ts        # Bot ready event handler
│           ├── guildCreate.ts  # Guild join event handler
│           └── interactionCreate.ts # Slash command handler
├── db/
│   └── migrations/             # Database migrations
├── scripts/
│   └── register-commands.ts    # Command registration script
├── .env.example                # Environment template
└── README.md                   # This file
```

## Troubleshooting

### Commands Not Appearing

1. **Check command registration**: Run `npm run commands:register` and verify it completes without errors
2. **Wait for propagation**: Discord commands can take up to 1 hour to propagate globally. For guild-specific commands, they should appear immediately
3. **Verify DEV_GUILD_ID**: Ensure `DEV_GUILD_ID` matches the server where you're testing
4. **Check bot permissions**: Ensure the bot has "Use Slash Commands" permission in the server
5. **Restart Discord**: Sometimes Discord client needs a restart to see new commands

### Database Connection Issues

1. **Check DATABASE_URL**: Verify the connection string format: `postgresql://user:password@host:port/database`
2. **Verify PostgreSQL is running**: `docker ps` or check your PostgreSQL service
3. **Check network**: Ensure the host and port are accessible
4. **Verify credentials**: Ensure username, password, and database name are correct
5. **Check logs**: Look for database connection errors in the application logs

### Bot Not Connecting

1. **Verify DISCORD_TOKEN**: Ensure the token is correct and hasn't been regenerated
2. **Check intents**: Ensure required Gateway Intents are enabled in Discord Developer Portal
3. **Check network**: Ensure the bot can reach Discord API
4. **Review logs**: Check for authentication or connection errors

### Migration Errors

1. **Check database exists**: Ensure the database specified in `DATABASE_URL` exists
2. **Verify permissions**: Ensure the database user has CREATE TABLE permissions
3. **Check migration files**: Ensure migration files are valid TypeScript
4. **Review migration history**: Check `pgmigrations` table for migration state

## Environment Variables

### Required

- `DISCORD_TOKEN` - Discord bot token from Developer Portal
- `DISCORD_CLIENT_ID` - Discord application ID
- `DEV_GUILD_ID` - Discord server ID for command registration
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment mode (`development` or `production`)

### Optional

- `LOG_LEVEL` - Logging level (`trace`, `debug`, `info`, `warn`, `error`, `fatal`). Default: `info`

## Database Schema

### guild_config

Stores per-guild configuration and metadata.

| Column     | Type         | Description                    |
|------------|--------------|--------------------------------|
| guild_id   | TEXT (PK)    | Discord guild/server ID        |
| created_at | TIMESTAMPTZ  | When the guild was first added |
| updated_at | TIMESTAMPTZ  | Last update timestamp          |

## License

ISC
