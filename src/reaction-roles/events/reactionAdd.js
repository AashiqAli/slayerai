const { handleReaction } = require('../handlers/reactionHandler');

const handleReactionAdd = (reaction, user, client) => {
  handleReaction(reaction, user, true, client);
};

module.exports = { handleReactionAdd };

