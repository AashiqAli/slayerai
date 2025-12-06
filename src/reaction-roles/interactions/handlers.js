const { setupSessions } = require('../common/sessions');
const { addReactionRole } = require('../utils/reactionRoles');
const { createPreviewEmbed } = require('../common/formatters');
const { showStep1Controls, showSetupControls, showStep3Controls } = require('./controls');

// Function to save/update role pair (called automatically when both role and emoji are selected)
const saveRolePair = async (interaction, client, session, channelId) => {
  const sessionId = `${interaction.user.id}:${channelId}`;
  
  if (!session.pendingRole || !session.pendingEmoji) {
    // This shouldn't happen, but if it does, just update the preview
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferUpdate();
    }
    await showSetupControls(interaction, client, sessionId, channelId, true);
    return;
  }

  const isEditing = session.editingRoleIndex >= 0 && session.editingRoleIndex < session.roles.length;
  
  if (isEditing) {
    // Update existing role
    session.roles[session.editingRoleIndex] = {
      emoji: session.pendingEmoji,
      role: session.pendingRole
    };
  } else {
    // Add new role
    session.roles.push({
      emoji: session.pendingEmoji,
      role: session.pendingRole
    });
    session.editingRoleIndex = session.roles.length - 1;
  }
  
  // Store what was added for confirmation message
  const addedRole = session.pendingRole;
  const addedEmoji = session.pendingEmoji;
  
  // Clear pending selections and reset to add new role
  session.pendingRole = null;
  session.pendingEmoji = null;
  session.editingRoleIndex = -1; // Always ready to add new role after saving
  
  // Clear invalid role message when role-emoji pair is successfully added
  session.hasInvalidRole = false;
  session.invalidRoleMessage = null;
  
  // Save session
  setupSessions.set(sessionId, session);

  // Store confirmation info for display in preview
  session.lastAddedRole = {
    name: addedRole.name,
    totalCount: session.roles.length
  };
  setupSessions.set(sessionId, session);

  // Show updated preview with controls (this will clear dropdowns since pendingRole/Emoji are null)
  try {
    // Defer update first if needed
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferUpdate();
    }
    
    // Force clear the session state to ensure dropdowns are reset
    // The dropdowns will show "Select a role..." and "Select an emoji..." placeholders
    await showSetupControls(interaction, client, sessionId, channelId, true);
  } catch (err) {
    console.error('Error in saveRolePair:', err);
    if (!interaction.replied && !interaction.deferred) {
      await showSetupControls(interaction, client, sessionId, channelId, false);
    }
  }
};

const handleRoleSelect = async (interaction, client) => {
  const [action, channelId] = interaction.customId.split(':');
  const sessionId = `${interaction.user.id}:${channelId}`;
  const session = setupSessions.get(sessionId);

  if (!session || session.userId !== interaction.user.id) {
    await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    return;
  }

  const selectedRole = interaction.roles.first();
  if (!selectedRole) {
    await interaction.reply({ content: 'No role selected.', ephemeral: true });
    return;
  }

  // Get guild to check role hierarchy
  const guild = await client.guilds.fetch(session.guildId).catch(() => null);
  if (guild) {
    // Find "Beepity-boop" role
    const beepityBoopRole = guild.roles.cache.find(role => 
      role.name.toLowerCase().includes('beepity-boop') || 
      role.name.toLowerCase().includes('beepity boop')
    );

    if (beepityBoopRole) {
      // Check if selected role is above "Beepity-boop" in hierarchy
      // Higher position = higher in hierarchy
      if (selectedRole.position > beepityBoopRole.position) {
        // Clear any pending role selection to prevent emoji selection
        session.pendingRole = null;
        session.hasInvalidRole = true; // Mark session as having invalid role
        session.invalidRoleMessage = '❌ **Role Not Allowed**\n\nThis role cannot be used for reaction roles. Please proceed with only **non-staff, non-partner, and non-event roles**.\n\nPlease select a different role below "Beepity-boop" in the hierarchy.';
        setupSessions.set(sessionId, session);
        
        // Update controls with disabled buttons and show error message
        await showSetupControls(interaction, client, sessionId, channelId, true);
        return;
      }
    }
    
    // Clear invalid role flag and message if role is valid
    const wasInvalid = session.hasInvalidRole;
    if (session.hasInvalidRole) {
      session.hasInvalidRole = false;
      session.invalidRoleMessage = null;
      setupSessions.set(sessionId, session);
    }
    
    // If we just cleared an invalid role, update controls immediately to remove the message
    if (wasInvalid) {
      session.pendingRole = { id: selectedRole.id, name: selectedRole.name };
      setupSessions.set(sessionId, session);
      await showSetupControls(interaction, client, sessionId, channelId, true);
      return;
    }
  }

  // Store role selection only if validation passes
  session.pendingRole = { id: selectedRole.id, name: selectedRole.name };
  setupSessions.set(sessionId, session);

  // If emoji is already selected, create the role entry immediately
  if (session.pendingEmoji) {
    await saveRolePair(interaction, client, session, channelId);
  } else {
    // Update preview immediately with new selection
    await showSetupControls(interaction, client, sessionId, channelId, true);
  }
};

