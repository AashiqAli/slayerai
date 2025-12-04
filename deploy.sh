#!/bin/bash

# AWS Deployment Script for Discord Bot
# This script sets up the bot on AWS EC2 with PM2 for auto-restart

set -e

echo "🚀 Starting AWS deployment setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Installing Node.js 18.x..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Install project dependencies
echo "📦 Installing project dependencies..."
npm install

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Stop existing PM2 process if running
echo "🛑 Stopping existing bot instance (if any)..."
pm2 stop discord-bot || true
pm2 delete discord-bot || true

# Start the bot with PM2
echo "✅ Starting bot with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration to auto-start on reboot
echo "💾 Saving PM2 startup configuration..."
pm2 save
pm2 startup

echo "✅ Deployment complete!"
echo ""
echo "📊 Bot Status:"
pm2 status
echo ""
echo "📝 Useful commands:"
echo "  - View logs: pm2 logs discord-bot"
echo "  - Restart bot: pm2 restart discord-bot"
echo "  - Stop bot: pm2 stop discord-bot"
echo "  - Monitor: pm2 monit"

