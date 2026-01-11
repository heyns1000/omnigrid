#!/usr/bin/env python3
"""
PulseTrade Metrics - Ecosystem Repository Sync Monitor

Scans repositories for branches behind main/master that need syncing.
Automatically skips bot branches (Dependabot, Copilot, etc.) which are ahead of main.
Enhanced with repository existence checks and connection status tracking.
Enhanced with retry logic and comprehensive error handling per PR #35 recommendations.
"""

import json
import os
import time
import sys
from pathlib import Path
from typing import Optional, Tuple, Dict, Any
from datetime import datetime

from github import Github, GithubException

# Configuration constants
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds
RATE_LIMIT_BUFFER = 100  # Keep buffer of API calls

class MetricsCollector:
    """Collects and reports automation metrics per PR #35 recommendations"""
    
    def __init__(self):
        self.start_time = datetime.now()
        self.repos_scanned = 0
        self.branches_analyzed = 0
        self.prs_created = 0
        self.errors_encountered = 0
        self.repos_skipped = 0
        self.api_calls_made = 0
        
    def to_dict(self) -> Dict[str, Any]:
        """Export metrics as dictionary"""
        duration = (datetime.now() - self.start_time).total_seconds()
        success_rate = 0
        if (self.repos_scanned + self.errors_encountered) > 0:
            success_rate = (self.repos_scanned / (self.repos_scanned + self.errors_encountered)) * 100
        
        return {
            "start_time": self.start_time.isoformat(),
            "duration_seconds": duration,
            "repos_scanned": self.repos_scanned,
            "branches_analyzed": self.branches_analyzed,
            "prs_created": self.prs_created,
            "errors_encountered": self.errors_encountered,
            "repos_skipped": self.repos_skipped,
            "api_calls_made": self.api_calls_made,
            "success_rate": success_rate
        }
    
    def save(self, output_file: str = "automation_metrics.json"):
        """Save metrics to file"""
        try:
            with open(output_file, 'w') as f:
                json.dump(self.to_dict(), f, indent=2)
            print(f"📊 Metrics saved to {output_file}")
        except Exception as e:
            print(f"⚠️  Could not save metrics: {e}")

def retry_on_rate_limit(func, *args, **kwargs):
    """Retry function on rate limit with exponential backoff per PR #35 recommendations"""
    for attempt in range(MAX_RETRIES):
        try:
            return func(*args, **kwargs)
        except GithubException as e:
            if e.status == 403 and 'rate limit' in str(e).lower():
                if attempt < MAX_RETRIES - 1:
                    wait_time = RETRY_DELAY * (2 ** attempt)
                    print(f"  ⏳ Rate limit hit, waiting {wait_time}s (attempt {attempt + 1}/{MAX_RETRIES})")
                    time.sleep(wait_time)
                else:
                    print(f"  ❌ Rate limit exceeded after {MAX_RETRIES} attempts")
                    raise
            else:
                raise
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                wait_time = RETRY_DELAY * (2 ** attempt)
                print(f"  ⏳ Transient error, retrying in {wait_time}s: {e}")
                time.sleep(wait_time)
            else:
                raise
    return None

def check_rate_limit(github_client: Github) -> Tuple[bool, int]:
    """Check if rate limit is adequate per PR #35 recommendations"""
    try:
        rate_limit = github_client.get_rate_limit()
        remaining = rate_limit.core.remaining
        
        if remaining < RATE_LIMIT_BUFFER:
            reset_time = rate_limit.core.reset
            wait_seconds = (reset_time - datetime.now()).total_seconds()
            return False, int(wait_seconds)
        
        return True, remaining
    except Exception as e:
        print(f"⚠️  Could not check rate limit: {e}")
        return True, 0  # Proceed with caution

def load_audit_data(audit_file: str = None):
    """Load audit data if available"""
    if not audit_file:
        return None
    
    audit_path = Path(audit_file)
    if not audit_path.exists():
        print(f"⚠️  Audit file not found: {audit_file}")
        return None
    
    try:
        with open(audit_path) as f:
            return json.load(f)
    except Exception as e:
        print(f"⚠️  Could not load audit file: {e}")
        return None

