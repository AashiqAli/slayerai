# AWS Deployment Guide for Discord Bot

This guide will help you deploy your Discord bot on AWS EC2 with automatic restart capabilities.

## Prerequisites

- AWS Account
- Discord Bot Token
- Basic knowledge of Linux/SSH

## Step 1: Launch an EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Choose an Amazon Linux 2023 or Ubuntu 22.04 LTS instance
3. Select `t2.micro` (free tier) or `t3.small` (recommended)
4. Configure security group:
   - Allow SSH (port 22) from your IP
   - No need to open other ports for Discord bot
5. Launch and download your key pair (.pem file)

## Step 2: Connect to Your EC2 Instance

```bash
# Make key file executable
chmod 400 your-key.pem

# Connect via SSH
ssh -i your-key.pem ec2-user@your-ec2-ip
# For Ubuntu, use: ssh -i your-key.pem ubuntu@your-ec2-ip
```

## Step 3: Install Node.js

### For Amazon Linux 2023:
```bash
sudo dnf install -y nodejs npm
```

### For Ubuntu:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify installation:
```bash
node --version  # Should be v18.x or higher
npm --version
```

## Step 4: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

PM2 will:
- Auto-restart your bot if it crashes
- Restart on server reboot
- Monitor memory usage
- Provide logging

## Step 5: Upload Your Bot Code

### Option A: Using Git (Recommended)
```bash
# Install git if not installed
sudo dnf install git -y  # Amazon Linux
# or
sudo apt-get install git -y  # Ubuntu

# Clone your repository
git clone <your-repo-url>
cd <your-repo-name>

# Or if you have a private repo, set up SSH keys
```

### Option B: Using SCP
From your local machine:
```bash
# Create a tarball
tar -czf bot.tar.gz --exclude='node_modules' --exclude='.git' .

# Upload to EC2
scp -i your-key.pem bot.tar.gz ec2-user@your-ec2-ip:~/

# On EC2, extract
tar -xzf bot.tar.gz
```

## Step 6: Set Up Environment Variables

```bash
# Create .env file
nano .env
```

Add your Discord token:
```
DISCORD_TOKEN=your_bot_token_here
```

Save and exit (Ctrl+X, then Y, then Enter)

## Step 7: Install Dependencies and Deploy

```bash
# Install project dependencies
npm install

# Create logs directory
mkdir -p logs

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

Or manually:
```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on system boot
pm2 startup
# Follow the instructions it prints
```

## Step 8: Verify Bot is Running

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs discord-bot

# Monitor in real-time
pm2 monit
```

## Useful PM2 Commands

```bash
# View all processes
pm2 list

# View logs
pm2 logs discord-bot
pm2 logs discord-bot --lines 100  # Last 100 lines

# Restart bot
pm2 restart discord-bot

# Stop bot
pm2 stop discord-bot

# Delete bot from PM2
pm2 delete discord-bot

# Monitor resources
pm2 monit

# Save current process list
pm2 save
```

## Auto-Restart Configuration

The `ecosystem.config.js` file is configured to:
- ✅ Auto-restart on crash
- ✅ Auto-restart on server reboot
- ✅ Restart if memory exceeds 500MB
- ✅ Restart after 10 seconds of uptime (prevents restart loops)
- ✅ Maximum 10 restarts (prevents infinite loops)
- ✅ 4 second delay between restarts

## Monitoring and Logs

Logs are stored in the `logs/` directory:
- `logs/err.log` - Error logs
- `logs/out.log` - Output logs
- `logs/combined.log` - Combined logs

View logs:
```bash
pm2 logs discord-bot
tail -f logs/combined.log
```

## Updating Your Bot

```bash
# Pull latest changes (if using git)
git pull

# Or upload new files via SCP

# Restart the bot
pm2 restart discord-bot

# Or reload (zero-downtime restart)
pm2 reload discord-bot
```

## Troubleshooting

### Bot not starting
```bash
# Check PM2 logs
pm2 logs discord-bot --err

# Check if token is set
cat .env

# Test manually
node src/index.js
```

### Bot keeps crashing
```bash
# Check error logs
pm2 logs discord-bot --err

# Check memory usage
pm2 monit

# Restart with more memory
pm2 restart discord-bot --update-env
```

### PM2 not starting on reboot
```bash
# Re-run startup script
pm2 startup
# Follow the instructions it prints
```

## Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use IAM roles** instead of storing AWS credentials
3. **Keep system updated**: `sudo dnf update` or `sudo apt update && sudo apt upgrade`
4. **Use firewall**: Configure security groups properly
5. **Regular backups**: Backup your `data/` directory

## Cost Optimization

- Use `t2.micro` for free tier (limited performance)
- Use `t3.small` for better performance (~$15/month)
- Consider AWS Lightsail for simpler pricing
- Monitor usage with AWS CloudWatch

## Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Discord.js Guide](https://discordjs.guide/)

