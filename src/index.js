require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials } = require('discord.js');

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

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
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
