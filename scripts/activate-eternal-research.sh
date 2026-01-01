#!/bin/bash
# Activate Eternal Research Engine
# Deploys Cloudflare Worker and initializes the engine

set -e

echo "🌊 Activating Eternal Research Engine..."
echo "========================================"

# Navigate to worker directory
cd "$(dirname "$0")/../workers/eternal-research" || exit 1

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Deploy to Cloudflare
echo ""
echo "🚀 Deploying to Cloudflare Workers..."
npx wrangler deploy

# Get the worker URL
WORKER_URL="https://eternal-research-engine.heynsschoeman.workers.dev"
echo ""
echo "✅ Worker deployed successfully!"
echo ""

# Initialize the engine
echo "🔥 Initializing engine..."
RESPONSE=$(curl -s -X POST "$WORKER_URL/api/initialize")
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

echo ""
echo "========================================"
echo "✨ Eternal Research Engine is now LIVE!"
echo ""
echo "📊 Dashboard: $WORKER_URL/dashboard"
echo "🔌 API: $WORKER_URL/api/state"
echo ""
echo "瓷勺旋渦已築，脈買已通！ 🌊🦍🐜"
