#!/bin/bash

# GitHub SSH Setup Script for AWS EC2
# This script helps you set up SSH keys to clone from GitHub

set -e

echo "🔑 Setting up GitHub SSH authentication..."

# Check if SSH key already exists
if [ -f ~/.ssh/id_ed25519 ] || [ -f ~/.ssh/id_rsa ]; then
    echo "⚠️  SSH key already exists. Do you want to use existing key or create new one?"
    read -p "Use existing key? (y/n): " use_existing
    if [ "$use_existing" != "y" ]; then
        echo "Creating new SSH key..."
        ssh-keygen -t ed25519 -C "ec2-bot-deployment" -f ~/.ssh/id_ed25519 -N ""
        KEY_FILE=~/.ssh/id_ed25519.pub
    else
        if [ -f ~/.ssh/id_ed25519.pub ]; then
            KEY_FILE=~/.ssh/id_ed25519.pub
        else
            KEY_FILE=~/.ssh/id_rsa.pub
        fi
    fi
else
    echo "📝 Generating new SSH key..."
    ssh-keygen -t ed25519 -C "ec2-bot-deployment" -f ~/.ssh/id_ed25519 -N ""
    KEY_FILE=~/.ssh/id_ed25519.pub
fi

# Display the public key
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📋 Your SSH Public Key:"
echo "═══════════════════════════════════════════════════════════"
cat $KEY_FILE
echo "═══════════════════════════════════════════════════════════"
echo ""

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519 2>/dev/null || ssh-add ~/.ssh/id_rsa 2>/dev/null

# Test GitHub connection
echo "🧪 Testing GitHub connection..."
ssh -T git@github.com 2>&1 | head -1 || true

echo ""
echo "✅ SSH key generated!"
echo ""
echo "📝 Next steps:"
echo "1. Copy the public key shown above"
echo "2. Go to: https://github.com/settings/keys"
echo "3. Click 'New SSH key'"
echo "4. Paste the key and save"
echo "5. Then run: git clone git@github.com:AashiqAli/slayerai.git"
echo ""
echo "💡 Or use HTTPS method (no SSH setup needed):"
echo "   git clone https://github.com/AashiqAli/slayerai.git"