def is_repo_accessible(repo_name: str, audit_data: dict = None) -> tuple:
    """Check if repo is accessible based on audit data
    Returns: (is_accessible: bool, reason: str)
    """
    if not audit_data:
        return True, "no audit data"
    
    # Check existing repos
    existing_repos = audit_data.get("existing_repos", [])
    for repo in existing_repos:
        if repo.get("name") == repo_name and repo.get("exists"):
            return True, "verified"
    
    # Check if in not_found list
    if repo_name in audit_data.get("repos_not_found", []):
        return False, "not found (404)"
    
    # Check if in private/no access list
    if repo_name in audit_data.get("repos_private_no_access", []):
        return False, "private/no access (403)"
    
    return True, "assumed accessible"

def load_connection_status(connection_file: str = None):
    """Load CodeNest connection status if available"""
    if not connection_file:
        return None
    
    conn_path = Path(connection_file)
    if not conn_path.exists():
        return None
    
    try:
        with open(conn_path) as f:
            return json.load(f)
    except Exception:
        return None

def get_connection_status(repo_name: str, connection_data: dict = None) -> str:
    """Get CodeNest connection status for a repo"""
    if not connection_data:
        return "unknown"
    
    # Check connected repos
    for repo in connection_data.get("connected_repos", []):
        if repo.get("name") == repo_name:
            return f"connected: {repo.get('integration_path', 'unknown')}"
    
    # Check disconnected repos
    for repo in connection_data.get("disconnected_repos", []):
        if repo.get("name") == repo_name:
            return f"disconnected (suggest: {repo.get('integration_path', 'unknown')})"
    
    return "unknown"

