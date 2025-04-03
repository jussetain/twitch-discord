import { Client as TwitchClient } from 'tmi.js';
import { Client as DiscordClient, Events, GatewayIntentBits, Message, MessageFlags } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const twitchClient = new TwitchClient({
    options: { debug: true },
    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    },
    channels: [process.env.TWITCH_CHANNEL!]
});

const discordClient = new DiscordClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates
    ],
});

discordClient.on('ready', () => {
    console.log(`Discord bot logged in as ${discordClient.user?.tag}`);
});

twitchClient.on('message', async (channel, tags, message, self) => {
    const badgeToEmote = (badges: { [key: string]: string | undefined } | undefined) => {
        let badgesString = '';

        if (badges?.moderator) {
            badgesString += '<:modo:1357337753326456934>';
        }

        if (badges?.vip) {
            badgesString += '<:vip:1357337750503817246>';
        }

        if (badges?.subscriber) {
            badgesString += '🐧';
        }

        if (badges?.partner) {
            badgesString += '<:partner:1357337751799988346>';
        }

        return badgesString;
    }

    if (self) return;

    try {
        const discordChannel = await discordClient.channels.fetch(process.env.DISCORD_CHANNEL_ID!);

        if (discordChannel?.isTextBased() && !discordChannel.isDMBased()) {
            const isMention = message.includes(process.env.TWITCH_USERNAME!);

            const formattedMessage = `${badgeToEmote(tags.badges || {})} **${tags['display-name']}**: ${message.replaceAll(`@${process.env.TWITCH_USERNAME}`, `<@${process.env.USER_ID}>`).replaceAll(`@${process.env.TWITCH_USERNAME}`, `<@${process.env.USER_ID}>`)}`

            await discordChannel.send({
                content: formattedMessage,
                flags: [MessageFlags.SuppressNotifications],
                allowedMentions: isMention ? { parse: ['users', 'roles'] } : { parse: [] }
            });
        }
    } catch (error) {
        console.error('Error forwarding message to Discord:', error);
    }
});

twitchClient.connect().catch(console.error);

discordClient.login(process.env.DISCORD_TOKEN).catch(console.error);

discordClient.on(Events.MessageCreate, async (message: Message) => {
    if (message.channel.id !== process.env.DISCORD_CHANNEL_ID) return;
    if (message.author.id !== process.env.USER_ID) return;

    const { content } = message;

    twitchClient.say(process.env.TWITCH_CHANNEL!, content);
});