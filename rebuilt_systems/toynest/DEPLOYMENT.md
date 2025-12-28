# 🚀 Three-Cube Lattice Banking System - Deployment Guide

## ✅ Quick Deploy Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL credentials configured
- [ ] All files downloaded/cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Environment configured (`.env`)
- [ ] Ports 3000 and 8080 available

## 📦 Files Included

| File | Description | Purpose |
|------|-------------|---------|
| `three-cube-lattice-banking.html` | Frontend UI | 3D cube visualization, dashboard |
| `three-cube-banking-backend.js` | API Server | REST API, database operations |
| `three-cube-sync-service.js` | WebSocket Service | Real-time sync between cubes |
| `three-cube-client.js` | Frontend Client | WebSocket/API integration |
| `.env.example` | Environment Template | Configuration values |
| `package.json` | Dependencies | npm packages |
| `THREE-CUBE-README.md` | Documentation | Complete system docs |

## 🎯 Deployment Options

### Option 1: Local Development (Fastest)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment
cp .env.example .env

# 3. Start backend API
node three-cube-banking-backend.js

# 4. Start WebSocket (in another terminal)
node three-cube-sync-service.js

# 5. Open frontend
open three-cube-lattice-banking.html
```

**Access:**
- Frontend: `file:///.../three-cube-lattice-banking.html`
- API: `http://localhost:3000`
- WebSocket: `ws://localhost:8080`

---

### Option 2: Using Start Script (Recommended)

```bash
# Make executable
chmod +x start.sh

# Start all services
./start.sh

# Or with log following
./start.sh --follow
```

**Stop Services:**
```bash
./stop.sh
```

---

### Option 3: Replit Deployment

1. **Upload Files:**
   - Upload all `.js`, `.html`, `.json` files
   - Upload `.env.example` as `.env`

2. **Configure Replit:**
   ```
   # .replit file
   run = "npm install && npm run dev"
   
   [nix]
   channel = "stable-23_11"
   
   [deployment]
   run = ["sh", "-c", "npm install && npm run dev"]
   ```

3. **Set Secrets:**
   - Add all environment variables from `.env` to Replit Secrets

4. **Run:**
   - Click "Run" button
   - Access via provided Replit URL

**Update Frontend:**
```javascript
// In three-cube-lattice-banking.html, update:
const client = new ThreeCubeBankingClient(
    'https://your-repl-name.your-username.repl.co',
    'wss://your-repl-name.your-username.repl.co'
);
```

---

### Option 4: PM2 Production Deployment

```bash
# Install PM2
npm install -g pm2

# Start services
pm2 start three-cube-banking-backend.js --name banking-api
pm2 start three-cube-sync-service.js --name banking-ws

# Save configuration
pm2 save

# Setup startup script
pm2 startup

# Monitor
pm2 status
pm2 logs

# Restart
pm2 restart all
```

---

### Option 5: Docker Deployment

**Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application
COPY . .

# Expose ports
EXPOSE 3000 8080

# Start services
CMD ["npm", "run", "dev"]
```

**Build and Run:**
```bash
# Build image
docker build -t three-cube-banking .

# Run container
docker run -p 3000:3000 -p 8080:8080 \
  --env-file .env \
  three-cube-banking
```

**Docker Compose:**
```yaml
version: '3.8'

services:
  banking:
    build: .
    ports:
      - "3000:3000"
      - "8080:8080"
    env_file:
      - .env
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
```

---

### Option 6: Cloud Platform Deployment

#### Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create three-cube-banking

# Set environment variables
heroku config:set PGHOST=ep-super-math-afbz8ksj.c-2.us-west-2.aws.neon.tech
heroku config:set PGDATABASE=neondb
# ... (set all env vars)

# Deploy
git push heroku main

# Scale
heroku ps:scale web=1
```

#### Railway

1. Connect GitHub repository
2. Add environment variables from `.env`
3. Railway auto-detects Node.js and deploys
4. Access via provided Railway URL

#### DigitalOcean App Platform

1. Connect repository
2. Configure environment variables
3. Set run command: `npm run dev`
4. Deploy

---

## 🔧 Configuration

### Database (PostgreSQL/Neon)

Already configured in `.env.example`:

