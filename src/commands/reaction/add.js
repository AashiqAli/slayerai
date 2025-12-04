const { findReactionRole, updateReactionRole, saveReactionRoles } = require('../../utils/reactionRoles');
const { getChannelAndMessage } = require('../../utils/messages');

const handleAdd = async (interaction, client) => {
  const messageId = interaction.options.getString('message_id');
  const emoji = interaction.options.getString('emoji');
  const role = interaction.options.getRole('role');

  const conf = findReactionRole(messageId);
  if (!conf) {
    await interaction.reply({ 
      content: 'No reaction-role message found with that ID. Use `/neko reaction setup` first.', 
      ephemeral: true 
    });
    return;
  }

  const { channel, message } = await getChannelAndMessage(client, conf.channelId, conf.messageId);
  if (!channel || !message) {
    await interaction.reply({ content: 'Could not fetch the target message or channel.', ephemeral: true });
    return;
  }

      const roleMention = `<@&${role.id}>`;
      const newLine = `${emoji} ✦ ${roleMention}`;
      const newContent = `${conf.content}\n${newLine}`;
  
  await message.edit({ content: newContent }).catch(err => {
    console.warn('Failed to edit message:', err.message);
  });

  try {
    await message.react(emoji);
  } catch (err) {
    console.warn('Failed to react with', emoji, ':', err.message);
  }

  conf.content = newContent;
  conf.roles[emoji] = role.id;
  saveReactionRoles();

  await interaction.reply({ 
    content: `Added ${emoji} → ${role.name} to message ${conf.messageId}`, 
    ephemeral: true 
  });
};

module.exports = { handleAdd };

