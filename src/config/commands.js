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
            name: 'setup-interactive',
            description: 'Create a reaction-role message with interactive role selection',
            type: 1, // SUB_COMMAND
            options: [
              { name: 'channel', description: 'Channel to post the message in', type: 7, required: true },
              { name: 'title', description: 'Title text for the message', type: 3, required: true }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'neko-public',
    description: 'Sayhitoourinhousebot',
    options: [
      {
        name: 'say-hi',
        description: 'Say hi to the house bot',
        type: 1 // SUB_COMMAND
      }
    ]
  }
];

module.exports = { commands };

