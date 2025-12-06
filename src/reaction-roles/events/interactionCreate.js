const { hasManagePermissions } = require('../../utils/permissions');
const { handleSetupInteractive } = require('../commands/setup-interactive');
const { handleSetupInteractions } = require('../interactions/router');

const handleReactionRolesInteraction = async (interaction, client) => {
  try {
    // Handle setup-interactive interactions (buttons and select menus)
    const handled = await handleSetupInteractions(interaction, client);
    if (handled) return true;

    // Handle slash commands
    if (!interaction.isChatInputCommand()) return false;

    // Handle /neko command (reaction roles)
    if (interaction.commandName !== 'neko') return false;

    const group = interaction.options.getSubcommandGroup(false);
    const sub = interaction.options.getSubcommand(false);

    if (group !== 'reaction' || !sub) return false;

    // Check permissions
    if (!hasManagePermissions(interaction.member)) {
      await interaction.reply({ 
        content: 'You need Manage Server or Manage Roles permission to use this command.', 
        embeds: [],
        ephemeral: true 
      });
      return true;
    }

    if (sub === 'setup-interactive') {
      await handleSetupInteractive(interaction, client);
      return true;
    }

    return false;
  } catch (err) {
    console.error('Reaction roles interaction handler error:', err);
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
    return true;
  }
};

module.exports = { handleReactionRolesInteraction };

