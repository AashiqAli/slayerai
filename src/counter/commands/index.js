const { 
  resetCounter, 
  resetToCheckpoint, 
  setChannelId, 
  getChannelId,
  getCounterState,
  getTopContributors,
  getTopMistakes
} = require('../utils/counter');

// Handle counter reset command
const handleCounterReset = async (interaction) => {
  resetCounter();
  const state = getCounterState();
  
  await interaction.reply({
    content: `💥 **BOOM! Counter Reset!** 💥\n\nThe counter has been yeeted back to **0**! 🗿\n\n**Current State:**\n• Count: 0 (fresh start!)\n• Last Checkpoint: ${state.lastCheckpoint}\n• Contributors: 0 (everyone can count again!)\n\nTime to start counting from scratch! 🔢`,
    embeds: [],
    ephemeral: true
  });
};

// Handle counter reset to checkpoint command
const handleCounterResetToCheckpoint = async (interaction) => {
  const state = getCounterState();
  
  if (state.lastCheckpoint === 0) {
    await interaction.reply({
      content: `😅 **No Checkpoint Found!**\n\nThere's no checkpoint saved yet! Checkpoints are created every 10 numbers (at 10, 20, 30, 40, etc.).\n\nKeep counting and you'll get checkpoints! 🔢✨`,
      embeds: [],
      ephemeral: true
    });
    return;
  }
  
  resetToCheckpoint();
  const newState = getCounterState();
  
  await interaction.reply({
    content: `🎯 **Checkpoint Restore Activated!** 🎯\n\nThe counter has been rewound to checkpoint **${state.lastCheckpoint}**! 🕰️\n\n**Current State:**\n• Count: ${newState.currentCount} (back at checkpoint!)\n• Last Checkpoint: ${newState.lastCheckpoint}\n• Contributors: ${newState.totalContributors} (cleared for fresh start!)\n\nTime to continue from here! 🚀`,
    embeds: [],
    ephemeral: true
  });
};

// Handle set counter channel command
const handleSetCounterChannel = async (interaction) => {
  const channel = interaction.options.getChannel('channel', true);
  
  if (!channel) {
    await interaction.reply({
      content: '😤 **Invalid Channel!**\n\nPlease specify a valid channel, my friend! The counter bot needs somewhere to listen! 👂',
      embeds: [],
      ephemeral: true
    });
    return;
  }
  
  setChannelId(channel.id);
  const state = getCounterState();
  
  await interaction.reply({
    content: `🎧 **Counter Channel Locked In!** 🎧\n\nThe counter bot is now listening to ${channel}! 👂✨\n\n**Current State:**\n• Channel: ${channel} (ready to count!)\n• Count: ${state.currentCount}\n• Last Checkpoint: ${state.lastCheckpoint}\n\nLet the counting begin! 🔢🎉`,
    embeds: [],
    ephemeral: true
  });
};

// Handle leaderboard command
const handleLeaderboard = async (interaction) => {
  const topContributors = getTopContributors(10);
  
  if (topContributors.length === 0) {
    await interaction.reply({
      content: `🏆 **Top Contributors Leaderboard** 🏆\n\n📭 *No contributions yet! Be the first to count and get on the leaderboard!* 🎯`,
      embeds: [],
      ephemeral: false
    });
    return;
  }

  // Fetch display names (server nicknames) for all users
  const guild = interaction.guild;
  const leaderboardEntries = await Promise.all(
    topContributors.map(async (entry) => {
      try {
        if (guild) {
          const member = await guild.members.fetch(entry.userId);
          return { ...entry, displayName: member.displayName };
        } else {
          const user = await interaction.client.users.fetch(entry.userId);
          return { ...entry, displayName: user.username };
        }
      } catch {
        return { ...entry, displayName: `Unknown (${entry.userId})` };
      }
    })
  );

  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
  const leaderboardLines = leaderboardEntries.map((entry, index) => {
    const medal = medals[index] || `${index + 1}.`;
    const count = entry.count;
    const plural = count === 1 ? 'time' : 'times';
    return `${medal} **${entry.displayName}** - **${count}** ${plural}`;
  });

  const funMessages = [
    `🏆 **Top Contributors Leaderboard** 🏆\n\nThese legends are carrying the counter! 💪✨\n\n${leaderboardLines.join('\n')}\n\nKeep counting to climb the ranks! 🔢🚀`,
    `🌟 **Counting Champions** 🌟\n\nThese heroes are making the numbers go brrr! 🔥\n\n${leaderboardLines.join('\n')}\n\nWho will be next to join the elite? 👀`,
    `💎 **Elite Counters Club** 💎\n\nThese masters of mathematics are on fire! 🔥📊\n\n${leaderboardLines.join('\n')}\n\nCan you beat them? Challenge accepted? 🎯`,
    `⚡ **Top 10 Counting Legends** ⚡\n\nThese counting wizards are absolutely crushing it! 🧙‍♂️✨\n\n${leaderboardLines.join('\n')}\n\nWant to see your name here? Start counting! 🎲`,
    `🎖️ **Hall of Fame: Counting Edition** 🎖️\n\nThese number ninjas are unstoppable! 🥷🔢\n\n${leaderboardLines.join('\n')}\n\nThe competition is real! Who's next? 🏃‍♂️💨`
  ];

  const message = funMessages[Math.floor(Math.random() * funMessages.length)];

  await interaction.reply({
    content: message,
    embeds: [],
    ephemeral: false
  });
};

