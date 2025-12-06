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

module.exports = {
  borderNames,
  titleBorderPreviews,
  titleBorders,
  topBorders,
  bottomBorders
};

