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

**Slash Commands**


- **Register commands:** Use the provided deploy script to register the `/neko` command to your guild (guild-scoped commands update immediately):

```bash
npm run deploy-commands
```

- **Create a reaction-role message:**


Use `/neko reaction setup` to post a new message where reactions will grant roles. Options:

- `channel` — the channel to post in (mention)
- `title` — the message title text


Example (Discord UI):

/neko reaction setup channel:#roles title:"Choose your roles"

The bot will post a message and reply with the `messageId`.

- **Add an emoji-role mapping:**


Use `/neko reaction add` to add an emoji → role pair to an existing reaction-role message. Options:

- `message_id` — the ID of the reaction-role message created earlier
- `emoji` — unicode emoji (e.g. `👍`) or custom emoji in `<:name:id>` form
- `role` — choose a role from the dropdown


Example (Discord UI):

/neko reaction add message_id:123456789012345678 emoji:👍 role:@Member

Behavior:
- The bot will edit the posted message to include the new emoji→role line and attempt to react with the emoji.
- Mappings are persisted in `reactionRoles.json` so the bot will act on reactions after restarts.

- **Remove a mapping by line number:**


  Use `/neko reaction delete` to delete a specific mapping line from a reaction-role message. The command removes the line from the message, deletes the mapping from `reactionRoles.json`, and removes the reaction from the message.

  Options:

  - `message_id` — the ID of the reaction-role message
  - `line` — the 1-based mapping line number (1 = first mapping listed under the title)

  Example (Discord UI):

  /neko reaction delete message_id:123456789012345678 line:2

  Notes:

  - Line numbers count only the mapping lines (the first mapping is line 1). The command assumes there is a blank line after the title and the mapping lines follow.
  - The bot needs `Manage Messages` to remove reactions and `Manage Roles` to manage role mappings.

Permissions required:
- Bot: `Send Messages`, `Add Reactions`, `Manage Roles`, `Manage Messages`, and `Read Messages/View Channel` in the target channel.
- Bot's role must be higher than any role it will assign.

**Fun Commands**

- `/nekogiggle` — sends a random meme image in the channel.

Example:

/nekogiggle

You can pass optional keywords to narrow the meme selection (the bot uses `https://api.apileague.com/retrieve-random-meme` when configured):

/nekogiggle keywords:cat,airplane

To use the external API, set `MEME_API_KEY` in your `.env` (the key is optional; the bot falls back to bundled images).

# slayerai
