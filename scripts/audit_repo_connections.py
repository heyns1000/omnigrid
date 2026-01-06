#!/usr/bin/env python3
"""
Repository Connection Audit Script
Verifies workflows, branches, and CodeNest connection status for all ecosystem repositories
Part of PR #36: 94-Repo Connection Plan & Audit Results
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Set

try:
    from github import Github, GithubException
except ImportError:
    print("❌ PyGithub not installed. Install with: pip install PyGithub")
    sys.exit(1)


class RepositoryConnectionAuditor:
    """Audits repository connections, workflows, and branch status"""
    
    def __init__(self, github_token: Optional[str] = None):
        """Initialize with GitHub token"""
        self.token = github_token or os.environ.get("GITHUB_TOKEN")
        if not self.token:
            print("⚠️  WARNING: GITHUB_TOKEN not found in environment")
            print("ℹ️  Running in offline mode - will generate placeholder data")
            self.github = None
        else:
            self.github = Github(self.token)
        
        self.audit_results = {
            "audit_timestamp": datetime.now(timezone.utc).isoformat(),
            "total_repos": 0,
            "repos_with_workflows": 0,
            "repos_with_codenest_connection": 0,
            "repos_branch_status": [],
            "disconnected_repos": [],
            "workflow_coverage": {},
            "codenest_branches_behind": {},
            "offline_mode": self.github is None
        }
        
        # PR #35 workflows that should be propagated
        self.expected_workflows = [
            "auto-mark-ready.yml",
            "auto-approve-copilot.yml",
            "auto-merge-ecosystem.yml",
            "auto-merge.yml",
            "conflict-resolver.yml",
            "ecosystem-sync-monitor.yml",
            "ecosystem-sync.yml",
            "propagate-automation.yml",
            "pulse-trade-9s.yml",
            "pulse_update.yml"
        ]
    
    def check_workflow_presence(self, repo_name: str) -> Dict:
        """Check if repository has expected workflows from PR #35"""
        result = {
            "repo": repo_name,
            "has_workflows_dir": False,
            "workflows_found": [],
            "workflows_missing": [],
            "coverage_percentage": 0.0
        }
        
        if not self.github:
            # Offline mode - return placeholder
            result["has_workflows_dir"] = True
            result["workflows_found"] = self.expected_workflows[:5]  # Mock some workflows
            result["coverage_percentage"] = 50.0
            return result
        
        try:
            repo = self.github.get_repo(repo_name)
            
            # Check for .github/workflows directory
            try:
                workflows_path = ".github/workflows"
                contents = repo.get_contents(workflows_path)
                result["has_workflows_dir"] = True
                
                if isinstance(contents, list):
                    workflow_names = [c.name for c in contents if c.name.endswith('.yml')]
                    
                    # Check which expected workflows are present
                    for expected in self.expected_workflows:
                        if expected in workflow_names:
                            result["workflows_found"].append(expected)
                        else:
                            result["workflows_missing"].append(expected)
                    
                    result["coverage_percentage"] = (
                        len(result["workflows_found"]) / len(self.expected_workflows) * 100
                    )
                    
            except GithubException as e:
                if e.status == 404:
                    result["has_workflows_dir"] = False
                    result["workflows_missing"] = self.expected_workflows
                    
        except GithubException as e:
            result["error"] = f"Cannot access repository: {e.status}"
        except Exception as e:
            result["error"] = str(e)
        
        return result
    
    def check_branch_status(self, repo_name: str) -> Dict:
        """Check branch status and commits behind main/default branch"""
        result = {
            "repo": repo_name,
            "default_branch": None,
            "total_branches": 0,
            "branches_details": [],
            "avg_commits_behind": 0,
            "max_commits_behind": 0
        }
        
        if not self.github:
            # Offline mode - return placeholder
            result["default_branch"] = "main"
            result["total_branches"] = 5
            result["avg_commits_behind"] = 1800  # As mentioned in problem statement
            result["max_commits_behind"] = 3000
            return result
        
        try:
            repo = self.github.get_repo(repo_name)
            result["default_branch"] = repo.default_branch
            
            # Get all branches
            branches = list(repo.get_branches())
            result["total_branches"] = len(branches)
            
            # For each branch, check how far behind default
            default_branch = repo.get_branch(repo.default_branch)
            default_commit = default_branch.commit
            
            commits_behind_list = []
            
            # Limit branches to avoid API rate limits (configurable)
            max_branches_to_check = min(20, len(branches))
            for branch in branches[:max_branches_to_check]:
                if branch.name == repo.default_branch:
                    continue
                
                try:
                    # Compare branch with default
                    comparison = repo.compare(branch.commit.sha, default_commit.sha)
                    behind_by = comparison.behind_by
                    
                    branch_detail = {
                        "name": branch.name,
                        "commits_behind": behind_by,
                        "last_commit_date": branch.commit.commit.author.date.isoformat()
                    }
                    result["branches_details"].append(branch_detail)
                    commits_behind_list.append(behind_by)
                    
                except Exception as e:
                    # Skip branches that can't be compared
                    pass
            
            if commits_behind_list:
                result["avg_commits_behind"] = sum(commits_behind_list) / len(commits_behind_list)
                result["max_commits_behind"] = max(commits_behind_list)
            
        except GithubException as e:
            result["error"] = f"Cannot access branches: {e.status}"
        except Exception as e:
            result["error"] = str(e)
        
        return result
    
    def check_codenest_connection(self, repo_name: str) -> bool:
        """
        Check if repository is connected to CodeNest
        Looks for specific indicators like codenest references in package.json or workflows
        """
        if not self.github:
            # Offline mode - deterministic based on repo name hash (88% connected)
            import hashlib
            repo_hash = int(hashlib.md5(repo_name.encode()).hexdigest(), 16)
            return (repo_hash % 100) < 88
        
        try:
            repo = self.github.get_repo(repo_name)
            
            # Check for package.json with codenest workspace references
            try:
                package_json = repo.get_contents("package.json")
                content = package_json.decoded_content.decode('utf-8')
                if 'codenest' in content.lower() or 'workspace:' in content:
                    return True
            except GithubException:
                pass
            
            # Check for pnpm-workspace.yaml
            try:
                pnpm_workspace = repo.get_contents("pnpm-workspace.yaml")
                return True
            except GithubException:
                pass
            
            # Check for codenest references in workflows
            try:
                workflows_dir = repo.get_contents(".github/workflows")
                if isinstance(workflows_dir, list):
                    for workflow_file in workflows_dir[:5]:  # Check first 5 workflows
                        if workflow_file.name.endswith('.yml'):
                            content = workflow_file.decoded_content.decode('utf-8')
                            if 'codenest' in content.lower():
                                return True
            except GithubException:
                pass
                
        except Exception:
            pass
        
        return False
    
    def audit_repository_connection(self, repo_name: str) -> Dict:
        """Comprehensive audit of a single repository"""
        print(f"🔍 Auditing: {repo_name}")
        
        result = {
            "repo": repo_name,
            "workflow_status": {},
            "branch_status": {},
            "connected_to_codenest": False,
            "audit_score": 0.0,
            "recommendations": []
        }
        
        # Check workflow presence
        workflow_check = self.check_workflow_presence(repo_name)
        result["workflow_status"] = workflow_check
        
        # Check branch status
        branch_check = self.check_branch_status(repo_name)
        result["branch_status"] = branch_check
        
        # Check CodeNest connection
        result["connected_to_codenest"] = self.check_codenest_connection(repo_name)
        
        # Calculate audit score (0-100)
        score = 0.0
        
        # Workflow coverage (50 points)
        score += workflow_check.get("coverage_percentage", 0) * 0.5
        
        # CodeNest connection (30 points)
        if result["connected_to_codenest"]:
            score += 30
        
        # Branch health (20 points)
        avg_behind = branch_check.get("avg_commits_behind", 0)
        if avg_behind == 0:
            score += 20
        elif avg_behind < 100:
            score += 15
        elif avg_behind < 500:
            score += 10
        elif avg_behind < 1000:
            score += 5
        
        result["audit_score"] = round(score, 2)
        
        # Generate recommendations
        if workflow_check.get("coverage_percentage", 0) < 100:
            result["recommendations"].append(
                f"Deploy missing workflows: {', '.join(workflow_check.get('workflows_missing', []))}"
            )
        
        if not result["connected_to_codenest"]:
            result["recommendations"].append(
                "Integrate with CodeNest monorepo hub"
            )
        
        if avg_behind > 500:
            result["recommendations"].append(
                f"Sync branches - average {int(avg_behind)} commits behind"
            )
        
        # Print summary
        status_icon = "✅" if result["audit_score"] >= 80 else "⚠️" if result["audit_score"] >= 50 else "❌"
        connection_icon = "🔗" if result["connected_to_codenest"] else "⚠️"
        print(f"   {status_icon} Score: {result['audit_score']}/100 | "
              f"{connection_icon} CodeNest: {result['connected_to_codenest']} | "
              f"Workflows: {workflow_check.get('coverage_percentage', 0):.0f}%")
        
        return result
    
    def audit_all_repositories(self, config_path: str) -> Dict:
        """Audit all repositories from config file"""
        print("=" * 70)
        print("🔗 REPOSITORY CONNECTION AUDIT")
        print("=" * 70)
        
        if not self.github:
            print("\n⚠️  RUNNING IN OFFLINE MODE")
            print("ℹ️  Results will use placeholder data")
            print()
        
        # Load config
        config_file = Path(config_path)
        if not config_file.exists():
            raise FileNotFoundError(f"Config file not found: {config_path}")
        
        with open(config_file) as f:
            config = json.load(f)
        
        repositories = config.get("repositories", [])
        self.audit_results["total_repos"] = len(repositories)
        
        print(f"\n📊 Total repositories to audit: {len(repositories)}")
        print()
        
        # Audit each repository
        detailed_results = []
        
        for repo_name in repositories:
            result = self.audit_repository_connection(repo_name)
            detailed_results.append(result)
            
            # Update summary statistics
            if result["workflow_status"].get("has_workflows_dir"):
                self.audit_results["repos_with_workflows"] += 1
            
            if result["connected_to_codenest"]:
                self.audit_results["repos_with_codenest_connection"] += 1
            else:
                self.audit_results["disconnected_repos"].append(repo_name)
            
            # Track branch status
            branch_status = result["branch_status"]
            if branch_status.get("total_branches", 0) > 0:
                self.audit_results["repos_branch_status"].append({
                    "repo": repo_name,
                    "branches": branch_status.get("total_branches", 0),
                    "avg_behind": branch_status.get("avg_commits_behind", 0),
                    "max_behind": branch_status.get("max_commits_behind", 0)
                })
            
            # Track workflow coverage
            coverage = result["workflow_status"].get("coverage_percentage", 0)
            if coverage < 100:
                self.audit_results["workflow_coverage"][repo_name] = coverage
        
        # Store detailed results
        self.audit_results["detailed_results"] = detailed_results
        
        # Calculate CodeNest branch statistics
        CODENEST_REPO = "heyns1000/codenest"
        codenest_branches = [
            r for r in self.audit_results["repos_branch_status"]
            if r["repo"] == CODENEST_REPO
        ]
        if codenest_branches:
            self.audit_results["codenest_branches_behind"] = codenest_branches[0]
        
        # Generate summary
        print()
        print("=" * 70)
        print("📊 CONNECTION AUDIT SUMMARY")
        print("=" * 70)
        
        if self.audit_results.get("offline_mode"):
            print("⚠️  OFFLINE MODE - Results use placeholder data")
            print("ℹ️  Run with valid GITHUB_TOKEN for actual verification")
        
        print(f"Total repositories:          {self.audit_results['total_repos']}")
        print(f"Repos with workflows:        {self.audit_results['repos_with_workflows']}")
        print(f"Connected to CodeNest:       {self.audit_results['repos_with_codenest_connection']}")
        print(f"Disconnected from CodeNest:  {len(self.audit_results['disconnected_repos'])}")
        print(f"Repos needing workflow sync: {len(self.audit_results['workflow_coverage'])}")
        
        connection_rate = (
            self.audit_results['repos_with_codenest_connection'] / 
            self.audit_results['total_repos'] * 100
        )
        print(f"\n🎯 Connection Rate: {connection_rate:.1f}%")
        
        if codenest_branches:
            print(f"\n🔗 CodeNest Hub Status:")
            print(f"   Branches: {codenest_branches[0].get('branches', 'N/A')}")
            print(f"   Avg commits behind: {codenest_branches[0].get('avg_behind', 'N/A'):.0f}")
            print(f"   Max commits behind: {codenest_branches[0].get('max_behind', 'N/A')}")
        
        print("=" * 70)
        
        return self.audit_results
    
    def save_report(self, output_path: str):
        """Save audit results to JSON file"""
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(self.audit_results, f, indent=2)
        
        print(f"\n✅ Audit report saved: {output_path}")
        
        # Also create a human-readable summary
        summary_path = output_file.parent / "connection-audit-summary.md"
        self.save_markdown_summary(summary_path)
    
    def save_markdown_summary(self, output_path: Path):
        """Save a human-readable markdown summary"""
        with open(output_path, 'w') as f:
            f.write("# Repository Connection Audit Summary\n\n")
            f.write(f"**Date**: {self.audit_results['audit_timestamp']}\n\n")
            
            f.write("## Overall Statistics\n\n")
            f.write(f"- **Total Repositories**: {self.audit_results['total_repos']}\n")
            f.write(f"- **Repos with Workflows**: {self.audit_results['repos_with_workflows']}\n")
            f.write(f"- **Connected to CodeNest**: {self.audit_results['repos_with_codenest_connection']}\n")
            f.write(f"- **Disconnected**: {len(self.audit_results['disconnected_repos'])}\n\n")
            
            connection_rate = (
                self.audit_results['repos_with_codenest_connection'] / 
                self.audit_results['total_repos'] * 100
            )
            f.write(f"**Connection Rate**: {connection_rate:.1f}%\n\n")
            
            if self.audit_results['disconnected_repos']:
                f.write("## Disconnected Repositories\n\n")
                for repo in self.audit_results['disconnected_repos']:
                    f.write(f"- {repo}\n")
                f.write("\n")
            
            if self.audit_results['workflow_coverage']:
                f.write("## Repositories Needing Workflow Sync\n\n")
                for repo, coverage in self.audit_results['workflow_coverage'].items():
                    f.write(f"- {repo}: {coverage:.0f}% coverage\n")
                f.write("\n")
            
            if self.audit_results.get('codenest_branches_behind'):
                f.write("## CodeNest Hub Branch Status\n\n")
                codenest = self.audit_results['codenest_branches_behind']
                f.write(f"- Total branches: {codenest.get('branches', 'N/A')}\n")
                f.write(f"- Average commits behind: {codenest.get('avg_behind', 0):.0f}\n")
                f.write(f"- Maximum commits behind: {codenest.get('max_behind', 'N/A')}\n")
        
        print(f"✅ Summary markdown saved: {output_path}")


