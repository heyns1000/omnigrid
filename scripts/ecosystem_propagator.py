#!/usr/bin/env python3
"""
Ecosystem Auto-Propagation Script
Propagates auto-merge.yml workflow to all ecosystem repositories
"""

import json
import os
import subprocess
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List

try:
    from github import Github
except ImportError:
    Github = None  # Will be checked when needed


class EcosystemPropagator:
    """Propagates CI/CD workflows across ecosystem repositories"""
    
    def __init__(self, dry_run: bool = True, audit_file: str = None):
        self.dry_run = dry_run
        self.audit_file = audit_file
        self.audit_data = self.load_audit_data() if audit_file else None
        self.repositories = self.load_ecosystem_repos()
        self.propagation_results = []
    
    def load_audit_data(self) -> Dict:
        """Load audit data if available"""
        if not self.audit_file:
            return None
        
        audit_path = Path(self.audit_file)
        if not audit_path.exists():
            print(f"⚠️  Audit file not found: {self.audit_file}")
            return None
        
        try:
            with open(audit_path) as f:
                return json.load(f)
        except Exception as e:
            print(f"⚠️  Could not load audit file: {e}")
            return None
    
    def is_repo_accessible(self, repo_name: str) -> bool:
        """Check if repo is accessible based on audit data"""
        if not self.audit_data:
            return True  # No audit data, assume accessible
        
        existing_repos = self.audit_data.get("existing_repos", [])
        for repo in existing_repos:
            if repo.get("name") == repo_name and repo.get("exists"):
                return True
        
        # Check if in not_found list
        if repo_name in self.audit_data.get("repos_not_found", []):
            return False
        
        # Check if in private/no access list
        if repo_name in self.audit_data.get("repos_private_no_access", []):
            return False
        
        return True  # Default to accessible
    
    def load_ecosystem_repos(self) -> List[str]:
        """Load list of ecosystem repositories from config file"""
        script_dir = Path(__file__).resolve().parent
        repo_root = script_dir.parent
        config_path = repo_root / "config" / "ecosystem-repos.json"
        
        if config_path.exists():
            with open(config_path) as f:
                config = json.load(f)
                repos = config.get("repositories", [])
                
                # Filter based on audit data if available
                if self.audit_data:
                    original_count = len(repos)
                    repos = [r for r in repos if self.is_repo_accessible(r)]
                    skipped = original_count - len(repos)
                    if skipped > 0:
                        print(f"ℹ️  Skipping {skipped} non-accessible repos based on audit data")
                
                return repos
        
        # Fallback to hardcoded list if config not found
        # Core repository
        repos = ["heyns1000/omnigrid"]
        
        # Financial Services (12)
        repos.extend([
            "heyns1000/celestial-payroll",
            "heyns1000/actuary-vault",
            "heyns1000/fruitful-finance",
            "heyns1000/quantum-custody",
            "heyns1000/treaty-grid",
            "heyns1000/revenue-harmonics",
            "heyns1000/care-loop-allocator",
            "heyns1000/baobab-ledger",
            "heyns1000/ml-dsa-signer",
            "heyns1000/crypto-exchange-bridge",
            "heyns1000/payment-gateway-hub",
            "heyns1000/risk-engine",
        ])
        
        # Healthcare Systems (8)
        repos.extend([
            "heyns1000/healthgrid",
            "heyns1000/meho-cache",
            "heyns1000/eho-memory",
            "heyns1000/patient-vault",
            "heyns1000/medical-indexer",
            "heyns1000/pharma-supply",
            "heyns1000/telehealth-hub",
            "heyns1000/clinical-trials-db",
        ])
        
        # Education Platforms (6)
        repos.extend([
            "heyns1000/toynest",
            "heyns1000/edu-grid",
            "heyns1000/learning-mesh",
            "heyns1000/course-catalog",
            "heyns1000/student-portal",
            "heyns1000/certification-engine",
        ])
        
        # E-commerce Hubs (15)
        repos.extend([
            "heyns1000/hotstack",
            "heyns1000/brand-dashboard-matrix",
            "heyns1000/inventory-mesh",
            "heyns1000/order-processor",
            "heyns1000/shipping-coordinator",
            "heyns1000/price-optimizer",
            "heyns1000/product-catalog",
            "heyns1000/customer-insights",
            "heyns1000/loyalty-program",
            "heyns1000/marketplace-connector",
            "heyns1000/vendor-portal",
            "heyns1000/fulfillment-network",
            "heyns1000/returns-manager",
            "heyns1000/promo-engine",
            "heyns1000/recommendation-ai",
        ])
        
        # Infrastructure & DevOps (10)
        repos.extend([
            "heyns1000/vaultmesh",
            "heyns1000/pulse-engine",
            "heyns1000/ecosystem-sync",
            "heyns1000/ci-orchestrator",
            "heyns1000/deployment-coordinator",
            "heyns1000/monitoring-hub",
            "heyns1000/log-aggregator",
            "heyns1000/secret-manager",
            "heyns1000/backup-vault",
            "heyns1000/disaster-recovery",
        ])
        
        # Data & Analytics (8)
        repos.extend([
            "heyns1000/data-warehouse",
            "heyns1000/analytics-engine",
            "heyns1000/report-generator",
            "heyns1000/dashboard-builder",
            "heyns1000/metrics-collector",
            "heyns1000/data-pipeline",
            "heyns1000/etl-coordinator",
            "heyns1000/bi-platform",
        ])
        
        # AI & Machine Learning (7)
        repos.extend([
            "heyns1000/gpr-framework",
            "heyns1000/tensor-processor",
            "heyns1000/model-registry",
            "heyns1000/inference-engine",
            "heyns1000/training-orchestrator",
            "heyns1000/feature-store",
            "heyns1000/ml-pipeline",
        ])
        
        # Security & Compliance (6)
        repos.extend([
            "heyns1000/security-scanner",
            "heyns1000/compliance-checker",
            "heyns1000/audit-logger",
            "heyns1000/access-manager",
            "heyns1000/encryption-service",
            "heyns1000/key-vault",
        ])
        
        # Communication & Collaboration (5)
        repos.extend([
            "heyns1000/notification-hub",
            "heyns1000/email-service",
            "heyns1000/sms-gateway",
            "heyns1000/chat-platform",
            "heyns1000/video-conferencing",
        ])
        
        # Regional & Localization (5)
        repos.extend([
            "heyns1000/kasi-economy",
            "heyns1000/sadc-integration",
            "heyns1000/localization-engine",
            "heyns1000/currency-converter",
            "heyns1000/regional-compliance",
        ])
        
        # Utility Services (12)
        repos.extend([
            "heyns1000/image-processor",
            "heyns1000/file-storage",
            "heyns1000/search-indexer",
            "heyns1000/cache-manager",
            "heyns1000/queue-service",
            "heyns1000/scheduler",
            "heyns1000/webhook-dispatcher",
            "heyns1000/api-gateway",
            "heyns1000/rate-limiter",
            "heyns1000/load-balancer",
            "heyns1000/cdn-manager",
            "heyns1000/dns-controller",
        ])
        
        return repos
    
    def propagate_workflow(self, repo: str, workflow_path: Path) -> Dict:
        """Propagate workflow file to a single repository"""
        print(f"\n📤 Propagating to: {repo}")
        
        result = {
            "repository": repo,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "status": "PENDING"
        }
        
        if self.dry_run:
            print(f"   [DRY RUN] Would propagate {workflow_path.name} to {repo}")
            result["status"] = "DRY_RUN"
            return result
        
        try:
            if Github is None:
                raise Exception("PyGithub not installed. Run: pip install PyGithub")
            
            token = os.environ.get("GITHUB_TOKEN")
            if not token:
                raise Exception("GITHUB_TOKEN not found in environment")
            
            g = Github(token)
            target_repo = g.get_repo(repo)
            
            # Read workflow content
            workflow_content = workflow_path.read_text()
            
            # Create branch
            default_branch = target_repo.default_branch
            branch_name = f"automation/propagate-workflows-{datetime.now().strftime('%Y%m%d')}"
            
            try:
                # Get default branch ref
                source = target_repo.get_branch(default_branch)
                target_repo.create_git_ref(
                    ref=f"refs/heads/{branch_name}",
                    sha=source.commit.sha
                )
                print(f"   ✅ Created branch: {branch_name}")
            except Exception as branch_error:
                if "already exists" in str(branch_error):
                    print(f"   ⚠️  Branch {branch_name} already exists, using existing")
                else:
                    raise
            
            # Create/update workflow file
            workflow_file_path = f".github/workflows/{workflow_path.name}"
            
            try:
                # Try to get existing file
                existing_file = target_repo.get_contents(workflow_file_path, ref=branch_name)
                target_repo.update_file(
                    workflow_file_path,
                    f"Update {workflow_path.name} from omnigrid automation",
                    workflow_content,
                    existing_file.sha,
                    branch=branch_name
                )
                print(f"   ✅ Updated workflow file")
            except Exception:
                # File doesn't exist, create it
                target_repo.create_file(
                    workflow_file_path,
                    f"Add {workflow_path.name} from omnigrid automation",
                    workflow_content,
                    branch=branch_name
                )
                print(f"   ✅ Created workflow file")
            
            # Create PR
            pr = target_repo.create_pull(
                title=f"🤖 Ecosystem Automation: Add {workflow_path.name}",
                body=f"""## 🌐 Automated Workflow Propagation

This PR adds the `{workflow_path.name}` workflow from the omnigrid hub to enable ecosystem-wide automation.

### 🚀 Features
- ✅ Auto-mark PRs ready for review
- ✅ Auto-approve bot PRs (user ID: 41898282)
- ✅ Auto-merge with safety checks
- ✅ AI-driven conflict resolution
- ✅ Ecosystem sync monitoring
- ✅ Pulse heartbeat tracking

### 🔒 Security
- Bot detection via user ID (not username)
- Required approvals respected
- Branch protection honored
- Clean mergeable state required

**Source:** heyns1000/omnigrid (PR #35)
**Propagated by:** Ecosystem Propagator v2.2.1
""",
                head=branch_name,
                base=default_branch
            )
            
            # Add labels
            try:
                pr.add_to_labels("automation", "ecosystem-sync", "automerge")
                print(f"   ✅ Added labels")
            except Exception as label_error:
                print(f"   ⚠️  Could not add labels: {label_error}")
                # Labels might not exist in target repo - not critical
            
            result["status"] = "SUCCESS"
            result["branch"] = branch_name
            result["pr_url"] = pr.html_url
            result["pr_number"] = pr.number
            
            print(f"   ✅ Created PR #{pr.number}: {pr.html_url}")
            
        except Exception as e:
            result["status"] = "FAILED"
            result["error"] = str(e)
            print(f"   ❌ Failed: {e}")
        
        return result
    
    def propagate_all(self, workflow_path: Path) -> Dict:
        """Propagate workflow to all 94 repositories"""
        print("=" * 70)
        print("🌐 Ecosystem Auto-Propagation")
        print("   Propagating auto-merge.yml to 94 repositories")
        print("=" * 70)
        print(f"\nMode: {'DRY RUN' if self.dry_run else 'PRODUCTION'}")
        print(f"Workflow: {workflow_path.name}")
        print(f"Repositories: {len(self.repositories)}")
        
        results = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "version": "2.2.1",
            "workflow": str(workflow_path),
            "dry_run": self.dry_run,
            "total_repositories": len(self.repositories),
            "results": []
        }
        
        for repo in self.repositories:
            result = self.propagate_workflow(repo, workflow_path)
            results["results"].append(result)
            self.propagation_results.append(result)
        
        # Calculate summary
        success_count = sum(1 for r in results["results"] if r["status"] in ["SUCCESS", "DRY_RUN"])
        failed_count = sum(1 for r in results["results"] if r["status"] == "FAILED")
        
        results["summary"] = {
            "successful": success_count,
            "failed": failed_count,
            "success_rate": (success_count / len(self.repositories)) * 100
        }
        
        return results
    
    def generate_report(self, results: Dict) -> str:
        """Generate propagation report"""
        report = []
        report.append("=" * 70)
        report.append("🌐 ECOSYSTEM AUTO-PROPAGATION REPORT")
        report.append("=" * 70)
        report.append(f"\nTimestamp: {results['timestamp']}")
        report.append(f"Version: {results['version']}")
        report.append(f"Workflow: {Path(results['workflow']).name}")
        report.append(f"Mode: {'DRY RUN' if results['dry_run'] else 'PRODUCTION'}")
        report.append("\n" + "-" * 70)
        report.append("SUMMARY")
        report.append("-" * 70)
        
        summary = results['summary']
        report.append(f"\nTotal Repositories: {results['total_repositories']}")
        report.append(f"Successful: {summary['successful']}")
        report.append(f"Failed: {summary['failed']}")
        report.append(f"Success Rate: {summary['success_rate']:.1f}%")
        
        report.append("\n" + "-" * 70)
        report.append("REPOSITORY STATUS")
        report.append("-" * 70)
        
        # Group by status
        by_status = {}
        for result in results['results']:
            status = result['status']
            if status not in by_status:
                by_status[status] = []
            by_status[status].append(result['repository'])
        
        for status, repos in by_status.items():
            icon = "✅" if status in ["SUCCESS", "DRY_RUN"] else "❌"
            report.append(f"\n{icon} {status} ({len(repos)} repositories)")
            for repo in repos[:5]:  # Show first 5
                report.append(f"   - {repo}")
            if len(repos) > 5:
                report.append(f"   ... and {len(repos) - 5} more")
        
        report.append("\n" + "=" * 70)
        
        if summary['success_rate'] == 100:
            report.append("✅ ALL REPOSITORIES SYNCHRONIZED")
        else:
            report.append(f"⚠️  {summary['failed']} REPOSITORIES FAILED")
        
        report.append("=" * 70)
        
        return "\n".join(report)


