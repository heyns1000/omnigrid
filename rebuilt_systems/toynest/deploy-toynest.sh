#!/bin/bash
# ToyNest Three-Cube Banking System - Deployment Script
# Deploy to toynest.seedwave.faa.zone

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     TOYNEST THREE-CUBE BANKING SYSTEM DEPLOYMENT              ║"
echo "║     toynest.seedwave.faa.zone                                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check if ports are available
echo "🔍 Checking ports..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 3000 is in use. Stop the service or choose different port."
    echo "   You can change PORT in .env file"
fi

if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 8080 is in use. Stop the service or choose different port."
    echo "   You can change WS_PORT in .env file"
fi
echo ""

# Option to choose deployment method
echo "Select deployment method:"
echo "  1) Local development (npm run dev)"
echo "  2) PM2 production"
echo "  3) Docker"
echo "  4) Cloudflare Workers"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    echo ""
    echo "🚀 Starting local development..."
    echo ""
    echo "Services will start:"
    echo "  • API Server: http://localhost:3000"
    echo "  • WebSocket: ws://localhost:8080"
    echo "  • Frontend: three-cube-lattice-banking.html"
    echo ""
    echo "Press Ctrl+C to stop"
    echo ""
    npm run dev
    ;;

  2)
    echo ""
    echo "🚀 Deploying with PM2..."

    # Install PM2 if needed
    if ! command -v pm2 &> /dev/null; then
        echo "Installing PM2..."
        npm install -g pm2
    fi

    # Start services
    pm2 start three-cube-banking-backend.js --name toynest-api
    pm2 start three-cube-sync-service.js --name toynest-ws

    # Save configuration
    pm2 save

    # Show status
    pm2 status

    echo ""
    echo "✅ ToyNest deployed with PM2"
    echo ""
    echo "Manage services:"
    echo "  pm2 status          - View status"
    echo "  pm2 logs            - View logs"
    echo "  pm2 restart all     - Restart services"
    echo "  pm2 stop all        - Stop services"
    echo ""
    ;;

  3)
    echo ""
    echo "🚀 Building Docker image..."

    # Create Dockerfile if doesn't exist
    if [ ! -f "Dockerfile" ]; then
        cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000 8080

CMD ["npm", "run", "dev"]
EOF
        echo "✅ Created Dockerfile"
    fi

    # Build and run
    docker build -t toynest-banking .
    docker run -d -p 3000:3000 -p 8080:8080 --name toynest toynest-banking

    echo ""
    echo "✅ ToyNest deployed in Docker"
    echo ""
    echo "Manage container:"
    echo "  docker ps                    - View running containers"
    echo "  docker logs toynest          - View logs"
    echo "  docker stop toynest          - Stop container"
    echo "  docker start toynest         - Start container"
    echo ""
    ;;

  4)
    echo ""
    echo "🚀 Deploying to Cloudflare..."
    echo ""
    echo "⚠️  Cloudflare Workers deployment requires:"
    echo "  1. Wrangler CLI installed"
    echo "  2. Cloudflare account configured"
    echo "  3. Database connection updated"
    echo ""
    echo "Manual steps:"
    echo "  1. npm install -g wrangler"
    echo "  2. wrangler login"
    echo "  3. Deploy backend to Workers"
    echo "  4. Deploy frontend to Pages"
    echo ""
    ;;

  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   DEPLOYMENT COMPLETE                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Access ToyNest:"
echo "  • API: http://localhost:3000"
echo "  • WebSocket: ws://localhost:8080"
echo "  • Frontend: open three-cube-lattice-banking.html"
echo ""
echo "Test the system:"
echo "  curl http://localhost:3000/api/health"
echo "  curl http://localhost:3000/api/metrics/all"
echo ""
echo "🎉 ToyNest Three-Cube Banking System is live!"
echo ""
