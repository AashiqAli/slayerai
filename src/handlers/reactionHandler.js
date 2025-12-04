const { findReactionRole } = require('../utils/reactionRoles');
const { buildEmojiVariants } = require('../utils/emoji');

const handleReaction = async (reaction, user, adding, client) => {
  try {
    if (user.bot) return;
    
    if (reaction.partial) await reaction.fetch();
    
    const message = reaction.message;
    const guild = message.guild;
    if (!guild) return;

    const conf = findReactionRole(message.id);
    if (!conf) return;

    // Build possible key variants to match stored mapping keys
    const variants = buildEmojiVariants(reaction);

    // Find matching role ID
    let roleId = null;
    for (const variant of variants) {
      if (!variant) continue;
      if (Object.prototype.hasOwnProperty.call(conf.roles, variant)) {
        roleId = conf.roles[variant];
        break;
      }
    }
    
    if (!roleId) return;

    const member = await guild.members.fetch(user.id).catch(() => null);
    if (!member) return;

    const reason = adding ? 'Reaction role' : 'Reaction role removed';
    if (adding) {
      await member.roles.add(roleId, reason).catch(err => {
        console.warn('Failed to add role:', err.message || err);
      });
    } else {
      await member.roles.remove(roleId, reason).catch(err => {
        console.warn('Failed to remove role:', err.message || err);
      });
    }
  } catch (err) {
    console.error('Error handling reaction:', err);
  }
};

module.exports = { handleReaction };

