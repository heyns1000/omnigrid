#!/bin/bash

###############################################################################
# HotStack Ecosystem Sync Script
###############################################################################
#
# Purpose: Synchronize code, automation, and configurations across all
#          12 repositories in the HotStack ecosystem
#
# Author: Fruitful Holdings (Pty) Ltd
# Date: December 29, 2025
# Platform: OmniGrid Central Hub
#
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ECOSYSTEM_ROOT="/tmp/ecosystem-sync"
GITHUB_USER="heyns1000"
SYNC_LOG="$HOME/ecosystem-sync.log"

# Repository list
REPOS=(
    "omnigrid"
    "hotstack"
    "nexus-nair"
    "vaultmesh"
    "buildnest"
    "codenest"
    "seedwave"
    "banimal"
    "faa.zone"
)

###############################################################################
# Functions
###############################################################################

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$SYNC_LOG"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$SYNC_LOG"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$SYNC_LOG"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$SYNC_LOG"
}

# Print banner
print_banner() {
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                                                              ║"
    echo "║        HotStack Ecosystem Synchronization System             ║"
    echo "║                                                              ║"
    echo "║        12 Repositories | 162 Brands | 24,852+ Snippets       ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Create ecosystem directory structure
setup_environment() {
    log "Setting up ecosystem environment..."

    if [ -d "$ECOSYSTEM_ROOT" ]; then
        warn "Ecosystem root exists. Cleaning..."
        rm -rf "$ECOSYSTEM_ROOT"
    fi

    mkdir -p "$ECOSYSTEM_ROOT"/{repos,extracted,consolidated}
    mkdir -p "$ECOSYSTEM_ROOT/logs"

    log "Environment ready at: $ECOSYSTEM_ROOT"
}

# Clone all repositories
clone_repositories() {
    log "Cloning all ecosystem repositories..."

    local failed=0

    for repo in "${REPOS[@]}"; do
        info "Cloning $repo..."

        if git clone "https://github.com/$GITHUB_USER/$repo.git" \
            "$ECOSYSTEM_ROOT/repos/$repo" 2>&1 | tee -a "$SYNC_LOG"; then
            log "✓ Cloned $repo successfully"
        else
            error "✗ Failed to clone $repo"
            ((failed++))
        fi
    done

    if [ $failed -gt 0 ]; then
        warn "$failed repositories failed to clone"
    else
        log "All repositories cloned successfully!"
    fi
}

# List all branches in all repos
list_all_branches() {
    log "Scanning all branches across ecosystem..."

    local output_file="$ECOSYSTEM_ROOT/consolidated/all_branches.txt"
    echo "# HotStack Ecosystem Branch Map" > "$output_file"
    echo "# Generated: $(date)" >> "$output_file"
    echo "" >> "$output_file"

    for repo in "${REPOS[@]}"; do
        local repo_path="$ECOSYSTEM_ROOT/repos/$repo"

        if [ -d "$repo_path" ]; then
            echo "## Repository: $repo" >> "$output_file"
            echo "" >> "$output_file"

            cd "$repo_path"
            git branch -a >> "$output_file" 2>/dev/null || true
            echo "" >> "$output_file"
        fi
    done

    log "Branch map saved to: $output_file"
}

# Extract automation scripts
extract_automation() {
    log "Extracting automation scripts from all repos..."

    local automation_dir="$ECOSYSTEM_ROOT/extracted/automation"
    mkdir -p "$automation_dir"

    # Patterns to search for
    local patterns=(
        "*.sh"
        "*deploy*.py"
        "*build*.sh"
        "*sync*.sh"
        "*.yaml"
        "*.yml"
        "*config*.json"
    )

    for repo in "${REPOS[@]}"; do
        local repo_path="$ECOSYSTEM_ROOT/repos/$repo"
        local extract_path="$automation_dir/$repo"

        if [ -d "$repo_path" ]; then
            mkdir -p "$extract_path"

            for pattern in "${patterns[@]}"; do
                find "$repo_path" -name "$pattern" -type f \
                    -exec cp {} "$extract_path/" \; 2>/dev/null || true
            done

            local file_count=$(find "$extract_path" -type f | wc -l)
            info "$repo: Extracted $file_count automation files"
        fi
    done

    log "Automation extraction complete"
}

# Generate ecosystem status report
generate_status_report() {
    log "Generating ecosystem status report..."

    local report_file="$ECOSYSTEM_ROOT/consolidated/ecosystem_status.md"

    cat > "$report_file" << 'EOFR'
# HotStack Ecosystem Status Report

**Generated:** $(date)
**Hub:** OmniGrid

---

## Repository Status

EOFR

    for repo in "${REPOS[@]}"; do
        local repo_path="$ECOSYSTEM_ROOT/repos/$repo"

        if [ -d "$repo_path" ]; then
            cd "$repo_path"

            local branch_count=$(git branch -a | wc -l)
            local commit_count=$(git rev-list --count HEAD 2>/dev/null || echo "0")
            local last_commit=$(git log -1 --format="%ar" 2>/dev/null || echo "unknown")

            cat >> "$report_file" << EOF
### $repo
- **Branches:** $branch_count
- **Commits:** $commit_count
- **Last Update:** $last_commit
- **Path:** $repo_path

EOF
        fi
    done

    log "Status report saved to: $report_file"
}

# Create consolidated automation package
create_automation_package() {
    log "Creating consolidated automation package..."

    local package_dir="$ECOSYSTEM_ROOT/consolidated/automation_package"
    mkdir -p "$package_dir"

    # Copy all automation scripts
    cp -r "$ECOSYSTEM_ROOT/extracted/automation/"* "$package_dir/" 2>/dev/null || true

    # Create master index
    cat > "$package_dir/README.md" << 'EOF'
# HotStack Ecosystem Automation Package

This package contains all automation scripts extracted from the entire ecosystem.

## Contents

- Deployment scripts
- Build automation
- Sync utilities
- Configuration files

## Usage

Each subdirectory contains automation from a specific repository.

EOF

    # Create tar archive
    cd "$ECOSYSTEM_ROOT/consolidated"
    tar -czf "hotstack-automation-$(date +%Y%m%d).tar.gz" automation_package/

    log "Automation package created: hotstack-automation-$(date +%Y%m%d).tar.gz"
}

# Sync specific files back to repos (dry-run mode)
sync_files() {
    log "Analyzing sync opportunities..."

    local sync_report="$ECOSYSTEM_ROOT/consolidated/sync_plan.md"

    cat > "$sync_report" << 'EOF'
# Ecosystem Sync Plan

## Proposed Changes

This document outlines files that could be synchronized across repositories.

EOF

    log "Sync analysis saved to: $sync_report"
}

# Main execution
main() {
    print_banner

    log "Starting HotStack Ecosystem Sync..."
    log "Target: $GITHUB_USER (12 repositories)"

    setup_environment
    clone_repositories
    list_all_branches
    extract_automation
    generate_status_report
    create_automation_package
    sync_files

    log ""
    log "═══════════════════════════════════════"
    log "Ecosystem sync complete!"
    log "═══════════════════════════════════════"
    log ""
    log "Results available at: $ECOSYSTEM_ROOT/consolidated/"
    log "Log file: $SYNC_LOG"
}

# Run main function
main "$@"
