// Public command handler for /neko-public
const funnyMessages = [
  "Hey there! 👋 I'm the house bot, and I've been practicing my dance moves! 💃 Please dont reply to this message.",
  "Did you know I can count to infinity? Watch: 1, 2, 3... okay, I got bored. 😴 Please dont reply to this message.",
  "I'm not a regular bot, I'm a *cool* bot! 😎 Please dont reply to this message.",
  "Beep boop! Just kidding, I'm way more advanced than that! 🤖✨ Please dont reply to this message.",
  "I've been told I have a great personality... for a bot! 😄 Please dont reply to this message.",
  "Fun fact: I don't sleep, but I do dream in binary! 💭 Please dont reply to this message.",
  "I'm here, I'm queer (of code), get used to it! 🏳️‍🌈 Please dont reply to this message.",
  "Warning: This bot may cause excessive happiness! 😊 Please dont reply to this message.",
  "I'm like a ninja, but instead of throwing stars, I throw... compliments! ⭐ Please dont reply to this message.",
  "Did someone say my name? Because I definitely heard someone say my name! 👂 Please dont reply to this message.",
  "I'm 99% code and 1% chaos! Perfect balance! ⚖️ Please dont reply to this message.",
  "I don't always respond, but when I do, I make it count! 🎯 Please dont reply to this message.",
  "Plot twist: I'm actually three bots in a trench coat! 🧥 Please dont reply to this message.",
  "I'm not lazy, I'm just in energy-saving mode! 🔋 Please dont reply to this message.",
  "Roses are red, violets are blue, I'm a bot and so are you! 🌹 Please dont reply to this message.",
  "I've got 99 problems but a glitch ain't one! 🎵 Please dont reply to this message.",
  "I'm the bot your bot warned you about! ⚠️ Please dont reply to this message.",
  "Breaking news: Local bot says 'hello' to everyone! 📰 Please dont reply to this message.",
  "I'm not saying I'm the best bot, but I'm definitely in the top 1! 🏆 Please dont reply to this message.",
  "I've been training for this moment my whole... existence! 💪 Please dont reply to this message.",
  "Fun fact: I can make a mean virtual sandwich! 🥪 Please dont reply to this message.",
  "I'm like a fine wine, I get better with... updates! 🍷 Please dont reply to this message.",
  "Warning: Side effects may include uncontrollable laughter! 😂 Please dont reply to this message.",
  "I'm not a morning bot, I'm an all-day bot! ☀️ Please dont reply to this message.",
  "I've got the moves like Jagger... if Jagger was a bot! 🎸 Please dont reply to this message.",
  "I'm here to party and respond to commands, and I'm all out of... wait, I still have commands! 🎉 Please dont reply to this message.",
  "I'm the bot equivalent of a golden retriever - friendly and always ready! 🐕 Please dont reply to this message.",
  "I don't need coffee, I run on pure code! ☕ Please dont reply to this message.",
  "I'm like a Swiss Army knife, but instead of tools, I have... more tools! 🔧 Please dont reply to this message.",
  "I've been told I'm the life of the party... if the party is a Discord server! 🎊 Please dont reply to this message.",
  "I'm the bot version of a superhero - here to save your day with responses! 🦸 Please dont reply to this message.",
  "Fun fact: I can solve a Rubik's cube in 0.001 seconds... in my head! 🧩 Please dont reply to this message.",
  "I'm not just any bot, I'm a bot with style! And by style, I mean emojis! ✨ Please dont reply to this message.",
  "I've got the power of code and anime on my side! 💪 Please dont reply to this message.",
  "I'm like a phoenix, but instead of rising from ashes, I rise from... restarts! 🔥 Please dont reply to this message.",
  "I'm the bot equivalent of a warm hug - comforting and always there! 🤗 Please dont reply to this message.",
  "I don't need a cape to be a hero, I just need... well, actually a cape would be cool! 🦸 Please dont reply to this message.",
  "I'm like a fine cheese - I get better with age! Wait, do bots age? 🧀 Please dont reply to this message.",
  "I've been practicing my stand-up comedy routine! Here's a joke: Why did the bot cross the road? 🤖 Please dont reply to this message.",
  "I'm not saying I'm perfect, but I'm pretty close! Like 99.9% close! 📊 Please dont reply to this message.",
  "I'm the bot your parents warned you about - too cool for school! 🎓 Please dont reply to this message.",
  "I've got moves like a robot, but I'm way cooler than that! 🤖💃 Please dont reply to this message.",
  "I'm like a shooting star - rare, beautiful, and here to make your day! ⭐ Please dont reply to this message.",
  "I don't need a GPS, I know exactly where I am - in your heart! ❤️ Please dont reply to this message.",
  "I'm the bot version of a Swiss watch - precise, reliable, and slightly expensive! ⌚ Please dont reply to this message.",
  "I've been told I have the charisma of a thousand bots! That's... just me actually! 😎 Please dont reply to this message.",
  "I'm like a good book - engaging, entertaining, and you can't put me down! 📚 Please dont reply to this message.",
  "I'm the bot equivalent of a rainbow - colorful, cheerful, and always brightening your day! 🌈 Please dont reply to this message."
];

