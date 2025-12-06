const { 
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
} = require('./handlers');

// Handle all setup-interactive related interactions (buttons and select menus)
const handleSetupInteractions = async (interaction, client) => {
  // Handle button interactions
  if (interaction.isButton()) {
    const customId = interaction.customId;
    
    if (customId.startsWith('setup_done:')) {
      await handleDoneButton(interaction, client);
      return true;
    }
    
    if (customId.startsWith('setup_prev_role:')) {
      await handlePrevRoleButton(interaction, client);
      return true;
    }
    
    if (customId.startsWith('setup_back_role:')) {
      await handleBackRoleButton(interaction, client);
      return true;
    }
    
    if (customId.startsWith('setup_next_role:')) {
      await handleNextRoleButton(interaction, client);
      return true;
    }
    
    if (customId.startsWith('setup_continue:')) {
      await handleContinueButton(interaction, client);
      return true;
    }
    
    if (customId.startsWith('setup_edit_title:')) {
      await handleEditTitleButton(interaction, client);
      return true;
    }
    
    if (customId.startsWith('setup_step3:')) {
      await handleStep3Button(interaction, client);
      return true;
    }
    
    if (customId.startsWith('setup_back_step2:')) {
      await handleBackToStep2Button(interaction, client);
      return true;
    }
    
    if (customId.startsWith('setup_cancel:')) {
      await handleCancelButton(interaction);
      return true;
    }
  }

  // Handle select menu interactions
  if (interaction.isAnySelectMenu()) {
    const customId = interaction.customId;
    
    if (customId.startsWith('setup_role_select:')) {
      await handleRoleSelect(interaction, client);
      return true;
    }
    
    if (customId.startsWith('setup_emoji_select:')) {
      await handleEmojiSelect(interaction, client);
      return true;
    }
    
    if (customId.startsWith('setup_title_border:')) {
      await handleTitleBorderSelect(interaction, client);
      return true;
    }
    
    if (customId.startsWith('setup_top_border:')) {
      await handleTopBorderSelect(interaction, client);
      return true;
    }
    
    if (customId.startsWith('setup_bottom_border:')) {
      await handleBottomBorderSelect(interaction, client);
      return true;
    }
  }

  // Not a setup interaction
  return false;
};

module.exports = { handleSetupInteractions };