const handleEmojiSelect = async (interaction, client) => {
  const [action, channelId] = interaction.customId.split(':');
  const sessionId = `${interaction.user.id}:${channelId}`;
  const session = setupSessions.get(sessionId);

  if (!session || session.userId !== interaction.user.id) {
    await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    return;
  }

  const selectedValue = interaction.values[0];
  
  // Handle special case for "more emojis"
  if (selectedValue === 'more_emojis') {
    // Mark session as waiting for emoji message
    session.waitingForEmojiMessage = true;
    setupSessions.set(sessionId, session);
    
    const helpMessage = `📝 **Custom Emoji Input**\n\n**How to add a custom emoji:**\n\n1. Simply send a message in this channel with the emoji you want to use\n2. You can use:\n   • Unicode emoji: \`👍\` \`❤️\` \`🎮\`\n   • Custom emoji: Just type it or use \`<:name:id>\`\n   • Animated emoji: \`<a:name:id>\`\n\n**Example:** Send a message like:\n\`👍\` or \`<:custom_emoji:123456789>\`\n\nThe bot will automatically detect the emoji from your message.\n\n**Send your message now - the bot is listening for emojis**`;
    
    await interaction.reply({ content: helpMessage, ephemeral: false });
    return;
  }

  // Store emoji selection (selectedValue is already in correct format)
  session.pendingEmoji = selectedValue;
  setupSessions.set(sessionId, session);

  // If role is already selected, create the role entry immediately
  if (session.pendingRole) {
    await saveRolePair(interaction, client, session, channelId);
  } else {
    // Update preview immediately with new selection
    await showSetupControls(interaction, client, sessionId, channelId, true);
  }
};

const handleTitleBorderSelect = async (interaction, client) => {
  const [action, channelId] = interaction.customId.split(':');
  const sessionId = `${interaction.user.id}:${channelId}`;
  const session = setupSessions.get(sessionId);

  if (!session || session.userId !== interaction.user.id) {
    await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    return;
  }

  const selectedBorder = interaction.values[0];
  session.titleBorder = selectedBorder;
  setupSessions.set(sessionId, session);

  // Update preview - show step 1 if in step 1, otherwise step 2
  if (session.step === 1) {
    await showStep1Controls(interaction, client, sessionId, channelId, true);
  } else {
    await showSetupControls(interaction, client, sessionId, channelId, true);
  }
};

const handleTopBorderSelect = async (interaction, client) => {
  const [action, channelId] = interaction.customId.split(':');
  const sessionId = `${interaction.user.id}:${channelId}`;
  const session = setupSessions.get(sessionId);

  if (!session || session.userId !== interaction.user.id) {
    await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    return;
  }

  const selectedBorder = interaction.values[0];
  session.topBorder = selectedBorder;
  setupSessions.set(sessionId, session);

  // Update preview
  await showStep3Controls(interaction, client, sessionId, channelId, true);
};

const handleBottomBorderSelect = async (interaction, client) => {
  const [action, channelId] = interaction.customId.split(':');
  const sessionId = `${interaction.user.id}:${channelId}`;
  const session = setupSessions.get(sessionId);

  if (!session || session.userId !== interaction.user.id) {
    await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    return;
  }

  const selectedBorder = interaction.values[0];
  session.bottomBorder = selectedBorder;
  setupSessions.set(sessionId, session);

  // Update preview
  await showStep3Controls(interaction, client, sessionId, channelId, true);
};