// Handle mistakes leaderboard command
const handleMistakesLeaderboard = async (interaction) => {
  const topMistakes = getTopMistakes(10);
  
  if (topMistakes.length === 0) {
    await interaction.reply({
      content: `😅 **Mistakes Leaderboard** 😅\n\n🎉 *Perfect! No mistakes yet! Everyone is being careful!* ✨`,
      embeds: [],
      ephemeral: false
    });
    return;
  }

  // Fetch display names (server nicknames) for all users
  const guild = interaction.guild;
  const leaderboardEntries = await Promise.all(
    topMistakes.map(async (entry) => {
      try {
        if (guild) {
          const member = await guild.members.fetch(entry.userId);
          return { ...entry, displayName: member.displayName };
        } else {
          const user = await interaction.client.users.fetch(entry.userId);
          return { ...entry, displayName: user.username };
        }
      } catch {
        return { ...entry, displayName: `Unknown (${entry.userId})` };
      }
    })
  );

  const mistakeEmojis = ['💥', '💀', '🗿', '😭', '🤡', '🤦', '🙈', '😅', '🤷', '🎭'];
  const leaderboardLines = leaderboardEntries.map((entry, index) => {
    const emoji = mistakeEmojis[index] || `${index + 1}.`;
    const count = entry.count;
    const plural = count === 1 ? 'mistake' : 'mistakes';
    return `${emoji} **${entry.displayName}** - **${count}** ${plural}`;
  });

  const funMessages = [
    `😅 **Top 10 Mistake Makers** 😅\n\nThese rebels tried their best... but math said no! 💀\n\n${leaderboardLines.join('\n')}\n\nIt's okay, mistakes make us stronger! 💪✨`,
    `🤡 **Hall of Oops** 🤡\n\nThese legends said "let me try" and chaos ensued! 🎭\n\n${leaderboardLines.join('\n')}\n\nWe appreciate the effort though! 😂🙏`,
    `💀 **Mistake Champions** 💀\n\nThese brave souls dared to count... and failed spectacularly! 🎪\n\n${leaderboardLines.join('\n')}\n\nBut hey, at least you tried! 🥲👏`,
    `🗿 **Top 10 Who Said "Oops"** 🗿\n\nThese counting warriors had a moment... or several! 😂\n\n${leaderboardLines.join('\n')}\n\nPractice makes perfect! Keep trying! 💪🎯`,
    `😭 **The "Almost Got It" Club** 😭\n\nThese heroes were so close... yet so far! 🎢\n\n${leaderboardLines.join('\n')}\n\nDon't give up! You'll get it next time! 🌟✨`
  ];

  const message = funMessages[Math.floor(Math.random() * funMessages.length)];

  await interaction.reply({
    content: message,
    embeds: [],
    ephemeral: false
  });
};

module.exports = {
  handleCounterReset,
  handleCounterResetToCheckpoint,
  handleSetCounterChannel,
  handleLeaderboard,
  handleMistakesLeaderboard
};

