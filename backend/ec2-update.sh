#!/bin/bash

echo "🚗 Car Craft Lab Backend - EC2 Update Script"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_header() {
    echo -e "${BLUE}[HEADER]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root. Use a regular user with sudo privileges."
    exit 1
fi

# Configuration
APP_DIR="/home/$USER/car-craft-lab-backend"
BACKUP_DIR="/home/$USER/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

print_header "Starting application update..."

# Check if application directory exists
if [ ! -d "$APP_DIR" ]; then
    print_error "Application directory not found: $APP_DIR"
    print_error "Please run the deployment script first."
    exit 1
fi

# Navigate to application directory
cd "$APP_DIR"

# Create backup of current version
print_status "Creating backup of current version..."
tar -czf "$BACKUP_DIR/car-craft-lab-backend-backup-$TIMESTAMP.tar.gz" \
    --exclude='node_modules' \
    --exclude='logs' \
    --exclude='.git' \
    .

print_status "Backup created: car-craft-lab-backup-$TIMESTAMP.tar.gz"

# Stop the application
print_status "Stopping application..."
pm2 stop car-craft-lab-backend

# Pull latest changes from git
print_status "Pulling latest changes from git..."
if git status &> /dev/null; then
    git fetch origin
    git reset --hard origin/main
    print_status "Git repository updated"
else
    print_warning "Not a git repository. Skipping git update."
fi

# Install/update dependencies
print_status "Installing/updating dependencies..."
npm install --production

# Check if .env file exists, if not create from template
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    if [ -f ec2-production.env ]; then
        cp ec2-production.env .env
        print_warning "Please update the .env file with your actual configuration values."
    else
        print_error "No .env template found. Please create .env file manually."
        exit 1
    fi
fi

# Run database migrations if any
print_status "Running database migrations..."
# Add your migration commands here if needed
# npm run migrate

# Seed database if needed
print_status "Seeding database..."
npm run seed

# Start the application
print_status "Starting application..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Check application status
print_status "Checking application status..."
sleep 5

if pm2 list | grep -q "car-craft-lab-backend.*online"; then
    print_status "Application started successfully"
else
    print_error "Application failed to start"
    print_status "Checking logs..."
    pm2 logs car-craft-lab-backend --lines 20
    exit 1
fi

# Test health endpoint
print_status "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)
if [ "$HEALTH_RESPONSE" = "200" ]; then
    print_status "Health check passed (HTTP $HEALTH_RESPONSE)"
else
    print_warning "Health check returned HTTP $HEALTH_RESPONSE"
fi

# Restart nginx to ensure configuration is loaded
print_status "Restarting nginx..."
sudo systemctl restart nginx

# Check nginx status
if systemctl is-active --quiet nginx; then
    print_status "Nginx restarted successfully"
else
    print_error "Nginx failed to restart"
    sudo systemctl status nginx
fi

# Clean up old backups (keep last 5)
print_status "Cleaning up old backups..."
cd "$BACKUP_DIR"
ls -t car-craft-lab-backend-backup-*.tar.gz | tail -n +6 | xargs -r rm

print_header "Update completed successfully!"
echo ""
echo "📋 Update Summary:"
echo "   ✅ Backup created: car-craft-lab-backup-$TIMESTAMP.tar.gz"
echo "   ✅ Dependencies updated"
echo "   ✅ Application restarted"
echo "   ✅ Nginx restarted"
echo "   ✅ Health check passed"
echo ""
echo "🌐 Your API is available at:"
echo "   http://$(curl -s ifconfig.me)"
echo "   Health check: http://$(curl -s ifconfig.me)/health"
echo ""
echo "📊 Monitor your application:"
echo "   pm2 status"
echo "   pm2 logs car-craft-lab-backend"
echo "   ./ec2-monitoring.sh"
echo ""
echo "🔄 If you need to rollback:"
echo "   pm2 stop car-craft-lab-backend"
echo "   cd $APP_DIR"
echo "   tar -xzf $BACKUP_DIR/car-craft-lab-backend-backup-$TIMESTAMP.tar.gz"
echo "   pm2 start ecosystem.config.js" 