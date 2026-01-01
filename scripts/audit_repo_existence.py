#!/usr/bin/env python3
"""
Repository Existence Audit Script
Verifies which repositories in ecosystem-repos.json actually exist on GitHub
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional

try:
    from github import Github, GithubException
except ImportError:
    print("❌ PyGithub not installed. Install with: pip install PyGithub")
    sys.exit(1)


class RepositoryAuditor:
    """Audits repository existence and accessibility"""
    
    def __init__(self, github_token: Optional[str] = None):
        """Initialize with GitHub token"""
        self.token = github_token or os.environ.get("GITHUB_TOKEN")
        if not self.token:
            raise ValueError("GITHUB_TOKEN not found in environment")
        
        self.github = Github(self.token)
        self.audit_results = {
            "audit_timestamp": datetime.now(timezone.utc).isoformat(),
            "repos_listed_in_config": 0,
            "repos_verified_exist": 0,
            "repos_not_found": [],
            "repos_private_no_access": [],
            "existing_repos": []
        }
    
    def check_repository(self, repo_name: str) -> Dict:
        """Check if a single repository exists and get its metadata"""
        print(f"🔍 Checking: {repo_name}")
        
        result = {
            "name": repo_name,
            "exists": False,
            "branches": 0,
            "has_workflows": False,
            "connected_to_codenest": False,
            "default_branch": None,
            "is_private": False,
            "error": None
        }
        
        try:
            repo = self.github.get_repo(repo_name)
            result["exists"] = True
            result["default_branch"] = repo.default_branch
            result["is_private"] = repo.private
            
            # Count branches
            try:
                branches = list(repo.get_branches())
                result["branches"] = len(branches)
            except GithubException:
                result["branches"] = 0
            
            # Check for workflows
            try:
                workflows_path = ".github/workflows"
                try:
                    contents = repo.get_contents(workflows_path)
                    result["has_workflows"] = len(contents) > 0 if isinstance(contents, list) else True
                except GithubException:
                    result["has_workflows"] = False
            except Exception:
                result["has_workflows"] = False
            
            print(f"   ✅ Exists | Branches: {result['branches']} | Workflows: {result['has_workflows']}")
            
        except GithubException as e:
            if e.status == 404:
                result["error"] = "Repository not found (404)"
                print(f"   ❌ Not found (404)")
            elif e.status == 403:
                result["error"] = "Private repository or no access (403)"
                result["exists"] = True  # Exists but no access
                result["is_private"] = True
                print(f"   ⚠️  Private or no access (403)")
            else:
                result["error"] = f"GitHub API error: {e.status}"
                print(f"   ❌ Error: {e.status}")
        except Exception as e:
            result["error"] = str(e)
            print(f"   ❌ Unexpected error: {e}")
        
        return result
    
    def audit_repositories(self, config_path: str) -> Dict:
        """Audit all repositories from config file"""
        print("=" * 70)
        print("🔍 REPOSITORY EXISTENCE AUDIT")
        print("=" * 70)
        
        # Load config
        config_file = Path(config_path)
        if not config_file.exists():
            raise FileNotFoundError(f"Config file not found: {config_path}")
        
        with open(config_file) as f:
            config = json.load(f)
        
        repositories = config.get("repositories", [])
        self.audit_results["repos_listed_in_config"] = len(repositories)
        
        print(f"\n📊 Total repositories to audit: {len(repositories)}")
        print()
        
        # Check each repository
        for repo_name in repositories:
            result = self.check_repository(repo_name)
            
            if result["exists"]:
                if result.get("is_private") and result.get("error"):
                    self.audit_results["repos_private_no_access"].append(repo_name)
                else:
                    self.audit_results["existing_repos"].append(result)
                    self.audit_results["repos_verified_exist"] += 1
            else:
                self.audit_results["repos_not_found"].append(repo_name)
        
        # Generate summary
        print()
        print("=" * 70)
        print("📊 AUDIT SUMMARY")
        print("=" * 70)
        print(f"Total listed in config:  {self.audit_results['repos_listed_in_config']}")
        print(f"Verified exist:          {self.audit_results['repos_verified_exist']}")
        print(f"Not found (404):         {len(self.audit_results['repos_not_found'])}")
        print(f"Private/No access (403): {len(self.audit_results['repos_private_no_access'])}")
        print("=" * 70)
        
        return self.audit_results
    
    def save_report(self, output_path: str):
        """Save audit results to JSON file"""
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(self.audit_results, f, indent=2)
        
        print(f"\n✅ Audit report saved: {output_path}")


def main():
    """Main audit execution"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Audit repository existence from ecosystem config"
    )
    parser.add_argument(
        "--config",
        default="config/ecosystem-repos.json",
        help="Path to ecosystem-repos.json config file"
    )
    parser.add_argument(
        "--output",
        default="audit/repo-existence-check.json",
        help="Output path for audit results"
    )
    parser.add_argument(
        "--token",
        help="GitHub token (defaults to GITHUB_TOKEN env var)"
    )
    
    args = parser.parse_args()
    
    try:
        auditor = RepositoryAuditor(github_token=args.token)
        auditor.audit_repositories(args.config)
        auditor.save_report(args.output)
        
        # Exit with error if any repos not found
        if auditor.audit_results["repos_not_found"]:
            print(f"\n⚠️  Warning: {len(auditor.audit_results['repos_not_found'])} repositories not found")
            return 1
        
        return 0
        
    except Exception as e:
        print(f"\n❌ Audit failed: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
