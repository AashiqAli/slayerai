# Discord Reaction Roles Bot

Minimal example Discord.js bot that assigns/removes roles when users react to a configured message.

Setup

1. Install dependencies:

```bash
cd "$(dirname "$0")" || exit
cd ../"\"$(pwd)\"" || true
npm install
```

Simpler:

```bash
npm install
```

2. Create a `.env` file from `.env.example` and set `DISCORD_TOKEN`.

3. Edit `reactionRoles.json` to include your `guildId`, `channelId`, and mappings from emoji to role ID. Use Unicode emoji (e.g. `"👍"`) or formatted custom emoji like `<:name:123456789012345678>`.

Example entry:

```json
{
  "guildId": "YOUR_GUILD_ID",
  "channelId": "CHANNEL_ID_TO_POST_TO",
  "messageId": null,
  "content": "React below to get roles:\n\n👍 — Member\n❤️ — Supporter",
  "roles": {
    "👍": "ROLE_ID_FOR_MEMBER",
    "❤️": "ROLE_ID_FOR_SUPPORTER"
  }
}
```

4. Run the publisher to post the message and add reactions (this will update `messageId`):

```bash
npm run publish
```

5. Start the bot (it will listen for add/remove reactions and assign/remove roles):

```bash
npm start
```

Permissions & notes
- Bot needs `Manage Roles` and `Read Messages/View Channel`, `Add Reactions`, `Manage Messages` (optional) in the target channel.
- Role assignment will fail if the bot's highest role is not above the target role.
- For custom emoji use the exact `<:name:id>` string in `reactionRoles.json` and ensure the bot can use that emoji (same guild or Nitro permissions).

If you want a slash-command workflow to create messages instead, tell me and I can add a simple admin slash command.
# slayerai
