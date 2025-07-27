# 🚗 Car Craft Lab Backend - AWS EC2 Deployment

This guide provides everything you need to deploy your Car Craft Lab backend on AWS EC2.

## 📁 Files Overview

- `ec2-deploy.sh` - Main deployment script
- `ec2-update.sh` - Update script for new versions
- `ec2-monitoring.sh` - Monitoring and health check script
- `ec2-production.env` - Production environment template
- `ec2-setup-guide.md` - Detailed setup guide

## 🚀 Quick Start

### 1. Launch EC2 Instance
- Use Ubuntu Server 22.04 LTS
- Instance type: `t3.micro` (free tier) or `t3.small`
- Security Group: SSH (22), HTTP (80), HTTPS (443)

### 2. Connect and Deploy
```bash
# Connect to your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Clone your repository
git clone https://github.com/your-username/car-craft-lab.git
cd car-craft-lab/backend

# Run deployment
chmod +x ec2-deploy.sh
./ec2-deploy.sh
```

## 🔧 What the Deployment Script Does

1. **System Setup**:
   - Updates system packages
   - Installs Node.js 18.x
   - Installs PM2 process manager
   - Installs nginx reverse proxy
   - Installs certbot for SSL

2. **Application Setup**:
   - Creates application directory
   - Installs dependencies
   - Creates production environment file
   - Sets up PM2 configuration
   - Configures nginx

3. **Security**:
   - Configures firewall (UFW)
   - Sets up PM2 systemd service
   - Enables automatic startup

4. **Database**:
   - Seeds initial data

## 📊 Monitoring

### Check Application Status
```bash
# View PM2 status
pm2 status

# View logs
pm2 logs car-craft-lab-backend

# Monitor resources
pm2 monit
```

### Run Monitoring Dashboard
```bash
./ec2-monitoring.sh
```

### Health Check
```bash
curl http://your-ec2-ip/health
```

## 🔄 Updates

### Deploy New Version
```bash
./ec2-update.sh
```

This script:
- Creates backup of current version
- Pulls latest code from git
- Updates dependencies
- Restarts application
- Tests health endpoint

## 🔐 Environment Configuration

### Update Production Environment
1. Edit `ec2-production.env` with your values
2. Copy to `.env`:
   ```bash
   cp ec2-production.env .env
   ```

### Important Environment Variables
```bash
# Database
MONGODB_URI=your-mongodb-atlas-connection-string

# Security
JWT_SECRET=your-strong-secret-key

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🌐 Domain and SSL Setup

### 1. Point Domain to EC2
- Create A record pointing to your EC2 public IP
- Wait for DNS propagation

### 2. Set up SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com
```

### 3. Update CORS
Update `CORS_ORIGIN` in `.env` with your domain.

## 🐛 Troubleshooting

### Common Issues

1. **Application not starting**:
   ```bash
   pm2 logs car-craft-lab-backend
   ```

2. **Nginx issues**:
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. **Database connection**:
   - Check MongoDB URI in `.env`
   - Verify MongoDB Atlas IP whitelist
   - Test connection: `./ec2-monitoring.sh`

4. **Port conflicts**:
   ```bash
   sudo netstat -tulpn | grep :5000
   ```

### Log Locations
- Application: `pm2 logs car-craft-lab-backend`
- Nginx: `/var/log/nginx/`
- System: `sudo journalctl -u nginx`

## 📈 Performance Optimization

### 1. Enable Gzip Compression
Add to nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### 2. PM2 Cluster Mode
The deployment script already configures PM2 to run in cluster mode for better performance.

### 3. Monitor Resources
```bash
pm2 monit
htop
```

## 🔒 Security Best Practices

1. **Update JWT Secret**: Generate a strong secret
2. **Restrict SSH Access**: Limit to your IP in security group
3. **Regular Updates**: Keep system packages updated
4. **Firewall**: UFW is configured to allow only necessary ports
5. **SSL**: Always use HTTPS in production

## 📞 Support Commands

```bash
# Application management
pm2 status                    # Check status
pm2 restart car-craft-lab-backend  # Restart app
pm2 stop car-craft-lab-backend     # Stop app
pm2 start ecosystem.config.js      # Start app

# Nginx management
sudo systemctl restart nginx  # Restart nginx
sudo nginx -t                 # Test config
sudo systemctl status nginx   # Check status

# Monitoring
./ec2-monitoring.sh          # Full monitoring dashboard
pm2 logs car-craft-lab-backend --lines 50  # Recent logs
```

## 🎯 API Endpoints

After deployment, your API will be available at:
- **Health Check**: `http://your-ec2-ip/health`
- **API Base**: `http://your-ec2-ip/api`
- **Auth**: `http://your-ec2-ip/api/auth`
- **Services**: `http://your-ec2-ip/api/services`
- **Builds**: `http://your-ec2-ip/api/builds`

## 📋 Checklist

- [ ] EC2 instance launched with correct security group
- [ ] Deployment script executed successfully
- [ ] Environment variables configured
- [ ] Domain pointed to EC2 (if applicable)
- [ ] SSL certificate installed (if applicable)
- [ ] CORS configured for frontend
- [ ] Health check passing
- [ ] Monitoring dashboard working
- [ ] Backup strategy in place

Your backend is now ready for production! 🚀 