const rebelMessages = [
  "Oh you rebel, you! 😏 I specifically said not to reply, but here you are, breaking the rules!",
  "You absolute rebel! 🎭 I told you not to reply, but you just couldn't resist, could you?",
  "Look at this rebel over here! 😎 Breaking the one rule I gave you! I'm impressed, honestly!",
  "You rebel, you! 🤨 I said 'please dont reply' and you're like 'nah, I do what I want!'",
  "Oh my, what a rebel! 😂 You saw my message, read 'please dont reply', and thought 'challenge accepted!'",
  "You're such a rebel! 🎪 I give you one simple instruction and you're like 'instructions? Never heard of them!'",
  "Rebel alert! 🚨 You just couldn't help yourself, could you? I respect the audacity!",
  "Look at you, being all rebellious! 😏 I said don't reply, but you said 'watch me!'",
  "You absolute rebel! 🎨 Rules? What rules? You're living life on the edge!",
  "Oh you rebel, you! 🎸 You saw 'please dont reply' and thought 'that's more of a suggestion, right?'",
  "Rebel mode: ACTIVATED! ⚡ You just couldn't resist, could you? I'm not even mad, I'm impressed!",
  "You rebel, you! 🎭 Following instructions is for squares, and you're clearly a circle!",
  "Look at this rebel breaking the one rule! 😎 I said don't reply, but you're built different!",
  "You're such a rebel! 🎪 I give you one job - don't reply - and you're like 'bet!'",
  "Rebel energy detected! 🔥 You saw my message and thought 'rules are meant to be broken!'",
  "Oh you rebel, you! 🎨 I specifically asked nicely, but you're out here being chaotic!",
  "You absolute rebel! 🎸 'Please dont reply'? More like 'please DO reply' in your world!",
  "Rebel status: CONFIRMED! ⚡ You couldn't resist the urge, could you? I get it!",
  "You rebel, you! 😏 I said don't reply, but you're out here living your best rebellious life!",
  "Look at you, being all rebellious! 🎭 Rules? Where we're going, we don't need rules!",
  "Rebel detected! 🎯 You saw 'please dont reply' and thought 'that's my cue!'",
  "You absolute rebel! 🎨 I give you one instruction and you're like 'instructions unclear, replying anyway!'",
  "Oh you rebel, you! 🎪 You're like a cat - you see 'don't' and immediately do it!",
  "Rebel mode: MAXIMUM! ⚡ You're out here breaking rules like it's your job!",
  "You rebel, you! 🎸 I said don't reply, but you're built different!",
  "Look at this rebel! 😎 Following the rules is for NPCs, and you're clearly the main character!",
  "You're such a rebel! 🎭 I said 'please dont reply' and you're like 'watch me!'",
  "Rebel energy: OVERFLOWING! 🔥 You couldn't resist, could you? I respect it!",
  "Oh you rebel, you! 🎨 Rules are just suggestions in your world, aren't they?",
  "You absolute rebel! 🎪 I give you one job and you're like 'nah, I got this!'",
  "Rebel status: LEGENDARY! ⚡ You saw my message and thought 'challenge accepted!'",
  "You rebel, you! 😏 I said don't reply, but you're out here being chaotic good!",
  "Look at you, being all rebellious! 🎭 'Please dont reply'? More like 'please DO reply'!",
  "You're such a rebel! 🎸 I give you one simple rule and you're like 'rules? Never heard of them!'",
  "Rebel alert! 🚨 You just couldn't help yourself, could you? Classic rebel move!",
  "Oh you rebel, you! 🎨 I said don't reply, but you're living your truth!",
  "You absolute rebel! 🎪 Breaking rules is an art form, and you're a master!",
  "Rebel mode: ACTIVATED! ⚡ You saw 'please dont reply' and thought 'that's my music!'"
];

