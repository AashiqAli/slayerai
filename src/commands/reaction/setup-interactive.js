const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, RoleSelectMenuBuilder, StringSelectMenuBuilder } = require('discord.js');
const { addReactionRole } = require('../../utils/reactionRoles');

// Store temporary setup data (in production, use a database or cache)
const setupSessions = new Map();

// Export setupSessions for message handler
module.exports.setupSessions = setupSessions;

// Border style names mapping
const borderNames = {
  none: 'No Border',
  stars: 'Star Border',
  hearts: 'Heart Border',
  fire: 'Fire Border',
  moon: 'Moon Border',
  sun: 'Sun Border',
  flower: 'Flower Border',
  star: 'Star Emoji Border',
  crown: 'Crown Border',
  sparkle: 'Sparkle Border',
  diamond: 'Diamond Border',
  rainbow: 'Rainbow Border',
  lightning: 'Lightning Border',
  heartAesthetic: 'Heart Aesthetic',
  strawberry: 'Strawberry Border',
  hands: 'Hands Border',
  sparkleAesthetic: 'Sparkle Aesthetic',
  starAesthetic: 'Star Aesthetic',
  flowerAesthetic: 'Flower Aesthetic',
  moonAesthetic: 'Moon Aesthetic',
  diamondAesthetic: 'Diamond Aesthetic',
};

// Preview icons for title borders (short preview)
const titleBorderPreviews = {
  none: '',
  stars: '✨ Title ✨',
  hearts: '💗 Title 💗',
  fire: '🔥 Title 🔥',
  moon: '🌙 Title 🌙',
  sun: '☀️ Title ☀️',
  flower: '🌸 Title 🌸',
  star: '⭐ Title ⭐',
  crown: '👑 Title 👑',
  sparkle: '✨ Title ✨',
  diamond: '💎 Title 💎',
  lightning: '⚡ Title ⚡',
  heartAesthetic: '💗·̩͙ꕤ·̩͙ Title ·̩͙ꕤ·̩͙💗',
  strawberry: '🍓༺ Title ༻🍓',
  hands: '🫶🏻・. Title .・🫶🏻',
  sparkleAesthetic: '✨·̩͙ꕤ·̩͙ Title ·̩͙ꕤ·̩͙✨',
  starAesthetic: '⭐·̩͙ꕤ·̩͙ Title ·̩͙ꕤ·̩͙⭐',
  flowerAesthetic: '🌸·̩͙ꕤ·̩͙ Title ·̩͙ꕤ·̩͙🌸',
  moonAesthetic: '🌙·̩͙ꕤ·̩͙ Title ·̩͙ꕤ·̩͙🌙',
  diamondAesthetic: '💎·̩͙ꕤ·̩͙ Title ·̩͙ꕤ·̩͙💎',
};

// Title border formatters
const titleBorders = {
  none: (title) => `**${title}**`,
  stars: (title) => `✨ **${title}** ✨`,
  hearts: (title) => `💗 **${title}** 💗`,
  fire: (title) => `🔥 **${title}** 🔥`,
  moon: (title) => `🌙 **${title}** 🌙`,
  sun: (title) => `☀️ **${title}** ☀️`,
  flower: (title) => `🌸 **${title}** 🌸`,
  star: (title) => `⭐ **${title}** ⭐`,
  crown: (title) => `👑 **${title}** 👑`,
  sparkle: (title) => `✨ **${title}** ✨`,
  diamond: (title) => `💎 **${title}** 💎`,
  lightning: (title) => `⚡ **${title}** ⚡`,
  heartAesthetic: (title) => `💗·̩͙ꕤ·̩͙ **${title}** ·̩͙ꕤ·̩͙💗`,
  strawberry: (title) => `🍓༺ **${title}** ༻🍓`,
  hands: (title) => `🫶🏻・. **${title}** .・🫶🏻`,
  sparkleAesthetic: (title) => `✨·̩͙ꕤ·̩͙ **${title}** ·̩͙ꕤ·̩͙✨`,
  starAesthetic: (title) => `⭐·̩͙ꕤ·̩͙ **${title}** ·̩͙ꕤ·̩͙⭐`,
  flowerAesthetic: (title) => `🌸·̩͙ꕤ·̩͙ **${title}** ·̩͙ꕤ·̩͙🌸`,
  moonAesthetic: (title) => `🌙·̩͙ꕤ·̩͙ **${title}** ·̩͙ꕤ·̩͙🌙`,
  diamondAesthetic: (title) => `💎·̩͙ꕤ·̩͙ **${title}** ·̩͙ꕤ·̩͙💎`,
};

