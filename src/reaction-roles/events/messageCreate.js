const { setupSessions } = require('../common/sessions');
const { saveRolePair } = require('../interactions/handlers');

// Extract emoji from message content
const extractEmoji = (content) => {
  // Try to match custom emoji format: <:name:id> or <a:name:id>
  const customEmojiMatch = content.match(/<a?:[\w]+:\d+>/);
  if (customEmojiMatch) {
    return customEmojiMatch[0];
  }
  
  // Try to match unicode emoji (first emoji in message)
  const unicodeEmojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  const unicodeMatch = content.match(unicodeEmojiRegex);
  if (unicodeMatch) {
    return unicodeMatch[0];
  }
  
  return null;
};

const handleReactionRolesMessage = async (message, client) => {
  // Ignore bot messages
  if (message.author.bot) return false;

  // Check if user has an active setup session waiting for emoji
  if (!setupSessions) {
    return false; // setupSessions not available
  }

  const sessionId = `${message.author.id}:${message.channel.id}`;
  const session = setupSessions.get(sessionId);

  if (!session || !session.waitingForEmojiMessage || session.userId !== message.author.id) {
    return false; // Not a reaction-roles setup message
  }

  // Extract emoji from message
  const emoji = extractEmoji(message.content);
  
  if (!emoji) {
    await message.reply({ 
      content: '❌ No emoji detected in your message. Please send a message containing an emoji (Unicode or custom format).', 
      allowedMentions: { repliedUser: false }
    });
    return true;
  }

  // Validate emoji format
  const unicodeEmojiRegex = /^[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  const customEmojiRegex = /^<a?:[\w]+:\d+>$/;

  const isValidUnicode = unicodeEmojiRegex.test(emoji);
  const isValidCustom = customEmojiRegex.test(emoji);

  if (!isValidUnicode && !isValidCustom) {
    await message.reply({ 
      content: '❌ Invalid emoji format. Please use:\n• Unicode emoji: `👍` `❤️` `🎮`\n• Custom emoji: `<:name:123456789>`\n• Animated emoji: `<a:name:123456789>`', 
      allowedMentions: { repliedUser: false }
    });
    return true;
  }

  // Store emoji selection and clear waiting flag
  session.pendingEmoji = emoji;
  session.waitingForEmojiMessage = false;
  setupSessions.set(sessionId, session);

  // Check if both role and emoji are selected
  if (session.pendingRole && session.pendingEmoji) {
    const channelId = session.channelId;
    
    // Create a fake interaction-like object for saveRolePair
    const fakeInteraction = {
      user: message.author,
      reply: async (options) => {
        return await message.reply({ ...options, allowedMentions: { repliedUser: false } });
      },
      channel: message.channel,
      update: async (options) => {
        return await message.channel.send({ ...options, allowedMentions: { repliedUser: false } });
      },
      deferUpdate: async () => {},
      replied: false,
      deferred: false
    };
    
    await saveRolePair(fakeInteraction, client, session, channelId);
  } else {
    await message.reply({ 
      content: `✅ **Emoji Detected**\n\n**Detected:** ${emoji}\n\n**Next Step:** Select a role from the dropdown in the setup message above.`, 
      allowedMentions: { repliedUser: false }
    });
  }

  // Delete the user's message to keep the channel clean (optional)
  try {
    await message.delete();
  } catch (err) {
    // Ignore if we can't delete (no permissions)
  }

  return true;
};

module.exports = { handleReactionRolesMessage };