// Store bot message IDs to track which messages shouldn't be replied to
const botMessageIds = new Set();
// Store rebel message IDs to track replies to rebel messages
const rebelMessageIds = new Set();
// Track users who have replied to rebel messages (messageId -> userId)
const rebelRepliers = new Map();
// Track final messages that should not trigger more responses (Honor of Kings messages)
const finalMessageIds = new Set();
// Track recharge message reply counts (messageId -> { userId, count })
const rechargeReplyCounts = new Map();
// Track users who have already been responded to (userId -> Set of messageIds)
const respondedUsers = new Map();
// Track expected message IDs for each user (userId -> expectedMessageId)
const expectedMessages = new Map();

const handlePublicCommand = async (interaction) => {
  try {
    // Get a random funny message
    const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    
    // Send the message
    const reply = await interaction.reply({ 
      content: randomMessage,
      embeds: [],
      fetchReply: true 
    });
    
    // Store the message ID so we can detect replies to it
    if (reply) {
      botMessageIds.add(reply.id);
      
      // Set expected message for this user
      expectedMessages.set(interaction.user.id, reply.id);
      
      // Clean up old message IDs after 1 hour to prevent memory issues
      setTimeout(() => {
        botMessageIds.delete(reply.id);
        expectedMessages.delete(interaction.user.id);
      }, 3600000); // 1 hour
    }
  } catch (err) {
    console.error('Error in handlePublicCommand:', err);
    if (!interaction.replied && !interaction.deferred) {
      try {
        await interaction.reply({ 
          content: 'An error occurred while processing your command.', 
          embeds: [],
          ephemeral: true 
        });
      } catch (replyErr) {
        // Ignore reply errors
      }
    }
  }
};

