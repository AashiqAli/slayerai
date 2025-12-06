const { handleCounterMessage } = require('../counter/events/messageCreate');
const { handleReactionRolesMessage } = require('../reaction-roles/events/messageCreate');

const handleMessageCreate = async (message, client) => {
  // Try counter message handling first
  const counterHandled = await handleCounterMessage(message, client);
  if (counterHandled) return;

  // Try reaction-roles message handling
  const reactionRolesHandled = await handleReactionRolesMessage(message, client);
  if (reactionRolesHandled) return;
};

module.exports = { handleMessageCreate };

