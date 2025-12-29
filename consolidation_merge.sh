#!/bin/bash

###############################################################################
# HotStack Ecosystem Consolidation Merge Script
###############################################################################
#
# One-command merge of all ecosystem work into a consolidated branch
#
# Author: Fruitful Holdings (Pty) Ltd
# Date: December 29, 2025
#
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║    HotStack Ecosystem Consolidation Merge                  ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Configuration
CONSOLIDATION_BRANCH="hotstack/ecosystem-consolidation-master"
BACKUP_TAG="pre-consolidation-$(date +%Y%m%d-%H%M%S)"

# Function to log
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"
}

# Create backup tag
log "Creating backup tag: $BACKUP_TAG"
git tag "$BACKUP_TAG"

# Ensure we're on the consolidation branch
log "Checking out consolidation branch: $CONSOLIDATION_BRANCH"
if git rev-parse --verify "$CONSOLIDATION_BRANCH" >/dev/null 2>&1; then
    git checkout "$CONSOLIDATION_BRANCH"
else
    log "Creating new consolidation branch"
    git checkout -b "$CONSOLIDATION_BRANCH"
fi

# Get list of all branches
log "Scanning for branches to merge..."
BRANCHES=$(git branch -a | grep -E "(claude|copilot|staging)" | sed 's/remotes\/origin\///' | sort -u)

log "Found branches:"
echo "$BRANCHES"

# Merge each branch
for branch in $BRANCHES; do
    # Skip if it's the current branch
    if [ "$branch" = "$CONSOLIDATION_BRANCH" ]; then
        continue
    fi

    # Skip if already merged
    if git branch --merged | grep -q "$branch"; then
        log "✓ Branch already merged: $branch"
        continue
    fi

    log "Merging: $branch"

    if git merge --no-ff "$branch" -m "Consolidate: Merge $branch into ecosystem master"; then
        log "✓ Successfully merged $branch"
    else
        log "⚠️  Conflicts in $branch - manual resolution needed"
        exit 1
    fi
done

log ""
log "═════════════════════════════════════════════"
log "Consolidation merge complete!"
log "═════════════════════════════════════════════"
log ""
log "Backup tag: $BACKUP_TAG"
log "Current branch: $CONSOLIDATION_BRANCH"
log ""
log "To push to remote:"
log "  git push -u origin $CONSOLIDATION_BRANCH"
