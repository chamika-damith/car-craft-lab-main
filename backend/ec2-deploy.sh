#!/bin/bash

echo "🚗 Car Craft Lab Backend - AWS EC2 Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root. Use a regular user with sudo privileges."
    exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm (using NodeSource repository)
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_status "Node.js version: $NODE_VERSION"
print_status "npm version: $NPM_VERSION"

# Install PM2 globally for process management
print_status "Installing PM2 process manager..."
sudo npm install -g pm2

# Install nginx for reverse proxy
print_status "Installing nginx..."
sudo apt install -y nginx

# Install certbot for SSL certificates
print_status "Installing certbot for SSL..."
sudo apt install -y certbot python3-certbot-nginx

# Create application directory
APP_DIR="/home/$USER/car-craft-lab-backend"
print_status "Setting up application directory: $APP_DIR"

if [ ! -d "$APP_DIR" ]; then
    mkdir -p "$APP_DIR"
fi

# Copy application files (assuming script is run from project root)
print_status "Copying application files..."
cp -r . "$APP_DIR/"

# Navigate to app directory
cd "$APP_DIR"

# Install dependencies
print_status "Installing Node.js dependencies..."
npm install --production

# Create production .env file
print_status "Creating production environment configuration..."
cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=${MONGODB_URI:-"mongodb+srv://chamikadamith9:Chamika%40200273@cluster0.bcz4z.mongodb.net/docbooking?retryWrites=true&w=majority&appName=Cluster0"}

# JWT Configuration
JWT_SECRET=${JWT_SECRET:-"your-super-secret-jwt-key-change-this-in-production"}
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=${CORS_ORIGIN:-"*"}
EOF

# Create PM2 ecosystem file
print_status "Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'car-craft-lab-backend',
    script: 'src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Create nginx configuration
print_status "Configuring nginx..."
sudo tee /etc/nginx/sites-available/car-craft-lab-backend > /dev/null << EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:5000/health;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/car-craft-lab-backend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
if sudo nginx -t; then
    print_status "Nginx configuration is valid"
    sudo systemctl restart nginx
    sudo systemctl enable nginx
else
    print_error "Nginx configuration is invalid"
    exit 1
fi

# Start the application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure firewall
print_status "Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Create systemd service for PM2
print_status "Setting up PM2 systemd service..."
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER

# Seed the database
print_status "Seeding database with sample data..."
npm run seed

print_status "Deployment completed successfully!"
echo ""
echo "🎉 Your Car Craft Lab Backend is now deployed on AWS EC2!"
echo ""
echo "📋 Useful commands:"
echo "   PM2 Status: pm2 status"
echo "   PM2 Logs: pm2 logs car-craft-lab-backend"
echo "   Restart App: pm2 restart car-craft-lab-backend"
echo "   Stop App: pm2 stop car-craft-lab-backend"
echo ""
echo "🌐 Your API endpoints:"
echo "   Health Check: http://$(curl -s ifconfig.me)/health"
echo "   API Base: http://$(curl -s ifconfig.me)/api"
echo ""
echo "🔧 Next steps:"
echo "   1. Configure your domain name (if you have one)"
echo "   2. Set up SSL certificate: sudo certbot --nginx"
echo "   3. Update CORS_ORIGIN in .env with your frontend domain"
echo "   4. Update JWT_SECRET with a strong secret"
echo ""
echo "📊 Monitor your application:"
echo "   pm2 monit" 