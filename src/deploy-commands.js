require('dotenv').config();
const { REST, Routes } = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId || !guildId) {
  console.error('Missing DISCORD_TOKEN, CLIENT_ID or GUILD_ID in .env');
  process.exit(1);
}

const commands = [
  {
    name: 'neko',
    description: 'Neko utilities',
    options: [
      {
        name: 'reaction',
        description: 'Reaction role management',
        type: 2, // SUB_COMMAND_GROUP
        options: [
          {
            name: 'setup',
            description: 'Create a new reaction-role message',
            type: 1, // SUB_COMMAND
            options: [
              { name: 'channel', description: 'Channel to post the message in', type: 7, required: true },
              { name: 'title', description: 'Title text for the message', type: 3, required: true }
            ]
          },
          {
            name: 'add',
            description: 'Add an emoji-role pair to an existing reaction-role message',
            type: 1,
            options: [
              { name: 'message_id', description: 'ID of the reaction-role message', type: 3, required: true },
              { name: 'emoji', description: 'Emoji to use (unicode or <:name:id>)', type: 3, required: true },
              { name: 'role', description: 'Role to assign', type: 8, required: true }
            ]
          },
          {
            name: 'delete',
            description: 'Remove an emoji-role mapping from a reaction-role message by line number',
            type: 1,
            options: [
              { name: 'message_id', description: 'ID of the reaction-role message', type: 3, required: true },
              { name: 'line', description: 'Line number to remove (1 = first mapping line)', type: 4, required: true }
            ]
          }
        ]
      }
    ]
  }
];

// Add a simple top-level command to send a random meme
commands.push({
  name: 'nekogiggle',
  description: 'Send a random meme image',
  options: [
    { name: 'keywords', description: 'Comma-separated keywords to search for in the meme', type: 3, required: false }
  ]
});

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Registering commands to guild', guildId);
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log('Commands registered.');
  } catch (err) {
    console.error('Failed to register commands:', err);
    process.exit(1);
  }
})();
