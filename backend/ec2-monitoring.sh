#!/bin/bash

echo "🚗 Car Craft Lab Backend - EC2 Monitoring Dashboard"
echo "=================================================="

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

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed. Please run the deployment script first."
    exit 1
fi

# Get system information
print_header "System Information"
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime -p)"
echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"
echo "Memory Usage: $(free -h | awk 'NR==2{printf "%.1f%%", $3*100/$2}')"
echo "Disk Usage: $(df -h / | awk 'NR==2{print $5}')"

echo ""

# PM2 Application Status
print_header "PM2 Application Status"
pm2 status

echo ""

# Check if application is running
if pm2 list | grep -q "car-craft-lab-backend"; then
    print_status "Application is running"
    
    # Get application info
    APP_STATUS=$(pm2 jlist | jq -r '.[] | select(.name=="car-craft-lab-backend") | .pm2_env.status')
    APP_RESTARTS=$(pm2 jlist | jq -r '.[] | select(.name=="car-craft-lab-backend") | .pm2_env.restart_time')
    APP_UPTIME=$(pm2 jlist | jq -r '.[] | select(.name=="car-craft-lab-backend") | .pm2_env.pm_uptime')
    
    echo "Status: $APP_STATUS"
    echo "Restarts: $APP_RESTARTS"
    echo "Uptime: $(($APP_UPTIME / 1000 / 60)) minutes"
else
    print_error "Application is not running"
fi

echo ""

# Nginx Status
print_header "Nginx Status"
if systemctl is-active --quiet nginx; then
    print_status "Nginx is running"
    echo "Status: $(systemctl is-active nginx)"
    echo "Enabled: $(systemctl is-enabled nginx)"
else
    print_error "Nginx is not running"
fi

echo ""

# Port Status
print_header "Port Status"
if netstat -tulpn | grep -q ":5000"; then
    print_status "Port 5000 is in use (Application)"
else
    print_warning "Port 5000 is not in use"
fi

if netstat -tulpn | grep -q ":80"; then
    print_status "Port 80 is in use (Nginx)"
else
    print_warning "Port 80 is not in use"
fi

echo ""

# Recent Logs
print_header "Recent Application Logs (Last 10 lines)"
pm2 logs car-craft-lab-backend --lines 10 --nostream

echo ""

# Health Check
print_header "Health Check"
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)
if [ "$HEALTH_RESPONSE" = "200" ]; then
    print_status "Health check passed (HTTP $HEALTH_RESPONSE)"
    curl -s http://localhost:5000/health | jq .
else
    print_error "Health check failed (HTTP $HEALTH_RESPONSE)"
fi

echo ""

# Database Connection Test
print_header "Database Connection Test"
if [ -f .env ]; then
    MONGODB_URI=$(grep MONGODB_URI .env | cut -d '=' -f2)
    if [ -n "$MONGODB_URI" ]; then
        print_status "Testing MongoDB connection..."
        # Simple connection test using Node.js
        node -e "
        const mongoose = require('mongoose');
        const uri = '$MONGODB_URI';
        
        mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
          .then(() => {
            console.log('✅ Database connection successful');
            process.exit(0);
          })
          .catch(err => {
            console.log('❌ Database connection failed:', err.message);
            process.exit(1);
          });
        " 2>/dev/null
        
        if [ $? -eq 0 ]; then
            print_status "Database connection successful"
        else
            print_error "Database connection failed"
        fi
    else
        print_warning "MONGODB_URI not found in .env"
    fi
else
    print_warning ".env file not found"
fi

echo ""

# Resource Usage
print_header "Resource Usage"
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1

echo "Memory Usage:"
free -h

echo "Disk Usage:"
df -h

echo ""

# Network Connections
print_header "Active Network Connections"
netstat -tulpn | grep -E ":(80|443|5000)" | head -5

echo ""

# Recent Errors
print_header "Recent Errors (Last 5)"
pm2 logs car-craft-lab-backend --lines 50 --nostream | grep -i error | tail -5

echo ""

# Quick Actions Menu
print_header "Quick Actions"
echo "1. Restart Application: pm2 restart car-craft-lab-backend"
echo "2. View Live Logs: pm2 logs car-craft-lab-backend"
echo "3. Monitor Resources: pm2 monit"
echo "4. Restart Nginx: sudo systemctl restart nginx"
echo "5. Check Nginx Config: sudo nginx -t"
echo "6. View System Logs: sudo journalctl -u nginx -f"
echo "7. Check Firewall: sudo ufw status"

echo ""
print_status "Monitoring complete!" 