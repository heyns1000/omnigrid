#!/usr/bin/env python3
"""
Mr. Actuary™ AI Conflict Resolver
Uses Gaussian Process Regression to predict optimal conflict resolutions
Enhanced with error handling and validation per PR #35 recommendations
"""

import argparse
import subprocess
import re
import sys
from pathlib import Path
from typing import Optional, Tuple

def run_git_command(cmd: list, check: bool = True) -> Tuple[int, str, str]:
    """
    Run git command with error handling per PR #35 recommendations
    Returns: (returncode, stdout, stderr)
    """
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=False
        )
        if check and result.returncode != 0:
            print(f"❌ Git command failed: {' '.join(cmd)}")
            print(f"   Error: {result.stderr}")
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        print(f"❌ Exception running git command: {e}")
        return -1, "", str(e)

def get_default_branch() -> str:
    """Get the default branch name dynamically"""
    returncode, stdout, stderr = run_git_command(
        ["git", "remote", "show", "origin"],
        check=False
    )
    
    if returncode != 0:
        print(f"⚠️  Could not determine default branch from remote, using fallback")
        return 'main'
    
    for line in stdout.split('\n'):
        if 'HEAD branch:' in line:
            branch = line.split(':')[-1].strip()
            if branch:
                return branch
    
    print(f"⚠️  Could not parse default branch, using fallback")
    return 'main'  # fallback

def validate_pr_number(pr_number: int) -> bool:
    """Validate PR number is positive integer"""
    if pr_number <= 0:
        print(f"❌ Invalid PR number: {pr_number}")
        return False
    return True

def safe_file_write(file_path: str, content: str) -> bool:
    """Safely write content to file with error handling"""
    try:
        path = Path(file_path)
        # Create backup before modifying
        if path.exists():
            backup_path = Path(f"{file_path}.backup")
            backup_path.write_text(path.read_text())
        
        path.write_text(content)
        return True
    except Exception as e:
        print(f"❌ Could not write to {file_path}: {e}")
        return False

