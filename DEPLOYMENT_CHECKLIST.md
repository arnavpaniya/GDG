# Nyaya AI - Deployment Checklist

## Pre-Deployment Verification

### ✅ Development Environment

- [x] All services start without errors
- [x] Frontend runs on port 3000
- [x] Backend runs on port 5000
- [x] ML service runs on port 5001
- [x] Health checks pass
- [x] File upload works
- [x] ML analysis works
- [x] Export functions work
- [x] Fallback mechanism works
- [x] No console errors

### ✅ Code Quality

- [x] Frontend code reviewed
- [x] Backend code reviewed
- [x] ML service code reviewed
- [x] No hardcoded credentials
- [x] Environment variables used
- [x] Error handling implemented
- [x] Logging configured
- [x] Comments added where needed

### ✅ Documentation

- [x] README.md updated
- [x] INTEGRATION_GUIDE.md created
- [x] TESTING_GUIDE.md created
- [x] QUICK_START.md created
- [x] ARCHITECTURE.md created
- [x] DATA_FLOW.md created
- [x] API endpoints documented
- [x] Environment variables documented

### ✅ Testing

- [x] Backend health check tested
- [x] ML service health check tested
- [x] File upload tested
- [x] ML analysis tested
- [x] Error scenarios tested
- [x] Fallback mechanism tested
- [x] Export functions tested
- [x] Authentication tested

## Production Deployment Steps

### 1. Environment Setup

#### Frontend (Vercel/Netlify)

```env
# Production .env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_API_BASE_PATH=/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

**Deployment Commands:**
```bash
cd frontend
npm run build
# Deploy to Vercel/Netlify
```

#### Backend (AWS/GCP/Heroku)

```env
# Production .env
PORT=5000
NODE_ENV=production
PYTHON_SERVICE_URL=http://ml-service:5001
MAX_FILE_SIZE_MB=10
ALLOWED_ORIGINS=https://yourdomain.com
```

**Deployment Commands:**
```bash
cd backend
npm install --production
npm start
```

#### ML Service (AWS/GCP/Docker)

```bash
cd ml
pip install -r requirements.txt
python -m nyaya_ai.api_service
```

### 2. Infrastructure Setup

#### Option A: Traditional Hosting

**Frontend:**
- [ ] Deploy to Vercel/Netlify
- [ ] Configure custom domain
- [ ] Enable HTTPS
- [ ] Set environment variables

**Backend:**
- [ ] Deploy to AWS EC2/Heroku/GCP
- [ ] Configure security groups
- [ ] Enable HTTPS
- [ ] Set environment variables
- [ ] Configure CORS

**ML Service:**
- [ ] Deploy to AWS EC2/GCP Compute
- [ ] Install Python dependencies
- [ ] Configure firewall (internal only)
- [ ] Set up monitoring

#### Option B: Docker Deployment

**Create Dockerfiles:**

`frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

`backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

`ml/Dockerfile`:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5001
CMD ["python", "-m", "nyaya_ai.api_service"]
```

**Docker Compose:**

`docker-compose.yml`:
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - PYTHON_SERVICE_URL=http://ml-service:5001
      - ALLOWED_ORIGINS=http://localhost:3000
    depends_on:
      - ml-service

  ml-service:
    build: ./ml
    ports:
      - "5001:5001"
```

**Deploy:**
```bash
docker-compose up -d
```

### 3. Security Hardening

#### Backend Security

- [ ] Add rate limiting
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

- [ ] Add API authentication
```javascript
const authenticateAPI = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
app.use('/api/', authenticateAPI);
```

- [ ] Add helmet for security headers
```javascript
const helmet = require('helmet');
app.use(helmet());
```

- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Validate all inputs
- [ ] Sanitize file uploads

#### ML Service Security

- [ ] Restrict to internal network only
- [ ] Add authentication
- [ ] Validate all inputs
- [ ] Set resource limits
- [ ] Enable logging

### 4. Monitoring & Logging

#### Application Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configure application monitoring (New Relic/DataDog)
- [ ] Set up uptime monitoring (Pingdom/UptimeRobot)
- [ ] Configure log aggregation (ELK/CloudWatch)

#### Health Checks

```bash
# Backend health
curl https://api.yourdomain.com/api/v1/analyze/status

