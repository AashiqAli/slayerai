# How to Close Terminal Without Killing Bot

## If you're on AWS EC2 (SSH):

### Option 1: Use PM2 (Recommended)
The bot should already be running with PM2. To verify:
```bash
pm2 list
pm2 status
```

If the bot is running with PM2, you can safely close the terminal. PM2 runs processes in the background.

### Option 2: Use `screen` or `tmux` (If you need to keep a session)
```bash
# Install screen (if not installed)
sudo apt install screen

# Start a screen session
screen -S bot

# Run your commands, then detach with: Ctrl+A, then D

# To reattach later:
screen -r bot
```

### Option 3: Use `nohup` (Alternative)
```bash
nohup node src/index.js > bot.log 2>&1 &
```

## If you're working locally:

The bot on AWS EC2 runs independently. Closing your local terminal won't affect it.

## Quick Check Commands:

```bash
# Check if bot is running with PM2
pm2 list

# Check bot logs
pm2 logs discord-bot

# Restart bot if needed
pm2 restart discord-bot

# Stop bot
pm2 stop discord-bot

# Start bot
pm2 start discord-bot
```

## To safely close terminal:

1. Make sure bot is running with PM2: `pm2 list`
2. If status shows "online", you can safely close the terminal
3. The bot will continue running in the background

