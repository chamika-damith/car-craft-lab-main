# 🚗 Car Craft Lab Backend - AWS EC2 Deployment Guide

This guide will help you deploy your Car Craft Lab backend on AWS EC2 with proper production configuration.

## 📋 Prerequisites

- AWS Account with EC2 access
- Domain name (optional, but recommended for SSL)
- Basic knowledge of AWS EC2 and SSH

## 🚀 Quick Deployment

### Step 1: Launch EC2 Instance

1. **Launch Instance**:
   - Go to AWS EC2 Console
   - Click "Launch Instance"
   - Choose "Ubuntu Server 22.04 LTS"
   - Select instance type: `t3.micro` (free tier) or `t3.small` for production
   - Configure Security Group:
     - SSH (Port 22) from your IP
     - HTTP (Port 80) from anywhere
     - HTTPS (Port 443) from anywhere

2. **Create Key Pair**:
   - Create or select an existing key pair
   - Download the `.pem` file
   - Set permissions: `chmod 400 your-key.pem`

### Step 2: Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Step 3: Clone and Deploy

```bash
# Clone your repository
git clone https://github.com/your-username/car-craft-lab.git
cd car-craft-lab/backend

# Make deployment script executable
chmod +x ec2-deploy.sh

# Run deployment script
./ec2-deploy.sh
```

## 🔧 Manual Setup (Alternative)

If you prefer manual setup or need to customize the deployment:

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Install PM2
```bash
sudo npm install -g pm2
```

### 4. Install Nginx
```bash
sudo apt install -y nginx
```

### 5. Configure Environment
```bash
# Create .env file
cat > .env << EOF
PORT=5000
NODE_ENV=production
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=your-frontend-domain
EOF
```

### 6. Install Dependencies
```bash
npm install --production
```

### 7. Configure Nginx
```bash
sudo tee /etc/nginx/sites-available/car-craft-lab-backend > /dev/null << EOF
server {
    listen 80;
    server_name your-domain.com;

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
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/car-craft-lab-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Start Application
```bash
pm2 start src/server.js --name "car-craft-lab-backend"
pm2 save
pm2 startup
```

## 🔒 Security Configuration

### 1. Configure Firewall
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### 2. Set up SSL Certificate (if you have a domain)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 3. Update Security Group
- Remove port 5000 from security group (only use 80/443)
- Restrict SSH access to your IP only

## 📊 Monitoring and Management

### PM2 Commands
```bash
# Check status
pm2 status

# View logs
pm2 logs car-craft-lab-backend

# Restart application
pm2 restart car-craft-lab-backend

# Monitor resources
pm2 monit

# Stop application
pm2 stop car-craft-lab-backend
```

### Nginx Commands
```bash
# Check status
sudo systemctl status nginx

# Restart nginx
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Deployment Updates

### 1. Pull Latest Code
```bash
cd /home/ubuntu/car-craft-lab-backend
git pull origin main
```

### 2. Install Dependencies
```bash
npm install --production
```

### 3. Restart Application
```bash
pm2 restart car-craft-lab-backend
```

## 🐛 Troubleshooting

### Common Issues

1. **Application not starting**:
   ```bash
   pm2 logs car-craft-lab-backend
   ```

2. **Nginx not working**:
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. **Port already in use**:
   ```bash
   sudo netstat -tulpn | grep :5000
   ```

4. **Database connection issues**:
   - Check MongoDB URI in `.env`
   - Verify network connectivity
   - Check MongoDB Atlas IP whitelist

### Log Locations
- Application logs: `~/car-craft-lab-backend/logs/`
- PM2 logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`

## 📈 Performance Optimization

### 1. Enable Gzip Compression
Add to nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### 2. Configure PM2 for Production
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'car-craft-lab-backend',
    script: 'src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

### 3. Set up Log Rotation
```bash
sudo logrotate -f /etc/logrotate.d/pm2-ubuntu
```

## 🔐 Environment Variables

Make sure to update these in your `.env` file:

```bash
# Production settings
NODE_ENV=production
PORT=5000

# Database (use your actual MongoDB URI)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Security (generate a strong secret)
JWT_SECRET=your-very-long-and-random-secret-key

# CORS (your frontend domain)
CORS_ORIGIN=https://your-frontend-domain.com
```

## 📞 Support

If you encounter issues:
1. Check the logs: `pm2 logs car-craft-lab-backend`
2. Verify environment variables
3. Test database connectivity
4. Check nginx configuration: `sudo nginx -t`

Your backend should now be successfully deployed and accessible at `http://your-ec2-ip` or `https://your-domain.com`! 