const handleContinueButton = async (interaction, client) => {
  const [action, channelId] = interaction.customId.split(':');
  const sessionId = `${interaction.user.id}:${channelId}`;
  const session = setupSessions.get(sessionId);

  if (!session || session.userId !== interaction.user.id) {
    await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    return;
  }

  // Move to step 2
  session.step = 2;
  setupSessions.set(sessionId, session);

  // Show step 2 controls - use update since this is a button interaction
  try {
    await showSetupControls(interaction, client, sessionId, channelId, true);
  } catch (err) {
    console.error('Error in handleContinueButton:', err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ 
        content: 'An error occurred while moving to step 2. Please try again.', 
        ephemeral: true 
      });
    }
  }
};

const handleEditTitleButton = async (interaction, client) => {
  const [action, channelId] = interaction.customId.split(':');
  const sessionId = `${interaction.user.id}:${channelId}`;
  const session = setupSessions.get(sessionId);

  if (!session || session.userId !== interaction.user.id) {
    await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    return;
  }

  // Go back to step 1
  session.step = 1;
  setupSessions.set(sessionId, session);

  // Show step 1 controls
  await showStep1Controls(interaction, client, sessionId, channelId, true);
};

const handleStep3Button = async (interaction, client) => {
  const [action, channelId] = interaction.customId.split(':');
  const sessionId = `${interaction.user.id}:${channelId}`;
  const session = setupSessions.get(sessionId);

  if (!session || session.userId !== interaction.user.id) {
    await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    return;
  }

  if (session.roles.length === 0) {
    await interaction.reply({ 
      content: '❌ **No Roles Added**\n\nYou need to add at least one role before proceeding to step 3.', 
      ephemeral: true 
    });
    return;
  }

  // Move to step 3
  session.step = 3;
  setupSessions.set(sessionId, session);

  // Show step 3 controls (top and bottom border selection)
  await showStep3Controls(interaction, client, sessionId, channelId, true);
};

const handleBackToStep2Button = async (interaction, client) => {
  const [action, channelId] = interaction.customId.split(':');
  const sessionId = `${interaction.user.id}:${channelId}`;
  const session = setupSessions.get(sessionId);

  if (!session || session.userId !== interaction.user.id) {
    await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    return;
  }

  // Go back to step 2
  session.step = 2;
  setupSessions.set(sessionId, session);

  // Show step 2 controls
  await showSetupControls(interaction, client, sessionId, channelId, true);
};

