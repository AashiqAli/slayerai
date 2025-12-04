require('dotenv').config();
const { createClient } = require('./config/client');
const { handleReady } = require('./events/ready');
const { handleInteractionCreate } = require('./events/interactionCreate');
const { handleMessageCreate } = require('./events/messageCreate');
const { handleReactionAdd } = require('./events/reactionAdd');
const { handleReactionRemove } = require('./events/reactionRemove');

const client = createClient();

// Register event handlers
client.once('clientReady', () => handleReady(client));
client.on('interactionCreate', (interaction) => handleInteractionCreate(interaction, client));
client.on('messageCreate', (message) => handleMessageCreate(message, client));
client.on('messageReactionAdd', (reaction, user) => handleReactionAdd(reaction, user, client));
client.on('messageReactionRemove', (reaction, user) => handleReactionRemove(reaction, user, client));

// Login
client.login(process.env.DISCORD_TOKEN);
