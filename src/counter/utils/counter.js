const fs = require('fs');
const path = require('path');

// Helper function to check if a number is prime
const isPrime = (num) => {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  for (let i = 3; i * i <= num; i += 2) {
    if (num % i === 0) return false;
  }
  return true;
};

// Get list of small prime numbers (for skip_multiple challenges)
const getSmallPrimes = () => [2, 3, 5, 7, 11, 13, 17, 19];

// ============================================================================
// COUNTER DATA STORAGE LOCATION
// ============================================================================
// All counter values are stored in: data/counter.json
// This file contains:
//   - currentCount: The current number in the sequence
//   - lastCheckpoint: The last saved checkpoint (every 10 numbers)
//   - channelId: The Discord channel ID where the counter listens
//   - contributors: Object mapping user IDs to their contribution count
//
// File path: data/counter.json (relative to project root)
// ============================================================================
const COUNTER_DATA_PATH = path.join(__dirname, '../../../data/counter.json');

// Counter state structure:
// {
//   currentCount: number,
//   lastCheckpoint: number,  // Last saved checkpoint (multiple of 10)
//   channelId: string | null, // Channel ID where counter listens
//   lastUserId: string | null, // Last user who posted (to prevent consecutive posts)
//   contributors: {          // Map of userId -> contribution count
//     "userId1": 5,  // User counted 5 times
//     "userId2": 3,  // User counted 3 times
//     ...
//   },
//   mistakes: {              // Map of userId -> mistake count
//     "userId1": 2,  // User made 2 mistakes
//     "userId2": 1,  // User made 1 mistake
//     ...
//   },
//   challenges: {            // Active challenge rules
//     pattern: { active: boolean, type: string, value: number }, // "even", "odd", "skip_multiple"
//     emoji: { active: boolean, requiredEmoji: string },
//     reverse: boolean,  // true = counting backwards
//     mathProblem: { active: boolean, problem: string, answer: number },
//     checkpointChallenge: { active: boolean, format: string }
//   }
// }

let counterState = {
  currentCount: 0,
  lastCheckpoint: 0,
  channelId: null,
  lastUserId: null,
  contributors: {},
  mistakes: {},
  challenges: {
    pattern: { active: false, type: null, value: null },
    emoji: { active: false, requiredEmoji: null },
    reverse: false,
    mathProblem: { active: false, problem: null, answer: null },
    checkpointChallenge: { active: false, format: null }
  }
};

// Migrate old contributors format (count -> userId) to new format (userId -> count)
const migrateContributors = (oldContributors) => {
  if (!oldContributors || typeof oldContributors !== 'object') {
    return {};
  }
  
  // Check if it's already in the new format (userId -> count)
  const firstKey = Object.keys(oldContributors)[0];
  if (firstKey && !isNaN(parseInt(firstKey))) {
    // Old format: keys are numbers (counts), values are userIds
    // Check if values look like user IDs (long numeric strings)
    const firstValue = oldContributors[firstKey];
    if (typeof firstValue === 'string' && firstValue.length > 10) {
      // This is old format, migrate it
      const newContributors = {};
      for (const [count, userId] of Object.entries(oldContributors)) {
        if (userId) {
          newContributors[userId] = (newContributors[userId] || 0) + 1;
        }
      }
      return newContributors;
    }
  }
  
  // Already in new format or empty
  return oldContributors;
};