const handleDoneButton = async (interaction, client) => {
  const [action, channelId] = interaction.customId.split(':');
  const sessionId = `${interaction.user.id}:${channelId}`;
  const session = setupSessions.get(sessionId);

  if (!session || session.userId !== interaction.user.id) {
    await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    return;
  }

  if (session.roles.length === 0) {
    await interaction.reply({ 
      content: '❌ **No Roles Added**\n\nYou need to add at least one role before finishing.', 
      ephemeral: true 
    });
    return;
  }

  // Show processing message
  await interaction.update({ 
    content: '⏳ **Creating Reaction Role Message...**\n\nPlease wait while I create your message and add reactions.', 
    components: [] 
  });

  // Create the message
  const channel = await client.channels.fetch(session.channelId).catch(() => null);
  if (!channel || !channel.isTextBased()) {
    await interaction.editReply({ 
      content: '❌ **Channel Error**\n\nCould not find or access the specified channel.' 
    });
    setupSessions.delete(sessionId);
    return;
  }

  const { content } = createPreviewEmbed(
    session.title, 
    session.roles, 
    session.titleBorder || 'none',
    session.topBorder || 'none',
    session.bottomBorder || 'none'
  );
  
  // aashiq here is final message - send as plain text, not embed
  // Explicitly send as content only, no embeds
  const sent = await channel.send({
    content: content,
    allowedMentions: { parse: [] }
  });

  // Add reactions
  const reactionResults = [];
  for (const { emoji } of session.roles) {
    try {
      await sent.react(emoji);
      reactionResults.push({ emoji, success: true });
    } catch (err) {
      console.warn('Failed to react with', emoji, ':', err.message);
      reactionResults.push({ emoji, success: false, error: err.message });
    }
  }

  // Save to reaction roles
  const entry = {
    guildId: session.guildId,
    channelId: session.channelId,
    messageId: sent.id,
    content: sent.content,
    roles: {}
  };

  for (const { emoji, role } of session.roles) {
    entry.roles[emoji] = role.id;
  }

  addReactionRole(entry);
  setupSessions.delete(sessionId);

  // Build completion message
  const failedReactions = reactionResults.filter(r => !r.success);
  let completionMessage = `✅ **Setup Complete!**\n\n**Message created in:** <#${session.channelId}>\n**Message ID:** \`${sent.id}\`\n**Roles configured:** ${session.roles.length}\n**Reactions added:** ${reactionResults.filter(r => r.success).length}/${session.roles.length}`;
  
  if (failedReactions.length > 0) {
    completionMessage += `\n\n⚠️ **Warning:** Failed to add ${failedReactions.length} reaction(s). You may need to add them manually.`;
  }

  completionMessage += `\n\n**Your reaction role message is now live!**`;

  await interaction.editReply({ content: completionMessage });
  
  const summaryMessage = `📋 **Setup Summary**\n\n**Message:** [Jump to message](https://discord.com/channels/${session.guildId}/${session.channelId}/${sent.id})\n\n**Configuration:**\n• Title: ${session.title}\n• Channel: <#${session.channelId}>\n• Roles: ${session.roles.length}\n\n**What's Next?**\nUsers can now react to the message to get roles automatically!`;
  
  await interaction.followUp({ content: summaryMessage, ephemeral: true });
};

const handlePrevRoleButton = async (interaction, client) => {
  const [action, channelId] = interaction.customId.split(':');
  const sessionId = `${interaction.user.id}:${channelId}`;
  const session = setupSessions.get(sessionId);

  if (!session || session.userId !== interaction.user.id) {
    await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    return;
  }

  if (session.editingRoleIndex > 0) {
    session.editingRoleIndex--;
    session.pendingRole = null;
    session.pendingEmoji = null;
    setupSessions.set(sessionId, session);
    await showSetupControls(interaction, client, sessionId, channelId, true);
  } else {
    await interaction.deferUpdate();
  }
};

const handleBackRoleButton = async (interaction, client) => {
  const [action, channelId] = interaction.customId.split(':');
  const sessionId = `${interaction.user.id}:${channelId}`;
  const session = setupSessions.get(sessionId);

  if (!session || session.userId !== interaction.user.id) {
    await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    return;
  }

  // Clear selections to start fresh for new role
  session.pendingRole = null;
  session.pendingEmoji = null;
  session.editingRoleIndex = -1;
  setupSessions.set(sessionId, session);
  
  await showSetupControls(interaction, client, sessionId, channelId, true);
};

const handleNextRoleButton = async (interaction, client) => {
  const [action, channelId] = interaction.customId.split(':');
  const sessionId = `${interaction.user.id}:${channelId}`;
  const session = setupSessions.get(sessionId);

  if (!session || session.userId !== interaction.user.id) {
    await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    return;
  }

  if (session.editingRoleIndex < session.roles.length - 1) {
    session.editingRoleIndex++;
    session.pendingRole = null;
    session.pendingEmoji = null;
    setupSessions.set(sessionId, session);
    await showSetupControls(interaction, client, sessionId, channelId, true);
  } else {
    await interaction.deferUpdate();
  }
};

const handleCancelButton = async (interaction) => {
  const [action, channelId] = interaction.customId.split(':');
  const sessionId = `${interaction.user.id}:${channelId}`;
  const session = setupSessions.get(sessionId);

  if (!session || session.userId !== interaction.user.id) {
    await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    return;
  }

  setupSessions.delete(sessionId);

  const cancelMessage = `❌ **Setup Cancelled**\n\nThe reaction role setup has been cancelled.`;

  await interaction.update({ content: cancelMessage, components: [] });
};

module.exports = {
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
  handleCancelButton,
  saveRolePair
};

