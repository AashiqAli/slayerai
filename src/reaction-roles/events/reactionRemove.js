const { handleReaction } = require('../handlers/reactionHandler');

const handleReactionRemove = (reaction, user, client) => {
  handleReaction(reaction, user, false, client);
};

module.exports = { handleReactionRemove };