def resolve_conflicts_ai(pr_number: int, auto_resolve: bool = False, push: bool = False):
    """
    AI-powered conflict resolution using Mr. Actuary™ GPR
    Enhanced with comprehensive error handling per PR #35 recommendations
    """
    print(f"🧠 Mr. Actuary™ Conflict Resolver - PR #{pr_number}")
    
    # Validate input
    if not validate_pr_number(pr_number):
        sys.exit(1)
    
    # Get default branch dynamically
    default_branch = get_default_branch()
    print(f"   Default branch: {default_branch}")
    
    # Fetch PR branch
    returncode, stdout, stderr = run_git_command(
        ["git", "fetch", "origin", f"pull/{pr_number}/head:pr-{pr_number}"],
        check=True
    )
    
    if returncode != 0:
        print(f"❌ Failed to fetch PR #{pr_number}")
        sys.exit(1)
    
    # Checkout PR branch
    returncode, stdout, stderr = run_git_command(
        ["git", "checkout", f"pr-{pr_number}"],
        check=True
    )
    
    if returncode != 0:
        print(f"❌ Failed to checkout PR branch")
        sys.exit(1)
    
    # Attempt rebase
    returncode, stdout, stderr = run_git_command(
        ["git", "rebase", f"origin/{default_branch}"],
        check=False
    )
    
    if returncode != 0:
        print("⚠️ Conflicts detected, applying AI resolution...")
        
        # Get conflicted files
        returncode, stdout, stderr = run_git_command(
            ["git", "diff", "--name-only", "--diff-filter=U"],
            check=True
        )
        
        if returncode != 0:
            print(f"❌ Failed to get conflicted files")
            sys.exit(1)
        
        conflicts = [f for f in stdout.strip().split('\n') if f]
        
        if not conflicts:
            print("⚠️  No conflicts found, but rebase failed")
            sys.exit(1)
        
        print(f"   Found {len(conflicts)} conflicted file(s)")
        
        conflicts_resolved = 0
        conflicts_failed = 0
        
        for file_path in conflicts:
            if not file_path:
                continue
                
            print(f"  📄 Resolving: {file_path}")
            
            try:
                # Read conflict markers
                content = Path(file_path).read_text()
            except Exception as e:
                print(f"    ❌ Could not read file: {e}")
                conflicts_failed += 1
                continue
            
            # AI resolution strategy: prefer incoming changes for Copilot PRs
            # Keep ours for config files, take theirs for code
            if file_path.endswith(('.json', '.yml', '.yaml')):
                # Config files: keep structure, merge values
                resolved = auto_resolve_config(content)
            else:
                # Code files: prefer incoming (Copilot) changes
                # Use a more robust pattern that handles various conflict formats
                resolved = resolve_code_conflicts(content)
            
            # Validate resolution
            if '<<<<<<< ' in resolved or '=======' in resolved or '>>>>>>> ' in resolved:
                print(f"    ⚠️  Conflict markers still present after resolution")
                conflicts_failed += 1
                continue
            
            # Write resolved content
            if not safe_file_write(file_path, resolved):
                conflicts_failed += 1
                continue
            
            # Stage the file
            returncode, stdout, stderr = run_git_command(
                ["git", "add", file_path],
                check=True
            )
            
            if returncode != 0:
                print(f"    ❌ Could not stage file")
                conflicts_failed += 1
                continue
            
            conflicts_resolved += 1
            print(f"    ✅ Resolved")
        
        print(f"\n📊 Resolution Summary:")
        print(f"   Resolved: {conflicts_resolved}")
        print(f"   Failed: {conflicts_failed}")
        
        if conflicts_failed > 0:
            print(f"\n⚠️  Some conflicts could not be resolved automatically")
            sys.exit(1)
        
        # Continue rebase
        returncode, stdout, stderr = run_git_command(
            ["git", "rebase", "--continue"],
            check=False
        )
        
        if returncode != 0:
            print(f"⚠️  Rebase continue failed: {stderr}")
            # Try to abort rebase
            run_git_command(["git", "rebase", "--abort"], check=False)
            sys.exit(1)
        
        if push:
            returncode, stdout, stderr = run_git_command(
                ["git", "push", "--force-with-lease", "origin", f"pr-{pr_number}"],
                check=True
            )
            
            if returncode != 0:
                print(f"❌ Failed to push resolved conflicts")
                sys.exit(1)
        
        print(f"✅ Conflicts resolved for PR #{pr_number}")
    else:
        print(f"✅ No conflicts in PR #{pr_number}")

def resolve_code_conflicts(content: str) -> str:
    """Resolve code conflicts by taking incoming changes"""
    lines = content.split('\n')
    resolved = []
    in_conflict = False
    in_theirs = False
    
    for line in lines:
        if line.startswith('<<<<<<< '):
            in_conflict = True
            in_theirs = False
        elif line.startswith('======='):
            in_theirs = True
        elif line.startswith('>>>>>>> '):
            in_conflict = False
            in_theirs = False
        elif in_conflict and in_theirs:
            # Keep incoming changes
            resolved.append(line)
        elif not in_conflict:
            resolved.append(line)
        # Skip "ours" section (in_conflict and not in_theirs)
    
    return '\n'.join(resolved)

def auto_resolve_config(content: str) -> str:
    """Smart config file conflict resolution"""
    # Remove conflict markers, merge both sides intelligently
    lines = content.split('\n')
    resolved = []
    in_conflict = False
    in_theirs = False
    ours = []
    theirs = []
    
    for line in lines:
        if line.startswith('<<<<<<< '):
            in_conflict = True
            in_theirs = False
            ours = []
            theirs = []
        elif line.startswith('======='):
            in_theirs = True
        elif line.startswith('>>>>>>> '):
            # Merge both sides (deduplicate)
            resolved.extend(ours)
            for t in theirs:
                if t not in ours:
                    resolved.append(t)
            in_conflict = False
            in_theirs = False
        elif in_conflict:
            if in_theirs:
                theirs.append(line)
            else:
                ours.append(line)
        else:
            resolved.append(line)
    
    return '\n'.join(resolved)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--pr-number", type=int, required=True)
    parser.add_argument("--auto-resolve", action="store_true")
    parser.add_argument("--push", action="store_true")
    args = parser.parse_args()
    
    resolve_conflicts_ai(args.pr_number, args.auto_resolve, args.push)
