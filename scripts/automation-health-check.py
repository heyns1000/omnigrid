#!/usr/bin/env python3
"""
Automation Health Check and Monitoring
Monitors status of automation workflows and provides health metrics
Per PR #35 recommendations for comprehensive monitoring
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any

try:
    from github import Github, GithubException
    GITHUB_AVAILABLE = True
except ImportError:
    GITHUB_AVAILABLE = False
    print("⚠️  PyGithub not available, some checks will be skipped")

class HealthCheckReport:
    """Health check report per PR #35 monitoring recommendations"""
    
    def __init__(self):
        self.timestamp = datetime.now()
        self.checks = []
        self.warnings = []
        self.errors = []
        self.metrics = {}
        
    def add_check(self, name: str, status: str, message: str = ""):
        """Add a health check result"""
        self.checks.append({
            "name": name,
            "status": status,
            "message": message,
            "timestamp": datetime.now().isoformat()
        })
        
        if status == "warning":
            self.warnings.append(f"{name}: {message}")
        elif status == "error":
            self.errors.append(f"{name}: {message}")
    
    def add_metric(self, name: str, value: Any):
        """Add a metric"""
        self.metrics[name] = value
    
    def is_healthy(self) -> bool:
        """Check if system is healthy (no errors)"""
        return len(self.errors) == 0
    
    def to_dict(self) -> Dict:
        """Export as dictionary"""
        return {
            "timestamp": self.timestamp.isoformat(),
            "healthy": self.is_healthy(),
            "checks": self.checks,
            "warnings": self.warnings,
            "errors": self.errors,
            "metrics": self.metrics,
            "summary": {
                "total_checks": len(self.checks),
                "passed": len([c for c in self.checks if c["status"] == "ok"]),
                "warnings": len(self.warnings),
                "errors": len(self.errors)
            }
        }
    
    def save(self, output_file: str = "automation_health.json"):
        """Save report to file"""
        try:
            with open(output_file, 'w') as f:
                json.dump(self.to_dict(), f, indent=2)
            print(f"📊 Health report saved to {output_file}")
        except Exception as e:
            print(f"⚠️  Could not save health report: {e}")

def check_config_files(report: HealthCheckReport):
    """Check if required configuration files exist"""
    required_files = [
        "config/ecosystem-repos.json",
        ".github/workflows/auto-approve-copilot.yml",
        ".github/workflows/auto-merge-ecosystem.yml",
        ".github/workflows/ecosystem-sync-monitor.yml"
    ]
    
    for file_path in required_files:
        path = Path(file_path)
        if path.exists():
            report.add_check(
                f"Config file: {file_path}",
                "ok",
                "File exists"
            )
        else:
            report.add_check(
                f"Config file: {file_path}",
                "warning",
                "File not found"
            )

def check_metrics_file(report: HealthCheckReport):
    """Check if metrics file exists and is recent"""
    metrics_file = Path("automation_metrics.json")
    
    if not metrics_file.exists():
        report.add_check(
            "Metrics file",
            "warning",
            "No metrics file found - automation may not have run yet"
        )
        return
    
    try:
        with open(metrics_file) as f:
            metrics = json.load(f)
        
        # Check if metrics are recent (within last 24 hours)
        if "start_time" in metrics:
            start_time = datetime.fromisoformat(metrics["start_time"])
            age_hours = (datetime.now() - start_time).total_seconds() / 3600
            
            if age_hours < 24:
                report.add_check(
                    "Metrics freshness",
                    "ok",
                    f"Metrics updated {age_hours:.1f} hours ago"
                )
            else:
                report.add_check(
                    "Metrics freshness",
                    "warning",
                    f"Metrics are {age_hours:.1f} hours old"
                )
        
        # Check success rate
        if "success_rate" in metrics:
            success_rate = metrics["success_rate"]
            report.add_metric("automation_success_rate", success_rate)
            
            if success_rate >= 90:
                report.add_check(
                    "Success rate",
                    "ok",
                    f"{success_rate:.1f}% success rate"
                )
            elif success_rate >= 70:
                report.add_check(
                    "Success rate",
                    "warning",
                    f"{success_rate:.1f}% success rate (below 90%)"
                )
            else:
                report.add_check(
                    "Success rate",
                    "error",
                    f"{success_rate:.1f}% success rate (below 70%)"
                )
        
        # Add other metrics
        for key in ["repos_scanned", "branches_analyzed", "prs_created", "errors_encountered"]:
            if key in metrics:
                report.add_metric(key, metrics[key])
        
    except Exception as e:
        report.add_check(
            "Metrics file",
            "error",
            f"Could not parse metrics: {e}"
        )

