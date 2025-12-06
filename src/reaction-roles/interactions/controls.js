const { ActionRowBuilder, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder, StringSelectMenuBuilder } = require('discord.js');
const { setupSessions } = require('../common/sessions');
const { borderNames, titleBorderPreviews, titleBorders } = require('../common/constants');
const { createPreviewEmbed } = require('../common/formatters');

// Step 1: Show title and title border selection
const showStep1Controls = async (interaction, client, sessionId, channelId, isUpdate = false) => {
  const session = setupSessions.get(sessionId);
  if (!session) return;

  // Create preview with current title and border
  const { content: previewContent } = createPreviewEmbed(
    session.title, 
    [], 
    session.titleBorder || 'none',
    session.topBorder || 'none',
    session.bottomBorder || 'none'
  );

  // Title border select menu - dynamically populate from borderNames
  const currentTitleBorder = session.titleBorder || 'none';
  const titleBorderOptions = Object.keys(titleBorders).map(key => {
    const option = {
      label: borderNames[key] || key,
      value: key,
      default: currentTitleBorder === key
    };
    // Only add description if there's a preview (Discord doesn't accept empty strings)
    const preview = titleBorderPreviews[key];
    if (preview) {
      option.description = preview;
    }
    return option;
  });
  const titleBorderSelect = new StringSelectMenuBuilder()
    .setCustomId(`setup_title_border:${channelId}`)
    .setPlaceholder(`Title Border: ${borderNames[currentTitleBorder] || 'No Border'}`)
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(titleBorderOptions);

  // Continue button to move to step 2
  const continueButton = new ButtonBuilder()
    .setCustomId(`setup_continue:${channelId}`)
    .setLabel('Continue to Step 2')
    .setStyle(ButtonStyle.Success)
    .setEmoji('➡️');

  const cancelButton = new ButtonBuilder()
    .setCustomId(`setup_cancel:${channelId}`)
    .setLabel('Cancel')
    .setStyle(ButtonStyle.Danger)
    .setEmoji('❌');

  const step1Message = `📝 **Step 1: Title & Border Setup**\n\n**Title:** ${session.title}\n\n**Preview:**\n${previewContent}\n\n**Select a title border style below, then click Continue to proceed to role selection.**`;

  const components = [
    new ActionRowBuilder().addComponents(titleBorderSelect),
    new ActionRowBuilder().addComponents(continueButton, cancelButton)
  ];

  if (isUpdate) {
    try {
      await interaction.update({ content: step1Message, components, flags: 64 });
    } catch (err) {
      if (interaction.deferred || interaction.replied) {
        try {
          await interaction.editReply({ content: step1Message, components, flags: 64 });
        } catch (editErr) {
          // Ignore edit errors
        }
      }
    }
  } else {
    await interaction.reply({ content: step1Message, components, flags: 64 });
    const reply = await interaction.fetchReply();
    session.messageIds.push(reply.id);
    setupSessions.set(sessionId, session);
  }
};

