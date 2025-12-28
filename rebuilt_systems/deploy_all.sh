#!/bin/bash
# Master Deployment Script
# Deploys entire Fruitful ecosystem

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     FRUITFUL ECOSYSTEM MASTER DEPLOYMENT                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"

# Deploy HotStack
echo "🚀 Deploying HotStack..."
cd rebuilt_systems/hotstack
python3 deployment_engine.py
cd ../..

# Deploy VaultMesh
echo "🚀 Deploying VaultMesh..."
cd rebuilt_systems/vaultmesh
python3 payment_gateway.py
cd ../..

# Deploy OmniGrid
echo "🚀 Deploying OmniGrid..."
cd rebuilt_systems/omnigrid
python3 orchestrator.py
cd ../..

# Deploy ToyNest
echo "🚀 Deploying ToyNest..."
cd rebuilt_systems/toynest
npm install
npm run dev &
cd ../..

echo ""
echo "✨ All systems deployed!"
echo ""
echo "Access points:"
echo "  - HotStack:   https://hotstack.faa.zone"
echo "  - VaultMesh:  https://vaultmesh.faa.zone"
echo "  - OmniGrid:   https://omnigrid.faa.zone"
echo "  - ToyNest:    https://toynest.seedwave.faa.zone"
echo ""
