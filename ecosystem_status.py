#!/usr/bin/env python3
"""
HotStack Ecosystem Status Monitor

Real-time status dashboard for all ecosystem repositories.

Author: Fruitful Holdings (Pty) Ltd
Date: December 29, 2025
"""

import json
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

# Repository configuration
REPOS = [
    "omnigrid", "hotstack", "nexus-nair", "vaultmesh",
    "buildnest", "codenest", "seedwave", "banimal", "faa.zone"
]

GITHUB_USER = "heyns1000"


class EcosystemMonitor:
    """Monitor status across all ecosystem repositories."""

    def __init__(self, repos_path: str = "/tmp/ecosystem-sync/repos"):
        self.repos_path = Path(repos_path)
        self.status_data = {}

    def run_git_command(self, repo_path: Path, args: List[str]) -> Optional[str]:
        """Run a git command and return output."""
        try:
            result = subprocess.run(
                ["git"] + args,
                cwd=repo_path,
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout.strip()
        except subprocess.CalledProcessError:
            return None

    def get_repo_status(self, repo_name: str) -> Dict:
        """Get status for a single repository."""
        repo_path = self.repos_path / repo_name

        if not repo_path.exists():
            return {
                "name": repo_name,
                "status": "NOT_CLONED",
                "exists": False
            }

        # Get current branch
        current_branch = self.run_git_command(repo_path, ["branch", "--show-current"])

        # Get commit count
        commit_count = self.run_git_command(repo_path, ["rev-list", "--count", "HEAD"])

        # Get last commit info
        last_commit_hash = self.run_git_command(repo_path, ["log", "-1", "--format=%h"])
        last_commit_date = self.run_git_command(repo_path, ["log", "-1", "--format=%ar"])
        last_commit_msg = self.run_git_command(repo_path, ["log", "-1", "--format=%s"])

        # Get all branches
        all_branches = self.run_git_command(repo_path, ["branch", "-a"])
        branch_count = len(all_branches.split("\n")) if all_branches else 0

        # Check if working tree is clean
        status_output = self.run_git_command(repo_path, ["status", "--short"])
        is_clean = len(status_output) == 0 if status_output is not None else False

        return {
            "name": repo_name,
            "status": "CLEAN" if is_clean else "MODIFIED",
            "exists": True,
            "current_branch": current_branch,
            "total_commits": commit_count,
            "total_branches": branch_count,
            "last_commit": {
                "hash": last_commit_hash,
                "date": last_commit_date,
                "message": last_commit_msg
            },
            "path": str(repo_path)
        }

    def scan_ecosystem(self):
        """Scan all repositories and collect status."""
        print("🔍 Scanning HotStack Ecosystem...\n")

        for repo in REPOS:
            status = self.get_repo_status(repo)
            self.status_data[repo] = status

            # Print status line
            emoji = "✅" if status.get("exists") and status.get("status") == "CLEAN" else "⚠️"
            exists_str = "exists" if status.get("exists") else "missing"

            print(f"{emoji} {repo:20} - {exists_str:10} - {status.get('current_branch', 'N/A')}")

    def print_summary(self):
        """Print ecosystem summary."""
        total = len(REPOS)
        cloned = sum(1 for s in self.status_data.values() if s.get("exists"))
        clean = sum(1 for s in self.status_data.values() if s.get("status") == "CLEAN")

        print(f"\n{'='*60}")
        print("ECOSYSTEM SUMMARY")
        print(f"{'='*60}")
        print(f"Total Repositories:  {total}")
        print(f"Cloned:             {cloned}")
        print(f"Clean Working Tree: {clean}")
        print(f"Modified:           {cloned - clean}")
        print(f"{'='*60}\n")

    def generate_report(self):
        """Generate detailed markdown report."""
        report = []

        report.append("# HotStack Ecosystem Status Report\n")
        report.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        report.append(f"**Scanned Repositories:** {len(REPOS)}\n")
        report.append("\n---\n\n")

        for repo_name, status in self.status_data.items():
            report.append(f"## {repo_name}\n")

            if not status.get("exists"):
                report.append("**Status:** ⚠️ Not Cloned\n\n")
                continue

            report.append(f"**Status:** {'✅ Clean' if status.get('status') == 'CLEAN' else '⚠️ Modified'}\n")
            report.append(f"**Current Branch:** `{status.get('current_branch')}`\n")
            report.append(f"**Total Commits:** {status.get('total_commits')}\n")
            report.append(f"**Total Branches:** {status.get('total_branches')}\n")

            if status.get("last_commit"):
                lc = status["last_commit"]
                report.append(f"**Last Commit:**\n")
                report.append(f"- Hash: `{lc.get('hash')}`\n")
                report.append(f"- Date: {lc.get('date')}\n")
                report.append(f"- Message: {lc.get('message')}\n")

            report.append("\n")

        return "".join(report)

    def save_report(self, filename: str = "ecosystem_status_report.md"):
        """Save status report to file."""
        report_content = self.generate_report()
        report_path = Path.home() / filename

        with open(report_path, "w") as f:
            f.write(report_content)

        print(f"📄 Report saved to: {report_path}")

        # Also save JSON
        json_path = Path.home() / "ecosystem_status.json"
        with open(json_path, "w") as f:
            json.dump(self.status_data, f, indent=2)

        print(f"📊 JSON data saved to: {json_path}")


def main():
    """Main entry point."""
    monitor = EcosystemMonitor()

    print("\n" + "="*60)
    print("  HotStack Ecosystem Status Monitor")
    print("="*60 + "\n")

    monitor.scan_ecosystem()
    monitor.print_summary()
    monitor.save_report()


if __name__ == "__main__":
    main()
