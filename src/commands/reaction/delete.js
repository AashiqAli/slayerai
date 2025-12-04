const { findReactionRole, saveReactionRoles } = require('../../utils/reactionRoles');
const { getChannelAndMessage } = require('../../utils/messages');

const handleDelete = async (interaction, client) => {
  const messageId = interaction.options.getString('message_id');
  const lineNumber = interaction.options.getInteger('line');

  const conf = findReactionRole(messageId);
  if (!conf) {
    await interaction.reply({ content: 'No reaction-role message found with that ID.', ephemeral: true });
    return;
  }

  const { channel, message } = await getChannelAndMessage(client, conf.channelId, conf.messageId);
  if (!channel || !message) {
    await interaction.reply({ content: 'Could not fetch the target message or channel.', ephemeral: true });
    return;
  }

  const lines = conf.content.split('\n');
  if (lineNumber < 1 || lineNumber > lines.length) {
    await interaction.reply({ 
      content: `Invalid line. Provide a number between 1 and ${lines.length}.`, 
      ephemeral: true 
    });
    return;
  }

  const removedLine = lines.splice(lineNumber - 1, 1)[0];
  const newContent = lines.join('\n');

  await message.edit({ content: newContent }).catch(err => {
    console.warn('Failed to edit message content:', err.message);
  });

      // Remove role mapping and reaction if line contains emoji mapping
      try {
        // Try multiple separator styles for compatibility
        const separators = ['—', '✦', '✧', '→', '⟶', '•'];
        let parts = null;
        for (const sep of separators) {
          if (removedLine.includes(sep)) {
            parts = removedLine.split(sep);
            break;
          }
        }
        if (!parts) parts = removedLine.split(/\s+/); // Fallback to whitespace
        
        const emojiPart = parts[0]?.trim();

    if (emojiPart) {
      // Find and remove matching role key
      const key = Object.keys(conf.roles).find(k => k === emojiPart || k.trim() === emojiPart);
      if (key) delete conf.roles[key];

      // Remove reaction from message
      const reaction = message.reactions.cache.find(r => {
        try {
          const repr = r.emoji.id ? `<:${r.emoji.name}:${r.emoji.id}>` : r.emoji.name;
          return repr === emojiPart || 
                 r.emoji.identifier === emojiPart || 
                 r.emoji.name === emojiPart || 
                 r.emoji.toString() === emojiPart;
        } catch {
          return false;
        }
      });
      
      if (reaction) {
        await reaction.remove().catch(() => {});
      }
    }

    conf.content = newContent;
    saveReactionRoles();
    await interaction.reply({ 
      content: `Removed line ${lineNumber} from message ${conf.messageId}`, 
      ephemeral: true 
    });
  } catch (err) {
    console.error('Failed to remove mapping:', err);
    await interaction.reply({ content: 'Failed to remove mapping.', ephemeral: true });
  }
};

module.exports = { handleDelete };

