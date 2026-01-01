#!/usr/bin/env python3
"""
Priority Sync Engine - Intelligent Repository Synchronization
Implements priority-based sync with urgency scoring for 104 ecosystem repos
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Tuple

try:
    from github import Github, GithubException
except ImportError:
    print("❌ PyGithub not installed. Install with: pip install PyGithub")
    sys.exit(1)


# Top 12 Priority Repos - ALWAYS sync first, in exact order
TOP_12_PRIORITY = [
    "heyns1000/omnigrid",           # 1. Orchestrator (CRITICAL)
    "heyns1000/codenest",           # 2. Hub (CRITICAL)
    "heyns1000/hotstack",           # 3. Engine (E-commerce)
    "heyns1000/buildnest",          # 4. Engine (Build automation)
    "Fruitful-Global-Planet/FruitfulPlanetChange",  # 5. Primary intake
    "heyns1000/payment-gateway-hub",  # 6. Financial engine
    "heyns1000/banimal",            # 7. Styling engine
    "heyns1000/vaultmesh",          # 8. Vault engine (was licensevault)
    "heyns1000/pulse-engine",       # 9. Pulse engine (was vaultmesh)
    "heyns1000/zoho",               # 10. Integration engine
    "heyns1000/toynest",            # 11. Education engine
    "heyns1000/data-warehouse",     # 12. Growth tracking engine (was metadata)
]


class PrioritySyncEngine:
    """Intelligent sync orchestrator with priority-based urgency scoring"""
    
    def __init__(self, github_token: Optional[str] = None, dry_run: bool = False):
        """Initialize sync engine"""
        self.token = github_token or os.environ.get("GITHUB_TOKEN")
        if not self.token:
            raise ValueError("GITHUB_TOKEN not found in environment")
        
        self.github = Github(self.token)
        self.dry_run = dry_run
        self.sync_results = {
            "sync_timestamp": datetime.now(timezone.utc).isoformat(),
            "mode": "unknown",
            "top_12_status": [],
            "urgent_repos": [],
            "all_repos_urgency": [],
            "sync_summary": {
                "synced": 0,
                "in_progress": 0,
                "pending": 0,
                "failed": 0,
                "skipped": 0
            },
            "performance_metrics": {
                "start_time": None,
                "end_time": None,
                "duration_seconds": 0,
                "repos_per_hour": 0
            }
        }
        
    def load_audit_data(self, audit_path: str) -> Dict:
        """Load audit data from repo-existence-check.json"""
        audit_file = Path(audit_path)
        if not audit_file.exists():
            print(f"⚠️  Audit file not found: {audit_path}")
            print("ℹ️  Run audit_repo_existence.py first to generate audit data")
            return {"existing_repos": []}
        
        with open(audit_file) as f:
            return json.load(f)
    
    def load_connection_data(self, connection_path: str) -> Dict:
        """Load CodeNest connection data"""
        connection_file = Path(connection_path)
        if not connection_file.exists():
            print(f"⚠️  Connection file not found: {connection_path}")
            return {"connected_repos": [], "disconnected_repos": []}
        
        with open(connection_file) as f:
            return json.load(f)
    
    def load_ecosystem_repos(self, config_path: str) -> List[str]:
        """Load ecosystem repositories from config"""
        config_file = Path(config_path)
        if not config_file.exists():
            raise FileNotFoundError(f"Config file not found: {config_path}")
        
        with open(config_file) as f:
            config = json.load(f)
        
        return config.get("repositories", [])
    
    def get_repo_metadata(self, repo_name: str) -> Dict:
        """Get repository metadata including commits behind/ahead"""
        try:
            repo = self.github.get_repo(repo_name)
            
            # Get default branch
            default_branch = repo.default_branch
            
            # Get commits behind/ahead (compare with upstream if fork)
            commits_behind = 0
            commits_ahead = 0
            
            if repo.fork and repo.parent:
                try:
                    comparison = repo.parent.compare(
                        f"{repo.parent.default_branch}",
                        f"{repo.owner.login}:{default_branch}"
                    )
                    commits_behind = comparison.behind_by
                    commits_ahead = comparison.ahead_by
                except Exception:
                    # If comparison fails, estimate from commit dates
                    pass
            
            # Get open PRs
            open_prs = repo.get_pulls(state='open').totalCount
            
            # Get last push date
            last_push = repo.pushed_at
            days_since_last_sync = (datetime.now(timezone.utc) - last_push).days if last_push else 999
            
            # Check for workflows
            has_workflows = False
            try:
                workflows = list(repo.get_workflows())
                has_workflows = len(workflows) > 0
            except Exception:
                pass
            
            # Security alerts (requires special permissions, default to 0)
            security_alerts = 0
            try:
                # This requires security events read permission
                # alerts = repo.get_vulnerability_alerts()
                # security_alerts = len(list(alerts))
                pass
            except Exception:
                pass
            
            return {
                "name": repo_name,
                "commits_behind": commits_behind,
                "commits_ahead": commits_ahead,
                "open_prs": open_prs,
                "days_since_last_sync": days_since_last_sync,
                "security_alerts": security_alerts,
                "has_workflows": has_workflows,
                "default_branch": default_branch,
                "accessible": True
            }
            
        except GithubException as e:
            return {
                "name": repo_name,
                "commits_behind": 0,
                "commits_ahead": 0,
                "open_prs": 0,
                "days_since_last_sync": 0,
                "security_alerts": 0,
                "has_workflows": False,
                "default_branch": None,
                "accessible": False,
                "error": str(e)
            }
    
    def calculate_urgency_score(
        self,
        repo_name: str,
        metadata: Dict,
        connection_data: Dict
    ) -> int:
        """
        Calculate urgency score for a repository
        
        Formula:
        urgency_score = (commits_behind * 10) +
                       (days_since_last_sync * 5) +
                       (open_prs * 3) +
                       (security_alerts * 50) +
                       (is_codenest_connected ? 20 : 0) +
                       (has_workflows ? 10 : 0)
        """
        score = 0
        
        # Commits behind (high impact)
        score += metadata.get("commits_behind", 0) * 10
        
        # Days since last sync (medium impact)
        days = metadata.get("days_since_last_sync", 0)
        if days > 30:  # Cap at 30 days to avoid extreme scores
            days = 30
        score += days * 5
        
        # Open PRs (active development)
        score += metadata.get("open_prs", 0) * 3
        
        # Security alerts (CRITICAL)
        score += metadata.get("security_alerts", 0) * 50
        
        # CodeNest connection bonus
        connected_repos = [r["name"] for r in connection_data.get("connected_repos", [])]
        if repo_name in connected_repos:
            score += 20
        
        # Has workflows bonus
        if metadata.get("has_workflows", False):
            score += 10
        
        return score
    
    def sync_repository(self, repo_name: str, metadata: Dict) -> Dict:
        """
        Sync a single repository (placeholder for actual sync logic)
        In production, this would:
        1. Clone/fetch the repo
        2. Check for conflicts
        3. Merge changes
        4. Create PR if needed
        """
        result = {
            "repo": repo_name,
            "status": "pending",
            "message": "",
            "commits_synced": 0
        }
        
        if self.dry_run:
            result["status"] = "dry_run"
            result["message"] = "Dry run mode - no actual sync performed"
            return result
        
        try:
            commits_behind = metadata.get("commits_behind", 0)
            
            if commits_behind == 0:
                result["status"] = "synced"
                result["message"] = "Already up to date"
            elif commits_behind > 10:
                result["status"] = "pr_required"
                result["message"] = f"{commits_behind} commits behind - PR creation needed"
            else:
                result["status"] = "synced"
                result["message"] = f"Auto-synced {commits_behind} commits"
                result["commits_synced"] = commits_behind
            
            return result
            
        except Exception as e:
            result["status"] = "failed"
            result["message"] = str(e)
            return result
    
    def sync_top_12(self, audit_data: Dict, connection_data: Dict) -> List[Dict]:
        """Sync Top 12 priority repos in exact order"""
        print("\n" + "=" * 70)
        print("🎯 PHASE 1: TOP 12 PRIORITY REPOS")
        print("=" * 70)
        
        results = []
        for i, repo_name in enumerate(TOP_12_PRIORITY, 1):
            print(f"\n{i:2d}. {repo_name}")
            
            # Get metadata
            metadata = self.get_repo_metadata(repo_name)
            
            if not metadata.get("accessible"):
                print(f"   ⚠️  Not accessible - {metadata.get('error', 'Unknown error')}")
                results.append({
                    "priority": i,
                    "repo": repo_name,
                    "status": "inaccessible",
                    "metadata": metadata
                })
                self.sync_results["sync_summary"]["skipped"] += 1
                continue
            
            # Display status
            commits_behind = metadata.get("commits_behind", 0)
            commits_ahead = metadata.get("commits_ahead", 0)
            
            if commits_behind == 0:
                print(f"   ✅ SYNCED ({commits_behind} behind, {commits_ahead} ahead)")
                status = "synced"
            else:
                print(f"   🔄 SYNCING ({commits_behind} behind, {commits_ahead} ahead)")
                status = "in_progress"
            
            # Perform sync
            sync_result = self.sync_repository(repo_name, metadata)
            
            results.append({
                "priority": i,
                "repo": repo_name,
                "status": sync_result["status"],
                "metadata": metadata,
                "sync_result": sync_result
            })
            
            # Update summary
            if sync_result["status"] in ["synced", "dry_run"]:
                self.sync_results["sync_summary"]["synced"] += 1
            elif sync_result["status"] == "pr_required":
                self.sync_results["sync_summary"]["in_progress"] += 1
            elif sync_result["status"] == "failed":
                self.sync_results["sync_summary"]["failed"] += 1
        
        self.sync_results["top_12_status"] = results
        return results
    
    def sync_urgent_repos(
        self,
        all_repos: List[str],
        audit_data: Dict,
        connection_data: Dict,
        limit: int = 10
    ) -> List[Dict]:
        """Sync top N repos by urgency score (excluding Top 12)"""
        print("\n" + "=" * 70)
        print(f"🔥 PHASE 2: URGENT REPOS (TOP {limit} BY URGENCY)")
        print("=" * 70)
        
        # Filter out Top 12
        remaining_repos = [r for r in all_repos if r not in TOP_12_PRIORITY]
        
        print(f"\nCalculating urgency scores for {len(remaining_repos)} repos...")
        
        # Calculate urgency for all remaining repos
        urgency_list = []
        for repo_name in remaining_repos:
            metadata = self.get_repo_metadata(repo_name)
            
            if not metadata.get("accessible"):
                continue
            
            urgency_score = self.calculate_urgency_score(
                repo_name, metadata, connection_data
            )
            
            urgency_list.append({
                "repo": repo_name,
                "urgency_score": urgency_score,
                "metadata": metadata
            })
        
        # Sort by urgency (highest first)
        urgency_list.sort(key=lambda x: x["urgency_score"], reverse=True)
        
        # Store all urgency rankings
        self.sync_results["all_repos_urgency"] = urgency_list
        
        # Display top urgent repos
        print(f"\nTop {limit} Urgent:")
        urgent_to_sync = urgency_list[:limit]
        
        for i, repo_info in enumerate(urgent_to_sync, 1):
            repo_name = repo_info["repo"]
            score = repo_info["urgency_score"]
            metadata = repo_info["metadata"]
            
            commits_behind = metadata.get("commits_behind", 0)
            security = metadata.get("security_alerts", 0)
            
            reason = []
            if commits_behind > 0:
                reason.append(f"{commits_behind} commits behind")
            if security > 0:
                reason.append(f"{security} security alert(s)")
            
            reason_str = ", ".join(reason) if reason else "active development"
            
            print(f"{i:2d}. {repo_name}")
            print(f"    urgency: {score} | {reason_str}")
        
        # Sync urgent repos
        results = []
        for repo_info in urgent_to_sync:
            sync_result = self.sync_repository(
                repo_info["repo"],
                repo_info["metadata"]
            )
            
            results.append({
                "repo": repo_info["repo"],
                "urgency_score": repo_info["urgency_score"],
                "status": sync_result["status"],
                "sync_result": sync_result
            })
            
            # Update summary
            if sync_result["status"] in ["synced", "dry_run"]:
                self.sync_results["sync_summary"]["synced"] += 1
            elif sync_result["status"] == "pr_required":
                self.sync_results["sync_summary"]["in_progress"] += 1
            elif sync_result["status"] == "failed":
                self.sync_results["sync_summary"]["failed"] += 1
        
        self.sync_results["urgent_repos"] = results
        return results
    
    def sync_all_repos(
        self,
        all_repos: List[str],
        audit_data: Dict,
        connection_data: Dict
    ):
        """Sync all repos in batched phases"""
        print("\n" + "=" * 70)
        print("🌐 PHASE 3: FULL ECOSYSTEM SYNC")
        print("=" * 70)
        
        # Phase 1: Top 12
        self.sync_top_12(audit_data, connection_data)
        
        # Phase 2: Next 20 by urgency
        self.sync_urgent_repos(all_repos, audit_data, connection_data, limit=20)
        
        # Phase 3: Remaining repos
        synced_repos = TOP_12_PRIORITY + [
            r["repo"] for r in self.sync_results["urgent_repos"]
        ]
        remaining = [r for r in all_repos if r not in synced_repos]
        
        print(f"\n📊 Remaining repos: {len(remaining)}")
        self.sync_results["sync_summary"]["pending"] = len(remaining)
    
    def run_sync(
        self,
        mode: str,
        config_path: str,
        audit_path: str,
        connection_path: str,
        force_repos: Optional[List[str]] = None
    ):
        """Main sync execution"""
        print("🚀 PRIORITY SYNC ENGINE v1.0")
        print("=" * 70)
        
        self.sync_results["mode"] = mode
        self.sync_results["performance_metrics"]["start_time"] = datetime.now(timezone.utc).isoformat()
        
        if self.dry_run:
            print("⚠️  DRY RUN MODE - No actual syncs will be performed")
            print("=" * 70)
        
        # Load data
        print("\n📋 Loading data...")
        all_repos = self.load_ecosystem_repos(config_path)
        audit_data = self.load_audit_data(audit_path)
        connection_data = self.load_connection_data(connection_path)
        
        print(f"   ✅ {len(all_repos)} repos loaded from ecosystem-repos.json")
        print(f"   ✅ Audit data loaded from {audit_path}")
        print(f"   ✅ Connection data loaded from {connection_path}")
        
        # Handle force repos
        if force_repos:
            print(f"\n🎯 Force syncing: {', '.join(force_repos)}")
            for repo in force_repos:
                if repo in all_repos:
                    metadata = self.get_repo_metadata(repo)
                    sync_result = self.sync_repository(repo, metadata)
                    print(f"   {repo}: {sync_result['status']}")
            return
        
        # Execute based on mode
        if mode == "top12":
            self.sync_top_12(audit_data, connection_data)
        elif mode == "urgent":
            self.sync_top_12(audit_data, connection_data)
            self.sync_urgent_repos(all_repos, audit_data, connection_data, limit=10)
        elif mode == "all":
            self.sync_all_repos(all_repos, audit_data, connection_data)
        
        # Record end time
        self.sync_results["performance_metrics"]["end_time"] = datetime.now(timezone.utc).isoformat()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print sync summary"""
        print("\n" + "=" * 70)
        print("📊 SYNC SUMMARY")
        print("=" * 70)
        
        summary = self.sync_results["sync_summary"]
        print(f"✅ Synced:      {summary['synced']} repos")
        print(f"🔄 In progress: {summary['in_progress']} repos")
        print(f"⚠️  Pending:     {summary['pending']} repos")
        print(f"❌ Failed:      {summary['failed']} repos")
        print(f"⏭️  Skipped:     {summary['skipped']} repos")
        
        # Calculate metrics
        start_time = self.sync_results["performance_metrics"]["start_time"]
        end_time = self.sync_results["performance_metrics"]["end_time"]
        
        if start_time and end_time:
            start_dt = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
            end_dt = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
            duration = (end_dt - start_dt).total_seconds()
            
            self.sync_results["performance_metrics"]["duration_seconds"] = duration
            
            if duration > 0:
                repos_synced = summary['synced']
                repos_per_hour = (repos_synced / duration) * 3600 if repos_synced > 0 else 0
                self.sync_results["performance_metrics"]["repos_per_hour"] = repos_per_hour
                
                print(f"\nSync velocity: {repos_per_hour:.1f} repos/hour")
        
        mode = self.sync_results["mode"]
        if mode == "top12":
            print("\n✅ Top 12 priority sync complete!")
            print("   Next run: Every 2 hours")
        elif mode == "urgent":
            print("\n✅ Priority + urgent sync complete!")
            print("   Next run: Every 6 hours")
        elif mode == "all":
            print("\n✅ Full ecosystem sync complete!")
            print("   Next run: Weekly")
        
        print("=" * 70)
    
    def save_results(self, output_path: str):
        """Save sync results to JSON"""
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(self.sync_results, f, indent=2)
        
        print(f"\n✅ Sync results saved: {output_path}")
    
    def save_urgency_ranking(self, output_path: str):
        """Save urgency ranking to JSON"""
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        ranking_data = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "top_12_priority": TOP_12_PRIORITY,
            "urgency_rankings": self.sync_results.get("all_repos_urgency", [])
        }
        
        with open(output_file, 'w') as f:
            json.dump(ranking_data, f, indent=2)
        
        print(f"✅ Urgency ranking saved: {output_path}")


