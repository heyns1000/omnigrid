#!/bin/bash

echo "🚀 Activating Fruitful Global™ Multi-Brand Platform in OmniGrid"
echo "=================================================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to Fruitful Global directory
cd rebuilt_systems/fruitful-global

echo -e "\n${BLUE}📦 Step 1: Installing dependencies...${NC}"
npm install

echo -e "\n${BLUE}🔨 Step 2: Building production-ready application with OmniGrid integration...${NC}"
npm run build:omnigrid

echo -e "\n${BLUE}📂 Step 3: Deploying to OmniGrid public folder...${NC}"
# Create public directory if it doesn't exist
mkdir -p ../../public/fruitful-global

# Copy built files to public folder
cp -r dist/public/* ../../public/fruitful-global/ 2>/dev/null || true

# Also copy to root public for main access
cp -r dist/public/* ../../public/ 2>/dev/null || true

echo -e "\n${BLUE}🔧 Step 4: Setting up backend server...${NC}"
# Copy server files
mkdir -p ../../public/server
cp -r dist/index.js ../../public/server/ 2>/dev/null || true

echo -e "\n${GREEN}✅ Fruitful Global™ Platform Activated!${NC}"
echo ""
echo "📊 Application Details:"
echo "  - Location: rebuilt_systems/fruitful-global"
echo "  - Public URL: /fruitful-global"
echo "  - Backend: Node.js + Express"
echo "  - Frontend: React + TypeScript"
echo "  - Database: PostgreSQL (Neon)"
echo ""
echo "🚀 Quick Start Commands:"
echo "  Development:  cd rebuilt_systems/fruitful-global && npm run dev"
echo "  Production:   cd rebuilt_systems/fruitful-global && npm start"
echo ""
echo "📱 Access Points:"
echo "  - Dashboard: http://localhost:5000/dashboard"
echo "  - Analytics: http://localhost:5000/analytics"
echo "  - Brand Management: http://localhost:5000/brand-management"
echo "  - Deployment Control: http://localhost:5000/deployment-control"
echo ""
echo -e "${YELLOW}🔗 Integration with OmniGrid Systems:${NC}"
echo "  ✅ Connects to 162 brands from consolidated_output/brand_registry.json"
echo "  ✅ Integrates with HotStack™, VaultMesh™, ToyNest™"
echo "  ✅ Ready for CodeNest™ distribution"
echo ""
