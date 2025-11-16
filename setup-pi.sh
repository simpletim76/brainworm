#!/bin/bash

# BrainWorm Dashboard Setup Script for Raspberry Pi
# Tested on Raspberry Pi Zero W

echo "=========================================="
echo "BrainWorm Dashboard - Raspberry Pi Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo ""
    echo "Installing Node.js..."

    # For Raspberry Pi, use NodeSource repository for latest LTS
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs

    if [ $? -eq 0 ]; then
        echo "✅ Node.js installed successfully"
    else
        echo "❌ Failed to install Node.js"
        exit 1
    fi
else
    echo "✅ Node.js is already installed ($(node --version))"
fi

echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
else
    echo "✅ npm is available ($(npm --version))"
fi

echo ""
echo "Installing project dependencies..."

# Install dependencies
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "To start the dashboard:"
echo "  npm start"
echo ""
echo "The dashboard will be available at:"
echo "  http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "To run in background with PM2:"
echo "  sudo npm install -g pm2"
echo "  pm2 start server.js --name brainworm"
echo "  pm2 startup"
echo "  pm2 save"
echo ""
