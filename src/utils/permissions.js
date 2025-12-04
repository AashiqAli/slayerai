const { PermissionFlagsBits } = require('discord.js');

const hasManagePermissions = (member) => {
  if (!member?.permissions) return false;
  return member.permissions.has(PermissionFlagsBits.ManageGuild) || 
         member.permissions.has(PermissionFlagsBits.ManageRoles);
};

module.exports = { hasManagePermissions };