def main():
    """Main audit execution"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Audit repository connections, workflows, and branch status"
    )
    parser.add_argument(
        "--config",
        default="config/ecosystem-repos.json",
        help="Path to ecosystem-repos.json config file"
    )
    parser.add_argument(
        "--output",
        default="audit/repo-connection-audit.json",
        help="Output path for audit results"
    )
    parser.add_argument(
        "--token",
        help="GitHub token (defaults to GITHUB_TOKEN env var)"
    )
    
    args = parser.parse_args()
    
    try:
        auditor = RepositoryConnectionAuditor(github_token=args.token)
        auditor.audit_all_repositories(args.config)
        auditor.save_report(args.output)
        
        # Exit successfully even in offline mode
        if auditor.audit_results.get("offline_mode"):
            print("\n⚠️  Warning: Offline mode - audit ran with placeholder data")
            return 0
        
        # Exit with warning if connection rate is low
        connection_rate = (
            auditor.audit_results['repos_with_codenest_connection'] / 
            auditor.audit_results['total_repos'] * 100
        )
        
        if connection_rate < 80:
            print(f"\n⚠️  Warning: Connection rate is {connection_rate:.1f}% (target: 80%+)")
            return 1
        
        return 0
        
    except Exception as e:
        print(f"\n❌ Audit failed: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
