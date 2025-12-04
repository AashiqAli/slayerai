const commands = [
  {
    name: 'neko',
    description: 'Neko admin utilities (reaction roles)',
    options: [
      {
        name: 'reaction',
        description: 'Reaction role management',
        type: 2, // SUB_COMMAND_GROUP
        options: [
          {
            name: 'setup',
            description: 'Create a new reaction-role message',
            type: 1, // SUB_COMMAND
            options: [
              { name: 'channel', description: 'Channel to post the message in', type: 7, required: true },
              { name: 'title', description: 'Title text for the message', type: 3, required: true }
            ]
          },
          {
            name: 'setup-interactive',
            description: 'Create a reaction-role message with interactive role selection',
            type: 1, // SUB_COMMAND
            options: [
              { name: 'channel', description: 'Channel to post the message in', type: 7, required: true },
              { name: 'title', description: 'Title text for the message', type: 3, required: true }
            ]
          },
          {
            name: 'add',
            description: 'Add an emoji-role pair to an existing reaction-role message',
            type: 1,
            options: [
              { name: 'message_id', description: 'ID of the reaction-role message', type: 3, required: true },
              { name: 'emoji', description: 'Emoji to use (unicode or <:name:id>)', type: 3, required: true },
              { name: 'role', description: 'Role to assign', type: 8, required: true }
            ]
          },
          {
            name: 'delete',
            description: 'Remove an emoji-role mapping from a reaction-role message by line number',
            type: 1,
            options: [
              { name: 'message_id', description: 'ID of the reaction-role message', type: 3, required: true },
              { name: 'line', description: 'Line number to remove (1 = first mapping line)', type: 4, required: true }
            ]
          }
        ]
      }
    ]
  }
];

module.exports = { commands };