# ML service health (internal)
curl http://ml-service:5001/health
```

#### Alerts

- [ ] Set up alerts for service downtime
- [ ] Configure alerts for high error rates
- [ ] Set up alerts for high response times
- [ ] Configure alerts for resource usage

### 5. Performance Optimization

#### Frontend

- [ ] Enable Next.js production build
- [ ] Configure CDN for static assets
- [ ] Enable image optimization
- [ ] Implement code splitting
- [ ] Enable caching headers

#### Backend

- [ ] Add Redis caching
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache analysis results
app.get('/api/v1/analyze/cached/:id', async (req, res) => {
  const cached = await client.get(req.params.id);
  if (cached) return res.json(JSON.parse(cached));
  // ... fetch and cache
});
```

- [ ] Enable compression
```javascript
const compression = require('compression');
app.use(compression());
```

- [ ] Optimize database queries
- [ ] Add connection pooling

#### ML Service

- [ ] Implement model caching
- [ ] Add request queuing (Celery)
- [ ] Optimize data processing
- [ ] Use batch predictions

### 6. Backup & Recovery

- [ ] Set up database backups
- [ ] Configure automated backups
- [ ] Test restore procedures
- [ ] Document recovery steps
- [ ] Set up disaster recovery plan

### 7. CI/CD Pipeline

#### GitHub Actions Example

`.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test Backend
        run: cd backend && npm test
      - name: Test ML Service
        run: cd ml && pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Frontend
        run: vercel --prod
      - name: Deploy Backend
        run: # your deployment command
      - name: Deploy ML Service
        run: # your deployment command
```

### 8. Post-Deployment Verification

- [ ] Verify all services are running
- [ ] Test file upload in production
- [ ] Test ML analysis in production
- [ ] Verify export functions work
- [ ] Check error handling
- [ ] Verify fallback mechanism
- [ ] Test authentication flow
- [ ] Check analytics tracking
- [ ] Verify monitoring is working
- [ ] Test from different locations
- [ ] Test on different devices
- [ ] Check mobile responsiveness

### 9. Performance Benchmarks

Run load tests:

```bash
# Install Apache Bench
apt-get install apache2-utils

# Test backend
ab -n 1000 -c 10 https://api.yourdomain.com/api/v1/analyze/status

# Test file upload
ab -n 100 -c 5 -p test.csv -T multipart/form-data \
  https://api.yourdomain.com/api/v1/analyze/upload
```

**Target Metrics:**
- [ ] Health check: < 100ms
- [ ] File upload: < 2s
- [ ] ML analysis: < 5s
- [ ] 99th percentile: < 10s
- [ ] Error rate: < 0.1%
- [ ] Uptime: > 99.9%

### 10. Documentation Updates

- [ ] Update README with production URLs
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document monitoring dashboards
- [ ] Create incident response plan
- [ ] Document rollback procedures

## Production Checklist Summary

### Critical (Must Have)

- [x] All services deployed
- [x] HTTPS enabled
- [x] Environment variables set
- [x] CORS configured
- [x] Error handling implemented
- [x] Monitoring enabled
- [x] Backups configured
- [x] Health checks working

### Important (Should Have)

- [ ] Rate limiting enabled
- [ ] API authentication added
- [ ] Caching implemented
- [ ] CI/CD pipeline set up
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Alerts configured
- [ ] Logging centralized

### Nice to Have

- [ ] CDN configured
- [ ] Auto-scaling enabled
- [ ] A/B testing set up
- [ ] Analytics dashboard
- [ ] User feedback system
- [ ] Performance monitoring
- [ ] Security audit completed

## Rollback Plan

If deployment fails:

1. **Immediate Actions:**
   - [ ] Revert to previous version
   - [ ] Check error logs
   - [ ] Notify team
   - [ ] Update status page

2. **Investigation:**
   - [ ] Identify root cause
   - [ ] Document issue
   - [ ] Create fix
   - [ ] Test fix

3. **Re-deployment:**
   - [ ] Deploy fix
   - [ ] Verify fix works
   - [ ] Monitor for issues
   - [ ] Update documentation

## Support Contacts

- **Frontend Issues:** [frontend-team@yourdomain.com]
- **Backend Issues:** [backend-team@yourdomain.com]
- **ML Service Issues:** [ml-team@yourdomain.com]
- **Infrastructure:** [devops@yourdomain.com]
- **Emergency:** [on-call@yourdomain.com]

## Post-Launch Monitoring

### Week 1
- [ ] Monitor error rates daily
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Fix critical bugs

### Week 2-4
- [ ] Analyze usage patterns
- [ ] Optimize slow endpoints
- [ ] Implement user feedback
- [ ] Plan next features

### Ongoing
- [ ] Weekly performance reviews
- [ ] Monthly security audits
- [ ] Quarterly load testing
- [ ] Continuous improvement

---

**Deployment Status:** Ready for Production ✅

**Last Updated:** 2026-04-26

**Next Review:** [Set date for next review]
