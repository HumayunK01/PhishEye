# Deployment Guide

This guide covers various deployment options for PhishEye, from local development to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Environment Configuration](#environment-configuration)
- [Security Considerations](#security-considerations)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

### System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **Memory**: Minimum 512MB RAM (1GB recommended)
- **Storage**: 100MB for application + data storage
- **Network**: Internet connection for OSINT data sources

### Optional Dependencies

- **Redis**: For caching (recommended for production)
- **PostgreSQL**: For persistent data storage (optional)
- **Nginx**: For reverse proxy and load balancing

## Local Development

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/phish-eye.git
   cd phish-eye
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open `http://localhost:5000` in your browser

### Development Environment

```bash
# Install all dependencies
npm install

# Start with hot reload
npm run dev

# Run type checking
npm run check

# Run linting
npm run lint

# Build for production
npm run build
```

## Production Deployment

### Manual Deployment

1. **Prepare the server**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y

   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Deploy the application**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/phish-eye.git
   cd phish-eye

   # Install dependencies
   npm install --production

   # Build the application
   npm run build

   # Start with PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

3. **Configure reverse proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'phish-eye',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

## Docker Deployment

### Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production image
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S phish-eye -u 1001

# Copy built application
COPY --from=builder --chown=phish-eye:nodejs /app/dist ./dist
COPY --from=builder --chown=phish-eye:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=phish-eye:nodejs /app/package*.json ./

USER phish-eye

EXPOSE 5000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  phish-eye:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - phish-eye
    restart: unless-stopped
```

### Build and Run

```bash
# Build the image
docker build -t phish-eye .

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Cloud Deployment

### Heroku

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set PORT=5000
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### AWS EC2

1. **Launch EC2 instance**
   - Choose Ubuntu 20.04 LTS
   - Select t3.micro or larger
   - Configure security groups (port 80, 443, 22)

2. **Install dependencies**
   ```bash
   sudo apt update
   sudo apt install nginx nodejs npm git
   ```

3. **Deploy application**
   ```bash
   git clone https://github.com/your-username/phish-eye.git
   cd phish-eye
   npm install
   npm run build
   ```

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### DigitalOcean App Platform

1. **Create app specification**
   ```yaml
   name: phish-eye
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/phish-eye
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     http_port: 5000
     envs:
     - key: NODE_ENV
       value: production
   ```

2. **Deploy via DigitalOcean dashboard**

## Environment Configuration

### Environment Variables

Create `.env` file:

```env
# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Security
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret
CORS_ORIGIN=https://yourdomain.com

# Database (Optional)
DATABASE_URL=postgresql://user:password@localhost:5432/phish-eye

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# OSINT API Keys
VIRUSTOTAL_API_KEY=your-virustotal-api-key
PHISHTANK_API_KEY=your-phishtank-api-key

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong, unique secrets
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Enable security headers
- [ ] Set up automated backups
- [ ] Configure health checks
- [ ] Test all functionality

## Security Considerations

### SSL/TLS Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

### Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# iptables
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -j DROP
```

## Monitoring and Maintenance

### Health Checks

```bash
# Check application health
curl http://localhost:5000/api/health

# Check system resources
htop
df -h
free -h
```

### Log Management

```bash
# View application logs
pm2 logs phish-eye

# Rotate logs
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Backup Strategy

```bash
# Backup application data
tar -czf phish-eye-backup-$(date +%Y%m%d).tar.gz \
  /path/to/phish-eye/data \
  /path/to/phish-eye/logs

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups/phish-eye"
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "$BACKUP_DIR/phish-eye-$DATE.tar.gz" /app/data
find $BACKUP_DIR -name "phish-eye-*.tar.gz" -mtime +7 -delete
```

### Updates

```bash
# Update application
git pull origin main
npm install
npm run build
pm2 restart phish-eye

# Rollback if needed
git checkout previous-version
npm install
npm run build
pm2 restart phish-eye
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :5000
   sudo kill -9 PID
   ```

2. **Permission denied**
   ```bash
   sudo chown -R $USER:$USER /path/to/phish-eye
   chmod +x /path/to/phish-eye/dist/index.js
   ```

3. **Memory issues**
   ```bash
   # Increase Node.js memory limit
   export NODE_OPTIONS="--max-old-space-size=2048"
   ```

4. **Database connection issues**
   ```bash
   # Check database status
   sudo systemctl status postgresql
   sudo systemctl start postgresql
   ```

### Performance Optimization

1. **Enable gzip compression**
2. **Use CDN for static assets**
3. **Implement caching strategies**
4. **Optimize database queries**
5. **Use connection pooling**

## Support

For deployment issues:
- **Documentation**: [GitHub Wiki](https://github.com/your-username/phish-eye/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/phish-eye/issues)
- **Email**: support@phish-eye.com

---

*Last updated: January 15, 2024*
