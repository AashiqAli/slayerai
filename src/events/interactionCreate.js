const { handleCounterInteraction } = require('../counter/events/interactionCreate');
const { handleReactionRolesInteraction } = require('../reaction-roles/events/interactionCreate');

const handleInteractionCreate = async (interaction, client) => {
  try {
    // Try counter interactions first
    const counterHandled = await handleCounterInteraction(interaction, client);
    if (counterHandled) return;

    // Try reaction-roles interactions
    const reactionRolesHandled = await handleReactionRolesInteraction(interaction, client);
    if (reactionRolesHandled) return;
  } catch (err) {
    console.error('Interaction handler error:', err);
    if (!interaction.replied && !interaction.deferred) {
      try {
        await interaction.reply({ 
          content: 'An error occurred while processing your command.', 
          embeds: [],
          ephemeral: true 
        });
      } catch {
        // Interaction may have expired or already been handled
      }
    }
  }
};

module.exports = { handleInteractionCreate };

