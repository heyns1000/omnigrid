#!/usr/bin/env python3
"""
Security Validator for Zero-Touch Automation

Validates automation scripts for security vulnerabilities including:
- Command injection patterns
- Hardcoded credentials
- Dangerous commands
- Input validation issues

Author: Fruitful Holdings (Pty) Ltd
Date: January 2026
"""

import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple


class SecurityValidator:
    """Validates automation scripts for security issues"""

    def __init__(self):
        self.issues: List[Dict] = []
        
        # Security patterns to detect
        self.patterns = {
            "command_injection": [
                r'\$\([^)]*\$\{[^}]*\}',  # Nested command substitution
                r'eval\s+[\'"]?\$',  # eval with variables
                r'exec\s+[\'"]?\$',  # exec with variables
                r'system\s*\([\'"]?\$',  # system() with variables
                r'subprocess\.(call|run|Popen)\([^)]*\+[^)]*\)',  # String concatenation in subprocess
            ],
            "hardcoded_credentials": [
                r'password\s*=\s*[\'"][^\'"]+[\'"]',
                r'api_key\s*=\s*[\'"][^\'"]+[\'"]',
                r'secret\s*=\s*[\'"][^\'"]+[\'"]',
                r'token\s*=\s*[\'"][a-zA-Z0-9]{20,}[\'"]',
                r'AWS_SECRET_ACCESS_KEY\s*=\s*[\'"][^\'"]+[\'"]',
            ],
            "dangerous_commands": [
                r'rm\s+-rf\s+/(?!tmp|var/tmp)',  # rm -rf on root paths
                r'chmod\s+777',  # Overly permissive permissions
                r'sudo\s+rm',  # Sudo with rm
                r'dd\s+if=.*of=/dev/sd',  # Disk operations
            ],
            "sql_injection": [
                r'execute\s*\([\'"].*%s',  # String formatting in SQL
                r'cursor\.execute\([^)]*\+[^)]*\)',  # String concatenation in SQL
                r'query\s*=\s*[\'"].*[\'"].*\+',  # Query string concatenation
            ]
        }

    def scan_file(self, file_path: Path) -> List[Dict]:
        """Scan a single file for security issues"""
        issues = []
        
        try:
            content = file_path.read_text(encoding='utf-8', errors='ignore')
            lines = content.split('\n')
            
            for line_num, line in enumerate(lines, start=1):
                # Check each security pattern
                for category, patterns in self.patterns.items():
                    for pattern in patterns:
                        if re.search(pattern, line, re.IGNORECASE):
                            issues.append({
                                'file': str(file_path),
                                'line': line_num,
                                'category': category,
                                'pattern': pattern,
                                'content': line.strip()[:100]  # First 100 chars
                            })
        except Exception as e:
            print(f"Warning: Could not scan {file_path}: {e}")
        
        return issues

    def scan_directory(self, directory: Path, patterns: List[str] = None) -> List[Dict]:
        """Scan directory for automation scripts"""
        if patterns is None:
            patterns = ['**/*.py', '**/*.sh', '**/*.js', '**/*.ts']
        
        all_issues = []
        
        for pattern in patterns:
            for file_path in directory.glob(pattern):
                if self._should_scan(file_path):
                    issues = self.scan_file(file_path)
                    all_issues.extend(issues)
        
        return all_issues

    def _should_scan(self, file_path: Path) -> bool:
        """Determine if file should be scanned"""
        # Skip certain directories
        skip_dirs = ['node_modules', '.git', 'venv', '__pycache__', 'dist', 'build']
        
        for skip_dir in skip_dirs:
            if skip_dir in file_path.parts:
                return False
        
        # Skip very large files
        if file_path.stat().st_size > 1_000_000:  # 1MB
            return False
        
        return True

    def generate_report(self, issues: List[Dict]) -> str:
        """Generate a security report"""
        if not issues:
            return "✅ No security issues detected!"
        
        report = []
        report.append(f"\n🔒 Security Validation Report")
        report.append(f"=" * 60)
        report.append(f"\nTotal Issues: {len(issues)}\n")
        
        # Group by category
        by_category = {}
        for issue in issues:
            category = issue['category']
            if category not in by_category:
                by_category[category] = []
            by_category[category].append(issue)
        
        for category, cat_issues in sorted(by_category.items()):
            report.append(f"\n{category.upper().replace('_', ' ')}: {len(cat_issues)} issues")
            report.append("-" * 60)
            
            for issue in cat_issues[:5]:  # Show first 5 per category
                report.append(f"  File: {issue['file']}")
                report.append(f"  Line: {issue['line']}")
                report.append(f"  Code: {issue['content']}")
                report.append("")
            
            if len(cat_issues) > 5:
                report.append(f"  ... and {len(cat_issues) - 5} more")
                report.append("")
        
        report.append(f"\n{'=' * 60}")
        report.append(f"\nRecommendation: Review and address security issues before deployment.\n")
        
        return "\n".join(report)


def main():
    """Main entry point"""
    validator = SecurityValidator()
    
    # Scan current directory
    current_dir = Path(".")
    print("🔍 Scanning automation scripts for security issues...")
    print(f"   Directory: {current_dir.absolute()}")
    print("=" * 60)
    
    issues = validator.scan_directory(current_dir)
    
    # Generate and print report
    report = validator.generate_report(issues)
    print(report)
    
    # Exit with error code if issues found
    if issues:
        # Filter out issues in test files or documentation
        critical_issues = [
            i for i in issues 
            if not any(x in str(i['file']) for x in ['test_', 'example', 'docs/', 'README'])
        ]
        
        if critical_issues:
            print(f"⚠️  {len(critical_issues)} critical security issues detected in production code!")
            return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
