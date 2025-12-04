const { findReactionRole, addReactionRole } = require('../../utils/reactionRoles');

const handleSetup = async (interaction) => {
  const channel = interaction.options.getChannel('channel');
  const title = interaction.options.getString('title');
  
  if (!channel?.isTextBased()) {
    await interaction.reply({ content: 'Invalid channel. Use a text channel.', ephemeral: true });
    return;
  }

  const sent = await channel.send({ content: `**${title}**\n\n` });
  const entry = {
    guildId: interaction.guildId,
    channelId: channel.id,
    messageId: sent.id,
    content: sent.content,
    roles: {}
  };
  
  addReactionRole(entry);
  await interaction.reply({ content: 'Created reaction-role message.', ephemeral: true });
};

module.exports = { handleSetup };

