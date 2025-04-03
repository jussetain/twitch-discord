# twitch-tchat-replica

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

⚠️ Don't forget to create a .env file with the appropriates values (example in .env.example)

TWITCH_USERNAME: name of your bot
TWITCH_OAUTH_TOKEN: token for your bot
TWITCH_CHANNEL: channel you want to be in
DISCORD_TOKEN: your discord app token
DISCORD_SERVER_ID: the id of the server (not used i think)
DISCORD_CHANNEL_ID: the channel you want to interact with
USER_ID: your discord user id (the one you'll be using to send messages to twitch)
