const { titleBorders, topBorders, bottomBorders } = require('./constants');

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

module.exports = {
  formatMessage,
  createPreviewEmbed
};

