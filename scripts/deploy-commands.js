require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { commands } = require('../src/config/commands');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId) {
  console.error('Missing DISCORD_TOKEN or CLIENT_ID in .env');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    // Deploy all commands to guild
    if (guildId) {
      console.log('Registering all commands to guild', guildId);
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      console.log('✅ Guild commands registered:', commands.map(c => c.name).join(', '));
    } else {
      console.error('⚠️  GUILD_ID not set, cannot register guild commands');
      process.exit(1);
    }
    
    console.log('\n✅ All commands deployed successfully!');
  } catch (err) {
    console.error('Failed to register commands:', err);
    process.exit(1);
  }
})();