// Step 2: Show role and emoji selection controls with preview
const showSetupControls = async (interaction, client, sessionId, channelId, isUpdate = false) => {
  // Get fresh session data
  const session = setupSessions.get(sessionId);
  if (!session) {
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    }
    return;
  }

  // Get guild for emojis
  const guild = await client.guilds.fetch(session.guildId).catch(() => null);
  if (!guild) {
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: 'Guild not found.', ephemeral: true });
    }
    return;
  }

  // Create preview - include pending selections in preview if they exist
  const previewRoles = [...session.roles];
  if (session.pendingRole && session.pendingEmoji) {
    previewRoles.push({
      emoji: session.pendingEmoji,
      role: session.pendingRole
    });
  }
  
  const { content: previewContent } = createPreviewEmbed(
    session.title, 
    previewRoles, 
    session.titleBorder || 'none',
    session.topBorder || 'none',
    session.bottomBorder || 'none'
  );

  // Determine if editing existing role or creating new
  const isEditing = session.editingRoleIndex >= 0 && session.editingRoleIndex < session.roles.length;
  const currentRole = isEditing ? session.roles[session.editingRoleIndex] : null;
  
  // Initialize pending selections from current role if editing
  if (isEditing && currentRole && !session.pendingRole && !session.pendingEmoji) {
    session.pendingRole = currentRole.role;
    session.pendingEmoji = currentRole.emoji;
    setupSessions.set(sessionId, session);
  }

  // Create role and emoji select menus
  // Disable if there's an invalid role selected
  const hasInvalidRole = session.hasInvalidRole || false;
  
  const rolePlaceholder = session.pendingRole 
    ? `Selected: ${session.pendingRole.name}` 
    : 'Select a role...';
  const roleSelect = new RoleSelectMenuBuilder()
    .setCustomId(`setup_role_select:${channelId}`)
    .setPlaceholder(rolePlaceholder)
    .setMinValues(1)
    .setMaxValues(1);

  // Get emoji name for placeholder
  let emojiPlaceholder = 'Select an emoji...';
  if (session.pendingEmoji) {
    if (session.pendingEmoji.startsWith('<')) {
      // Custom emoji: <:name:id> or <a:name:id>
      const match = session.pendingEmoji.match(/<a?:(\w+):\d+>/);
      if (match) {
        emojiPlaceholder = `${session.pendingEmoji} ${match[1]}`;
      } else {
        emojiPlaceholder = `Selected: ${session.pendingEmoji}`;
      }
    } else {
      // Unicode emoji
      emojiPlaceholder = `${session.pendingEmoji} ${session.pendingEmoji}`;
    }
  }
  
  const emojiSelect = new StringSelectMenuBuilder()
    .setCustomId(`setup_emoji_select:${channelId}`)
    .setPlaceholder(emojiPlaceholder.length > 100 ? 'Selected emoji' : emojiPlaceholder)
    .setMinValues(1)
    .setMaxValues(1);

  // Get server emojis - filter to only show emojis with names containing "neko_role_"
  const serverEmojis = guild.emojis.cache
    .filter(emoji => emoji.name && emoji.name.includes('neko_role_'))
    .map(emoji => {
      const emojiString = emoji.animated 
        ? `<a:${emoji.name}:${emoji.id}>`
        : `<:${emoji.name}:${emoji.id}>`;
      return {
        label: emoji.name,
        value: emojiString,
        emoji: emoji.id,
        description: emoji.animated ? 'Animated emoji' : 'Static emoji'
      };
    });

  // Common unicode emojis for Step 2
  const commonEmojis = [
    { label: '🔥 Fire', value: '🔥', emoji: '🔥' },
    { label: '❤️ Heart', value: '❤️', emoji: '❤️' },
    { label: '⭐ Star', value: '⭐', emoji: '⭐' },
    { label: '🎉 Party', value: '🎉', emoji: '🎉' },
    { label: '🐱 Cat', value: '🐱', emoji: '🐱' }
  ];

  const maxOptions = 25;
  const needsMoreOption = serverEmojis.length > maxOptions;
  const availableSlots = needsMoreOption ? maxOptions - 1 : maxOptions;
  const commonCount = Math.min(commonEmojis.length, availableSlots);
  
  // Add common emojis first
  const emojiOptions = commonEmojis.slice(0, commonCount).map(opt => ({
    ...opt,
    default: session.pendingEmoji === opt.value
  }));
  emojiSelect.addOptions(emojiOptions);
  
  // Calculate remaining slots for server emojis
  const remainingSlots = availableSlots - commonCount;
  const serverCount = Math.min(serverEmojis.length, remainingSlots);
  
  let serverOptions = [];
  if (serverCount > 0) {
    serverOptions = serverEmojis.slice(0, serverCount).map(opt => ({
      ...opt,
      default: session.pendingEmoji === opt.value
    }));
    emojiSelect.addOptions(serverOptions);
  }
  
  // Add "more emojis" option if there are more server emojis available
  if (serverEmojis.length > serverCount && needsMoreOption) {
    emojiSelect.addOptions([{
      label: `+${serverEmojis.length - serverCount} more server emojis`,
      value: 'more_emojis',
      description: 'Use format: <:name:id>',
      emoji: '📋',
      default: false
    }]);
  }
  
  // If no server emojis found and we have space, add "more emojis" option
  if (serverEmojis.length === 0 && commonCount < availableSlots) {
    emojiSelect.addOptions([{
      label: 'Input custom emoji',
      value: 'more_emojis',
      description: 'Use format: <:name:id> or send a message with emoji',
      emoji: '📋',
      default: false
    }]);
  }

  // Create action buttons
  const editTitleButton = new ButtonBuilder()
    .setCustomId(`setup_edit_title:${channelId}`)
    .setLabel('Edit Title')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('✏️')
    .setDisabled(hasInvalidRole);

  const goToStep3Button = new ButtonBuilder()
    .setCustomId(`setup_step3:${channelId}`)
    .setLabel('Go to Step 3')
    .setStyle(ButtonStyle.Success)
    .setEmoji('➡️')
    .setDisabled(session.roles.length === 0 || hasInvalidRole);

  const cancelButton = new ButtonBuilder()
    .setCustomId(`setup_cancel:${channelId}`)
    .setLabel('Cancel')
    .setStyle(ButtonStyle.Danger)
    .setEmoji('❌')
    .setDisabled(hasInvalidRole);

  // Navigation buttons
  const buttons = [];
  
  // Show Previous button if there are previous roles to navigate to
  const hasPrevious = session.roles.length > 0 && session.editingRoleIndex > 0;
  if (hasPrevious) {
    const prevButton = new ButtonBuilder()
      .setCustomId(`setup_prev_role:${channelId}`)
      .setLabel('◀ Previous')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(hasInvalidRole);
    buttons.push(prevButton);
  }
  
  // Show Back button after adding first role (instead of Next)
  // Back button clears selections to start fresh
  const showBackButton = session.roles.length === 1 && session.editingRoleIndex === 0;
  if (showBackButton) {
    const backButton = new ButtonBuilder()
      .setCustomId(`setup_back_role:${channelId}`)
      .setLabel('◀ Back')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(hasInvalidRole);
    buttons.push(backButton);
  }
  
  // Build preview message with confirmation if role was just added
  let previewMessage = `👁️ **Preview**\n\n${previewContent}`;
  
  // Add confirmation line if a role was just added
  if (session.lastAddedRole) {
    previewMessage += `\n\n✅ **${session.lastAddedRole.name}** added (${session.lastAddedRole.totalCount} role${session.lastAddedRole.totalCount === 1 ? '' : 's'} total)`;
    // Clear the confirmation after showing it once
    session.lastAddedRole = null;
    setupSessions.set(sessionId, session);
  }
  
  // Add error message if there's an invalid role
  if (session.invalidRoleMessage) {
    previewMessage = `${session.invalidRoleMessage}\n\n${previewMessage}`;
  }

  // Add action buttons - Edit Title, Go to Step 3, Cancel
  buttons.push(editTitleButton, goToStep3Button, cancelButton);
  
  // Discord allows max 5 ActionRows per message and max 5 buttons per row
  // We have: 2 select menus (role, emoji) + 1 row with buttons (up to 5 buttons)
  const components = [
    new ActionRowBuilder().addComponents(roleSelect),
    new ActionRowBuilder().addComponents(emojiSelect)
  ];
  
  // Only add button row if we have buttons
  if (buttons.length > 0) {
    components.push(new ActionRowBuilder().addComponents(buttons));
  }

  if (isUpdate) {
    try {
      await interaction.update({ content: previewMessage, components, flags: 64 }); // 64 = EPHEMERAL
    } catch (err) {
      // If update fails, try to edit reply or send a new message
      if (interaction.deferred || interaction.replied) {
        try {
          await interaction.editReply({ content: previewMessage, components, flags: 64 });
        } catch (editErr) {
          // Ignore edit errors
        }
      }
    }
  } else {
    await interaction.reply({ content: previewMessage, components, flags: 64 }); // 64 = EPHEMERAL
    const reply = await interaction.fetchReply();
    session.messageIds.push(reply.id);
    setupSessions.set(sessionId, session);
  }
};

