#!/usr/bin/env python3
"""
PulseTrade Metrics - Ecosystem Repository Sync Monitor

Scans repositories for branches behind main/master that need syncing.
Automatically skips bot branches (Dependabot, Copilot, etc.) which are ahead of main.
Enhanced with repository existence checks and connection status tracking.
"""

import json
import os
from pathlib import Path
from github import Github

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
    """
    token = os.environ.get("GITHUB_TOKEN")
    g = Github(token)
    
    config = json.loads(Path(config_path).read_text())
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
            continue
        
        # Get connection status
        conn_status = get_connection_status(repo_name, connection_data)
        
        try:
            repo = g.get_repo(repo_name)
            default_branch = repo.default_branch
            
            # Get all branches
            for branch in repo.get_branches():
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
                
                # Compare with default
                comparison = repo.compare(default_branch, branch.name)
                
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
                        # Create sync PR to update the branch from default
                        try:
                            pr = repo.create_pull(
                                title=f"🔄 Auto-sync: Update {branch.name} from {default_branch}",
                                body=f"Branch is {comparison.behind_by} commits behind. Auto-generated sync PR.",
                                head=default_branch,
                                base=branch.name
                            )
                            pr.add_to_labels("automerge", "ecosystem-sync")
                            print(f"    ✅ Created sync PR #{pr.number}")
                        except Exception as pr_error:
                            print(f"    ⚠️  Could not create PR: {pr_error}")
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
    
    print(f"\n📊 Total divergent branches: {len(divergent)}")
    if skipped:
        print(f"ℹ️  Skipped {len(skipped)} branches/repos (bot branches, ahead of main, or inaccessible)")
    
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
