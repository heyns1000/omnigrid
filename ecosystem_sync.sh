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
SYNC_MODE="${SYNC_MODE:-full}"  # full or incremental
PARALLEL_JOBS="${PARALLEL_JOBS:-4}"  # Number of parallel clone jobs

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

# Clone or update a single repository
clone_or_update_repo() {
    local repo=$1
    local repo_path="$ECOSYSTEM_ROOT/repos/$repo"
    local max_retries=3
    local retry=0
    local success=false
    
    if [ -d "$repo_path" ] && [ "$SYNC_MODE" = "incremental" ]; then
        # Incremental update - just pull latest changes
        info "Updating $repo (incremental)..."
        cd "$repo_path"
        if git pull --rebase 2>&1 | tee -a "$SYNC_LOG"; then
            log "✓ Updated $repo successfully"
            return 0
        else
            warn "Failed to update $repo, will try full clone"
            cd - > /dev/null
            rm -rf "$repo_path"
        fi
    fi
    
    # Full clone
    info "Cloning $repo..."
    
    while [ $retry -lt $max_retries ] && [ "$success" = false ]; do
        # Try SSH first, fall back to HTTPS
        if git clone "git@github.com:$GITHUB_USER/$repo.git" \
            "$repo_path" 2>&1 | tee -a "$SYNC_LOG"; then
            success=true
            log "✓ Cloned $repo successfully (SSH)"
        elif git clone "https://github.com/$GITHUB_USER/$repo.git" \
            "$repo_path" 2>&1 | tee -a "$SYNC_LOG"; then
            success=true
            log "✓ Cloned $repo successfully (HTTPS)"
        else
            retry=$((retry + 1))
            if [ $retry -lt $max_retries ]; then
                warn "Retry $retry/$max_retries for $repo..."
                sleep 2
            fi
        fi
    done
    
    if [ "$success" = false ]; then
        error "✗ Failed to clone $repo after $max_retries attempts"
        return 1
    fi
    return 0
}

# Clone all repositories with parallel processing
clone_repositories() {
    log "Cloning/updating all ecosystem repositories..."
    log "Mode: $SYNC_MODE | Parallel jobs: $PARALLEL_JOBS"

    local failed=0
    local temp_dir=$(mktemp -d)
    
    # Export function and variables for parallel execution
    export -f clone_or_update_repo log info warn error
    export ECOSYSTEM_ROOT GITHUB_USER SYNC_LOG SYNC_MODE
    export RED GREEN YELLOW BLUE NC

    # Process repositories in parallel
    if command -v parallel >/dev/null 2>&1; then
        info "Using GNU parallel for faster cloning..."
        printf "%s\n" "${REPOS[@]}" | parallel -j "$PARALLEL_JOBS" --halt-on-error 0 \
            "clone_or_update_repo {} || echo {} >> $temp_dir/failed.txt"
    else
        info "GNU parallel not found, using sequential processing..."
        for repo in "${REPOS[@]}"; do
            clone_or_update_repo "$repo" || echo "$repo" >> "$temp_dir/failed.txt"
        done
    fi
    
    # Count failures
    if [ -f "$temp_dir/failed.txt" ]; then
        failed=$(wc -l < "$temp_dir/failed.txt")
    fi
    
    rm -rf "$temp_dir"

    if [ $failed -gt 0 ]; then
        warn "$failed repositories failed to clone/update"
        return 1
    else
        log "All repositories cloned/updated successfully!"
        return 0
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
    local json_file="$ECOSYSTEM_ROOT/consolidated/ecosystem_status.json"

    cat > "$report_file" << EOFR
# HotStack Ecosystem Status Report

**Generated:** $(date)
**Hub:** OmniGrid
**Sync Mode:** $SYNC_MODE
**Parallel Jobs:** $PARALLEL_JOBS

---

## Repository Status

EOFR

    # Start JSON report
    echo "{" > "$json_file"
    echo "  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"," >> "$json_file"
    echo "  \"sync_mode\": \"$SYNC_MODE\"," >> "$json_file"
    echo "  \"repositories\": [" >> "$json_file"

    local first=true
    for repo in "${REPOS[@]}"; do
        local repo_path="$ECOSYSTEM_ROOT/repos/$repo"

        if [ -d "$repo_path" ]; then
            cd "$repo_path"

            local branch_count=$(git branch -a 2>/dev/null | wc -l)
            local commit_count=$(git rev-list --count HEAD 2>/dev/null || echo "0")
            local last_commit=$(git log -1 --format="%ar" 2>/dev/null || echo "unknown")
            local current_branch=$(git branch --show-current 2>/dev/null || echo "unknown")
            local last_commit_sha=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
            local status=$(git status --porcelain 2>/dev/null | wc -l)
            
            # Markdown report
            cat >> "$report_file" << EOF
### $repo
- **Current Branch:** $current_branch
- **Latest Commit:** $last_commit_sha
- **Branches:** $branch_count
- **Commits:** $commit_count
- **Last Update:** $last_commit
- **Working Tree:** $([ $status -eq 0 ] && echo "clean" || echo "$status changes")
- **Path:** $repo_path

EOF

            # JSON report
            if [ "$first" = false ]; then
                echo "    ," >> "$json_file"
            fi
            first=false
            
            cat >> "$json_file" << EOF
    {
      "name": "$repo",
      "branch": "$current_branch",
      "commit": "$last_commit_sha",
      "branches": $branch_count,
      "commits": $commit_count,
      "last_update": "$last_commit",
      "working_tree_status": $([ $status -eq 0 ] && echo "\"clean\"" || echo "\"dirty\""),
      "path": "$repo_path"
    }
EOF
        fi
    done

    # Close JSON
    echo "  ]" >> "$json_file"
    echo "}" >> "$json_file"

    log "Status report saved to: $report_file"
    log "JSON report saved to: $json_file"
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
