#!/bin/bash
# Check Eternal Research Engine Status
# Fetches and displays current state

set -e

WORKER_URL="https://eternal-research-engine.heynsschoeman.workers.dev"

echo "🌊 Eternal Research Engine Status"
echo "=================================="
echo ""

# Fetch state
echo "Fetching current state..."
echo ""

STATE=$(curl -s "$WORKER_URL/api/state")

# Parse and display state
echo "$STATE" | jq '.'

# Check for data requests
echo ""
echo "Checking for data requests..."
REQUEST=$(curl -s "$WORKER_URL/api/data-request")

if echo "$REQUEST" | jq -e '.noRequest' > /dev/null 2>&1; then
  echo "✅ No active data requests"
else
  echo "⚠️  Active data request:"
  echo "$REQUEST" | jq '.'
fi

echo ""
echo "📊 Dashboard: $WORKER_URL/dashboard"
