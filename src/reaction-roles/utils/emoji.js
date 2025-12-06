const emojiKeyFrom = (reaction) => {
  if (reaction.emoji.id) return `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
  return reaction.emoji.name;
};

const buildEmojiVariants = (reaction) => {
  const variants = [];
  try {
    if (reaction.emoji.id) {
      variants.push(`<:${reaction.emoji.name}:${reaction.emoji.id}>`);
      if (reaction.emoji.identifier) variants.push(reaction.emoji.identifier);
      variants.push(reaction.emoji.name, reaction.emoji.toString());
    } else {
      variants.push(reaction.emoji.name, reaction.emoji.toString());
    }
  } catch {
    variants.push(emojiKeyFrom(reaction));
  }

  // Include trimmed variants
  variants.push(...variants.map(v => (typeof v === 'string' ? v.trim() : v)));
  
  return variants;
};

module.exports = { emojiKeyFrom, buildEmojiVariants };

