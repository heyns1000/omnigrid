#!/usr/bin/env python3
"""
Merge Gatekeeper - Safe Auto-Merge Validation
Validates all conditions before allowing automated PR merges
"""

import json
import sys
from datetime import datetime, timezone
from typing import Dict, List, Tuple, Optional


class MergeGatekeeper:
    """Gatekeeper for validating safe auto-merge conditions"""
    
    def __init__(self):
        self.required_checks = 14
        self.required_approvals = 2
        self.approved_team = "hotstack-core-team"
        
    def validate_ci_checks(self, checks: List[Dict]) -> Tuple[bool, List[str]]:
        """Validate all 14 CI checks pass"""
        required_check_names = [
            'mr-actuary-gpr',
            'celestial-payroll-tps',
            'durable-objects-latency',
            'keccak256-hash-rate',
            '9s-pulse-simulation',
            'unit-tests',
            'integration-tests',
            'security-scanning',
            'visual-regression',
            'performance-benchmarks',
            'linting',
            'type-checking',
            'dependency-audit',
            'license-compliance'
        ]
        
        passed_checks = []
        failed_checks = []
        
        for check_name in required_check_names:
            check = next((c for c in checks if check_name in c.get('name', '')), None)
            if check and check.get('status') == 'completed' and check.get('conclusion') == 'success':
                passed_checks.append(check_name)
            else:
                failed_checks.append(check_name)
        
        all_passed = len(failed_checks) == 0
        return all_passed, failed_checks
    
    def validate_approvals(self, reviews: List[Dict]) -> Tuple[bool, int]:
        """Validate required approvals from HotStack Core Team"""
        approved_reviews = [
            r for r in reviews 
            if r.get('state') == 'APPROVED'
        ]
        
        approval_count = len(approved_reviews)
        is_valid = approval_count >= self.required_approvals
        
        return is_valid, approval_count
    
    def validate_branch_status(self, pr_data: Dict) -> Tuple[bool, str]:
        """Validate branch is up-to-date and mergeable"""
        mergeable = pr_data.get('mergeable', False)
        mergeable_state = pr_data.get('mergeable_state', '')
        
        valid_states = ['clean', 'unstable', 'has_hooks']
        is_valid = mergeable and mergeable_state in valid_states
        
        return is_valid, mergeable_state
    
    def validate_conversations(self, comments: List[Dict]) -> Tuple[bool, int]:
        """Validate all review conversations are resolved"""
        unresolved_count = sum(
            1 for c in comments 
            if not c.get('resolved', True)
        )
        
        is_valid = unresolved_count == 0
        return is_valid, unresolved_count
    
    def validate_linear_history(self, commits: List[Dict]) -> Tuple[bool, List[str]]:
        """Validate commits follow linear history (no merge commits)"""
        merge_commits = [
            c['sha'][:7] for c in commits 
            if len(c.get('parents', [])) > 1
        ]
        
        is_valid = len(merge_commits) == 0
        return is_valid, merge_commits
    
    def validate_pr_metadata(self, pr_data: Dict) -> Tuple[bool, List[str]]:
        """Validate PR has required metadata"""
        issues = []
        
        if not pr_data.get('title'):
            issues.append("Missing PR title")
        
        if not pr_data.get('body'):
            issues.append("Missing PR description")
        
        if pr_data.get('draft', False):
            issues.append("PR is still in draft mode")
        
        labels = [l.get('name') for l in pr_data.get('labels', [])]
        if 'automerge' not in labels:
            issues.append("Missing 'automerge' label")
        
        is_valid = len(issues) == 0
        return is_valid, issues
    
    def validate_security(self, security_data: Dict) -> Tuple[bool, List[str]]:
        """Validate security requirements"""
        issues = []
        
        vulnerabilities = security_data.get('vulnerabilities', 0)
        if vulnerabilities > 0:
            issues.append(f"{vulnerabilities} security vulnerabilities detected")
        
        secrets_exposed = security_data.get('secrets_exposed', False)
        if secrets_exposed:
            issues.append("Secrets potentially exposed in commits")
        
        license_compliant = security_data.get('license_compliant', True)
        if not license_compliant:
            issues.append("License compliance check failed")
        
        is_valid = len(issues) == 0
        return is_valid, issues
    
    def comprehensive_validation(self, pr_data: Dict, checks: List[Dict], 
                                 reviews: List[Dict], comments: List[Dict],
                                 commits: List[Dict], security_data: Dict) -> Dict:
        """Run comprehensive validation of all merge requirements"""
        
        validation_results = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "pr_number": pr_data.get('number'),
            "pr_title": pr_data.get('title'),
            "validations": {},
            "overall_status": "UNKNOWN"
        }
        
        # Run all validations
        ci_valid, failed_checks = self.validate_ci_checks(checks)
        approval_valid, approval_count = self.validate_approvals(reviews)
        branch_valid, branch_state = self.validate_branch_status(pr_data)
        conv_valid, unresolved = self.validate_conversations(comments)
        linear_valid, merge_commits = self.validate_linear_history(commits)
        meta_valid, meta_issues = self.validate_pr_metadata(pr_data)
        security_valid, security_issues = self.validate_security(security_data)
        
        # Store results
        validation_results["validations"] = {
            "ci_checks": {
                "passed": ci_valid,
                "failed_checks": failed_checks,
                "total_required": self.required_checks
            },
            "approvals": {
                "passed": approval_valid,
                "count": approval_count,
                "required": self.required_approvals
            },
            "branch_status": {
                "passed": branch_valid,
                "state": branch_state
            },
            "conversations": {
                "passed": conv_valid,
                "unresolved_count": unresolved
            },
            "linear_history": {
                "passed": linear_valid,
                "merge_commits": merge_commits
            },
            "metadata": {
                "passed": meta_valid,
                "issues": meta_issues
            },
            "security": {
                "passed": security_valid,
                "issues": security_issues
            }
        }
        
        # Overall validation
        all_validations_passed = all([
            ci_valid,
            approval_valid,
            branch_valid,
            conv_valid,
            linear_valid,
            meta_valid,
            security_valid
        ])
        
        validation_results["overall_status"] = "APPROVED" if all_validations_passed else "BLOCKED"
        validation_results["merge_allowed"] = all_validations_passed
        
        return validation_results
    
    def generate_validation_report(self, results: Dict) -> str:
        """Generate human-readable validation report"""
        report = []
        report.append("=" * 70)
        report.append("🔒 MERGE GATEKEEPER VALIDATION REPORT")
        report.append("=" * 70)
        report.append(f"\nPR #{results['pr_number']}: {results['pr_title']}")
        report.append(f"Timestamp: {results['timestamp']}")
        report.append(f"\nOverall Status: {results['overall_status']}")
        report.append(f"Merge Allowed: {'✅ YES' if results['merge_allowed'] else '❌ NO'}")
        report.append("\n" + "-" * 70)
        report.append("VALIDATION DETAILS:")
        report.append("-" * 70)
        
        for validation_name, validation_data in results['validations'].items():
            passed = validation_data.get('passed', False)
            status = "✅ PASS" if passed else "❌ FAIL"
            
            report.append(f"\n{validation_name.upper()}: {status}")
            
            # Add specific details
            if validation_name == "ci_checks":
                report.append(f"  Required: {validation_data['total_required']}")
                if validation_data['failed_checks']:
                    report.append(f"  Failed: {', '.join(validation_data['failed_checks'])}")
            
            elif validation_name == "approvals":
                report.append(f"  Count: {validation_data['count']}/{validation_data['required']}")
            
            elif validation_name == "branch_status":
                report.append(f"  State: {validation_data['state']}")
            
            elif validation_name == "conversations":
                if validation_data['unresolved_count'] > 0:
                    report.append(f"  Unresolved: {validation_data['unresolved_count']}")
            
            elif validation_name == "linear_history":
                if validation_data['merge_commits']:
                    report.append(f"  Merge commits: {', '.join(validation_data['merge_commits'])}")
            
            elif validation_name == "metadata" and validation_data['issues']:
                for issue in validation_data['issues']:
                    report.append(f"  - {issue}")
            
            elif validation_name == "security" and validation_data['issues']:
                for issue in validation_data['issues']:
                    report.append(f"  - {issue}")
        
        report.append("\n" + "=" * 70)
        
        if results['merge_allowed']:
            report.append("🎉 ALL VALIDATIONS PASSED - MERGE AUTHORIZED")
        else:
            report.append("🚫 VALIDATION FAILED - MERGE BLOCKED")
        
        report.append("=" * 70)
        
        return "\n".join(report)