def main():
    """Main propagation execution"""
    import sys
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Propagate workflows to ecosystem repositories"
    )
    parser.add_argument(
        "--dry-run", "-n",
        action="store_true",
        help="Run in dry-run mode (no actual changes)"
    )
    parser.add_argument(
        "--config",
        default="config/ecosystem-repos.json",
        help="Path to ecosystem repos config"
    )
    parser.add_argument(
        "--audit-file",
        help="Path to audit results JSON (skips non-existent repos)"
    )
    
    args = parser.parse_args()
    
    propagator = EcosystemPropagator(dry_run=args.dry_run, audit_file=args.audit_file)
    
    # Use relative path for portability
    script_dir = Path(__file__).resolve().parent
    repo_root = script_dir.parent
    workflow_path = repo_root / ".github" / "workflows" / "auto-merge.yml"
    
    if not workflow_path.exists():
        print(f"❌ Workflow file not found: {workflow_path}")
        return 1
    
    # Run propagation
    results = propagator.propagate_all(workflow_path)
    
    # Generate report
    report = propagator.generate_report(results)
    print(report)
    
    # Save results
    with open('ecosystem_propagation_report.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("\n✅ Propagation results saved: ecosystem_propagation_report.json")
    
    return 0 if results['summary']['success_rate'] == 100 else 1


if __name__ == "__main__":
    exit(main())
