const { setupSessions } = require('../common/sessions');
const { showStep1Controls } = require('../interactions/controls');

const handleSetupInteractive = async (interaction, client) => {
  const channel = interaction.options.getChannel('channel');
  const title = interaction.options.getString('title');
  
  if (!channel?.isTextBased()) {
    await interaction.reply({ content: 'Invalid channel. Use a text channel.', ephemeral: true });
    return;
  }

  // Initialize session with new structure
  const sessionId = `${interaction.user.id}:${channel.id}`;
  setupSessions.set(sessionId, {
    userId: interaction.user.id,
    guildId: interaction.guildId,
    channelId: channel.id,
    title,
    roles: [],
    editingRoleIndex: -1,
    titleBorder: 'none',
    messageIds: [], // Track messages to delete
    pendingRole: null,
    pendingEmoji: null,
    step: 1 // Step 1: Title and border, Step 2: Role selection
  });

  // Show step 1: Title and title border selection
  await showStep1Controls(interaction, client, sessionId, channel.id);
};

module.exports = { handleSetupInteractive };

