const { getChannelId, processCounterMessage, resetToCheckpoint, getCounterState, getActiveChallengeMessages, getNextValidNumber } = require('../utils/counter');

// Track last time active challenges reminder was shown per channel
// Format: Map<channelId, timestamp>
const lastReminderTimestamps = new Map();

// Reminder cooldown: 20 seconds (20000 ms)
const REMINDER_COOLDOWN_MS = 20000;

const handleCounterMessage = async (message, client) => {
  // Ignore bot messages
  if (message.author.bot) return false;

  // Counter bot - listen to configured channel
  const counterChannelId = getChannelId();
  
  if (!counterChannelId || message.channel.id !== counterChannelId) {
    return false; // Not a counter channel message
  }

  const result = processCounterMessage(message.content, message.author.id, message.createdTimestamp);
  
  if (result === null) {
    return false; // Not a numeric message
  }

  // This is a numeric message, process it
  if (result.valid) {
    // Correct number from a new user - react with :neko_role_love:
    try {
      // Try to find the custom emoji in the guild
      const customEmoji = message.guild?.emojis.cache.find(emoji => emoji.name === 'neko_role_love');
      if (customEmoji) {
        await message.react(customEmoji);
      } else {
        // Fallback to emoji name format if not found in cache
        await message.react('❤️');
        console.warn('Custom emoji :neko_role_love: not found, using fallback ❤️');
      }
    } catch (err) {
      console.error('Failed to react with :neko_role_love:', err);
    }
    
    // Check if checkpoint was reached and send funny message
    if (result.checkpointReached) {
      const checkpointNumber = result.actualCount;
      const checkpointMessages = [
        `🎉 **CHECKPOINT REACHED!** 🎉\n\nWe hit **${checkpointNumber}**! Time to celebrate! 🎊✨\n\nGreat job everyone! Keep counting! 🔢🚀`,
        `🏆 **CHECKPOINT ACHIEVED!** 🏆\n\n**${checkpointNumber}** reached! You're all doing amazing! 💪🎯\n\nLet's keep this momentum going! 🔥`,
        `✨ **CHECKPOINT MILESTONE!** ✨\n\nWe made it to **${checkpointNumber}**! 🎊🎉\n\nThis is getting exciting! Keep up the great work! 🌟`,
        `🎯 **CHECKPOINT UNLOCKED!** 🎯\n\n**${checkpointNumber}** achieved! You legends are crushing it! 💎🔥\n\nOnward to the next milestone! 🚀`,
        `🎊 **CHECKPOINT CELEBRATION!** 🎊\n\n**${checkpointNumber}** reached! Amazing teamwork! 👏✨\n\nThe counter gods are proud! Keep counting! 🔢💪`,
        `🌟 **CHECKPOINT SUCCESS!** 🌟\n\nWe hit **${checkpointNumber}**! Everyone's a hero! 🦸‍♂️🦸‍♀️\n\nTime to aim for the next one! 🎯🔥`,
        `💫 **CHECKPOINT MOMENT!** 💫\n\n**${checkpointNumber}** achieved! The numbers are on fire! 🔥📊\n\nYou're all counting champions! 🏅✨`,
        `🎖️ **CHECKPOINT VICTORY!** 🎖️\n\n**${checkpointNumber}** reached! This is epic! 🎉🚀\n\nKeep the counting train rolling! 🚂💨`
      ];
      const checkpointMessage = checkpointMessages[Math.floor(Math.random() * checkpointMessages.length)];
      
      // Get active challenge messages
      const activeChallenges = getActiveChallengeMessages();
      let fullMessage = checkpointMessage;
      if (activeChallenges.length > 0) {
        fullMessage += '\n\n**⚠️ NEW CHALLENGES ACTIVATED! ⚠️**\n\n' + activeChallenges.join('\n');
      }
      
      try {
        await message.channel.send({
          content: fullMessage,
          embeds: []
        });
        console.log(`Counter bot: ✅ Checkpoint message sent for ${checkpointNumber}`);
      } catch (err) {
        console.error('❌ Counter bot: Failed to send checkpoint message:', err);
      }
    }
    
    return true;
  } else {
    // Invalid - wrong number or consecutive user
    console.log('Counter bot: Invalid message detected', {
      reason: result.reason,
      expectedCount: result.expectedCount,
      actualCount: result.actualCount,
      userId: message.author.id,
      username: message.author.username
    });
    
    // Get current state before resetting
    const stateBeforeReset = getCounterState();
    const checkpoint = stateBeforeReset.lastCheckpoint;
    
    // Reset to checkpoint
    resetToCheckpoint();
    
    // Get the new expected count after reset
    const newState = getCounterState();
    // Calculate next number accounting for pattern challenges
    const isReverse = newState.challenges?.reverse || false;
    const nextNumber = getNextValidNumber(newState.currentCount, isReverse);
    
    console.log('Counter bot: After reset', {
      checkpoint,
      currentCount: newState.currentCount,
      nextNumber
    });
    
    // React with :neko_role_kitty_nope: emoji
    try {
      // Try to find the custom emoji in the guild
      const customEmoji = message.guild?.emojis.cache.find(emoji => emoji.name === 'neko_role_kitty_nope');
      if (customEmoji) {
        await message.react(customEmoji);
      } else {
        // Fallback to ❌ if not found in cache
        await message.react('❌');
        console.warn('Custom emoji :neko_role_kitty_nope: not found, using fallback ❌');
      }
    } catch (err) {
      console.error('Failed to react with :neko_role_kitty_nope:', err);
    }
    
    // Get active challenges before reset (challenges are preserved)
    const activeChallenges = getActiveChallengeMessages();
    
    // Helper function to generate example based on ALL active challenges
    // Handles all combinations: emoji, math equations, pattern rules
    const getExampleForNumber = (num) => {
      // Use newState which has the latest challenges after reset
      const challenges = newState.challenges || {};
      const examples = [];
      
      // Base example: plain number with emoji if required
      let baseExample = `${num}`;
      if (challenges.emoji && challenges.emoji.active && challenges.emoji.requiredEmoji) {
        baseExample = `${num} ${challenges.emoji.requiredEmoji}`;
      }
      examples.push(baseExample);
      
      // Math equation example if math problem mode is active
      if (challenges.mathProblem && challenges.mathProblem.active) {
        const a = Math.floor(Math.random() * Math.max(1, num - 1)) + 1;
        const b = num - a;
        let mathExample = `${a} + ${b}`;
        // Add emoji to math example too if required
        if (challenges.emoji && challenges.emoji.active && challenges.emoji.requiredEmoji) {
          mathExample = `${mathExample} ${challenges.emoji.requiredEmoji}`;
        }
        examples.push(`"${mathExample}"`);
      }
      
      // Combine all examples with "or"
      return examples.join(' or ');
    };
    
    // Get example for next number with all challenge combinations
    const nextNumberExample = getExampleForNumber(nextNumber);
    
    // Send appropriate message with hilarious explanation
    let resetMessage;
    if (result.reason === 'consecutive_user') {
      // Same user posted consecutively (thumb rule violation)
      const consecutiveMessages = [
        `${message.author.toString()} bro... you just posted! 😂 **No consecutive posts allowed!** The previous sender must always be different. Let someone else count! Back to checkpoint.\n\n**Why?** You posted twice in a row - the thumb rule says no consecutive posts!\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`,
        `${message.author.toString()} trying to post twice in a row? 🤨 **Nope!** No user may post twice consecutively - that's the thumb rule! Reset to checkpoint.\n\n**Why?** Same user can't post consecutively - someone else needs to count next!\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`,
        `${message.author.toString()} be like "let me count again right away" 💀 **Can't do that!** The previous sender must always be different. Back to checkpoint we go!\n\n**Why?** Consecutive posts from the same user are not allowed!\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`,
        `${message.author.toString()} really said "let me post consecutively" 🗿 **Sorry champ, that's not allowed!** No consecutive posts - someone else needs to count next! Reset to checkpoint.\n\n**Why?** The thumb rule: previous sender must always be different!\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`,
        `${message.author.toString()} thought they could post back-to-back... **Plot twist:** You can't! 😎 The thumb rule says no consecutive posts! Back to checkpoint.\n\n**Why?** You posted when you were the last person - that's not allowed!\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`
      ];
      resetMessage = consecutiveMessages[Math.floor(Math.random() * consecutiveMessages.length)];
    } else if (result.challengeErrors && result.challengeErrors.length > 0) {
      // Challenge violation(s) - show all violations
      const violationMessages = result.challengeErrors.map(err => err.message);
      const firstViolation = violationMessages[0];
      
      // Format all violations clearly
      let violationsText;
      if (violationMessages.length === 1) {
        violationsText = `**${violationMessages[0]}**`;
      } else {
        // Multiple violations - list them clearly
        violationsText = violationMessages.map((msg, idx) => `${idx + 1}. **${msg}**`).join('\n');
      }
      
      resetMessage = `${message.author.toString()} ${firstViolation} Back to checkpoint.\n\n**Why?** You violated the following challenge rule(s):\n${violationsText}\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`;
    } else {
      // Wrong number - show example for the CORRECT number (expectedNum), not nextNumber
      const expectedNum = result.expectedCount;
      const actualNum = result.actualCount;
      // Use newState for correct answer example too (challenges are preserved)
      const example = getExampleForNumber(expectedNum);
      
      if (checkpoint === 0) {
        const wrongNumberMessages = [
          `Bruh... we expected **${expectedNum}** but got **${actualNum}** 😭 Back to square one we go!\n\n**Why?** Wrong number! We needed ${expectedNum}, but you said ${actualNum}.\n**Correct answer:** ${expectedNum}\n**Example:** ${example}\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`,
          `Someone said **${actualNum}** when we needed **${expectedNum}** 💀 Time to start from scratch!\n\n**Why?** The sequence was broken - expected ${expectedNum}, got ${actualNum} instead.\n**Correct answer:** ${expectedNum}\n**Example:** ${example}\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`,
          `Expected **${expectedNum}**, got **${actualNum}** instead 🗿 The count has been reset!\n\n**Why?** Wrong number in sequence! Should have been ${expectedNum}.\n**Correct answer:** ${expectedNum}\n**Example:** ${example}\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`,
          `**${actualNum}**? We needed **${expectedNum}**! 😂 Guess we're starting over!\n\n**Why?** You said ${actualNum} but the correct number was ${expectedNum}.\n**Correct answer:** ${expectedNum}\n**Example:** ${example}\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`,
          `The math ain't mathing... Expected **${expectedNum}**, received **${actualNum}** 🧮 Back to zero!\n\n**Why?** Number mismatch! Expected ${expectedNum}, got ${actualNum}.\n**Correct answer:** ${expectedNum}\n**Example:** ${example}\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`
        ];
        resetMessage = wrongNumberMessages[Math.floor(Math.random() * wrongNumberMessages.length)];
      } else {
        const checkpointMessages = [
          `Thank the counter gods! 🛐 We're at a checkpoint! Expected **${expectedNum}** but got **${actualNum}**. Saved by the checkpoint!\n\n**Why?** Wrong number! We needed ${expectedNum}, but you said ${actualNum}. Checkpoint saved us from going back to 0!\n**Correct answer:** ${expectedNum}\n**Example:** ${example}\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`,
          `Checkpoint activated! ✨ Expected **${expectedNum}**, got **${actualNum}** instead. We're safe at checkpoint!\n\n**Why?** You said ${actualNum} but should have said ${expectedNum}. Good thing we had a checkpoint!\n**Correct answer:** ${expectedNum}\n**Example:** ${example}\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`,
          `Phew! Checkpoint saved us! 😅 Expected **${expectedNum}** but someone said **${actualNum}**. Back to checkpoint we go!\n\n**Why?** Wrong number (${actualNum} instead of ${expectedNum}), but checkpoint prevented full reset!\n**Correct answer:** ${expectedNum}\n**Example:** ${example}\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`,
          `Checkpoint moment! 🎯 We needed **${expectedNum}**, got **${actualNum}**. Thank goodness for checkpoints!\n\n**Why?** Number was wrong (${actualNum} ≠ ${expectedNum}), but checkpoint saved the day!\n**Correct answer:** ${expectedNum}\n**Example:** ${example}\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`,
          `Checkpoint to the rescue! 🦸 Expected **${expectedNum}**, received **${actualNum}**. We're back at checkpoint!\n\n**Why?** You said ${actualNum} when we needed ${expectedNum}. Checkpoint prevented disaster!\n**Correct answer:** ${expectedNum}\n**Example:** ${example}\n**Next number:** ${nextNumber}\n**Example:** ${nextNumberExample}`
        ];
        resetMessage = checkpointMessages[Math.floor(Math.random() * checkpointMessages.length)];
      }
    }
    
    // Add active challenge reminders to reset message (only if 60 seconds have passed since last reminder)
    const channelId = message.channel.id;
    const now = Date.now();
    const lastReminderTime = lastReminderTimestamps.get(channelId) || 0;
    const timeSinceLastReminder = now - lastReminderTime;
    
    if (activeChallenges.length > 0 && timeSinceLastReminder >= REMINDER_COOLDOWN_MS) {
      resetMessage += '\n\n**⚠️ REMINDER: Active Challenges ⚠️**\n\n' + activeChallenges.join('\n');
      lastReminderTimestamps.set(channelId, now);
    }
    
    // Send message in the same channel (plain text, not embed)
    console.log(`Counter bot: About to send message: "${resetMessage}"`);
    try {
      const sent = await message.channel.send({
        content: resetMessage,
        embeds: []
      });
      console.log(`Counter bot: ✅ Successfully sent message with ID: ${sent.id}`);
    } catch (err) {
      console.error('❌ Counter bot: Failed to send reset message:', err);
      console.error('Error details:', {
        error: err.message,
        code: err.code,
        stack: err.stack,
        channelId: message.channel.id,
        channelName: message.channel.name,
        hasSendPermission: message.channel.permissionsFor(message.client.user)?.has('SendMessages')
      });
    }
    return true;
  }
};

module.exports = { handleCounterMessage };

