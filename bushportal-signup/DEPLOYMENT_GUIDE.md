# BushPortal™ Signup - Complete Deployment Guide

This guide covers deploying the BushPortal™ Signup application across the global CodeNest infrastructure.

## 📦 Overview

The BushPortal™ Signup application is a complete fullstack solution with:
- **Frontend**: React + Vite (SPA)
- **Backend**: Express.js API
- **Shared**: TypeScript types and utilities

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Global Deployment)

#### Frontend Deployment

```bash
cd apps/bushportal-signup/frontend
vercel deploy --prod
```

Environment variables on Vercel:
```
VITE_API_URL=https://bushportal-api.vercel.app
```

#### Backend Deployment

```bash
cd apps/bushportal-signup/backend
vercel deploy --prod
```

Environment variables on Vercel:
```
NODE_ENV=production
JWT_SECRET=[your-secret-key]
CLIENT_URL=https://bushportal-signup.vercel.app
```

### Option 2: Docker + Kubernetes

#### Build Image

```bash
docker build -t ghcr.io/heyns1000/bushportal-signup:latest -f apps/bushportal-signup/Dockerfile .
docker push ghcr.io/heyns1000/bushportal-signup:latest
```

#### Docker Compose (Development)

```bash
cd apps/bushportal-signup
docker-compose up
```

#### Kubernetes Deployment

```bash
kubectl apply -f k8s/deployment.yaml
kubectl expose deployment bushportal-signup --type=LoadBalancer --port=80
```

### Option 3: Self-Hosted (VPS/Dedicated Server)

```bash
# SSH into server
ssh user@your-domain.com

# Clone repo
git clone https://github.com/heyns1000/codenest.git
cd codenest

# Install pnpm
npm install -g pnpm

# Install dependencies
pnpm install

# Build application
pnpm --filter @bushportal/signup-frontend build
pnpm --filter @bushportal/signup-backend build

# Start services with PM2
pm2 start apps/bushportal-signup/backend/dist/index.js --name "bushportal-backend"
pm2 serve apps/bushportal-signup/frontend/dist 5173 --name "bushportal-frontend"

# Setup Nginx reverse proxy
# See nginx.conf section below
```

## 🔧 Environment Configuration

### Frontend (.env)

```env
# Development
VITE_API_URL=http://localhost:3000
VITE_ENABLE_DEMO_MODE=true
VITE_ENABLE_GUEST_ACCESS=true

# Production
VITE_API_URL=https://api.bushportal.global
VITE_ENABLE_DEMO_MODE=false
VITE_ENABLE_GUEST_ACCESS=false
```

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=3000

# CORS
CLIENT_URL=https://signup.bushportal.global

# JWT
JWT_SECRET=your-strong-secret-key-here-min-32-chars

# Database (optional)
DATABASE_URL=postgresql://user:password@db.bushportal.global/bushportal

# Email (optional)
SENDGRID_API_KEY=SG.your-key-here
VERIFICATION_EMAIL_FROM=noreply@bushportal.global
```

## 🌐 Domain Configuration

### DNS Records

```
signup.bushportal.global          A       your.server.ip
api.bushportal.global             A       your.api.ip (or same as frontend)
signup-*.region.bushportal.global  A       regional.ip
```

### SSL/TLS Certificates

Using Let's Encrypt:
```bash
certbot certonly --webroot -w /var/www/bushportal -d signup.bushportal.global
certbot certonly --webroot -w /var/www/bushportal -d api.bushportal.global
```

## 🔒 Security Checklist

- [ ] Environment variables are set securely
- [ ] JWT_SECRET is strong (min 32 characters)
- [ ] SSL/TLS certificates are installed
- [ ] CORS is restricted to trusted domains
- [ ] Rate limiting is configured
- [ ] Database credentials are secure
- [ ] Backup strategy is in place
- [ ] Monitoring and alerts are set up

## 📊 Monitoring & Logging

### Application Monitoring

```bash
# Using PM2 Monitoring
pm2 monitoring

