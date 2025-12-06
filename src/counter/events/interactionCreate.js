const { hasManagePermissions } = require('../../utils/permissions');
const { 
  handleCounterReset, 
  handleCounterResetToCheckpoint, 
  handleSetCounterChannel,
  handleLeaderboard,
  handleMistakesLeaderboard
} = require('../commands');

const handleCounterInteraction = async (interaction, client) => {
  // Only handle slash commands
  if (!interaction.isChatInputCommand()) return false;

  // Handle /neko-counter command
  if (interaction.commandName === 'neko-counter') {
    const subcommand = interaction.options.getSubcommand(false);
    
    // Public leaderboard commands (no permission check)
    if (subcommand === 'leaderboard') {
      await handleLeaderboard(interaction);
      return true;
    }
    
    if (subcommand === 'mistakes-leaderboard') {
      await handleMistakesLeaderboard(interaction);
      return true;
    }
    
    // Admin commands (require permissions)
    if (!hasManagePermissions(interaction.member)) {
      await interaction.reply({ 
        content: 'You need Manage Server or Manage Roles permission to use this command.', 
        embeds: [],
        ephemeral: true 
      });
      return true;
    }
    
    if (subcommand === 'reset') {
      await handleCounterReset(interaction);
      return true;
    }
    
    if (subcommand === 'reset-checkpoint') {
      await handleCounterResetToCheckpoint(interaction);
      return true;
    }
    
    if (subcommand === 'set-channel') {
      await handleSetCounterChannel(interaction);
      return true;
    }
  }

  return false;
};

module.exports = { handleCounterInteraction };