// Load counter data
const loadCounterData = () => {
  try {
    if (fs.existsSync(COUNTER_DATA_PATH)) {
      const data = JSON.parse(fs.readFileSync(COUNTER_DATA_PATH, 'utf8'));
      const migratedContributors = migrateContributors(data.contributors);
      counterState = {
        currentCount: data.currentCount || 0,
        lastCheckpoint: data.lastCheckpoint || 0,
        channelId: data.channelId || null,
        lastUserId: data.lastUserId || null,
        contributors: migratedContributors,
        mistakes: data.mistakes || {},
        challenges: data.challenges || {
          pattern: { active: false, type: null, value: null },
          emoji: { active: false, requiredEmoji: null },
          reverse: false,
          mathProblem: { active: false, problem: null, answer: null },
          checkpointChallenge: { active: false, format: null }
        }
      };
      // Save migrated data if migration occurred
      if (migratedContributors !== data.contributors) {
        saveCounterData();
      }
    } else {
      // Initialize with default values
      counterState = {
        currentCount: 0,
        lastCheckpoint: 0,
        channelId: null,
        lastUserId: null,
        contributors: {},
        mistakes: {},
        challenges: {
          pattern: { active: false, type: null, value: null },
          emoji: { active: false, requiredEmoji: null },
          reverse: false,
          mathProblem: { active: false, problem: null, answer: null },
          checkpointChallenge: { active: false, format: null }
        }
      };
      saveCounterData();
    }
  } catch (err) {
    console.error('Could not read counter.json:', err.message);
    counterState = {
      currentCount: 0,
      lastCheckpoint: 0,
      channelId: null,
      lastUserId: null,
      contributors: {},
      mistakes: {}
    };
  }
};

