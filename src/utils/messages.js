const getChannelAndMessage = async (client, channelId, messageId) => {
  const channel = await client.channels.fetch(channelId).catch(() => null);
  if (!channel?.isTextBased()) return { channel: null, message: null };
  
  const message = await channel.messages.fetch(messageId).catch(() => null);
  return { channel, message };
};

module.exports = { getChannelAndMessage };

