#!/bin/bash
# Quick Start Script for Global Standardization Research System

echo "🌍 Global Standardization Research System - Quick Start"
echo "=========================================================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Check config file
if [ ! -f "research-config.json" ]; then
    echo "❌ research-config.json not found"
    exit 1
fi

echo "✅ Configuration file found"

# Check for GitHub token
if [ -z "$GITHUB_TOKEN" ] && [ -z "$GH_TOKEN" ]; then
    echo "⚠️  GitHub token not set (will use unauthenticated API - 60 requests/hour)"
    echo "   To use authenticated API (5000 requests/hour), run:"
    echo "   export GITHUB_TOKEN=your_token_here"
else
    echo "✅ GitHub token found"
fi

echo ""
echo "📊 Repository Configuration:"
python3 -c "
import json
config = json.load(open('research-config.json'))
core = len(config['repositories']['core_systems'])
sectors = len(config['repositories']['sector_hubs'])
print(f'  - Core Systems: {core}')
print(f'  - Sector Hubs: {sectors}')
print(f'  - Total: {core + sectors}')
print(f'  - Pulse Interval: {config[\"research\"][\"pulse_interval_seconds\"]}s')
"

echo ""
echo "🚀 Starting Research Engine..."
echo "   Press Ctrl+C to stop"
echo ""

# Start the research engine
python3 research_engine.py
