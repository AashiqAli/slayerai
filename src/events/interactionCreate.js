const { hasManagePermissions } = require('../utils/permissions');
const { handleSetup } = require('../commands/reaction/setup');
const { 
  handleSetupInteractive, 
  handleRoleSelect,
  handleEmojiSelect,
  handleTitleBorderSelect,
  handleTopBorderSelect,
  handleBottomBorderSelect,
  handleContinueButton,
  handleEditTitleButton,
  handleStep3Button,
  handleBackToStep2Button,
  handleDoneButton,
  handlePrevRoleButton,
  handleBackRoleButton,
  handleNextRoleButton,
  handleCancelButton 
} = require('../commands/reaction/setup-interactive');
const { handleAdd } = require('../commands/reaction/add');
const { handleDelete } = require('../commands/reaction/delete');

const handleInteractionCreate = async (interaction, client) => {
  try {
    // Handle button interactions
    if (interaction.isButton()) {
      const customId = interaction.customId;
      
      if (customId.startsWith('setup_done:')) {
        await handleDoneButton(interaction, client);
        return;
      }
      
      if (customId.startsWith('setup_prev_role:')) {
        await handlePrevRoleButton(interaction, client);
        return;
      }
      
      if (customId.startsWith('setup_back_role:')) {
        await handleBackRoleButton(interaction, client);
        return;
      }
      
      if (customId.startsWith('setup_next_role:')) {
        await handleNextRoleButton(interaction, client);
        return;
      }
      
      if (customId.startsWith('setup_continue:')) {
        await handleContinueButton(interaction, client);
        return;
      }
      
      if (customId.startsWith('setup_edit_title:')) {
        await handleEditTitleButton(interaction, client);
        return;
      }
      
      if (customId.startsWith('setup_step3:')) {
        await handleStep3Button(interaction, client);
        return;
      }
      
      if (customId.startsWith('setup_back_step2:')) {
        await handleBackToStep2Button(interaction, client);
        return;
      }
      
      if (customId.startsWith('setup_cancel:')) {
        await handleCancelButton(interaction);
        return;
      }
    }


    // Handle select menu interactions
    if (interaction.isAnySelectMenu()) {
      const customId = interaction.customId;
      
      if (customId.startsWith('setup_role_select:')) {
        await handleRoleSelect(interaction, client);
        return;
      }
      
      if (customId.startsWith('setup_emoji_select:')) {
        await handleEmojiSelect(interaction, client);
        return;
      }
      
      if (customId.startsWith('setup_title_border:')) {
        await handleTitleBorderSelect(interaction, client);
        return;
      }
      
      if (customId.startsWith('setup_top_border:')) {
        await handleTopBorderSelect(interaction, client);
        return;
      }
      
      if (customId.startsWith('setup_bottom_border:')) {
        await handleBottomBorderSelect(interaction, client);
        return;
      }
      
    }

    // Handle slash commands
    if (!interaction.isChatInputCommand()) return;

    // Handle /neko command (reaction roles)
    if (interaction.commandName !== 'neko') return;

    const group = interaction.options.getSubcommandGroup(false);
    const sub = interaction.options.getSubcommand(false);

    if (group !== 'reaction' || !sub) return;

    // Check permissions
    if (!hasManagePermissions(interaction.member)) {
      await interaction.reply({ 
        content: 'You need Manage Server or Manage Roles permission to use this command.', 
        ephemeral: true 
      });
      return;
    }

    if (sub === 'setup') {
      await handleSetup(interaction);
      return;
    }

    if (sub === 'setup-interactive') {
      await handleSetupInteractive(interaction, client);
      return;
    }

    if (sub === 'add') {
      await handleAdd(interaction, client);
      return;
    }

    if (sub === 'delete') {
      await handleDelete(interaction, client);
      return;
    }
  } catch (err) {
    console.error('Interaction handler error:', err);
    if (!interaction.replied && !interaction.deferred) {
      try {
        await interaction.reply({ content: 'An error occurred while processing your command.', ephemeral: true });
      } catch {
        // Interaction may have expired or already been handled
      }
    }
  }
};

module.exports = { handleInteractionCreate };