def scan_ecosystem(config_path: str, auto_sync: bool = False, create_prs: bool = False,
                   audit_file: str = None, connection_file: str = None):
    """
    Scan all ecosystem repositories for branch divergence
    Enhanced with audit and connection status checks
    Enhanced with metrics collection and retry logic per PR #35 recommendations
    """
    metrics = MetricsCollector()
    
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        print("❌ GITHUB_TOKEN environment variable not set")
        sys.exit(1)
    
    g = Github(token)
    
    # Check rate limit before starting
    can_proceed, info = check_rate_limit(g)
    if not can_proceed:
        print(f"⚠️  Rate limit too low, resets in {info} seconds")
        print("   Consider waiting or running with --skip-rate-check")
        sys.exit(1)
    else:
        print(f"✅ Rate limit check passed: {info} API calls remaining")
    
    try:
        config = json.loads(Path(config_path).read_text())
    except Exception as e:
        print(f"❌ Could not load config file {config_path}: {e}")
        metrics.errors_encountered += 1
        metrics.save()
        sys.exit(1)
    
    repos = config["repositories"]
    threshold = config.get("auto_merge_threshold_commits", 10)
    
    # Load audit and connection data
    audit_data = load_audit_data(audit_file)
    connection_data = load_connection_status(connection_file)
    
    print(f"🔍 Scanning {len(repos)} repositories...")
    print(f"📊 Threshold: {threshold} commits behind main")
    if audit_data:
        print(f"📋 Using audit data from: {audit_file}")
    if connection_data:
        print(f"🔗 Using connection data from: {connection_file}")
    print()
    
    divergent = []
    skipped = []
    
    for repo_name in repos:
        # Check accessibility first
        accessible, reason = is_repo_accessible(repo_name, audit_data)
        if not accessible:
            print(f"  ⏭️  Skipping {repo_name}: {reason}")
            skipped.append({
                "repo": repo_name,
                "reason": reason
            })
            metrics.repos_skipped += 1
            continue
        
        # Get connection status
        conn_status = get_connection_status(repo_name, connection_data)
        
        try:
            # Use retry logic for repo access
            repo = retry_on_rate_limit(g.get_repo, repo_name)
            if not repo:
                metrics.errors_encountered += 1
                continue
            
            metrics.api_calls_made += 1
            default_branch = repo.default_branch
            metrics.repos_scanned += 1
            
            # Get all branches with retry logic
            branches = retry_on_rate_limit(lambda: list(repo.get_branches()))
            if not branches:
                print(f"  ⚠️  Could not retrieve branches for {repo_name}")
                metrics.errors_encountered += 1
                continue
            
            metrics.api_calls_made += 1
            
            for branch in branches:
                metrics.branches_analyzed += 1
                
                if branch.name == default_branch:
                    continue
                
                # Skip bot branches (Dependabot, Copilot, etc.) - they are ahead, not behind
                branch_lower = branch.name.lower()
                if any(prefix in branch_lower for prefix in ['dependabot/', 'copilot/', 'claude/', 'renovate/']):
                    skipped.append({
                        "repo": repo_name,
                        "branch": branch.name,
                        "reason": "bot branch (ahead of main)"
                    })
                    continue
                
                # Compare with default using retry logic
                comparison = retry_on_rate_limit(repo.compare, default_branch, branch.name)
                if not comparison:
                    print(f"    ⚠️  Could not compare {branch.name}")
                    metrics.errors_encountered += 1
                    continue
                
                metrics.api_calls_made += 1
                
                # Only report branches that are behind (not ahead)
                if comparison.behind_by > 0 and comparison.ahead_by == 0:
                    divergent.append({
                        "repo": repo_name,
                        "branch": branch.name,
                        "behind": comparison.behind_by,
                        "ahead": comparison.ahead_by,
                        "connection_status": conn_status
                    })
                    
                    print(f"  ⚠️  {repo_name}:{branch.name} is {comparison.behind_by} commits behind | {conn_status}")
                    
                    if create_prs and comparison.behind_by > threshold:
                        # Create sync PR to update the branch from default with retry logic
                        try:
                            pr = retry_on_rate_limit(
                                repo.create_pull,
                                title=f"🔄 Auto-sync: Update {branch.name} from {default_branch}",
                                body=f"Branch is {comparison.behind_by} commits behind. Auto-generated sync PR.",
                                head=default_branch,
                                base=branch.name
                            )
                            if pr:
                                metrics.api_calls_made += 2
                                retry_on_rate_limit(pr.add_to_labels, "automerge", "ecosystem-sync")
                                metrics.prs_created += 1
                                print(f"    ✅ Created sync PR #{pr.number}")
                        except Exception as pr_error:
                            print(f"    ⚠️  Could not create PR: {pr_error}")
                            metrics.errors_encountered += 1
                elif comparison.ahead_by > 0:
                    # Branch is ahead - this is normal for feature branches
                    skipped.append({
                        "repo": repo_name,
                        "branch": branch.name,
                        "reason": f"ahead by {comparison.ahead_by} commits (feature branch)"
                    })
        
        except Exception as e:
            error_msg = str(e)
            if "404" in error_msg:
                print(f"  ❌ {repo_name} not found (404) - should be in audit results")
            elif "403" in error_msg:
                print(f"  ⚠️  {repo_name} private/no access (403)")
            else:
                print(f"  ❌ Error scanning {repo_name}: {e}")
            
            skipped.append({
                "repo": repo_name,
                "reason": f"error: {error_msg}"
            })
            metrics.errors_encountered += 1
    
    print(f"\n📊 Total divergent branches: {len(divergent)}")
    if skipped:
        print(f"ℹ️  Skipped {len(skipped)} branches/repos (bot branches, ahead of main, or inaccessible)")
    
    # Save metrics
    metrics.save()
    
    # Print summary
    print(f"\n📈 Automation Metrics:")
    print(f"   Repos scanned: {metrics.repos_scanned}")
    print(f"   Branches analyzed: {metrics.branches_analyzed}")
    print(f"   PRs created: {metrics.prs_created}")
    print(f"   Errors: {metrics.errors_encountered}")
    print(f"   Success rate: {metrics.to_dict()['success_rate']:.1f}%")
    print(f"   API calls: {metrics.api_calls_made}")
    
    return divergent

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(
        description="Scan ecosystem repositories for branch divergence"
    )
    parser.add_argument("--config", required=True, help="Path to ecosystem config")
    parser.add_argument("--auto-sync", action="store_true", help="Enable auto-sync")
    parser.add_argument("--create-prs", action="store_true", help="Create sync PRs")
    parser.add_argument("--audit-file", help="Path to audit results JSON")
    parser.add_argument("--connection-file", help="Path to connection status JSON")
    args = parser.parse_args()
    
    scan_ecosystem(
        args.config,
        args.auto_sync,
        args.create_prs,
        args.audit_file,
        args.connection_file
    )
