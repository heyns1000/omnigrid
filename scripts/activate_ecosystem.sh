#!/bin/bash
# Activate Ecosystem Automation Framework

set -e

echo "🌐 OmniGrid Ecosystem Activation"
echo "================================"

# Check for GitHub token
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: GITHUB_TOKEN environment variable not set"
    echo "   export GITHUB_TOKEN=your_github_token"
    exit 1
fi

echo "✅ GitHub token configured"

# Check Python dependencies
echo "📦 Checking dependencies..."
python3 -c "import github" 2>/dev/null || {
    echo "⚠️  Installing PyGithub..."
    pip install PyGithub requests
}

echo "✅ Dependencies installed"

# Validate configuration
if [ ! -f "config/ecosystem-repos.json" ]; then
    echo "❌ Error: config/ecosystem-repos.json not found"
    exit 1
fi

echo "✅ Configuration validated"

# Display summary
REPO_COUNT=$(jq '.repositories | length' config/ecosystem-repos.json)
echo ""
echo "📊 Ecosystem Summary:"
echo "   Repositories: $REPO_COUNT"
echo "   Sync Interval: 15 minutes"
echo "   Pulse Interval: 9 seconds"
echo "   Auto-merge Threshold: 10 commits"
echo ""

echo "🚀 Ecosystem is ready for automation!"
echo ""
echo "Next steps:"
echo "  1. Trigger manual propagation:"
echo "     python scripts/ecosystem_propagator.py --dry-run"
echo ""
echo "  2. Scan for divergent branches:"
echo "     python scripts/pulse-trade-metrics.py --config config/ecosystem-repos.json"
echo ""
echo "  3. GitHub Actions will handle automated sync"
echo ""
