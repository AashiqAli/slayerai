# Discord Reaction Roles Bot

A Discord.js bot that automatically assigns and removes roles when users react to configured messages.

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Create a `.env` file** and set the following variables:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
```

3. **Register slash commands:**

```bash
npm run deploy-commands
```

This registers the guild-scoped slash commands to your Discord server.

4. **Start the bot:**

```bash
npm start
```

## Slash Commands

All commands require **Manage Server** or **Manage Roles** permission.

### `/neko reaction setup`

Creates a new reaction-role message in the specified channel.

**Options:**
- `channel` — The channel to post the message in (channel mention)
- `title` — The title/header text for the message

**Example:**
```
/neko reaction setup channel:#roles title:"Choose your roles"
```

The bot will post a message and reply with the `messageId` that you'll need for adding roles.

### `/neko reaction add`

Adds an emoji → role mapping to an existing reaction-role message.

**Options:**
- `message_id` — The ID of the reaction-role message (from setup command)
- `emoji` — Unicode emoji (e.g., `👍`) or custom emoji in `<:name:id>` format
- `role` — The role to assign (role picker)

**Example:**
```
/neko reaction add message_id:123456789012345678 emoji:👍 role:@Member
```

The bot will:
- Edit the message to include the new emoji → role line
- Add the emoji as a reaction to the message
- Save the mapping to `reactionRoles.json`

### `/neko reaction delete`

Removes a specific line from a reaction-role message.

**Options:**
- `message_id` — The ID of the reaction-role message
- `line` — The line number to remove (1-based index)

**Example:**
```
/neko reaction delete message_id:123456789012345678 line:2
```

The bot will:
- Remove the specified line from the message
- Remove the emoji reaction from the message
- Delete the mapping from `reactionRoles.json`

**Note:** Line numbers are 1-based and count all lines in the message content.

## Manual Configuration (Alternative)

You can also manually edit `reactionRoles.json` to configure reaction roles:

```json
[
  {
    "guildId": "YOUR_GUILD_ID",
    "channelId": "CHANNEL_ID_TO_POST_TO",
    "messageId": "MESSAGE_ID_AFTER_POSTING",
    "content": "**Choose your roles**\n\n👍 — <@&ROLE_ID_FOR_MEMBER>\n❤️ — <@&ROLE_ID_FOR_SUPPORTER>",
    "roles": {
      "👍": "ROLE_ID_FOR_MEMBER",
      "❤️": "ROLE_ID_FOR_SUPPORTER"
    }
  }
]
```

Then use the publish script to post the message:

```bash
npm run publish
```

## Permissions Required

### Bot Permissions
- `Send Messages` — To post reaction-role messages
- `Read Messages/View Channel` — To read messages and reactions
- `Add Reactions` — To add emoji reactions
- `Manage Messages` — To edit messages and remove reactions
- `Manage Roles` — To assign/remove roles to users

### Role Hierarchy
- The bot's role must be **higher** than any role it will assign in the server's role hierarchy.

### User Permissions
- Users need **Manage Server** or **Manage Roles** permission to use the `/neko` commands.

## How It Works

1. When a user reacts to a configured message, the bot checks if the emoji is mapped to a role.
2. If a mapping exists, the bot automatically assigns or removes the role based on whether the reaction was added or removed.
3. All mappings are persisted in `reactionRoles.json`, so the bot remembers configurations after restarts.

## Emoji Format

- **Unicode emojis:** Use directly (e.g., `👍`, `❤️`, `🎮`)
- **Custom emojis:** Use the format `<:name:id>` (e.g., `<:custom_emoji:123456789012345678>`)
- The bot must have access to custom emojis (same guild or Nitro permissions)

## Scripts

- `npm start` — Run the bot
- `npm run deploy-commands` — Register/update slash commands (requires `DISCORD_TOKEN`, `CLIENT_ID`, and `GUILD_ID` in `.env`)
- `npm run publish` — Post configured reaction-role messages from `reactionRoles.json` and update `messageId` fields

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | Yes | Your Discord bot token |
| `CLIENT_ID` | Yes (for deploy) | Your bot's application/client ID |
| `GUILD_ID` | Yes (for deploy) | Target guild ID for command registration |

## Troubleshooting

- **Role not assigned:** Check that the bot's role is higher than the target role in the server settings.
- **Reaction not working:** Ensure the message ID in `reactionRoles.json` matches the actual message ID.
- **Commands not appearing:** Run `npm run deploy-commands` and wait a few minutes for Discord to update.
- **Permission errors:** Verify the bot has all required permissions in the target channel.
