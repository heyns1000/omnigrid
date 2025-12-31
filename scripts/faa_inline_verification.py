#!/usr/bin/env python3
"""
FAA Inline Verification™ - CI Orchestration Script Validator
Validates CI workflows for security, safety, and compliance
"""

import yaml
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple
from datetime import datetime, timezone


class FAAInlineVerification:
    """FAA Actuary Mastery™ Inline Verification System"""
    
    def __init__(self):
        self.violations = []
        self.warnings = []
        self.passed_checks = []
        
        # Security patterns to detect
        self.unsafe_patterns = [
            (r'\$\{\{.*secrets\..*\}\}.*\|.*sh', "Secret potentially exposed to shell"),
            (r'git\s+push.*--force[^-]', "Force push without --force-with-lease"),
            (r'curl.*\|.*sh', "Piping curl to shell (unsafe)"),
            (r'eval\s+\$', "Using eval with variables (unsafe)"),
            (r'rm\s+-rf\s+/', "Dangerous recursive delete from root"),
        ]
        
        # Required security features
        self.required_features = [
            "permissions",  # Explicit permissions required
            "on",          # Trigger definition required
        ]
    
    def verify_workflow(self, workflow_path: Path) -> Dict:
        """Verify a single workflow file"""
        print(f"\n🔍 Verifying: {workflow_path.name}")
        
        with open(workflow_path, 'r') as f:
            content = f.read()
        
        try:
            workflow = yaml.safe_load(content)
        except yaml.YAMLError as e:
            return {
                "file": str(workflow_path),
                "status": "ERROR",
                "error": f"Invalid YAML: {e}"
            }
        
        # Run verification checks
        self.check_permissions(workflow, workflow_path.name)
        self.check_secrets_usage(content, workflow_path.name)
        self.check_unsafe_patterns(content, workflow_path.name)
        self.check_branch_protection(workflow, workflow_path.name)
        self.check_required_checks(workflow, workflow_path.name)
        
        return {
            "file": str(workflow_path),
            "status": "VERIFIED" if len(self.violations) == 0 else "FAILED",
            "violations": len(self.violations),
            "warnings": len(self.warnings),
            "passed": len(self.passed_checks)
        }
    
    def check_permissions(self, workflow: Dict, filename: str):
        """Verify explicit permissions are defined"""
        jobs = workflow.get('jobs', {})
        
        for job_name, job_config in jobs.items():
            if 'permissions' not in job_config and 'permissions' not in workflow:
                self.warnings.append({
                    "file": filename,
                    "job": job_name,
                    "issue": "No explicit permissions defined (uses defaults)",
                    "severity": "WARNING"
                })
            else:
                self.passed_checks.append(f"{filename}:{job_name} - Permissions defined")
    
    def check_secrets_usage(self, content: str, filename: str):
        """Check for unsafe secret handling"""
        # Find all secret references
        secret_refs = re.findall(r'\$\{\{\s*secrets\.(\w+)\s*\}\}', content)
        
        for secret in secret_refs:
            # Check if secret is used in potentially unsafe contexts
            pattern = r'\$\{\{\s*secrets\.' + re.escape(secret) + r'\s*\}\}[^}]*\|'
            if re.search(pattern, content):
                self.violations.append({
                    "file": filename,
                    "issue": f"Secret '{secret}' may be exposed via pipe",
                    "severity": "CRITICAL"
                })
            else:
                self.passed_checks.append(f"{filename} - Secret '{secret}' handled safely")
    
    def check_unsafe_patterns(self, content: str, filename: str):
        """Check for unsafe command patterns"""
        for pattern, description in self.unsafe_patterns:
            matches = re.findall(pattern, content, re.MULTILINE)
            if matches:
                self.violations.append({
                    "file": filename,
                    "issue": description,
                    "pattern": pattern,
                    "matches": len(matches),
                    "severity": "HIGH"
                })
            else:
                self.passed_checks.append(f"{filename} - No '{description}' detected")
    
    def check_branch_protection(self, workflow: Dict, filename: str):
        """Verify branch protection compliance"""
        on_config = workflow.get('on', {})
        
        if isinstance(on_config, dict):
            push_config = on_config.get('push', {})
            if isinstance(push_config, dict):
                branches = push_config.get('branches', [])
                
                # Check if main branch is protected
                if 'main' in branches or 'master' in branches:
                    self.warnings.append({
                        "file": filename,
                        "issue": "Workflow triggers on main/master push (ensure branch protection is enabled)",
                        "severity": "WARNING"
                    })
                else:
                    self.passed_checks.append(f"{filename} - No direct main branch triggers")
    
    def check_required_checks(self, workflow: Dict, filename: str):
        """Verify required CI checks are present"""
        if filename == "ci-validation.yml":
            jobs = workflow.get('jobs', {})
            
            required_jobs = [
                'validation',
                'performance-validation',
                'security-validation',
                'comprehensive-validation'
            ]
            
            for required_job in required_jobs:
                if required_job in jobs:
                    self.passed_checks.append(f"{filename} - Required job '{required_job}' present")
                else:
                    self.violations.append({
                        "file": filename,
                        "issue": f"Required job '{required_job}' missing",
                        "severity": "HIGH"
                    })
    
    def verify_ecosystem(self, workflows_dir: Path) -> Dict:
        """Verify all workflows in the ecosystem"""
        print("=" * 70)
        print("🔒 FAA Inline Verification™ - CI Orchestration Validator")
        print("   FAA Actuary Mastery™ | Ecosystem Sync v2.2.1")
        print("=" * 70)
        
        workflow_files = list(workflows_dir.glob("*.yml")) + list(workflows_dir.glob("*.yaml"))
        
        results = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "version": "2.2.1",
            "workflows_verified": len(workflow_files),
            "results": []
        }
        
        for workflow_file in workflow_files:
            # Reset counters for each file
            self.violations = []
            self.warnings = []
            self.passed_checks = []
            
            result = self.verify_workflow(workflow_file)
            results["results"].append(result)
        
        # Aggregate results
        results["summary"] = {
            "total_violations": sum(r.get("violations", 0) for r in results["results"]),
            "total_warnings": sum(r.get("warnings", 0) for r in results["results"]),
            "total_passed": sum(r.get("passed", 0) for r in results["results"]),
            "status": "VERIFIED" if sum(r.get("violations", 0) for r in results["results"]) == 0 else "FAILED"
        }
        
        return results
    
    def generate_report(self, results: Dict) -> str:
        """Generate human-readable verification report"""
        report = []
        report.append("=" * 70)
        report.append("🔒 FAA INLINE VERIFICATION™ REPORT")
        report.append("=" * 70)
        report.append(f"\nTimestamp: {results['timestamp']}")
        report.append(f"Version: {results['version']}")
        report.append(f"Workflows Verified: {results['workflows_verified']}")
        report.append("\n" + "-" * 70)
        report.append("SUMMARY")
        report.append("-" * 70)
        
        summary = results['summary']
        report.append(f"\nTotal Violations: {summary['total_violations']}")
        report.append(f"Total Warnings: {summary['total_warnings']}")
        report.append(f"Total Passed Checks: {summary['total_passed']}")
        report.append(f"\nOverall Status: {summary['status']}")
        
        report.append("\n" + "-" * 70)
        report.append("WORKFLOW DETAILS")
        report.append("-" * 70)
        
        for result in results['results']:
            status_icon = "✅" if result['status'] == "VERIFIED" else "❌"
            report.append(f"\n{status_icon} {Path(result['file']).name}")
            report.append(f"   Status: {result['status']}")
            if result.get('violations', 0) > 0:
                report.append(f"   Violations: {result['violations']}")
            if result.get('warnings', 0) > 0:
                report.append(f"   Warnings: {result['warnings']}")
            report.append(f"   Passed Checks: {result['passed']}")
        
        report.append("\n" + "=" * 70)
        
        if summary['status'] == "VERIFIED":
            report.append("✅ ALL WORKFLOWS VERIFIED - CI ORCHESTRATION SAFE")
        else:
            report.append("❌ VERIFICATION FAILED - REVIEW VIOLATIONS")
        
        report.append("=" * 70)
        
        return "\n".join(report)


def main():
    """Main verification execution"""
    verifier = FAAInlineVerification()
    
    # Use relative path for portability
    script_dir = Path(__file__).resolve().parent
    repo_root = script_dir.parent
    workflows_dir = repo_root / ".github" / "workflows"
    
    if not workflows_dir.exists():
        print(f"❌ Workflows directory not found: {workflows_dir}")
        return 1
    
    # Run verification
    results = verifier.verify_ecosystem(workflows_dir)
    
    # Generate report
    report = verifier.generate_report(results)
    print(report)
    
    # Save results
    with open('faa_inline_verification_report.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("\n✅ Verification results saved: faa_inline_verification_report.json")
    
    # Return exit code based on status
    return 0 if results['summary']['status'] == "VERIFIED" else 1


if __name__ == "__main__":
    exit(main())