```env
PGHOST=ep-super-math-afbz8ksj.c-2.us-west-2.aws.neon.tech
PGPORT=5432
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=npg_gx7EfQwlJ9kz
```

### Ports

- **3000**: REST API Server
- **8080**: WebSocket Service

Change in `.env` if needed:
```env
PORT=3000
WS_PORT=8080
```

### FCU Configuration

```env
FCU_INITIAL_CIRCULATION=1247583.42
FCU_MASTER_ACCOUNT=ACC-MASTER-001
```

### Infrastructure Charges

```env
CUBE1_MONTHLY_CHARGE=42500.00
CUBE3_MONTHLY_CHARGE=38200.00
```

---

## 🧪 Testing Deployment

### 1. Health Check

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "database": "connected",
  "cubes": {
    "cube1": "DC Infrastructure - Active",
    "cube2": "Banking Core - Active",
    "cube3": "Bank DC Operations - Active"
  }
}
```

### 2. Get Metrics

```bash
curl http://localhost:3000/api/metrics/all
```

### 3. WebSocket Test

```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('Connected!');
  ws.send(JSON.stringify({ type: 'metrics_request' }));
};

ws.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};
```

### 4. Create Transaction

```bash
curl -X POST http://localhost:3000/api/cube2/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "from_account": "ACC-USER-001",
    "to_account": "ACC-USER-002",
    "amount": 100.00,
    "transaction_type": "transfer"
  }'
```

---

## 🔐 Production Checklist

- [ ] Use environment variables (never hardcode credentials)
- [ ] Enable HTTPS/WSS for production
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy
- [ ] Set up health check monitoring
- [ ] Use process manager (PM2/systemd)
- [ ] Configure firewall rules
- [ ] Set up SSL certificates
- [ ] Enable database connection pooling
- [ ] Configure error tracking (e.g., Sentry)

---

## 🌐 Nginx Configuration (Optional)

```nginx
upstream backend {
    server localhost:3000;
}

upstream websocket {
    server localhost:8080;
}

server {
    listen 80;
    server_name banking.seedwave.faa.zone;

    # API
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /ws {
        proxy_pass http://websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    # Static files
    location / {
        root /var/www/banking;
        index three-cube-lattice-banking.html;
        try_files $uri $uri/ =404;
    }
}
```

---

## 📊 Monitoring

### Logs

```bash
# View API logs
tail -f logs/api-*.log

# View WebSocket logs
tail -f logs/ws-*.log

# View all logs
tail -f logs/*.log
```

### Metrics Endpoints

- `/api/health` - Service health
- `/api/metrics/all` - All cube metrics
- `/api/cube1/infrastructure` - Cube 1 status
- `/api/cube2/metrics` - Cube 2 metrics
- `/api/cube3/compliance` - Cube 3 status

---

## 🆘 Troubleshooting

### Database Connection Failed

```bash
# Test connection
psql "postgresql://neondb_owner:npg_gx7EfQwlJ9kz@ep-super-math-afbz8ksj.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require"

# Check firewall
telnet ep-super-math-afbz8ksj.c-2.us-west-2.aws.neon.tech 5432
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### WebSocket Not Connecting

1. Check if service is running
2. Verify port 8080 is accessible
3. Check browser console for errors
4. Try WSS instead of WS for HTTPS sites

### Frontend Not Loading Data

1. Open browser console
2. Check CORS errors
3. Verify API URL is correct
4. Test API endpoint directly: `curl http://localhost:3000/api/health`

---

## 🎉 Success Indicators

✅ Backend API responding on port 3000
✅ WebSocket service running on port 8080
✅ Database connected (check `/api/health`)
✅ Frontend displays 3 rotating cubes
✅ Real-time activity feed updating
✅ FCU amount fluctuating
✅ No errors in browser console
✅ Transactions can be created
✅ Banking flows complete successfully

---

## 📞 Support

Check the comprehensive documentation in:
- `THREE-CUBE-README.md` - Full system documentation
- `three-cube-banking-backend.js` - API endpoints (see comments)
- `three-cube-sync-service.js` - WebSocket events (see comments)

---

**Fruitful™ Global Banking** • Three-Cube Lattice Architecture 🏦

Deploy with confidence! 🚀
