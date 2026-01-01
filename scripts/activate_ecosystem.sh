#!/bin/bash
set -e

echo "🚀 Activating 94-Repository Ecosystem Automation"
echo "=================================================="
echo ""

# Check for GitHub token
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN environment variable not set"
    echo "Please set it with: export GITHUB_TOKEN=your_token"
    exit 1
fi

echo "✅ GitHub token found"
echo ""

# Step 1: Validate config
echo "📋 Step 1: Validating ecosystem configuration..."
python3 -c "import json; json.load(open('config/ecosystem-repos.json'))" && echo "✅ Config valid" || exit 1
echo ""

# Step 2: Scan for divergent branches
echo "🔍 Step 2: Scanning for divergent branches..."
python3 scripts/pulse-trade-metrics.py \
    --config config/ecosystem-repos.json \
    --create-prs
echo ""

# Step 3: Propagate workflows (dry run first)
echo "🌐 Step 3: Propagating workflows (dry run)..."
python3 scripts/ecosystem_propagator.py --dry-run
echo ""

read -p "Proceed with actual propagation? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Propagating workflows to all repositories..."
    python3 scripts/ecosystem_propagator.py
    echo ""
    echo "✅ Propagation complete!"
else
    echo "⚠️  Propagation cancelled"
fi

echo ""
echo "=================================================="
echo "✅ Ecosystem activation complete!"
echo "📊 Check ecosystem_propagation_report.json for details"