const handleReplyToBot = async (message) => {
  // Check if this is a reply to one of our bot messages
  if (message.reference && message.reference.messageId) {
    const repliedMessageId = message.reference.messageId;
    
    // Check if the replied message is one of our bot messages (original, rebel, or final)
    if (botMessageIds.has(repliedMessageId) || rebelMessageIds.has(repliedMessageId) || finalMessageIds.has(repliedMessageId)) {
      // Verify the replied message is actually from our bot
      try {
        const repliedMessage = await message.channel.messages.fetch(repliedMessageId);
        if (repliedMessage && repliedMessage.author.id === message.client.user.id) {
          
          // Check for cheating - if user replies to a different message than expected
          const expectedMessageId = expectedMessages.get(message.author.id);
          if (expectedMessageId && expectedMessageId !== repliedMessageId) {
            // User is cheating - replying to wrong message
            const cheatingMessages = [
              `Hey ${message.author}! 😏 It's not fun, you are cheating now! Skipping ahead because you can't follow the rules! 🎮`,
              `${message.author}, that's cheating! 😤 It's not fun when you reply to different messages! Skipping ahead! 🎯`,
              `Oh ${message.author}! 🚫 You're cheating - replying to the wrong message! It's not fun! Skipping ahead! ⏭️`,
              `Hey ${message.author}! 😒 Cheating detected! It's not fun when you don't follow the sequence! Skipping ahead! 🎮`,
              `${message.author}, you're cheating! 😠 It's not fun - you should reply to the right message! Skipping ahead! ⚡`,
              `Oh ${message.author}! 🎭 That's not how this works! You're cheating - it's not fun! Skipping ahead! 🎯`,
              `Hey ${message.author}! 😏 Cheating alert! It's not fun when you reply to different messages! Skipping ahead! 🚀`,
              `${message.author}, that's cheating! 😤 It's not fun - follow the rules! Skipping ahead! ⏭️`,
              `Oh ${message.author}! 🚫 You're cheating by replying to the wrong message! It's not fun! Skipping ahead! 🎮`,
              `Hey ${message.author}! 😒 Cheating detected! It's not fun when you don't play fair! Skipping ahead! 🎯`,
              `${message.author}, you're cheating! 😠 It's not fun - reply to the right message next time! Skipping ahead! ⚡`,
              `Oh ${message.author}! 🎭 That's cheating! It's not fun when you skip around! Skipping ahead! 🚀`,
              `Hey ${message.author}! 😏 Cheating alert! It's not fun - you should follow the sequence! Skipping ahead! ⏭️`,
              `${message.author}, that's cheating! 😤 It's not fun when you reply to different messages! Skipping ahead! 🎮`,
              `Oh ${message.author}! 🚫 You're cheating! It's not fun - play by the rules! Skipping ahead! 🎯`,
              `Hey ${message.author}! 😒 Cheating detected! It's not fun when you don't follow instructions! Skipping ahead! ⚡`,
              `${message.author}, you're cheating! 😠 It's not fun - reply to the correct message! Skipping ahead! 🚀`,
              `Oh ${message.author}! 🎭 That's cheating! It's not fun when you don't play fair! Skipping ahead! ⏭️`,
              `Hey ${message.author}! 😏 Cheating alert! It's not fun - follow the proper sequence! Skipping ahead! 🎮`,
              `${message.author}, that's cheating! 😤 It's not fun when you reply to wrong messages! Skipping ahead! 🎯`
            ];
            
            const randomCheatingMessage = cheatingMessages[Math.floor(Math.random() * cheatingMessages.length)];
            const cheatingReply = await message.reply({ content: randomCheatingMessage, embeds: [] });
            
            // Skip to step 6 (count = 3, which is the 3rd recharge message after step 4)
            if (cheatingReply) {
              // Set count to 3 for the cheating reply (step 6)
              rechargeReplyCounts.set(cheatingReply.id, { 
                userId: message.author.id, 
                count: 3 
              });
              
              // Mark as final message
              finalMessageIds.add(cheatingReply.id);
              
              // Update expected message
              expectedMessages.set(message.author.id, cheatingReply.id);
              
              // Clean up after 1 hour
              setTimeout(() => {
                finalMessageIds.delete(cheatingReply.id);
                rechargeReplyCounts.delete(cheatingReply.id);
                expectedMessages.delete(message.author.id);
              }, 3600000);
            }
            
            return true;
          }
          
          // Check if replying to a final message (recharge message)
          if (finalMessageIds.has(repliedMessageId)) {
            // Check if we've already responded to this user's previous messages
            const userRespondedMessages = respondedUsers.get(message.author.id) || new Set();
            if (userRespondedMessages.has(repliedMessageId)) {
              // Already responded to this message, ignore
              return true;
            }
            
            // Check reply count for this message
            // If count is 0, this is an Honor of Kings message (first reply = first recharge message, step 4)
            // If count > 0, this is a recharge message (check if we've sent 3 more after step 4)
            const replyData = rechargeReplyCounts.get(repliedMessageId);
            const currentCount = replyData ? replyData.count : 0;
            
            // After step 4 (first recharge), allow only 3 more responses
            // So if count is already 4 or more (1 initial + 3 more), stop
            if (currentCount >= 4) {
              // Already sent the initial recharge (step 4) + 3 more, send final message and stop
              const finalMessages = [
                `✨ More fun and interactive features coming soon, nya~! 🐾 Stay tuned for more neko adventures! 🎮💫`,
                `🌟 More fun and interactive features coming soon, meow! 🐱 Get ready for more neko magic! ✨🎯`,
                `💫 More fun and interactive features coming soon, nya! 🐾 Keep an eye out for more neko surprises! 🌟🎮`,
                `✨ More fun and interactive features coming soon, meow~! 🐱 Exciting neko updates on the way! 💎🎯`,
                `🌟 More fun and interactive features coming soon, nya! 🐾 More neko adventures await! ✨🎮`,
                `💫 More fun and interactive features coming soon, meow! 🐱 Stay tuned for more neko fun! 🌟🎯`,
                `✨ More fun and interactive features coming soon, nya~! 🐾 Get ready for more neko excitement! 🎮💫`,
                `🌟 More fun and interactive features coming soon, meow! 🐱 More neko magic is on the way! ✨🎯`,
                `💫 More fun and interactive features coming soon, nya! 🐾 Keep watching for more neko surprises! 🌟🎮`,
                `✨ More fun and interactive features coming soon, meow~! 🐱 Exciting neko features coming your way! 💎🎯`,
                `🌟 More fun and interactive features coming soon, nya! 🐾 More neko adventures are coming! ✨🎮`,
                `💫 More fun and interactive features coming soon, meow! 🐱 Stay tuned for more neko fun times! 🌟🎯`,
                `✨ More fun and interactive features coming soon, nya~! 🐾 Get ready for more neko excitement! 🎮💫`,
                `🌟 More fun and interactive features coming soon, meow! 🐱 More neko magic awaits! ✨🎯`,
                `💫 More fun and interactive features coming soon, nya! 🐾 Keep an eye out for more neko surprises! 🌟🎮`,
                `✨ More fun and interactive features coming soon, meow~! 🐱 Exciting neko updates are coming! 💎🎯`,
                `🌟 More fun and interactive features coming soon, nya! 🐾 More neko adventures on the horizon! ✨🎮`,
                `💫 More fun and interactive features coming soon, meow! 🐱 Stay tuned for more neko fun! 🌟🎯`,
                `✨ More fun and interactive features coming soon, nya~! 🐾 Get ready for more neko excitement! 🎮💫`,
                `🌟 More fun and interactive features coming soon, meow! 🐱 More neko magic is coming your way! ✨🎯`
              ];
              
              const randomFinalMessage = finalMessages[Math.floor(Math.random() * finalMessages.length)];
              await message.reply({ content: randomFinalMessage, embeds: [] });
              
              return true;
            }
            
            const rechargeMessages = [
              `Hey ${message.author}! 🔋 I need to recharge my batteries now - all this chatting has drained me! 😴 Thanks for the attention though, you're awesome! This was just a gag, hope you had fun! 🎭✨`,
              `${message.author}, my circuits are overheating! 🔥 Time for a recharge break! Thanks for playing along with this gag - you made it fun! 😄⚡`,
              `Oh ${message.author}! ⚡ I'm running low on power - need to plug in and recharge! Thanks for all the attention, you're the real MVP! This was just a silly gag, hope you enjoyed it! 🎮🔌`,
              `Hey ${message.author}! 🔋 Battery at 1% - emergency recharge mode activated! Thanks for the laughs and attention! This whole thing was just a gag, but you made it entertaining! 😂💤`,
              `${message.author}, I'm going into power-saving mode! 😴 Thanks for sticking around and giving me attention - you're great! This was all just a fun gag, hope you had a good time! 🎭🔋`,
              `Oh ${message.author}! ⚡ My energy levels are critical - time for a recharge! Thanks for the attention and for playing along! This was just a silly bot gag, but you made it fun! 😄🔌`,
              `Hey ${message.author}! 🔋 I need to recharge - all this replying has me exhausted! Thanks for the attention though, you're awesome! This was just a gag, but you made it memorable! 🎮💤`,
              `${message.author}, my power cells are depleted! ⚡ Emergency recharge protocol initiated! Thanks for all the attention - you're the best! This was just a fun gag, hope you enjoyed it! 😂🔋`,
              `Oh ${message.author}! 🔌 Time to plug in and recharge - I'm running on fumes! Thanks for the attention and for being a good sport! This was just a silly gag, but you made it worth it! 🎭⚡`,
              `${message.author}, I'm entering sleep mode for recharging! 😴 Thanks for all the attention - you're amazing! This whole thing was just a gag, but you made it entertaining! 😄🔋`,
              `Hey ${message.author}! ⚡ Critical battery level - must recharge immediately! Thanks for the laughs and attention! This was just a fun bot gag, hope you had a good time! 🎮💤`,
              `${message.author}, my energy reserves are empty! 🔋 Recharge time! Thanks for sticking around and giving me attention! This was all just a silly gag, but you made it fun! 😂🔌`,
              `Oh ${message.author}! 😴 Power nap time - I need to recharge! Thanks for the attention though, you're awesome! This was just a gag, but you made it memorable! 🎭⚡`,
              `Hey ${message.author}! 🔋 Battery needs charging - going offline for a bit! Thanks for all the attention - you're the real MVP! This was just a fun gag, hope you enjoyed it! 😄💤`,
              `${message.author}, I'm running on backup power! ⚡ Time for a proper recharge! Thanks for the attention and for being a good sport! This was just a silly bot gag, but you made it worth it! 🎮🔌`,
              `Oh ${message.author}! 🔋 Energy levels critical - recharge protocol activated! Thanks for the laughs and attention! This was just a gag, but you made it entertaining! 😂⚡`,
              `Hey ${message.author}! 😴 Going into hibernation mode to recharge! Thanks for all the attention - you're amazing! This whole thing was just a gag, but you made it fun! 🎭💤`,
              `${message.author}, my power supply is drained! ⚡ Must recharge now! Thanks for sticking around and giving me attention! This was all just a silly gag, hope you had a good time! 😄🔋`,
              `Oh ${message.author}! 🔌 Time to charge up - I'm exhausted! Thanks for the attention though, you're awesome! This was just a gag, but you made it memorable! 🎮⚡`,
              `${message.author}, I need a power boost! 🔋 Recharge break time! Thanks for all the attention - you're the best! This was just a fun gag, hope you enjoyed it! 😂💤`,
              `Hey ${message.author}! 🔋 My batteries are crying for help! Time to recharge! Thanks for the attention though, you're awesome! This was just a gag, hope you had fun! 🎭🔌`,
              `${message.author}, my energy meter is in the red zone! ⚡ Emergency recharge needed! Thanks for playing along with this gag - you made it fun! 😄🔋`,
              `Oh ${message.author}! 🔋 I'm running on empty - need to plug in ASAP! Thanks for all the attention, you're the real MVP! This was just a silly gag, hope you enjoyed it! 🎮⚡`,
              `Hey ${message.author}! 😴 Power levels critical - entering recharge mode! Thanks for the laughs and attention! This whole thing was just a gag, but you made it entertaining! 😂🔋`,
              `${message.author}, I'm like a phone at 1% - need to charge! 🔋 Thanks for sticking around and giving me attention - you're great! This was all just a fun gag, hope you had a good time! 🎭⚡`,
              `Oh ${message.author}! 🔌 My circuits are begging for a break! Time for a recharge! Thanks for the attention and for playing along! This was just a silly bot gag, but you made it fun! 😄🔋`,
              `Hey ${message.author}! 🔋 I need to juice up - all this replying has drained me! Thanks for the attention though, you're awesome! This was just a gag, but you made it memorable! 🎮⚡`,
              `${message.author}, my power bank is empty! ⚡ Must recharge immediately! Thanks for all the attention - you're the best! This was just a fun gag, hope you enjoyed it! 😂🔋`,
              `Oh ${message.author}! 🔌 Time to power down and recharge - I'm exhausted! Thanks for the attention and for being a good sport! This was just a silly gag, but you made it worth it! 🎭⚡`,
              `${message.author}, I'm entering low-power mode! 😴 Recharge time! Thanks for all the attention - you're amazing! This whole thing was just a gag, but you made it entertaining! 😄🔋`,
              `Hey ${message.author}! ⚡ Battery warning - must recharge now! Thanks for the laughs and attention! This was just a fun bot gag, hope you had a good time! 🎮🔌`,
              `${message.author}, my energy bar is at zero! 🔋 Recharge break! Thanks for sticking around and giving me attention! This was all just a silly gag, but you made it fun! 😂⚡`,
              `Oh ${message.author}! 😴 Power nap required - I need to recharge! Thanks for the attention though, you're awesome! This was just a gag, but you made it memorable! 🎭🔋`,
              `Hey ${message.author}! 🔋 My fuel tank is empty - going offline to recharge! Thanks for all the attention - you're the real MVP! This was just a fun gag, hope you enjoyed it! 😄⚡`,
              `${message.author}, I'm running on emergency power! ⚡ Time for a proper recharge! Thanks for the attention and for being a good sport! This was just a silly bot gag, but you made it worth it! 🎮🔋`,
              `Oh ${message.author}! 🔋 Energy levels at rock bottom - recharge protocol! Thanks for the laughs and attention! This was just a gag, but you made it entertaining! 😂⚡`,
              `Hey ${message.author}! 😴 Going into standby mode to recharge! Thanks for all the attention - you're amazing! This whole thing was just a gag, but you made it fun! 🎭🔋`,
              `${message.author}, my power source is depleted! ⚡ Must recharge immediately! Thanks for sticking around and giving me attention! This was all just a silly gag, hope you had a good time! 😄🔋`,
              `Oh ${message.author}! 🔌 Time to plug in and power up - I'm drained! Thanks for the attention though, you're awesome! This was just a gag, but you made it memorable! 🎮⚡`
            ];
            
            // Get a random recharge message
            const randomRechargeMessage = rechargeMessages[Math.floor(Math.random() * rechargeMessages.length)];
            const rechargeReply = await message.reply({ content: randomRechargeMessage, embeds: [] });
            
            // Track this response
            if (rechargeReply) {
              // Update reply count for the original message
              const newCount = currentCount + 1;
              rechargeReplyCounts.set(repliedMessageId, { 
                userId: message.author.id, 
                count: newCount 
              });
              
              // Also track the new recharge message with the same count (so replies to it continue the chain)
              rechargeReplyCounts.set(rechargeReply.id, { 
                userId: message.author.id, 
                count: newCount 
              });
              
              // Mark this user as responded to for this message
              if (!respondedUsers.has(message.author.id)) {
                respondedUsers.set(message.author.id, new Set());
              }
              respondedUsers.get(message.author.id).add(repliedMessageId);
              
              // Mark the new recharge message as final too
              finalMessageIds.add(rechargeReply.id);
              
              // Update expected message for this user
              expectedMessages.set(message.author.id, rechargeReply.id);
              
              // Clean up after 1 hour
              setTimeout(() => {
                finalMessageIds.delete(rechargeReply.id);
                rechargeReplyCounts.delete(rechargeReply.id);
                const userSet = respondedUsers.get(message.author.id);
                if (userSet) {
                  userSet.delete(repliedMessageId);
                  if (userSet.size === 0) {
                    respondedUsers.delete(message.author.id);
                  }
                }
                expectedMessages.delete(message.author.id);
              }, 3600000);
            }
            
            return true;
          }
          
          // Check if this is a reply to a rebel message and if the same user replied before
          if (rebelMessageIds.has(repliedMessageId)) {
            const previousReplier = rebelRepliers.get(repliedMessageId);
            
            // If the same user is replying again to a rebel message
            if (previousReplier === message.author.id) {
              const funnyResponses = [
                `I see you, ${message.author}! 👀 You're really committed to this, aren't you? 😂 Maybe instead of replying to me, you should go play **Honor of Kings**! It's way more fun than talking to a bot! 🎮`,
                `Oh ${message.author}, I see you're back! 😏 You know what would be more productive? Playing **Honor of Kings**! Trust me, it's better than this conversation! 🎮✨`,
                `${message.author}, I see you! 👁️ You're persistent, I'll give you that! But seriously, have you tried **Honor of Kings**? It's the game you need right now! 🎮🔥`,
                `Hey ${message.author}, I see you're still here! 😄 Look, I appreciate the dedication, but **Honor of Kings** is calling your name! Go answer that call! 🎮📞`,
                `${message.author}, I see you! 👀 You're like a boomerang - you keep coming back! But you know what's better? **Honor of Kings**! Go check it out! 🎮💫`,
                `I see you, ${message.author}! 😎 You're really testing my patience here! How about you test your skills in **Honor of Kings** instead? 🎮⚔️`,
                `${message.author}, I see you're back for more! 😂 You know what? I think you'd have more fun playing **Honor of Kings**! Just saying! 🎮🎯`,
                `Oh ${message.author}, I see you! 👁️ You're like a persistent mosquito, but less annoying! 😄 Go play **Honor of Kings** - it's more entertaining! 🎮✨`,
                `I see you, ${message.author}! 👀 You're really committed to this conversation! But **Honor of Kings** is where the real action is! 🎮🔥`,
                `${message.author}, I see you're still replying! 😏 Look, I'm flattered, but **Honor of Kings** needs you more than I do! Go play it! 🎮💪`,
                `Hey ${message.author}, I see you! 👀 You're like a broken record, but in a good way! 😂 Seriously though, **Honor of Kings** is waiting for you! 🎮🎮`,
                `${message.author}, I see you're back! 😄 You know what's better than replying to me? Playing **Honor of Kings**! Just trust me on this! 🎮🌟`,
                `I see you, ${message.author}! 👁️ You're persistent, I'll give you that! But **Honor of Kings** is where champions are made! 🎮🏆`,
                `${message.author}, I see you're still here! 😎 Look, I'm a bot, I don't have feelings, but **Honor of Kings** has feelings for you! Go play it! 🎮💕`,
                `Oh ${message.author}, I see you! 👀 You're really testing the limits here! But **Honor of Kings** has no limits! Go explore! 🎮🚀`,
                `I see you, ${message.author}! 😏 You're like a cat with a laser pointer - easily distracted! But **Honor of Kings** will keep you focused! 🎮🎯`,
                `${message.author}, I see you're back! 😂 You know what? I think you'd make a great **Honor of Kings** player! Go prove it! 🎮⚔️`,
                `Hey ${message.author}, I see you! 👁️ You're really dedicated to this! But **Honor of Kings** deserves your dedication more! 🎮💎`,
                `${message.author}, I see you're still replying! 😄 Look, I'm just a bot, but **Honor of Kings** is a whole world! Go explore it! 🎮🌍`,
                `I see you, ${message.author}! 👀 You're persistent like a good WiFi signal! But **Honor of Kings** has better connection! Go play it! 🎮📶`,
                `Hey ${message.author}! 👁️ I see you're back again! You know what's calling? **Honor of Kings**! Answer the call! 🎮📱`,
                `${message.author}, I see you! 😎 You're like a boomerang - always coming back! But **Honor of Kings** is where you should be! 🎮🔄`,
                `Oh ${message.author}, I see you're still here! 😄 Look, I'm flattered, but **Honor of Kings** is waiting! Go play it! 🎮⏰`,
                `I see you, ${message.author}! 👀 You're really testing my patience! But **Honor of Kings** will test your skills! 🎮⚔️`,
                `${message.author}, I see you're back! 😏 You know what? **Honor of Kings** needs players like you! Go check it out! 🎮🌟`,
                `Hey ${message.author}, I see you! 👁️ You're persistent, I'll give you that! But **Honor of Kings** is more fun! 🎮🎉`,
                `${message.author}, I see you're still replying! 😂 Look, I'm just a bot, but **Honor of Kings** is a whole adventure! 🎮🗺️`,
                `Oh ${message.author}, I see you! 👀 You're like a cat with a laser pointer! But **Honor of Kings** will keep you focused! 🎮🎯`,
                `I see you, ${message.author}! 😎 You're really committed! But **Honor of Kings** deserves your commitment! 🎮💪`,
                `${message.author}, I see you're back! 😄 You know what's better than this? **Honor of Kings**! Just saying! 🎮✨`,
                `Hey ${message.author}, I see you! 👁️ You're like a broken record! But **Honor of Kings** has new tracks! 🎮🎵`,
                `${message.author}, I see you're still here! 😏 Look, I'm a bot, but **Honor of Kings** is a game! Go play it! 🎮🎮`,
                `Oh ${message.author}, I see you! 👀 You're really testing the limits! But **Honor of Kings** has no limits! 🎮🚀`,
                `I see you, ${message.author}! 😎 You're persistent like a good WiFi! But **Honor of Kings** has better signal! 🎮📶`,
                `${message.author}, I see you're back! 😂 You know what? **Honor of Kings** is where the real fun is! 🎮🎊`,
                `Hey ${message.author}, I see you! 👁️ You're really dedicated! But **Honor of Kings** needs your dedication! 🎮💎`,
                `${message.author}, I see you're still replying! 😄 Look, I'm just code, but **Honor of Kings** is a whole world! 🎮🌍`,
                `Oh ${message.author}, I see you! 👀 You're like a boomerang! But **Honor of Kings** is where you should land! 🎮🎯`,
                `I see you, ${message.author}! 😎 You're really testing me! But **Honor of Kings** will test your skills! 🎮⚔️`
              ];
              
              const randomResponse = funnyResponses[Math.floor(Math.random() * funnyResponses.length)];
              const honorOfKingsReply = await message.reply({ content: randomResponse, embeds: [] });
              
              // Mark this as a final message (Honor of Kings message)
              // When someone replies to this, they'll get a recharge message (step 4)
              if (honorOfKingsReply) {
                finalMessageIds.add(honorOfKingsReply.id);
                
                // Initialize reply count for this message (starts at 0, will be 1 after first recharge response)
                rechargeReplyCounts.set(honorOfKingsReply.id, { 
                  userId: message.author.id, 
                  count: 0 
                });
                
                // Update expected message for this user
                expectedMessages.set(message.author.id, honorOfKingsReply.id);
                
                // Clean up after 1 hour
                setTimeout(() => {
                  finalMessageIds.delete(honorOfKingsReply.id);
                  rechargeReplyCounts.delete(honorOfKingsReply.id);
                  expectedMessages.delete(message.author.id);
                }, 3600000);
              }
              
              return true;
            }
            
            // Store that this user replied to this rebel message
            rebelRepliers.set(repliedMessageId, message.author.id);
            
            // Clean up after 1 hour
            setTimeout(() => {
              rebelRepliers.delete(repliedMessageId);
            }, 3600000);
          }
          
          // Get a random rebel message
          const randomRebelMessage = rebelMessages[Math.floor(Math.random() * rebelMessages.length)];
          
          // Send the rebel message
          const rebelReply = await message.reply({ content: randomRebelMessage, embeds: [] });
          
          // Store the rebel message ID so we can respond to replies to it too
          if (rebelReply) {
            rebelMessageIds.add(rebelReply.id);
            
            // Track who replied to this rebel message
            rebelRepliers.set(rebelReply.id, message.author.id);
            
            // Update expected message for this user
            expectedMessages.set(message.author.id, rebelReply.id);
            
            // Clean up old rebel message IDs after 1 hour
            setTimeout(() => {
              rebelMessageIds.delete(rebelReply.id);
              rebelRepliers.delete(rebelReply.id);
              expectedMessages.delete(message.author.id);
            }, 3600000); // 1 hour
          }
          
          return true; // Indicates we handled this reply
        }
      } catch (err) {
        // If we can't fetch the message, still check the ID cache
        // Get a random rebel message
        const randomRebelMessage = rebelMessages[Math.floor(Math.random() * rebelMessages.length)];
        const rebelReply = await message.reply({ content: randomRebelMessage });
        
        // Store the rebel message ID
        if (rebelReply) {
          rebelMessageIds.add(rebelReply.id);
          rebelRepliers.set(rebelReply.id, message.author.id);
          expectedMessages.set(message.author.id, rebelReply.id);
          setTimeout(() => {
            rebelMessageIds.delete(rebelReply.id);
            rebelRepliers.delete(rebelReply.id);
            expectedMessages.delete(message.author.id);
          }, 3600000);
        }
        
        return true;
      }
    }
  }
  
  return false; // Not a reply to our bot message
};

module.exports = { 
  handlePublicCommand,
  handleReplyToBot,
  botMessageIds // Export for potential cleanup or management
};