// Step 3: Show top and bottom border selection
const showStep3Controls = async (interaction, client, sessionId, channelId, isUpdate = false) => {
  const session = setupSessions.get(sessionId);
  if (!session) {
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: 'Session not found or expired.', ephemeral: true });
    }
    return;
  }

  // Create preview with current borders
  const { content: previewContent } = createPreviewEmbed(
    session.title,
    session.roles,
    session.titleBorder || 'none',
    session.topBorder || 'none',
    session.bottomBorder || 'none'
  );

  // Border options for top and bottom
  const borderOptions = [
    { label: 'No Border', value: 'none' },
    { label: 'Wavy', value: 'wavy' },
    { label: 'Stars', value: 'stars' },
    { label: 'Lines', value: 'lines' },
    { label: 'Decorative', value: 'decorative' },
    { label: 'Aesthetic 1', value: 'aesthetic1' },
    { label: 'Aesthetic 2', value: 'aesthetic2' },
    { label: 'Aesthetic 3', value: 'aesthetic3' },
    { label: 'Aesthetic 4', value: 'aesthetic4' },
    { label: 'Aesthetic 5', value: 'aesthetic5' }
  ];

  // Top border select
  const topBorderSelect = new StringSelectMenuBuilder()
    .setCustomId(`setup_top_border:${channelId}`)
    .setPlaceholder(`Top Border: ${borderOptions.find(opt => opt.value === (session.topBorder || 'none'))?.label || 'No Border'}`)
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(borderOptions.map(opt => ({
      ...opt,
      default: (session.topBorder || 'none') === opt.value
    })));

  // Bottom border select
  const bottomBorderSelect = new StringSelectMenuBuilder()
    .setCustomId(`setup_bottom_border:${channelId}`)
    .setPlaceholder(`Bottom Border: ${borderOptions.find(opt => opt.value === (session.bottomBorder || 'none'))?.label || 'No Border'}`)
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(borderOptions.map(opt => ({
      ...opt,
      default: (session.bottomBorder || 'none') === opt.value
    })));

  const previewMessage = `👁️ **Preview**\n\n${previewContent}\n\n**Step 3: Select Top and Bottom Borders**\n\nChoose borders to encase the role list.`;

  // Create action buttons
  const backButton = new ButtonBuilder()
    .setCustomId(`setup_back_step2:${channelId}`)
    .setLabel('Back to Step 2')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('⬅️');

  const createButton = new ButtonBuilder()
    .setCustomId(`setup_done:${channelId}`)
    .setLabel('Create Message')
    .setStyle(ButtonStyle.Success)
    .setEmoji('✅');

  const cancelButton = new ButtonBuilder()
    .setCustomId(`setup_cancel:${channelId}`)
    .setLabel('Cancel')
    .setStyle(ButtonStyle.Danger)
    .setEmoji('❌');

  const components = [
    new ActionRowBuilder().addComponents(topBorderSelect),
    new ActionRowBuilder().addComponents(bottomBorderSelect),
    new ActionRowBuilder().addComponents(backButton, createButton, cancelButton)
  ];

  if (isUpdate) {
    try {
      await interaction.update({ content: previewMessage, components, flags: 64 });
    } catch (err) {
      if (interaction.deferred || interaction.replied) {
        try {
          await interaction.editReply({ content: previewMessage, components, flags: 64 });
        } catch (editErr) {
          // Ignore edit errors
        }
      }
    }
  } else {
    await interaction.reply({ content: previewMessage, components, flags: 64 });
    const reply = await interaction.fetchReply();
    session.messageIds.push(reply.id);
    setupSessions.set(sessionId, session);
  }
};

module.exports = {
  showStep1Controls,
  showSetupControls,
  showStep3Controls
};