def check_github_access(report: HealthCheckReport):
    """Check GitHub API access and rate limits"""
    if not GITHUB_AVAILABLE:
        report.add_check(
            "GitHub access",
            "warning",
            "PyGithub not available"
        )
        return
    
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        report.add_check(
            "GitHub access",
            "error",
            "GITHUB_TOKEN environment variable not set"
        )
        return
    
    try:
        g = Github(token)
        rate_limit = g.get_rate_limit()
        
        remaining = rate_limit.core.remaining
        limit = rate_limit.core.limit
        percentage = (remaining / limit) * 100
        
        report.add_metric("github_rate_limit_remaining", remaining)
        report.add_metric("github_rate_limit_total", limit)
        report.add_metric("github_rate_limit_percentage", percentage)
        
        if percentage > 50:
            report.add_check(
                "GitHub rate limit",
                "ok",
                f"{remaining}/{limit} API calls remaining ({percentage:.1f}%)"
            )
        elif percentage > 20:
            report.add_check(
                "GitHub rate limit",
                "warning",
                f"{remaining}/{limit} API calls remaining ({percentage:.1f}%)"
            )
        else:
            report.add_check(
                "GitHub rate limit",
                "error",
                f"Low rate limit: {remaining}/{limit} ({percentage:.1f}%)"
            )
        
        # Check when rate limit resets
        reset_time = rate_limit.core.reset
        time_until_reset = (reset_time - datetime.now()).total_seconds() / 60
        report.add_metric("rate_limit_reset_minutes", time_until_reset)
        
    except GithubException as e:
        report.add_check(
            "GitHub access",
            "error",
            f"GitHub API error: {e}"
        )
    except Exception as e:
        report.add_check(
            "GitHub access",
            "error",
            f"Could not check GitHub access: {e}"
        )

def check_script_permissions(report: HealthCheckReport):
    """Check if automation scripts have execute permissions"""
    scripts = [
        "scripts/pulse-trade-metrics.py",
        "scripts/mr-actuary-conflict-resolver.py",
        "scripts/validate-automation-config.py"
    ]
    
    for script_path in scripts:
        path = Path(script_path)
        if not path.exists():
            report.add_check(
                f"Script: {script_path}",
                "warning",
                "Script not found"
            )
            continue
        
        # Check if executable
        if os.access(path, os.X_OK):
            report.add_check(
                f"Script: {script_path}",
                "ok",
                "Executable"
            )
        else:
            report.add_check(
                f"Script: {script_path}",
                "warning",
                "Not executable (may need chmod +x)"
            )

def main():
    """Main health check function"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Check health of automation system"
    )
    parser.add_argument(
        "--output",
        default="automation_health.json",
        help="Output file for health report"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Show detailed output"
    )
    
    args = parser.parse_args()
    
    print("🏥 Running automation health checks...\n")
    
    report = HealthCheckReport()
    
    # Run all checks
    check_config_files(report)
    check_metrics_file(report)
    check_github_access(report)
    check_script_permissions(report)
    
    # Save report
    report.save(args.output)
    
    # Print summary
    print(f"\n{'='*60}")
    print(f"Health Check Summary")
    print(f"{'='*60}")
    print(f"Timestamp: {report.timestamp.isoformat()}")
    print(f"Total checks: {len(report.checks)}")
    print(f"Passed: {len([c for c in report.checks if c['status'] == 'ok'])}")
    print(f"Warnings: {len(report.warnings)}")
    print(f"Errors: {len(report.errors)}")
    print(f"Overall status: {'✅ HEALTHY' if report.is_healthy() else '❌ UNHEALTHY'}")
    
    if args.verbose or report.warnings or report.errors:
        print(f"\n{'='*60}")
        print("Check Results:")
        print(f"{'='*60}")
        for check in report.checks:
            icon = "✅" if check["status"] == "ok" else "⚠️" if check["status"] == "warning" else "❌"
            print(f"{icon} {check['name']}: {check['message']}")
    
    if report.metrics:
        print(f"\n{'='*60}")
        print("Metrics:")
        print(f"{'='*60}")
        for key, value in report.metrics.items():
            print(f"  {key}: {value}")
    
    # Exit with appropriate code
    if not report.is_healthy():
        sys.exit(1)
    
    sys.exit(0)

if __name__ == "__main__":
    main()
