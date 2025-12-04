require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');

const reactionRolesPath = path.join(__dirname, '..', 'data', 'reactionRoles.json');

let reactionRoles = [];
try {
  reactionRoles = JSON.parse(fs.readFileSync(reactionRolesPath, 'utf8'));
} catch (err) {
  console.error('Failed to read reactionRoles.json:', err.message);
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('clientReady', async () => {
  console.log(`Logged in as ${client.user.tag} — publishing reaction role messages`);
  let modified = false;
  
  for (const cfg of reactionRoles) {
    try {
      if (!cfg.channelId) {
        console.warn('Skipping entry without channelId');
        continue;
      }
      
      const channel = await client.channels.fetch(cfg.channelId).catch(() => null);
      if (!channel || !channel.isTextBased()) {
        console.warn('Channel not found or not text-based:', cfg.channelId);
        continue;
      }

      if (cfg.messageId) {
        console.log('Message already published for channel', cfg.channelId);
        continue;
      }

      const sent = await channel.send({ content: cfg.content || 'React to get roles' });
      
      for (const emoji of Object.keys(cfg.roles)) {
        try {
          await sent.react(emoji);
        } catch (err) {
          console.warn('Failed to react with', emoji, ':', err.message);
        }
      }
      
      cfg.messageId = sent.id;
      modified = true;
      console.log('Published reaction message in', cfg.channelId, 'messageId=', sent.id);
    } catch (err) {
      console.error('Error publishing entry:', err);
    }
  }

  if (modified) {
    fs.writeFileSync(reactionRolesPath, JSON.stringify(reactionRoles, null, 2), 'utf8');
    console.log('Updated reactionRoles.json with messageId(s)');
  }
  
  console.log('Done — exiting.');
  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);

