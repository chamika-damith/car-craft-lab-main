# 🚀 Car Craft Lab Backend - CI/CD Documentation

This document explains the complete CI/CD setup using GitHub Actions for automated testing, security scanning, and deployment to AWS EC2.

## 📁 CI/CD Structure

```
.github/
├── workflows/
│   ├── ci-cd.yml          # Main CI/CD pipeline
│   ├── security.yml       # Security scanning & dependency management
│   └── backup.yml         # Automated backups
├── dependabot.yml         # Automated dependency updates
├── ISSUE_TEMPLATE/        # Issue templates
│   ├── bug_report.md
│   └── feature_request.md
└── pull_request_template.md
```

## 🔄 CI/CD Pipeline Overview

### Main Pipeline (`ci-cd.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` branch
- Only when changes are made in `backend/` directory

**Jobs:**

1. **🧪 Test & Build**
   - Installs dependencies
   - Runs security audit
   - Executes tests
   - Runs linting
   - Builds application

2. **🔒 Security Scan**
   - npm audit with high severity
   - Snyk security scanning
   - Generates security reports

3. **🚀 Deploy to Staging** (develop branch)
   - Deploys to staging EC2 instance
   - Runs health checks
   - Automated rollback on failure

4. **🚀 Deploy to Production** (main branch)
   - Deploys to production EC2 instance
   - Uses `ec2-update.sh` script
   - Runs health checks
   - Sends Slack notifications

5. **📧 Notify Failure**
   - Sends failure notifications to Slack

## 🔒 Security Workflow (`security.yml`)

**Triggers:**
- Daily at 2 AM UTC (scheduled)
- Push/PR changes to package files

**Jobs:**

1. **🔍 Dependency Vulnerability Scan**
   - npm audit with JSON output
   - Snyk security scanning
   - Uploads reports as artifacts

2. **🔄 Dependency Updates**
   - Checks for outdated packages
   - Creates automated PRs for updates
   - Manages dependency lifecycle

3. **🔍 Code Security Analysis**
   - ESLint security rules
   - Bandit security scanning
   - Code quality checks

4. **📧 Security Notifications**
   - Sends security summaries to Slack

## 💾 Backup Workflow (`backup.yml`)

**Triggers:**
- Daily at 3 AM UTC (scheduled)
- Manual trigger with backup type selection

**Jobs:**

1. **🗄️ Database Backup**
   - MongoDB backup using mongodump
   - Fallback to Node.js backup script
   - Compresses and stores backups

2. **📦 Application Backup**
   - Backs up application code
   - Excludes node_modules and logs
   - Version-controlled backups

3. **⚙️ Configuration Backup**
   - Backs up .env files
   - Nginx configurations
   - PM2 ecosystem files

4. **✅ Backup Verification**
   - Verifies backup integrity
   - Sends backup notifications

## 🔧 Required GitHub Secrets

### EC2 Deployment Secrets
```bash
EC2_SSH_PRIVATE_KEY          # SSH private key for EC2 access
EC2_PRODUCTION_HOST          # Production EC2 public IP/domain
EC2_STAGING_HOST            # Staging EC2 public IP/domain
```

### Database Secrets
```bash
MONGODB_URI_TEST            # Test database connection string
```

### Security Secrets
```bash
SNYK_TOKEN                  # Snyk API token for security scanning
```

### Notification Secrets
```bash
SLACK_WEBHOOK_URL           # Slack webhook for notifications
```

## 🚀 Deployment Process

### Staging Deployment (develop branch)
1. **Code Push** → Triggers CI/CD pipeline
2. **Tests & Security** → All checks must pass
3. **Deploy** → SSH to staging EC2
4. **Update Code** → Pull latest from develop branch
5. **Restart App** → PM2 restart
6. **Health Check** → Verify deployment success

### Production Deployment (main branch)
1. **Code Push** → Triggers CI/CD pipeline
2. **Tests & Security** → All checks must pass
3. **Deploy** → SSH to production EC2
4. **Run Update Script** → Execute `ec2-update.sh`
5. **Health Check** → Verify deployment success
6. **Notification** → Send success notification

## 🔄 Branch Strategy

```
main (production)
├── develop (staging)
│   ├── feature/new-feature
│   ├── bugfix/issue-123
│   └── hotfix/critical-fix
```

**Workflow:**
1. Create feature branch from `develop`
2. Develop and test locally
3. Push to feature branch
4. Create PR to `develop`
5. Code review and merge
6. Deploy to staging automatically
7. Create PR from `develop` to `main`
8. Deploy to production automatically

## 📊 Monitoring & Notifications

### Slack Notifications
- **Deployment Success**: Production deployments
- **Deployment Failure**: Any deployment failures
- **Security Alerts**: High-severity security issues
- **Backup Status**: Daily backup results

### Health Checks
- **Staging**: `http://staging-ip/health`
- **Production**: `http://production-ip/health`
- **Response**: JSON with status and timestamp

## 🔧 Configuration Files

### Dependabot (`dependabot.yml`)
- **npm**: Weekly updates on Mondays
- **GitHub Actions**: Weekly updates
- **Docker**: Weekly updates (future)
- **Ignores**: Major version updates for critical packages

### Issue Templates
- **Bug Report**: Structured bug reporting
- **Feature Request**: Detailed feature proposals
- **Pull Request**: Comprehensive PR template

## 🛠️ Local Development Setup

### Prerequisites
```bash
# Install required tools
npm install -g eslint
npm install -g nodemon

# Install project dependencies
npm install

# Set up environment
cp env.example .env
# Edit .env with your configuration
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Run security audit
npm audit
```

### Pre-commit Hooks
```bash
# Install husky (if not already installed)
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm test && npm run lint"
```

## 🔍 Troubleshooting

### Common Issues

1. **Deployment Fails**
   ```bash
   # Check EC2 SSH access
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Check application logs
   pm2 logs car-craft-lab-backend
   
   # Check nginx logs
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Security Scan Fails**
   ```bash
   # Update Snyk token
   # Check for vulnerable dependencies
   npm audit fix
   ```

3. **Backup Fails**
   ```bash
   # Check disk space
   df -h
   
   # Check backup directory permissions
   ls -la ~/backups/
   ```

### Debugging Workflows
1. **Check GitHub Actions logs**
2. **Verify secrets are set correctly**
3. **Test SSH connectivity manually**
4. **Check EC2 instance status**

## 📈 Performance Optimization

### CI/CD Optimizations
- **Caching**: npm cache for faster builds
- **Parallel Jobs**: Independent jobs run in parallel
- **Conditional Jobs**: Only run when necessary
- **Artifact Management**: Efficient artifact storage

### Deployment Optimizations
- **Rolling Updates**: Zero-downtime deployments
- **Health Checks**: Automatic rollback on failure
- **Backup Strategy**: Automated backups with retention
- **Monitoring**: Real-time application monitoring

## 🔒 Security Best Practices

1. **Secrets Management**
   - Use GitHub Secrets for sensitive data
   - Rotate secrets regularly
   - Limit secret access

2. **Code Security**
   - Regular security scans
   - Dependency vulnerability checks
   - Code quality gates

3. **Infrastructure Security**
   - SSH key management
   - Firewall configuration
   - SSL/TLS certificates

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests**
5. **Update documentation**
6. **Submit a pull request**

The CI/CD pipeline will automatically test your changes and provide feedback.

---

Your CI/CD pipeline is now fully automated! 🚀 