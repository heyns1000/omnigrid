#!/usr/bin/env python3
"""
HotStack Ecosystem Automation Audit

Comprehensive audit of all automation scripts, workflows, and configurations
across the entire HotStack ecosystem.

Author: Fruitful Holdings (Pty) Ltd
Date: December 29, 2025
"""

import json
import os
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any


class EcosystemAudit:
    """Audit automation across all HotStack repositories"""

    def __init__(self):
        self.audit_results = {
            "timestamp": datetime.utcnow().isoformat(),
            "repositories_audited": [],
            "automation_scripts": [],
            "github_actions": [],
            "security_issues": [],
            "recommendations": [],
            "statistics": {}
        }

        self.repo_paths = {
            "omnigrid": ".",
            "hotstack": "/tmp/ecosystem-sync/repos/hotstack",
            "nexus-nair": "/tmp/ecosystem-sync/repos/nexus-nair",
            "vaultmesh": "/tmp/ecosystem-sync/repos/vaultmesh",
            "buildnest": "/tmp/ecosystem-sync/repos/buildnest",
            "codenest": "/tmp/ecosystem-sync/repos/codenest",
            "seedwave": "/tmp/ecosystem-sync/repos/seedwave",
            "banimal": "/tmp/ecosystem-sync/repos/banimal",
            "faa.zone": "/tmp/ecosystem-sync/repos/faa.zone"
        }

        self.automation_patterns = [
            "**/*.sh",
            "**/*.py",
            "**/deploy*",
            "**/build*",
            "**/*automation*",
            "**/*sync*",
            ".github/workflows/*.yml",
            ".github/workflows/*.yaml"
        ]

    def scan_directory(self, path: Path, patterns: List[str]) -> List[Path]:
        """Scan directory for files matching patterns"""
        found_files = []

        for pattern in patterns:
            try:
                found_files.extend(path.glob(pattern))
            except Exception as e:
                print(f"  Warning: Could not scan pattern {pattern}: {e}")

        return list(set(found_files))  # Remove duplicates

    def analyze_script(self, script_path: Path) -> Dict[str, Any]:
        """Analyze a single automation script"""
        analysis = {
            "path": str(script_path),
            "name": script_path.name,
            "type": script_path.suffix,
            "size": script_path.stat().st_size,
            "executable": os.access(script_path, os.X_OK),
            "issues": []
        }

        try:
            content = script_path.read_text()

            # Check for common issues
            if "password" in content.lower() or "secret" in content.lower():
                analysis["issues"].append("⚠️ Contains potential hardcoded credentials")

            if "rm -rf" in content and not "# safe" in content:
                analysis["issues"].append("⚠️ Contains dangerous rm -rf command")

            if script_path.suffix == ".sh" and not content.startswith("#!"):
                analysis["issues"].append("⚠️ Missing shebang")

            if script_path.suffix == ".py" and not content.startswith("#!"):
                analysis["issues"].append("⚠️ Missing shebang")

            # Check size
            if analysis["size"] == 0:
                analysis["issues"].append("⚠️ Empty file")
            elif analysis["size"] > 100000:  # 100KB
                analysis["issues"].append("ℹ️ Large file (>100KB)")

            # Check executability
            if script_path.suffix in [".sh", ".py"] and not analysis["executable"]:
                analysis["issues"].append("ℹ️ Not executable")

            analysis["line_count"] = len(content.splitlines())

        except Exception as e:
            analysis["issues"].append(f"❌ Could not read file: {e}")

        return analysis

    def audit_repository(self, repo_name: str, repo_path: str):
        """Audit a single repository"""
        print(f"\n🔍 Auditing {repo_name}...")

        path = Path(repo_path)

        if not path.exists():
            print(f"  ⚠️ Repository not found: {repo_path}")
            self.audit_results["repositories_audited"].append({
                "name": repo_name,
                "status": "not_found",
                "path": repo_path
            })
            return

        # Find automation scripts
        automation_files = self.scan_directory(path, self.automation_patterns)

        repo_audit = {
            "name": repo_name,
            "path": repo_path,
            "status": "audited",
            "automation_count": len(automation_files),
            "scripts": []
        }

        # Analyze each script
        for script in automation_files:
            if script.is_file():
                analysis = self.analyze_script(script)
                repo_audit["scripts"].append(analysis)
                self.audit_results["automation_scripts"].append({
                    "repository": repo_name,
                    **analysis
                })

        self.audit_results["repositories_audited"].append(repo_audit)

        print(f"  ✅ Found {len(automation_files)} automation files")

        # Count issues
        issues = sum(len(s.get("issues", [])) for s in repo_audit["scripts"])
        if issues > 0:
            print(f"  ⚠️ {issues} issues detected")

    def check_github_actions(self):
        """Check GitHub Actions workflows in current repo"""
        print("\n🔍 Checking GitHub Actions workflows...")

        workflows_dir = Path(".github/workflows")

        if not workflows_dir.exists():
            print("  ℹ️ No .github/workflows directory found")
            return

        workflows = list(workflows_dir.glob("*.yml")) + list(workflows_dir.glob("*.yaml"))

        print(f"  ✅ Found {len(workflows)} workflow(s)")

        for workflow in workflows:
            workflow_info = {
                "name": workflow.name,
                "path": str(workflow),
                "size": workflow.stat().st_size,
                "issues": []
            }

            try:
                content = workflow.read_text()

                # Check for best practices
                if "secrets." in content:
                    workflow_info["uses_secrets"] = True

                if "schedule:" in content:
                    workflow_info["has_schedule"] = True

                if "workflow_dispatch:" in content:
                    workflow_info["manual_trigger"] = True

                workflow_info["line_count"] = len(content.splitlines())

            except Exception as e:
                workflow_info["issues"].append(f"Could not read: {e}")

            self.audit_results["github_actions"].append(workflow_info)

    def generate_statistics(self):
        """Generate audit statistics"""
        print("\n📊 Generating statistics...")

        total_scripts = len(self.audit_results["automation_scripts"])
        total_workflows = len(self.audit_results["github_actions"])

        # Count by type
        script_types = {}
        for script in self.audit_results["automation_scripts"]:
            script_type = script.get("type", "unknown")
            script_types[script_type] = script_types.get(script_type, 0) + 1

        # Count issues
        total_issues = sum(
            len(script.get("issues", []))
            for script in self.audit_results["automation_scripts"]
        )

        # Executable count
        executable_count = sum(
            1 for script in self.audit_results["automation_scripts"]
            if script.get("executable", False)
        )

        self.audit_results["statistics"] = {
            "total_repositories": len(self.repo_paths),
            "repositories_audited": len(self.audit_results["repositories_audited"]),
            "total_automation_scripts": total_scripts,
            "total_github_actions": total_workflows,
            "script_types": script_types,
            "total_issues": total_issues,
            "executable_scripts": executable_count,
            "non_executable_scripts": total_scripts - executable_count
        }

        print(f"  ✅ Statistics generated")

    def generate_recommendations(self):
        """Generate recommendations based on audit"""
        print("\n💡 Generating recommendations...")

        recommendations = []

        # Check for missing executables
        non_exec = self.audit_results["statistics"]["non_executable_scripts"]
        if non_exec > 0:
            recommendations.append({
                "priority": "medium",
                "category": "permissions",
                "issue": f"{non_exec} scripts are not executable",
                "recommendation": "Run: chmod +x <script_name> for executable scripts",
                "impact": "Scripts may fail to run directly"
            })

        # Check for scripts with issues
        total_issues = self.audit_results["statistics"]["total_issues"]
        if total_issues > 10:
            recommendations.append({
                "priority": "high",
                "category": "code_quality",
                "issue": f"{total_issues} issues found across automation scripts",
                "recommendation": "Review and fix flagged issues",
                "impact": "Potential security or reliability problems"
            })

        # Check for GitHub Actions
        if self.audit_results["statistics"]["total_github_actions"] == 0:
            recommendations.append({
                "priority": "low",
                "category": "automation",
                "issue": "No GitHub Actions workflows found",
                "recommendation": "Consider setting up CI/CD with GitHub Actions",
                "impact": "Manual deployment processes"
            })

        # Check pulse system
        pulse_found = any(
            "pulse" in s.get("name", "").lower()
            for s in self.audit_results["automation_scripts"]
        )

        if pulse_found:
            recommendations.append({
                "priority": "info",
                "category": "ecosystem",
                "issue": "Pulse engine detected",
                "recommendation": "Ensure pulse_update.yml workflow is enabled",
                "impact": "Live GitHub profile updates"
            })

        self.audit_results["recommendations"] = recommendations

        print(f"  ✅ {len(recommendations)} recommendations generated")

    def save_report(self, filename: str = "automation_audit_report.json"):
        """Save audit report to file"""
        report_path = Path(filename)

        with open(report_path, 'w') as f:
            json.dump(self.audit_results, f, indent=2)

        print(f"\n💾 Audit report saved: {report_path}")

        return report_path

    def print_summary(self):
        """Print audit summary"""
        stats = self.audit_results["statistics"]

        print("\n" + "=" * 70)
        print("AUDIT SUMMARY")
        print("=" * 70)

        print(f"\n📊 Statistics:")
        print(f"  Total Repositories: {stats['total_repositories']}")
        print(f"  Repositories Audited: {stats['repositories_audited']}")
        print(f"  Automation Scripts: {stats['total_automation_scripts']}")
        print(f"  GitHub Actions: {stats['total_github_actions']}")
        print(f"  Total Issues: {stats['total_issues']}")

        print(f"\n📝 Script Types:")
        for script_type, count in stats['script_types'].items():
            print(f"  {script_type}: {count}")

        print(f"\n⚡ Executability:")
        print(f"  Executable: {stats['executable_scripts']}")
        print(f"  Non-executable: {stats['non_executable_scripts']}")

        if self.audit_results["recommendations"]:
            print(f"\n💡 Recommendations: {len(self.audit_results['recommendations'])}")
            for rec in self.audit_results["recommendations"]:
                priority_emoji = {
                    "high": "🔴",
                    "medium": "🟡",
                    "low": "🟢",
                    "info": "ℹ️"
                }.get(rec["priority"], "📌")

                print(f"  {priority_emoji} [{rec['priority'].upper()}] {rec['issue']}")
                print(f"     → {rec['recommendation']}")

        print("\n" + "=" * 70)

    def run(self):
        """Run complete audit"""
        print("🚀 Starting HotStack Ecosystem Automation Audit...")
        print("=" * 70)

        # Audit local repository (omnigrid)
        self.audit_repository("omnigrid", ".")

        # Audit GitHub Actions
        self.check_github_actions()

        # Note: Other repos would need to be cloned first
        # User can run ecosystem_sync.sh to clone all repos

        # Generate statistics
        self.generate_statistics()

        # Generate recommendations
        self.generate_recommendations()

        # Save report
        self.save_report()

        # Print summary
        self.print_summary()

        print("\n✅ Audit complete!")


def main():
    """Main entry point"""
    auditor = EcosystemAudit()
    auditor.run()


if __name__ == "__main__":
    main()
