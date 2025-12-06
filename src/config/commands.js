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
    name: 'neko-counter',
    description: 'Counter bot management',
    options: [
      {
        name: 'reset',
        description: 'Reset the counter to 0',
        type: 1 // SUB_COMMAND
      },
      {
        name: 'reset-checkpoint',
        description: 'Reset the counter to the last checkpoint',
        type: 1 // SUB_COMMAND
      },
      {
        name: 'set-channel',
        description: 'Set the channel where the counter bot listens',
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'channel',
            description: 'The channel for the counter bot to listen to',
            type: 7, // CHANNEL
            required: true
          }
        ]
      },
      {
        name: 'leaderboard',
        description: 'Show top 10 contributors leaderboard',
        type: 1 // SUB_COMMAND
      },
      {
        name: 'mistakes-leaderboard',
        description: 'Show top 10 mistake makers leaderboard',
        type: 1 // SUB_COMMAND
      }
    ]
  }
];

module.exports = { commands };

