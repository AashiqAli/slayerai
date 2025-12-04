const fs = require('fs');
const path = require('path');

const REACTION_ROLES_PATH = path.join(__dirname, '../../data/reactionRoles.json');

let reactionRoles = [];

// Load reaction roles data
const loadReactionRoles = () => {
  try {
    reactionRoles = JSON.parse(fs.readFileSync(REACTION_ROLES_PATH, 'utf8'));
  } catch (err) {
    console.warn('Could not read reactionRoles.json:', err.message);
    reactionRoles = [];
  }
};

// Save reaction roles data
const saveReactionRoles = () => {
  try {
    fs.writeFileSync(REACTION_ROLES_PATH, JSON.stringify(reactionRoles, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save reactionRoles.json:', err);
  }
};

// Get all reaction roles
const getReactionRoles = () => reactionRoles;

// Find reaction role by message ID
const findReactionRole = (messageId) => {
  return reactionRoles.find(r => r.messageId === messageId);
};

// Add new reaction role entry
const addReactionRole = (entry) => {
  reactionRoles.push(entry);
  saveReactionRoles();
};

// Update existing reaction role
const updateReactionRole = (messageId, updates) => {
  const conf = findReactionRole(messageId);
  if (!conf) return false;
  
  Object.assign(conf, updates);
  saveReactionRoles();
  return true;
};

// Initialize on module load
loadReactionRoles();

module.exports = {
  getReactionRoles,
  findReactionRole,
  addReactionRole,
  updateReactionRole,
  saveReactionRoles,
  loadReactionRoles
};