// Save counter data
const saveCounterData = () => {
  try {
    fs.writeFileSync(COUNTER_DATA_PATH, JSON.stringify(counterState, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save counter.json:', err);
  }
};

// Check if a number looks like a Discord ID (snowflake)
// Discord IDs are typically 17-19 digits long
const isDiscordId = (number) => {
  if (number === null || number === undefined) return false;
  const numStr = Math.abs(number).toString();
  // Discord snowflake IDs are 17-19 digits
  return numStr.length >= 17 && numStr.length <= 19;
};

// Check if message is purely numeric
const isNumericOnly = (content) => {
  // Remove whitespace and check if it's a valid number
  const trimmed = content.trim();
  return /^\d+$/.test(trimmed);
};

// Extract the last number from a text message
// Returns the number or null if no number found
const extractNumberFromText = (content) => {
  // Find all numbers in the message (including negative numbers)
  const numberMatches = content.match(/-?\d+/g);
  if (!numberMatches || numberMatches.length === 0) {
    return null;
  }
  // Return the last number found (most likely the intended count)
  const lastNumber = parseInt(numberMatches[numberMatches.length - 1], 10);
  return isFinite(lastNumber) ? lastNumber : null;
};

// Safely evaluate a math equation
// Only allows: numbers, +, -, *, /, parentheses, spaces
// Returns the numeric result or null if invalid
const evaluateMathEquation = (content) => {
  try {
    const trimmed = content.trim();
    
    // Remove all spaces for validation
    const noSpaces = trimmed.replace(/\s+/g, '');
    
    // Only allow: digits, +, -, *, /, (, )
    if (!/^[\d+\-*/().\s]+$/.test(trimmed)) {
      return null; // Contains invalid characters
    }
    
    // Check for balanced parentheses
    let parenCount = 0;
    for (const char of noSpaces) {
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
      if (parenCount < 0) return null; // Unbalanced parentheses
    }
    if (parenCount !== 0) return null; // Unbalanced parentheses
    
    // Check for valid structure (must contain at least one operator or be a number)
    if (!/[\d+\-*/()]/.test(noSpaces)) {
      return null;
    }
    
    // Safely evaluate using Function constructor (safer than eval)
    // This only evaluates math expressions, not arbitrary code
    const result = Function('"use strict"; return (' + trimmed + ')')();
    
    // Ensure result is a finite number
    if (typeof result !== 'number' || !isFinite(result)) {
      return null;
    }
    
    // Return integer result (round to nearest integer)
    return Math.round(result);
  } catch (err) {
    // Invalid expression
    return null;
  }
};

// Check if user posted consecutively (same as last user)
const isConsecutiveUser = (userId) => {
  return counterState.lastUserId === userId;
};

// ============================================================================
// CHALLENGE VALIDATION FUNCTIONS
// ============================================================================



// Calculate next valid number accounting for pattern challenges
const getNextValidNumber = (currentCount, isReverse = false) => {
  let candidate = isReverse ? Math.max(0, currentCount - 1) : currentCount + 1;
  
  // Skip numbers that violate pattern challenges
  if (counterState.challenges.pattern && counterState.challenges.pattern.active) {
    const { type, value } = counterState.challenges.pattern;
    let attempts = 0;
    const maxAttempts = 100; // Safety limit
    
    while (attempts < maxAttempts) {
      let violatesPattern = false;
      
      if (type === 'even' && candidate % 2 !== 0) {
        violatesPattern = true;
      } else if (type === 'odd' && candidate % 2 === 0) {
        violatesPattern = true;
      } else if (type === 'skip_multiple' && candidate % value === 0) {
        violatesPattern = true;
      }
      
      if (!violatesPattern) {
        break; // Found valid number
      }
      
      // Skip to next number
      if (isReverse) {
        candidate = Math.max(0, candidate - 1);
        if (candidate === 0) break; // Can't go below 0
      } else {
        candidate++;
      }
      attempts++;
    }
  }
  
  return candidate;
};

// Validate challenges
const validateChallenges = (messageContent, number, messageTimestamp) => {
  const challenges = counterState.challenges;
  const errors = [];


  // 2. Pattern Challenges
  if (challenges.pattern.active) {
    const { type, value } = challenges.pattern;
    if (type === 'even' && number % 2 !== 0) {
      errors.push({ reason: 'pattern', message: 'Only even numbers allowed!' });
    } else if (type === 'odd' && number % 2 === 0) {
      errors.push({ reason: 'pattern', message: 'Only odd numbers allowed!' });
    } else if (type === 'skip_multiple' && number % value === 0) {
      errors.push({ reason: 'pattern', message: `Cannot use multiples of ${value}!` });
    }
  }

  // 3. Emoji Requirement
  if (challenges.emoji.active && challenges.emoji.requiredEmoji) {
    if (!messageContent.includes(challenges.emoji.requiredEmoji)) {
      errors.push({ reason: 'emoji', message: `Must include ${challenges.emoji.requiredEmoji} emoji!` });
    }
  }

  // 4. Reverse Counting (handled in expected count calculation)

  // 5. Math Problem Mode
  // Note: Math problem is just a display hint. The number validation already ensures correctness.
  // Users can type the answer directly or as a math equation that evaluates to the expected count.


  // 10. Speed Round (removed - was using time pressure)

  // 12. Checkpoint Challenge (removed - was using uppercase)

  return errors.length > 0 ? errors : null; // Return all errors
};

// Process a counter message
// Returns: { valid: boolean, expectedCount: number, actualCount: number, reason: string, challengeError: string }
// Rule: No user may post twice consecutively. The previous sender must always be different.
// Supports: 
//   - Plain numbers (e.g., "5")
//   - Math equations (e.g., "2+3", "10*2", "(5+5)/2")
//   - Text with numbers (e.g., "this should be considered as a valid count 27")
const processCounterMessage = (messageContent, userId, messageTimestamp = Date.now()) => {
  let number = null;
  
  // First try to parse as a plain number
  if (isNumericOnly(messageContent)) {
    number = parseInt(messageContent.trim(), 10);
  } else {
    // Try to evaluate as a math equation
    number = evaluateMathEquation(messageContent);
    if (number === null) {
      // If not a math equation, try to extract number from text
      number = extractNumberFromText(messageContent);
      if (number === null) {
        return null; // Not a valid number, math equation, or text with number, ignore
      }
    }
  }

  // Reject Discord IDs (channels, emojis, stickers, users, roles, etc.)
  // Discord snowflake IDs are 17-19 digits long
  if (isDiscordId(number)) {
    return null; // Ignore Discord IDs - not a valid count
  }

  // Handle reverse counting
  const isReverse = counterState.challenges.reverse;
  if (isReverse && counterState.currentCount === 0) {
    // Disable reverse counting if we hit 0
    counterState.challenges.reverse = false;
    saveCounterData();
  }
  
  // Calculate expected count accounting for pattern challenges
  const expectedCount = getNextValidNumber(counterState.currentCount, isReverse);
  
  // Track skipped numbers for checkpoint calculation (numbers between currentCount and expectedCount)
  const skippedNumbers = [];
  if (counterState.challenges.pattern && counterState.challenges.pattern.active) {
    const baseCount = isReverse ? counterState.currentCount - 1 : counterState.currentCount + 1;
    const direction = isReverse ? -1 : 1;
    for (let num = baseCount; num !== expectedCount; num += direction) {
      skippedNumbers.push(num);
    }
  }
  
  const isCorrectNumber = number === expectedCount;
  const isConsecutive = isConsecutiveUser(userId);

  // Validate challenges
  const challengeErrors = validateChallenges(messageContent, number, messageTimestamp);
  if (challengeErrors && challengeErrors.length > 0) {
    counterState.mistakes[userId] = (counterState.mistakes[userId] || 0) + 1;
    saveCounterData();
    return {
      valid: false,
      expectedCount: expectedCount,
      actualCount: number,
      reason: 'challenge_violation',
      challengeErrors: challengeErrors // Return all errors
    };
  }

  console.log('Counter bot: Processing message', {
    userId,
    number,
    expectedCount,
    isCorrectNumber,
    isConsecutive,
    lastUserId: counterState.lastUserId,
    currentCount: counterState.currentCount
  });

  // Check for consecutive user first (thumb rule: no consecutive posts)
  if (isConsecutive) {
    console.log('Counter bot: Consecutive user detected!', {
      userId,
      lastUserId: counterState.lastUserId
    });
    // Track mistake
    counterState.mistakes[userId] = (counterState.mistakes[userId] || 0) + 1;
    saveCounterData();
    return {
      valid: false,
      expectedCount: expectedCount,
      actualCount: number,
      reason: 'consecutive_user'
    };
  }

  // Then check if number is correct
  if (isCorrectNumber) {
    // Valid count - update state
    counterState.currentCount = number;
    // Increment user's contribution count
    counterState.contributors[userId] = (counterState.contributors[userId] || 0) + 1;
    counterState.lastUserId = userId; // Track last user who posted

    // ============================================================================
    // CHECKPOINT INTERVAL DEFINITION
    // ============================================================================
    // Checkpoints occur every 10 numbers: at 10, 20, 30, 40, 50, 60, etc.
    // To change the checkpoint interval, modify the CHECKPOINT_INTERVAL constant below.
    // ============================================================================
    
    // Check if we need to save a checkpoint (every 10: at 10, 20, 30, 40, etc.)
    // Handles all cases: even if skip_multiple uses any prime number (including 5),
    // the checkpoint will be set at the next valid number reached after passing the checkpoint
    let checkpointReached = false;
    let checkpointNumber = number;
    
    // Calculate the next expected checkpoint (next multiple of 10 after lastCheckpoint)
    // CHECKPOINT INTERVAL: Change the divisor (10) here to modify checkpoint frequency
    const CHECKPOINT_INTERVAL = 10;
    const nextCheckpoint = Math.floor((counterState.lastCheckpoint / CHECKPOINT_INTERVAL) + 1) * CHECKPOINT_INTERVAL;
    
    // Check if we've reached or passed a checkpoint
    // If the current number is >= nextCheckpoint, we've passed a checkpoint (even if it was skipped)
    // This works regardless of which prime number is used in skip_multiple challenge
    if (number >= nextCheckpoint && number > counterState.lastCheckpoint) {
      checkpointNumber = number;
      checkpointReached = true;
      console.log(`✅ Checkpoint reached at ${number} (next checkpoint was ${nextCheckpoint}, which may have been skipped due to pattern challenge)`);
    }
    
    if (checkpointReached) {
      counterState.lastCheckpoint = checkpointNumber;
      console.log(`✅ Checkpoint saved at ${checkpointNumber}${checkpointNumber !== number ? ` (skipped number)` : ''}`);
      // Activate challenges at checkpoint
      activateCheckpointChallenge(checkpointNumber);
    }

    saveCounterData();
    return {
      valid: true,
      expectedCount: number,
      actualCount: number,
      checkpointReached: checkpointReached
    };
  } else {
    // Invalid: wrong number - track mistake
    counterState.mistakes[userId] = (counterState.mistakes[userId] || 0) + 1;
    saveCounterData();
    return {
      valid: false,
      expectedCount: expectedCount,
      actualCount: number,
      reason: 'wrong_number'
    };
  }
};

// Get current counter state (for debugging/admin)
const getCounterState = () => {
  return {
    currentCount: counterState.currentCount,
    lastCheckpoint: counterState.lastCheckpoint,
    channelId: counterState.channelId,
    totalContributors: Object.keys(counterState.contributors).length,
    contributors: counterState.contributors, // Include contributors map
    challenges: counterState.challenges // Include challenges for example generation
  };
};

// Reset counter to 0 (manual reset - fully resets counter.json)
const resetCounter = () => {
  counterState.currentCount = 0;
  counterState.lastCheckpoint = 0;
  counterState.contributors = {};
  counterState.mistakes = {};
  counterState.lastUserId = null;
  // Reset all challenges to inactive
  counterState.challenges = {
    pattern: { active: false, type: null, value: null },
    emoji: { active: false, requiredEmoji: null },
    reverse: false,
    mathProblem: { active: false, problem: null, answer: null },
    checkpointChallenge: { active: false, format: null }
  };
  saveCounterData();
};

// Reset counter to last checkpoint (automatic reset - preserves stats and challenges)
const resetToCheckpoint = () => {
  const checkpoint = counterState.lastCheckpoint;
  counterState.currentCount = checkpoint;
  // Contributors and mistakes are preserved for leaderboard tracking
  // Challenges are also preserved so they remain active after reset
  counterState.lastUserId = null;
  saveCounterData();
};

// Set the channel ID for counter
const setChannelId = (channelId) => {
  counterState.channelId = channelId;
  saveCounterData();
};

// Get the channel ID for counter
const getChannelId = () => {
  return counterState.channelId;
};

// Get leaderboard data
const getTopContributors = (limit = 10) => {
  const entries = Object.entries(counterState.contributors)
    .map(([userId, count]) => ({ userId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
  return entries;
};

// Get top mistake makers
const getTopMistakes = (limit = 10) => {
  const entries = Object.entries(counterState.mistakes)
    .map(([userId, count]) => ({ userId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
  return entries;
};

// ============================================================================
// CHALLENGE ACTIVATION FUNCTIONS
// ============================================================================

// Activate random challenge at checkpoint
const activateCheckpointChallenge = (checkpointNumber) => {
  const challenges = counterState.challenges;
  
  // Reset all challenges first
  challenges.pattern.active = false;
  challenges.emoji.active = false;
  challenges.reverse = false;
  challenges.mathProblem.active = false;
  challenges.checkpointChallenge.active = false;
  
  // Randomly activate 1-2 challenges
  const challengeTypes = [];
  
  // 2. Pattern Challenges (50% chance - increased to occur more often)
  if (Math.random() < 0.5) {
    const smallPrimes = getSmallPrimes();
    // Weight smaller primes more heavily (they occur more often)
    const primeWeights = [
      { prime: 2, weight: 3 },   // Most common
      { prime: 3, weight: 3 },   // Most common
      { prime: 5, weight: 2 },   // Common
      { prime: 7, weight: 2 },   // Common
      { prime: 11, weight: 1 },  // Less common
      { prime: 13, weight: 1 },  // Less common
      { prime: 17, weight: 1 },  // Less common
      { prime: 19, weight: 1 }   // Less common
    ];
    
    // Build weighted list of skip_multiple patterns
    const skipMultiplePatterns = [];
    primeWeights.forEach(({ prime, weight }) => {
      for (let i = 0; i < weight; i++) {
        skipMultiplePatterns.push({ type: 'skip_multiple', value: prime });
      }
    });
    
    const patterns = [
      { type: 'even', value: null },
      { type: 'odd', value: null },
      ...skipMultiplePatterns // Only prime numbers for skip_multiple
    ];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    challenges.pattern.active = true;
    challenges.pattern.type = pattern.type;
    challenges.pattern.value = pattern.value;
    challengeTypes.push('pattern');
  }
  
  // 3. Emoji Requirement (35% chance)
  if (Math.random() < 0.35) {
    const emojis = ['🎉', '🔥', '✨', '💪', '🚀', '⭐', '🎯', '💎', '🌟', '🎊'];
    challenges.emoji.active = true;
    challenges.emoji.requiredEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    challengeTypes.push('emoji');
  }
  
  // 4. Reverse Counting (20% chance)
  if (Math.random() < 0.2) {
    challenges.reverse = true;
    challengeTypes.push('reverse');
  }
  
  // 5. Math Problem Mode (30% chance) - generates problems as hints
  // Problems will be generated dynamically based on expected count when displayed
  if (Math.random() < 0.3) {
    challenges.mathProblem.active = true;
    challenges.mathProblem.problem = null; // Will be generated dynamically
    challenges.mathProblem.answer = null;
    challengeTypes.push('math_problem');
  }
  
  
  // 10. Speed Round (removed - was using time pressure)
  
  // 12. Checkpoint Challenge (removed - was using uppercase)
  
  saveCounterData();
  return challengeTypes;
};

// Get active challenge messages for display
const getActiveChallengeMessages = () => {
  const challenges = counterState.challenges;
  const messages = [];
  
  // 2. Pattern Challenges
  if (challenges.pattern.active) {
    if (challenges.pattern.type === 'even') {
      messages.push(`🔢 **Pattern Challenge!** Only **even numbers** allowed!`);
    } else if (challenges.pattern.type === 'odd') {
      messages.push(`🔢 **Pattern Challenge!** Only **odd numbers** allowed!`);
    } else if (challenges.pattern.type === 'skip_multiple') {
      messages.push(`🔢 **Pattern Challenge!** Cannot use multiples of **${challenges.pattern.value}**!`);
    }
  }
  
  // 3. Emoji Requirement
  if (challenges.emoji.active && challenges.emoji.requiredEmoji) {
    messages.push(`😊 **Emoji Requirement!** Must include ${challenges.emoji.requiredEmoji} emoji!`);
  }
  
  // 4. Reverse Counting
  if (challenges.reverse) {
    messages.push(`🔄 **Reverse Counting!** We're counting **backwards** now!`);
  }
  
  // 5. Math Problem Mode
  if (challenges.mathProblem.active) {
    // Generate a problem dynamically based on expected count
    const expectedCount = counterState.currentCount + 1;
    const a = Math.floor(Math.random() * Math.max(1, expectedCount - 1)) + 1;
    const b = expectedCount - a;
    const problem = `${a} + ${b}`;
    messages.push(`🧮 **Math Problem Mode!** You can answer with math equations! (e.g., "${problem}")`);
  }
  
  return messages;
};

// Initialize on module load
loadCounterData();

module.exports = {
  processCounterMessage,
  getCounterState,
  loadCounterData,
  saveCounterData,
  resetCounter,
  resetToCheckpoint,
  setChannelId,
  getChannelId,
  getTopContributors,
  getTopMistakes,
  getActiveChallengeMessages,
  activateCheckpointChallenge,
  getNextValidNumber
};

