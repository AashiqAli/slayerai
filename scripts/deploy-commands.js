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
    // Deploy all commands to guild only (neko + neko-public)
    if (guildId) {
      console.log('Registering all commands to guild', guildId);
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      console.log('✅ Guild commands registered:', commands.map(c => c.name).join(', '));
    } else {
      console.error('⚠️  GUILD_ID not set, cannot register guild commands');
      process.exit(1);
    }
    
    // Remove neko-public from global commands if it exists
    try {
      const globalCommands = await rest.get(Routes.applicationCommands(clientId));
      const nekoPublicGlobal = globalCommands.find(c => c.name === 'neko-public');
      if (nekoPublicGlobal) {
        console.log('\nRemoving neko-public from global commands...');
        await rest.delete(Routes.applicationCommand(clientId, nekoPublicGlobal.id));
        console.log('✅ Removed neko-public from global commands');
      }
    } catch (err) {
      // Ignore if no global commands or deletion fails
      console.log('ℹ️  No global neko-public command found or already removed');
    }
    
    console.log('\n✅ All commands deployed successfully!');
  } catch (err) {
    console.error('Failed to register commands:', err);
    process.exit(1);
  }
})();

