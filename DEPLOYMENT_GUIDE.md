# 🚀 Deployment Guide

Complete guide for deploying Token Insight & Analytics API to production.

## 📦 Prerequisites

Before deploying, ensure you have:
- Production API keys for all services
- Server with Node.js 18+ or Docker installed
- Domain name and SSL certificate (recommended)
- Reverse proxy (Nginx recommended)
- Process manager (PM2 recommended)

## 🌐 Deployment Options

### Option 1: Docker Compose (Recommended)

Best for: Quick deployment with MongoDB support

```bash
# 1. Copy environment file
cp .env.example .env.production

# 2. Edit with production values
nano .env.production

# 3. Start services
docker-compose up -d

# 4. Check logs
docker-compose logs -f
```

**Production Environment Variables:**
```env
NODE_ENV=production
PORT=5000
AI_PROVIDER=HUGGINGFACE
HUGGINGFACE_API_KEY=prod_key_here
COINGECKO_API_KEY=prod_key_here
MONGODB_URI=mongodb://mongo:27017/token-insight
```

### Option 2: PM2 (Process Manager)

Best for: Traditional VPS deployments

```bash
# 1. Install PM2
npm install -g pm2

# 2. Start application
pm2 start src/server.js --name token-insight-api

# 3. Enable auto-restart on reboot
pm2 startup
pm2 save

# 4. Monitor
pm2 logs token-insight-api
pm2 status

# 5. Stop application
pm2 stop token-insight-api
```

**PM2 Ecosystem File (ecosystem.config.js):**
```javascript
module.exports = {
  apps: [{
    name: 'token-insight-api',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
};
```

Use with: `pm2 start ecosystem.config.js`

### Option 3: Kubernetes

Best for: Enterprise-scale deployments

**Dockerfile** (already included)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
USER nodejs
EXPOSE 5000
CMD ["npm", "start"]
```

**Deployment Steps:**
```bash
# 1. Build and push image
docker build -t your-registry/token-insight-api:v1.0.0 .
docker push your-registry/token-insight-api:v1.0.0

# 2. Create Kubernetes manifests
# - deployment.yaml
# - service.yaml
# - configmap.yaml
# - secret.yaml

# 3. Apply manifests
kubectl apply -f k8s/

# 4. Verify deployment
kubectl get pods
kubectl logs -f deployment/token-insight-api
```

### Option 4: Serverless (AWS Lambda / Vercel / Netlify)

Best for: Cost-effective, auto-scaling

**Note:** Requires code modifications for serverless environment

```bash
# Install serverless framework
npm install -g serverless

# Configure AWS credentials
serverless config credentials --provider aws --key XXX --secret XXX

# Deploy
serverless deploy
```

## 🔒 Security Checklist

### Before Deployment

- [ ] All API keys rotated and secured
- [ ] `.env` file not in version control
- [ ] HTTPS/SSL enabled
- [ ] CORS origins configured
- [ ] Rate limiting enabled
- [ ] Firewall rules configured
- [ ] Secrets management in place
- [ ] Logging and monitoring set up
- [ ] Backup strategy in place
- [ ] Security headers configured (Helmet)

### Environment Variables Security

```env
# Production .env should never be committed
# Use secrets management:
# - AWS Secrets Manager
# - HashiCorp Vault
# - Azure Key Vault
# - Kubernetes Secrets
```

### Nginx Reverse Proxy

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

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

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
}
```

## 📊 Monitoring & Logging

### Recommended Tools

1. **Application Monitoring**
   - New Relic
   - DataDog
   - Sentry (error tracking)

2. **Logging**
   - Winston (Node.js logger)
   - ELK Stack (Elasticsearch, Logstash, Kibana)
   - CloudWatch (AWS)

3. **Uptime Monitoring**
   - Pingdom
   - UptimeRobot
   - StatusCake

### Winston Setup Example

```bash
npm install winston
```

**src/utils/logger.js:**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

## 🗄️ Database Setup (Optional but Recommended)

### MongoDB Atlas (Cloud)

1. Create cluster at mongodb.com
2. Get connection string
3. Add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/token-insight
   ```

### Self-Hosted MongoDB

```bash
# Install MongoDB
apt-get install mongodb

# Start service
systemctl start mongod
systemctl enable mongod

# Connection string
MONGODB_URI=mongodb://localhost:27017/token-insight
```

### Redis Cache (Production)

```bash
# Install Redis
apt-get install redis-server

# Start Redis
systemctl start redis
systemctl enable redis

# Update code to use Redis instead of in-memory cache
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/app
            git pull
            npm ci --production
            pm2 restart token-insight-api
```

## 📈 Performance Optimization

### Production Build

1. **Enable caching headers**
2. **Use Redis for cache** (instead of in-memory)
3. **Enable compression**:
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

4. **Database indexing**
5. **CDN for static assets** (if any)
6. **Load balancing** for multiple instances

### Scaling

**Horizontal Scaling:**
```bash
# Run multiple PM2 instances
pm2 start ecosystem.config.js

# Or use Docker Swarm
docker service scale token-insight-api=5
```

## 🔍 Health Checks & Alerts

### Automated Health Monitoring

```bash
# Add to crontab
*/5 * * * * curl -f http://localhost:5000/health || systemctl restart token-insight-api
```

### Uptime Monitoring

Configure external monitoring service to check:
- GET https://yourdomain.com/health
- Expected: 200 OK
- Alert if: down for > 1 minute

## 🗂️ Backup Strategy

### Database Backups

```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/token-insight" --out=/backup/$(date +%Y%m%d)

# Automated daily backup
0 2 * * * mongodump --uri="mongodb://localhost:27017/token-insight" --out=/backup/$(date +\%Y\%m\%d)
```

### Configuration Backups

```bash
# Backup environment files
cp .env .env.backup.$(date +%Y%m%d)
```

## 📞 Rollback Procedure

### If Deployment Fails

**Docker:**
```bash
docker-compose down
docker-compose up -d  # previous version
```

**PM2:**
```bash
pm2 restart token-insight-api --update-env
```

**Git:**
```bash
git checkout previous-commit
npm ci --production
pm2 restart token-insight-api
```

## ✅ Post-Deployment Checklist

- [ ] Health endpoint responds
- [ ] All API endpoints functional
- [ ] No errors in logs
- [ ] SSL certificate valid
- [ ] Rate limiting working
- [ ] Monitoring configured
- [ ] Alerts set up
- [ ] Backups scheduled
- [ ] Documentation updated
- [ ] Team notified

## 📊 Monitoring Dashboard

Create a simple dashboard showing:
- API uptime
- Request count
- Average response time
- Error rate
- Cache hit rate
- Active users

## 🆘 Troubleshooting

**High Memory Usage**
- Increase PM2 memory limit
- Add more server resources
- Optimize caching strategy

**Slow Response Times**
- Enable Redis caching
- Add database indexes
- Use CDN for static assets
- Scale horizontally

**API Rate Limits**
- Implement request queuing
- Add retry logic with exponential backoff
- Monitor API usage
- Upgrade API tier if needed

## 📚 Additional Resources

- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Production Checklist](https://docs.mongodb.com/manual/administration/production-checklist/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Your API is now production-ready! 🎉**

