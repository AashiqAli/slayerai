require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');

const reactionRolesPath = path.join(__dirname, '..', 'reactionRoles.json');
let reactionRoles = [];
try {
  reactionRoles = JSON.parse(fs.readFileSync(reactionRolesPath, 'utf8'));
} catch (err) {
  console.warn('Could not read reactionRoles.json:', err.message);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember]
});

client.once('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

const saveReactionRoles = () => {
  try {
    fs.writeFileSync(reactionRolesPath, JSON.stringify(reactionRoles, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save reactionRoles.json:', err);
  }
};

// Note: static fallback images removed — memes are fetched from external API only

// A minimal fallback image when the API fails
const FALLBACK_MEME = 'https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/158003452121/original/21NzgM8F5bJtqrUPt0RHU60taR_yiffpQg.png?1762538072';

// Try retrieving a random meme from external API, fall back to local pool
async function fetchRandomMeme(keywords) {
  const apiKey = process.env.MEME_API_KEY;
  const params = new URLSearchParams();
  if (apiKey) params.set('api-key', apiKey);
  params.set('media-type', 'image');
  if (keywords) params.set('keywords', keywords);
  // Prefer keywords-in-image when keywords are provided
  if (keywords) params.set('keywords-in-image', 'true');
  const apiUrl = 'https://api.apileague.com/retrieve-random-meme' + (params.toString() ? `?${params.toString()}` : '');
  try {
    const res = await fetch(apiUrl, { method: 'GET', headers: { Accept: 'application/json' } });
    if (res.ok) {
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (ct.includes('application/json')) {
        const data = await res.json();
        // common fields
        const candidates = ['url', 'image', 'image_url', 'link', 'data', 'result'];
        for (const k of candidates) {
          if (!data) continue;
          if (typeof data[k] === 'string' && data[k].startsWith('http')) {
            return { url: data[k], description: data.description || null, raw: data };
          }
          if (data[k] && typeof data[k] === 'object') {
            if (typeof data[k].url === 'string' && data[k].url.startsWith('http')) {
              return {
                url: data[k].url,
                description: data.description || data[k].description || null,
                type: data.type || data[k].type || null,
                width: data.width || data[k].width || null,
                height: data.height || data[k].height || null,
                raw: data
              };
            }
          }
        }
        // deep-search for any string that looks like a URL
        const findUrl = (obj) => {
          if (!obj) return null;
          if (typeof obj === 'string' && obj.startsWith('http')) return obj;
          if (typeof obj === 'object') {
            for (const v of Object.values(obj)) {
              const found = findUrl(v);
              if (found) return found;
            }
          }
          return null;
        };
        const found = findUrl(data);
        if (found) return { url: found, description: data.description || null, raw: data };
        // if data contains url at top-level, return structured object
        if (data.url && typeof data.url === 'string') {
          return {
            url: data.url,
            description: data.description || null,
            type: data.type || null,
            width: data.width || null,
            height: data.height || null,
            raw: data
          };
        }
      } else {
        const text = await res.text();
        if (text && text.trim().startsWith('http')) return { url: text.trim(), description: null, raw: text };
      }
    }
  } catch (err) {
    console.warn('fetchRandomMeme failed:', err && err.message ? err.message : err);
  }
  // fallback to a reliable image
  return { url: FALLBACK_MEME, description: null, raw: null };
}

client.on('interactionCreate', async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    // Handle /neko-public giggle command
    if (interaction.commandName === 'neko-public') {
      let sub = null;
      try { sub = interaction.options.getSubcommand(); } catch (e) { sub = null; }

      if (sub === 'giggle') {
        const keywords = interaction.options.getString('keywords');
        const res = await fetchRandomMeme(keywords);
        const url = typeof res === 'string' ? res : (res && res.url ? res.url : null);
        const desc = (res && res.description) ? res.description : null;
        if (!url) {
          await interaction.reply({ content: 'Could not find a meme right now, try again later.' });
          return;
        }
        const embed = new EmbedBuilder().setImage(url);
        if (desc) embed.setDescription(desc);
        await interaction.reply({ embeds: [embed] });
      }
      return;
    }

    // Handle /neko command (reaction roles)
    if (interaction.commandName !== 'neko') return;

    // Determine subcommand group and subcommand safely
    let group = null;
    let sub = null;
    try { group = interaction.options.getSubcommandGroup(); } catch (e) { group = null; }
    try { sub = interaction.options.getSubcommand(); } catch (e) { sub = null; }

    // reaction group handling
    if (group !== 'reaction') return;
    if (!sub) return;

    // permission: user must have ManageGuild or ManageRoles
    const perms = interaction.member.permissions;
    if (!perms || (!perms.has && !perms.has('ManageGuild') && !perms.has('ManageRoles'))) {
      // attempt flag check using bitfield names
    }

    if (sub === 'setup') {
      const channel = interaction.options.getChannel('channel');
      const title = interaction.options.getString('title');
      if (!channel || !channel.isTextBased()) {
        await interaction.reply({ content: 'Invalid channel. Use a text channel.', ephemeral: true });
        return;
      }

      // post message
      const sent = await channel.send({ content: `**${title}**\n\n` });
      const entry = {
        guildId: interaction.guildId,
        channelId: channel.id,
        messageId: sent.id,
        content: sent.content,
        roles: {}
      };
      reactionRoles.push(entry);
      saveReactionRoles();
      await interaction.reply({ content: `Created reaction-role For You `, ephemeral: true });
      return;
    }

    if (sub === 'add') {
      const messageId = interaction.options.getString('message_id');
      const emoji = interaction.options.getString('emoji');
      const role = interaction.options.getRole('role');

      const conf = reactionRoles.find(r => r.messageId === messageId);
      if (!conf) {
        await interaction.reply({ content: 'No reaction-role message found with that ID. Use `/neko reaction setup` first.', ephemeral: true });
        return;
      }

      // fetch the channel and message
      const channel = await client.channels.fetch(conf.channelId).catch(() => null);
      if (!channel || !channel.isTextBased()) {
        await interaction.reply({ content: 'Configured channel not available.', ephemeral: true });
        return;
      }
      const msg = await channel.messages.fetch(conf.messageId).catch(() => null);
      if (!msg) {
        await interaction.reply({ content: 'Could not fetch the target message.', ephemeral: true });
        return;
      }

      // append to message content
      const roleMention = `<@&${role.id}>`;
      const newLine = `${emoji} — ${roleMention}`;
      const newContent = `${conf.content}\n${newLine}`;
      await msg.edit({ content: newContent }).catch(() => {});

      // react
      try {
        await msg.react(emoji);
      } catch (err) {
        console.warn('Failed to react with', emoji, err.message);
      }

      // store mapping key - use raw emoji as key (keep consistent with emojiKeyFrom output)
      const key = (/<:.*?:\d+>/.test(emoji)) ? emoji : emoji;
      conf.content = newContent;
      conf.roles[key] = role.id;
      saveReactionRoles();

      await interaction.reply({ content: `Added ${emoji} → ${role.name} to message ${conf.messageId}`, ephemeral: true });
      return;
    }

    if (sub === 'delete') {
      const messageId = interaction.options.getString('message_id');
      const lineNumber = interaction.options.getInteger('line');

      const conf = reactionRoles.find(r => r.messageId === messageId);
      if (!conf) {
        await interaction.reply({ content: 'No reaction-role message found with that ID.', ephemeral: true });
        return;
      }

      const channel = await client.channels.fetch(conf.channelId).catch(() => null);
      if (!channel || !channel.isTextBased()) {
        await interaction.reply({ content: 'Configured channel not available.', ephemeral: true });
        return;
      }
      const msg = await channel.messages.fetch(conf.messageId).catch(() => null);
      if (!msg) {
        await interaction.reply({ content: 'Could not fetch the target message.', ephemeral: true });
        return;
      }

      // Treat the provided line number as a 1-based index into the full message content lines.
      const lines = conf.content.split('\n');
      if (lineNumber < 1 || lineNumber > lines.length) {
        await interaction.reply({ content: `Invalid line. Provide a number between 1 and ${lines.length}.`, ephemeral: true });
        return;
      }

      // Remove the exact line from the full content
      const removedLine = lines.splice(lineNumber - 1, 1)[0];
      const newContent = lines.join('\n');

      try {
        await msg.edit({ content: newContent }).catch(() => {});
      } catch (err) {
        console.warn('Failed to edit message content:', err.message);
      }

      // If the removed line looks like a mapping (emoji — role), attempt to remove mapping and reaction
      try {
        const parts = removedLine.split('—');
        const emojiPart = parts[0] ? parts[0].trim() : null;

        if (emojiPart) {
          // find matching key in conf.roles (exact match)
          const key = Object.keys(conf.roles).find(k => k === emojiPart || k === emojiPart.trim());
          if (key) delete conf.roles[key];

          // remove reaction from message if present
          const reaction = msg.reactions.cache.find(r => {
            try {
              const repr = r.emoji.id ? `<:${r.emoji.name}:${r.emoji.id}>` : r.emoji.name;
              return repr === emojiPart || r.emoji.identifier === emojiPart || r.emoji.name === emojiPart || r.emoji.toString() === emojiPart;
            } catch (e) { return false; }
          });
          if (reaction) await reaction.remove().catch(() => {});
        }

        conf.content = newContent;
        saveReactionRoles();
        await interaction.reply({ content: `Removed line ${lineNumber} from message ${conf.messageId}`, ephemeral: true });
      } catch (err) {
        console.error('Failed to remove mapping:', err);
        await interaction.reply({ content: 'Failed to remove mapping.', ephemeral: true });
      }

      return;
    }
  } catch (err) {
    console.error('Interaction handler error:', err);
    if (interaction && !interaction.replied) {
      try { await interaction.reply({ content: 'An error occurred', ephemeral: true }); } catch (e) {}
    }
  }
});

function emojiKeyFrom(reaction) {
  if (reaction.emoji.id) return `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
  return reaction.emoji.name;
}

async function handleReaction(reaction, user, adding) {
  try {
    if (user.bot) return;
    if (reaction.partial) await reaction.fetch();
    const msg = reaction.message;
    const guild = msg.guild;
    if (!guild) return;

    const conf = reactionRoles.find(r => r.messageId === msg.id);
    if (!conf) return;

    const key = emojiKeyFrom(reaction);
    const roleId = conf.roles[key];
    if (!roleId) return;

    const member = await guild.members.fetch(user.id);
    if (!member) return;

    if (adding) await member.roles.add(roleId, 'Reaction role');
    else await member.roles.remove(roleId, 'Reaction role removed');
  } catch (err) {
    console.error('Error handling reaction:', err);
  }
}
// client.on("messageCreate", async (message) => {
//     if (message.author.bot) return;

//     const content = message.content;
//     // Funny responses list
//     const responses = [
//         "Hold on, let me grab a time machine so I can send that mindset back to 1800.",
//         "Bro really opened a history book and picked the worst page.",
//         "Your racism is showing… might want to tuck that back in.",
//         "Imagine saying that confidently *and* being wrong. Couldn’t be me.",
//         "That take aged faster than milk in the sun."
//     ];
//     // Detect sequence
//     if (/igga/i.test(content)) {
//         try {
//             await message.delete();

//             const reply = responses[Math.floor(Math.random() * responses.length)];
//             const botMsg = await message.channel.send(reply);

//             // Delete bot message after 3 seconds
//             setTimeout(() => {
//                 botMsg.delete().catch(() => {});
//             }, 3000);

//         } catch (err) {
//             console.error("Failed to delete or send message:", err);
//         }
//     }
// });

client.on('messageReactionAdd', (reaction, user) => handleReaction(reaction, user, true));
client.on('messageReactionRemove', (reaction, user) => handleReaction(reaction, user, false));

client.login(process.env.DISCORD_TOKEN);