# Using Datadog
# Configure datadog.yml in app root
pm2 install pm2-datadog
```

### Log Aggregation

```bash
# Using ELK Stack
# Configure logstash to collect logs from /var/log/bushportal/

# Using Papertrail
# Configure syslog forwarding to your Papertrail account
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy BushPortal Signup

on:
  push:
    branches: [main]
    paths:
      - 'apps/bushportal-signup/**'

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm --filter @bushportal/signup-frontend build
      
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm --filter @bushportal/signup-backend build
      
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_API_PROJECT_ID }}
```

## 🧪 Pre-Deployment Testing

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Unit tests
pnpm test

# Build verification
pnpm build

# Smoke tests
curl https://api.bushportal.global/health
curl https://signup.bushportal.global
```

## 🌍 Global Deployment

### Multi-Region Strategy

```
Region 1 (US): signup-us.bushportal.global
Region 2 (EU): signup-eu.bushportal.global
Region 3 (APAC): signup-apac.bushportal.global

Primary CDN: Cloudflare
Backup: AWS CloudFront
```

### Load Balancing

```bash
# Using HAProxy
# Configuration in /etc/haproxy/haproxy.cfg

frontend bushportal-web
    bind *:80
    bind *:443 ssl crt /etc/ssl/certs/bushportal.pem
    redirect scheme https code 301 if !{ ssl_fc }
    
    acl is_signup hdr(host) -i signup.bushportal.global
    acl is_api hdr(host) -i api.bushportal.global
    
    use_backend frontend if is_signup
    use_backend backend if is_api

backend frontend
    balance roundrobin
    server web1 10.0.1.10:5173
    server web2 10.0.1.11:5173
    
backend backend
    balance roundrobin
    server api1 10.0.2.10:3000
    server api2 10.0.2.11:3000
```

## 📈 Scaling Considerations

### Horizontal Scaling

```yaml
# Kubernetes horizontal pod autoscaling
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: bushportal-signup-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: bushportal-signup
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Database Scaling

- Use connection pooling (PgBouncer for PostgreSQL)
- Implement read replicas
- Consider sharding for user data

## 🔗 Integration with CodeNest Ecosystem

### Authentication Integration

The signup service integrates with the global CodeNest auth system:

```bash
# Register as a CodeNest app
curl -X POST https://auth.codenest.global/register \
  -H "Content-Type: application/json" \
  -d '{
    "app_id": "bushportal-signup",
    "name": "BushPortal Signup",
    "redirect_uri": "https://signup.bushportal.global/callback"
  }'
```

### Cross-App Communication

Users can sign up at `signup.bushportal.global` and automatically be provisioned in other BushPortal services through the unified auth system.

## 📝 Rollback Procedure

```bash
# View deployment history
vercel deployments list

# Rollback to previous version
vercel rollback [deployment-id]

# Or using git
git revert [commit-hash]
git push origin main
```

## 🆘 Troubleshooting

### Frontend not loading

```bash
# Check VITE_API_URL
echo $VITE_API_URL

# Check CORS configuration on backend
curl -H "Origin: https://signup.bushportal.global" \
  -H "Access-Control-Request-Method: POST" \
  https://api.bushportal.global/api/auth/login -v
```

### Backend not responding

```bash
# Check service status
pm2 status

# Check logs
pm2 logs bushportal-backend

# Check port
netstat -tlnp | grep 3000
```

### Database connection issues

```bash
# Test database connection
psql "postgresql://user:password@host:5432/bushportal" -c "SELECT 1"
```

## 📞 Support

For deployment issues or questions:
- Email: deploy@bushportal.global
- Slack: #bushportal-deployments
- GitHub Issues: https://github.com/heyns1000/codenest/issues

---

**Last Updated**: 2024-12-28
**Version**: 1.0.0