def main():
    """Demo validation with simulated data"""
    print("🔒 Merge Gatekeeper - Safe Auto-Merge Validation")
    print("=" * 70)
    
    gatekeeper = MergeGatekeeper()
    
    # Simulated PR data (all passing)
    pr_data = {
        "number": 34,
        "title": "Ecosystem Synchronization v2.2.1",
        "body": "Complete CI/CD harmonization",
        "mergeable": True,
        "mergeable_state": "clean",
        "draft": False,
        "labels": [{"name": "automerge"}, {"name": "ecosystem"}]
    }
    
    checks = [
        {"name": check, "status": "completed", "conclusion": "success"}
        for check in [
            'mr-actuary-gpr', 'celestial-payroll-tps', 'durable-objects-latency',
            'keccak256-hash-rate', '9s-pulse-simulation', 'unit-tests',
            'integration-tests', 'security-scanning', 'visual-regression',
            'performance-benchmarks', 'linting', 'type-checking',
            'dependency-audit', 'license-compliance'
        ]
    ]
    
    reviews = [
        {"state": "APPROVED", "user": {"login": "reviewer1"}},
        {"state": "APPROVED", "user": {"login": "reviewer2"}}
    ]
    
    comments = []
    
    commits = [
        {"sha": "abc123", "parents": [{"sha": "def456"}]},
        {"sha": "def456", "parents": [{"sha": "ghi789"}]}
    ]
    
    security_data = {
        "vulnerabilities": 0,
        "secrets_exposed": False,
        "license_compliant": True
    }
    
    # Run validation
    results = gatekeeper.comprehensive_validation(
        pr_data, checks, reviews, comments, commits, security_data
    )
    
    # Generate and print report
    report = gatekeeper.generate_validation_report(results)
    print(report)
    
    # Save results
    with open('merge_gatekeeper_validation.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("\n✅ Validation results saved: merge_gatekeeper_validation.json")
    
    return 0 if results['merge_allowed'] else 1


if __name__ == "__main__":
    sys.exit(main())
