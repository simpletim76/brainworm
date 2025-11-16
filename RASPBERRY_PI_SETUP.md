# Raspberry Pi Setup Guide

This guide will help you set up the BrainWorm Dashboard on a Raspberry Pi, including the Raspberry Pi Zero W.

## Quick Start (Recommended for Pi Zero W)

The Raspberry Pi Zero W has limited resources (512MB RAM, ARMv6 CPU), so running the app **without Docker** is recommended for better performance.

### 1. Automated Setup

```bash
chmod +x setup-pi.sh
./setup-pi.sh
```

### 2. Start the Dashboard

```bash
npm start
```

The dashboard will be available at `http://<your-pi-ip>:3000`

Find your Pi's IP address:
```bash
hostname -I
```

## Docker Troubleshooting

If you're getting "Cannot connect to Docker daemon" errors:

### Check if Docker service is running:
```bash
sudo systemctl status docker
```

### If it's not running, start it:
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Add your user to the docker group:
```bash
sudo usermod -aG docker $USER
```

**Then log out and log back in** for the group change to take effect.

### Test Docker:
```bash
docker --version
docker ps
```

### Important Note for Pi Zero W:
The Raspberry Pi Zero W uses **ARMv6** architecture. Docker's official support for ARMv6 is limited. Many Docker images won't work on Pi Zero W. **We recommend running the app natively instead of using Docker.**

## Manual Setup (Without Docker)

### 1. Update your system:
```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### 2. Install Node.js (if not already installed):

**For Raspberry Pi OS (recommended):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify installation:**
```bash
node --version
npm --version
```

### 3. Clone and setup the project:
```bash
cd /home/pi/
git clone <your-repo-url> brainworm
cd brainworm
npm install
```

### 4. Start the server:
```bash
npm start
```

## Running as a Background Service

To keep the dashboard running even after you close the terminal:

### Option 1: Using PM2 (Recommended)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the dashboard
pm2 start server.js --name brainworm

# Make it start on boot
pm2 startup systemd
# Follow the command it gives you (copy and paste it)

# Save the current PM2 configuration
pm2 save

# Useful PM2 commands:
pm2 status           # Check status
pm2 logs brainworm   # View logs
pm2 restart brainworm # Restart
pm2 stop brainworm   # Stop
```

### Option 2: Using systemd

Create a service file:
```bash
sudo nano /etc/systemd/system/brainworm.service
```

Paste this content (adjust paths if needed):
```ini
[Unit]
Description=BrainWorm Dashboard
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/brainworm
ExecStart=/usr/bin/node /home/pi/brainworm/server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable brainworm
sudo systemctl start brainworm

# Check status:
sudo systemctl status brainworm

# View logs:
sudo journalctl -u brainworm -f
```

## Performance Tips for Pi Zero W

1. **Don't use Docker** - Run natively for better performance
2. **Close unnecessary services** to free up RAM
3. **Use swap** if you experience memory issues:
   ```bash
   sudo dphys-swapfile swapoff
   sudo nano /etc/dphys-swapfile
   # Change CONF_SWAPSIZE=100 to CONF_SWAPSIZE=512
   sudo dphys-swapfile setup
   sudo dphys-swapfile swapon
   ```
4. **Reduce API refresh interval** if needed (edit `public/app.js`, line 265)

## Accessing from iPad

1. Make sure your iPad is on the same network as your Pi
2. Open Safari on your iPad
3. Navigate to `http://<pi-ip-address>:3000`
4. Tap the Share button (square with arrow)
5. Select "Add to Home Screen"
6. Name it "BrainWorm Dashboard"
7. Open from your home screen for full-screen experience

## Troubleshooting

### Port 3000 already in use:
```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill the process (replace PID with actual number)
kill -9 <PID>

# Or use a different port by setting environment variable:
PORT=8080 npm start
```

### npm install fails:
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

### Out of memory errors:
- Increase swap size (see Performance Tips above)
- Close other running applications
- Consider using a Pi with more RAM (Pi 3/4)

### Can't access from iPad:
- Check firewall settings:
  ```bash
  sudo ufw status
  # If active and blocking, allow port 3000:
  sudo ufw allow 3000
  ```
- Verify Pi is on same network as iPad
- Try accessing using IP address, not hostname

## Updating the Dashboard

```bash
cd /home/pi/brainworm
git pull origin main
npm install  # In case dependencies changed
pm2 restart brainworm  # If using PM2
# OR
sudo systemctl restart brainworm  # If using systemd
```

## Monitoring

### Check CPU and Memory usage:
```bash
htop
# or
top
```

### Check temperature:
```bash
vcgencmd measure_temp
```

### Monitor logs (if using PM2):
```bash
pm2 logs brainworm
```

### Monitor logs (if using systemd):
```bash
sudo journalctl -u brainworm -f
```