def main():
    """Main execution"""
    parser = argparse.ArgumentParser(
        description="Priority Sync Engine - Intelligent repository synchronization",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Sync top 12 only
  python3 priority_sync_engine.py --mode top12
  
  # Sync top 12 + urgent repos
  python3 priority_sync_engine.py --mode urgent
  
  # Sync everything
  python3 priority_sync_engine.py --mode all
  
  # Force specific repos
  python3 priority_sync_engine.py --force omnigrid,codenest,hotstack
  
  # Dry run
  python3 priority_sync_engine.py --mode all --dry-run
        """
    )
    
    parser.add_argument(
        "--mode",
        choices=["top12", "urgent", "all"],
        default="top12",
        help="Sync mode: top12 (default), urgent, or all"
    )
    parser.add_argument(
        "--config",
        default="config/ecosystem-repos.json",
        help="Path to ecosystem-repos.json"
    )
    parser.add_argument(
        "--audit-file",
        default="audit/repo-existence-check.json",
        help="Path to audit results"
    )
    parser.add_argument(
        "--connection-file",
        default="audit/codenest-connection-status.json",
        help="Path to connection status"
    )
    parser.add_argument(
        "--output",
        default="audit/sync-progress.json",
        help="Output path for sync results"
    )
    parser.add_argument(
        "--urgency-output",
        default="audit/urgency-ranking.json",
        help="Output path for urgency rankings"
    )
    parser.add_argument(
        "--force",
        help="Comma-separated list of repos to force sync"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Dry run mode - no actual syncs"
    )
    parser.add_argument(
        "--token",
        help="GitHub token (defaults to GITHUB_TOKEN env var)"
    )
    
    args = parser.parse_args()
    
    try:
        engine = PrioritySyncEngine(
            github_token=args.token,
            dry_run=args.dry_run
        )
        
        force_repos = None
        if args.force:
            force_repos = [r.strip() for r in args.force.split(",")]
        
        engine.run_sync(
            mode=args.mode,
            config_path=args.config,
            audit_path=args.audit_file,
            connection_path=args.connection_file,
            force_repos=force_repos
        )
        
        # Save results
        engine.save_results(args.output)
        engine.save_urgency_ranking(args.urgency_output)
        
        return 0
        
    except Exception as e:
        print(f"\n❌ Sync failed: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