// Top and bottom border formatters (simple fixed borders)
const topBorders = {
  none: () => '',
  wavy: () => '╭────── · · ୨୧ · · ──────╮',
  stars: () => '✨ ────────────────── ✨',
  aesthetic1: () => '╴╴╴╴╴⊹ꮺ˚ ╴╴╴╴╴⊹˚ ╴╴╴╴˚ೃ ╴╴',
  aesthetic2: () => '.・。.・゜✭・.・✫・゜・。.',
  aesthetic3: () => '・・・・☆・・・・☆ ・・・・',
  aesthetic4: () => '‿︵‿︵‿୨ ୧‿︵‿︵‿',
  aesthetic5: () => '✿﹕ ︵︵✧₊︵︵ꕤ₊˚︵ ૮꒰˵• ᵜ •˵꒱ა ﹕ɞ'
};

const bottomBorders = {
  none: () => '',
  wavy: () => '╰────── · · ୨୧ · · ──────╯',
  stars: () => '✨ ────────────────── ✨',

  aesthetic1: () => '╴╴╴╴╴⊹ꮺ˚ ╴╴╴╴╴⊹˚ ╴╴╴╴˚ೃ ╴╴',
  aesthetic2: () => '.・。.・゜✭・.・✫・゜・。.',
  aesthetic3: () => '・・・・☆・・・・☆ ・・・・',
  aesthetic4: () => '‿︵‿︵‿୨ ୧‿︵‿︵‿',
  aesthetic5: () => '✿﹕ ︵︵✧₊︵︵ꕤ₊˚︵ ૮꒰˵• ᵜ •˵꒱ა ﹕ɞ'
};

// Combined formatter using title border and top/bottom borders
const formatMessage = (title, roles, titleBorder = 'none', topBorder = 'none', bottomBorder = 'none') => {
  const formatTitle = titleBorders[titleBorder] || titleBorders.none;
  const formatTop = topBorders[topBorder] || topBorders.none;
  const formatBottom = bottomBorders[bottomBorder] || bottomBorders.none;
  
  let bodyItems = [];
  if (roles.length === 0) {
    bodyItems = ['*No roles added yet.*'];
  } else {
    roles.forEach(({ emoji, role }) => {
      bodyItems.push(`${emoji} ✦ <@&${role.id}>`);
    });
  }
  
  // Apply top and bottom borders around the role list
  const bodyContent = bodyItems.join('\n');
  const topBorderLine = formatTop();
  const bottomBorderLine = formatBottom();
  
  let formattedBody = bodyContent;
  if (topBorderLine || bottomBorderLine) {
    const parts = [];
    if (topBorderLine) {
      parts.push(topBorderLine);
      parts.push(''); // Add empty line after top border
    }
    parts.push(bodyContent);
    if (bottomBorderLine) {
      parts.push(''); // Add empty line before bottom border
      parts.push(bottomBorderLine);
      parts.push(''); // Add empty line after bottom border
    }
    formattedBody = parts.join('\n');
  }
  
  return `${formatTitle(title)}\n\n${formattedBody}`;
};


const createPreviewEmbed = (title, roles, titleBorder = 'none', topBorder = 'none', bottomBorder = 'none') => {
  const formattedContent = formatMessage(title, roles, titleBorder, topBorder, bottomBorder);
  return { content: formattedContent };
};

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
    // Role select is always enabled so user can select a different role

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

const handleSetupInteractive = async (interaction, client) => {
  const channel = interaction.options.getChannel('channel');
  const title = interaction.options.getString('title');
  
  if (!channel?.isTextBased()) {
    await interaction.reply({ content: 'Invalid channel. Use a text channel.', ephemeral: true });
    return;
  }

  // Initialize session with new structure
  const sessionId = `${interaction.user.id}:${channel.id}`;
  setupSessions.set(sessionId, {
    userId: interaction.user.id,
    guildId: interaction.guildId,
    channelId: channel.id,
    title,
    roles: [],
    editingRoleIndex: -1,
    titleBorder: 'none',
    messageIds: [], // Track messages to delete
    pendingRole: null,
    pendingEmoji: null,
    step: 1 // Step 1: Title and border, Step 2: Role selection
  });

  // Show step 1: Title and title border selection
  await showStep1Controls(interaction, client, sessionId, channel.id);
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
  handleCancelButton,
  saveRolePair,
  setupSessions // Export setupSessions in the main export object
};

