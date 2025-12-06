# Counter Bot Rules & Documentation

## 📋 Table of Contents
- [Basic Rules](#basic-rules)
- [Input Formats](#input-formats)
- [Checkpoint System](#checkpoint-system)
- [Challenge System](#challenge-system)
- [Reset Types](#reset-types)
- [Leaderboards](#leaderboards)
- [Commands](#commands)
- [Error Messages](#error-messages)

---

## 🎯 Basic Rules

### Core Counting Rule
- **Count sequentially**: Each message must be the next number in the sequence (1, 2, 3, 4, ...)
- **Wrong number = Reset**: If someone posts the wrong number, the counter resets (see [Reset Types](#reset-types) for details)

### Thumb Rule: No Consecutive Posts
- **The previous sender must always be different**
- You cannot post twice in a row
- If you post consecutively, the counter resets and your mistake is tracked
- This rule applies regardless of whether your number is correct

### Invalid Inputs
- **Discord IDs are rejected**: Any number that looks like a Discord ID (17-19 digits) will be ignored
  - This includes channel IDs, emoji IDs, sticker IDs, user IDs, role IDs, etc.
  - Example: `123456789012345678` (18 digits) will be rejected

---

## 📝 Input Formats

The counter bot accepts multiple input formats:

### 1. Plain Numbers
```
5
42
100
```

### 2. Math Equations
You can use math equations that evaluate to the correct number:
- **Addition**: `2 + 3`, `10 + 5`
- **Subtraction**: `10 - 3`, `20 - 5`
- **Multiplication**: `5 * 2`, `10 * 3`
- **Division**: `10 / 2`, `20 / 4`
- **Parentheses**: `(5 + 5) / 2`, `(10 * 2) - 5`
- **Combinations**: `2 + 3 * 4`, `(10 + 5) / 3`

**Examples:**
```
2 + 3
10 * 2
(5 + 5) / 2
20 - 5
```

### 3. Text with Numbers
You can include text in your message, and the bot will extract the **last number** found:
```
This should be considered as a valid count 27
Let's count! 42
The number is 100
```

**Note**: The bot extracts the **last number** in the message, so be careful with multiple numbers:
```
I think 5 but actually 10  ← Will use 10 (the last number)
```

---

## 🎯 Checkpoint System

### Checkpoint Interval
- **Checkpoints are created every 10 numbers**: at 10, 20, 30, 40, 50, 60, etc.
- Checkpoints are saved at the **next valid number reached** after passing the checkpoint interval
  - Example: If checkpoint is at 20, but 20 is skipped due to a pattern challenge, the checkpoint will be set at the next valid number (e.g., 21, 22, etc.)

### Checkpoint Benefits
- **Automatic resets** (wrong number, consecutive user, challenge violation) reset to the **last checkpoint** instead of 0
- **Manual reset to checkpoint** preserves:
  - ✅ Contributor stats (for leaderboard tracking)
  - ✅ Mistake stats (for leaderboard tracking)
  - ✅ Active challenges (they remain active after reset)

### Checkpoint Messages
- When a checkpoint is reached, a funny message is sent (not an embed)
- New challenges may be activated at checkpoints (see [Challenge System](#challenge-system))

---

## 🎮 Challenge System

Challenges are randomly activated at checkpoints (every 10 numbers). Multiple challenges can be active simultaneously.

### Challenge Types

#### 1. Pattern Challenges
Pattern challenges restrict which numbers can be used:

- **Even Numbers Only** 🔢
  - Only even numbers (2, 4, 6, 8, ...) are allowed
  - Odd numbers will cause a reset

- **Odd Numbers Only** 🔢
  - Only odd numbers (1, 3, 5, 7, ...) are allowed
  - Even numbers will cause a reset

- **Skip Multiples** 🔢
  - Cannot use multiples of a specific **prime number**
  - Prime numbers used: 2, 3, 5, 7, 11, 13, 17, 19
  - Smaller primes (2, 3, 5, 7) occur more frequently
  - Example: If "skip multiples of 5" is active, you cannot use 5, 10, 15, 20, 25, etc.
  - The counter will automatically skip these numbers

**Activation Chance**: 50% at each checkpoint

#### 2. Emoji Requirement 😊
- You **must include** a specific emoji in your message
- The required emoji is randomly selected from: 🎉, 🔥, ✨, 💪, 🚀, ⭐, 🎯, 💎, 🌟, 🎊
- Example: If ✨ is required, your message must be like `22 ✨` or `"10 + 12 ✨"`

**Activation Chance**: 35% at each checkpoint

#### 3. Reverse Counting 🔄
- The counter counts **backwards** instead of forwards
- Example: If current count is 50, next number is 49, then 48, 47, etc.
- **Auto-disables** when count reaches 0 (cannot go below 0)

**Activation Chance**: 20% at each checkpoint

#### 4. Math Problem Mode 🧮
- You can answer with **math equations** instead of just numbers
- The bot provides hints showing example equations
- Example: If expected count is 15, you can type `10 + 5` or `20 - 5` or just `15`
- This mode makes counting more flexible and fun

**Activation Chance**: 30% at each checkpoint

### Challenge Combinations
- Multiple challenges can be active at the same time
- You must satisfy **all active challenges** simultaneously
- Example: If "even numbers only" + "emoji requirement ✨" are both active:
  - ✅ Valid: `22 ✨` (even number + emoji)
  - ✅ Valid: `"10 + 12 ✨"` (math equation that equals even number + emoji)
  - ❌ Invalid: `21 ✨` (odd number, violates pattern)
  - ❌ Invalid: `22` (missing emoji)

### Challenge Persistence
- Challenges **remain active** after automatic resets (wrong number, consecutive user, challenge violation)
- Challenges are **reset** only when:
  - Manual full reset (`/neko-counter reset`)
  - New challenges are activated at a checkpoint (replaces old challenges)

---

## 🔄 Reset Types

### 1. Automatic Resets (Preserve Stats & Challenges)
These resets occur when a mistake is made:

- **Wrong Number**: Someone posts the wrong number
- **Consecutive User**: Same user posts twice in a row (thumb rule violation)
- **Challenge Violation**: User violates an active challenge rule

**What's Preserved:**
- ✅ Contributor stats (for leaderboard tracking)
- ✅ Mistake stats (for leaderboard tracking)
- ✅ Active challenges (they remain active)

**What's Reset:**
- ❌ Current count → reset to last checkpoint (or 0 if no checkpoint)
- ❌ Last user ID → cleared (allows anyone to count next)

### 2. Manual Full Reset (`/neko-counter reset`)
Completely resets the counter to 0:

**What's Reset:**
- ❌ Current count → 0
- ❌ Last checkpoint → 0
- ❌ Contributors → cleared
- ❌ Mistakes → cleared
- ❌ Last user ID → cleared
- ❌ All challenges → deactivated

**Use Case**: Starting fresh, clearing all stats

### 3. Manual Reset to Checkpoint (`/neko-counter reset-checkpoint`)
Resets to the last checkpoint while preserving stats:

**What's Preserved:**
- ✅ Contributor stats (for leaderboard tracking)
- ✅ Mistake stats (for leaderboard tracking)
- ✅ Active challenges (they remain active)

**What's Reset:**
- ❌ Current count → reset to last checkpoint
- ❌ Last user ID → cleared

**Use Case**: Going back to a checkpoint without losing leaderboard progress

---

## 🏆 Leaderboards

### Top Contributors Leaderboard (`/neko-counter leaderboard`)
- Shows the **top 10 users** with the most successful counts
- Displays **server nicknames** (display names) instead of mentions
- Stats are **preserved** during automatic resets
- Stats are **cleared** only during manual full reset

### Mistakes Leaderboard (`/neko-counter mistakes-leaderboard`)
- Shows the **top 10 users** who made the most mistakes
- Displays **server nicknames** (display names) instead of mentions
- Stats are **preserved** during automatic resets
- Stats are **cleared** only during manual full reset

---

## ⌨️ Commands

All commands are under the `/neko-counter` slash command:

### `/neko-counter reset`
- **Description**: Fully resets the counter to 0
- **Clears**: Count, checkpoint, contributors, mistakes, challenges
- **Use Case**: Starting completely fresh

### `/neko-counter reset-checkpoint`
- **Description**: Resets the counter to the last checkpoint
- **Preserves**: Contributors, mistakes, active challenges
- **Requires**: A checkpoint must exist (checkpoints are created every 10 numbers)
- **Use Case**: Going back to a checkpoint without losing stats

### `/neko-counter set-channel <channel>`
- **Description**: Sets the channel where the counter bot listens
- **Required**: Channel mention or ID
- **Use Case**: Configuring which channel the bot monitors

### `/neko-counter leaderboard`
- **Description**: Shows the top 10 contributors
- **Display**: Server nicknames (display names)
- **Public**: Message is visible to everyone

### `/neko-counter mistakes-leaderboard`
- **Description**: Shows the top 10 mistake makers
- **Display**: Server nicknames (display names)
- **Public**: Message is visible to everyone

---

## 💬 Error Messages

When a mistake is made, the bot sends a detailed error message that **always includes**:

1. **Why?** - Explanation of what went wrong
2. **Next number** - The next valid number to count
3. **Example** - Example(s) showing how to format the next number (respects all active challenges)

### Error Message Components

#### Consecutive User Error
- Shows why consecutive posts aren't allowed
- Provides next number and example

#### Challenge Violation Error
- Lists **all violated challenge rules** (if multiple challenges are violated)
- Shows which specific rules were broken
- Provides next number and example (with all active challenges applied)

#### Wrong Number Error
- Shows the expected number vs. the actual number
- Provides correct answer with example
- If checkpoint exists: shows next number and example
- If no checkpoint: only shows correct answer and example

### Active Challenges Reminder
- The "⚠️ REMINDER: Active Challenges ⚠️" section appears **only if 20 seconds have passed** since the last reminder
- This prevents message spam while keeping essential information visible
- The reminder lists all currently active challenges

---

## 📊 Data Storage

All counter data is stored in `data/counter.json`:

```json
{
  "currentCount": 0,
  "lastCheckpoint": 0,
  "channelId": "channel_id_here",
  "lastUserId": null,
  "contributors": {
    "user_id_1": 5,
    "user_id_2": 3
  },
  "mistakes": {
    "user_id_1": 2,
    "user_id_2": 1
  },
  "challenges": {
    "pattern": {
      "active": false,
      "type": null,
      "value": null
    },
    "emoji": {
      "active": false,
      "requiredEmoji": null
    },
    "reverse": false,
    "mathProblem": {
      "active": false,
      "problem": null,
      "answer": null
    },
    "checkpointChallenge": {
      "active": false,
      "format": null
    }
  }
}
```

---

## 🎯 Quick Reference

### Valid Count Examples
- ✅ `5` (plain number)
- ✅ `2 + 3` (math equation)
- ✅ `"10 + 12 ✨"` (math equation with emoji requirement)
- ✅ `Let's count! 42` (text with number)
- ✅ `22 ✨` (number with emoji requirement)

### Invalid Count Examples
- ❌ `5` when next number is `6` (wrong number)
- ❌ Posting twice in a row (consecutive user)
- ❌ `21` when "even numbers only" is active (pattern violation)
- ❌ `22` when emoji ✨ is required (missing emoji)
- ❌ `123456789012345678` (Discord ID, rejected)

### Tips for Success
1. **Check active challenges** before counting (they're shown in error messages)
2. **Wait your turn** - don't post consecutively
3. **Use math equations** when math problem mode is active (more flexible)
4. **Include required emojis** when emoji requirement is active
5. **Watch for pattern rules** - even/odd/skip multiples can change the sequence
6. **Check checkpoints** - they save your progress!

---

## 🔧 Technical Details

### Checkpoint Calculation
- Checkpoints are calculated at the **next valid number reached** after passing a checkpoint interval
- If a checkpoint interval number is skipped (due to pattern challenges), the checkpoint is set at the first valid number after that interval
- Example: If checkpoint is at 20, but 20 is skipped (multiple of 5), checkpoint is set at 21, 22, etc. (next valid number)

### Number Validation Order
1. Extract number from message (plain number, math equation, or text extraction)
2. Reject Discord IDs (17-19 digits)
3. Check if number matches expected count (accounting for reverse counting and pattern challenges)
4. Validate all active challenges
5. Check for consecutive user violation
6. Process valid count or return error

### Challenge Activation
- Challenges are randomly activated at checkpoints
- 1-2 challenges can be active simultaneously
- Activation chances:
  - Pattern: 50%
  - Emoji: 35%
  - Reverse: 20%
  - Math Problem: 30%

---

**Last Updated**: Counter Bot v2.0
**Checkpoint Interval**: Every 10 numbers
**Reminder Cooldown**: 20 seconds

