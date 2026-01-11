#!/usr/bin/env python3
"""
Automation Configuration Validator
Validates ecosystem configuration before automation runs
Per PR #35 recommendations for robust configuration handling
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Any

def validate_repo_format(repo: str) -> Tuple[bool, str]:
    """Validate repository name format (owner/repo)"""
    if '/' not in repo:
        return False, f"Invalid format: {repo} (expected 'owner/repo')"
    
    parts = repo.split('/')
    if len(parts) != 2:
        return False, f"Invalid format: {repo} (expected 'owner/repo')"
    
    owner, name = parts
    if not owner or not name:
        return False, f"Empty owner or repo name: {repo}"
    
    # Check for common issues
    if owner.startswith('@'):
        return False, f"Remove @ from owner: {repo}"
    
    return True, "valid"

def validate_ecosystem_config(config_path: str) -> Tuple[bool, List[str]]:
    """
    Validate ecosystem configuration file
    Returns: (is_valid, list_of_errors)
    """
    errors = []
    
    # Check file exists
    if not Path(config_path).exists():
        errors.append(f"Configuration file not found: {config_path}")
        return False, errors
    
    # Try to load JSON
    try:
        with open(config_path) as f:
            config = json.load(f)
    except json.JSONDecodeError as e:
        errors.append(f"Invalid JSON: {e}")
        return False, errors
    except Exception as e:
        errors.append(f"Could not read file: {e}")
        return False, errors
    
    # Validate required fields
    required_fields = ["repositories"]
    for field in required_fields:
        if field not in config:
            errors.append(f"Missing required field: {field}")
    
    # Validate repositories field
    if "repositories" in config:
        repos = config["repositories"]
        
        if not isinstance(repos, list):
            errors.append("'repositories' must be an array")
        elif len(repos) == 0:
            errors.append("'repositories' array is empty")
        else:
            # Validate each repository
            seen_repos = set()
            for i, repo in enumerate(repos):
                if not isinstance(repo, str):
                    errors.append(f"Repository at index {i} is not a string: {repo}")
                    continue
                
                # Check format
                is_valid, msg = validate_repo_format(repo)
                if not is_valid:
                    errors.append(f"Repository at index {i}: {msg}")
                
                # Check for duplicates
                if repo in seen_repos:
                    errors.append(f"Duplicate repository: {repo}")
                seen_repos.add(repo)
    
    # Validate optional numeric fields
    numeric_fields = {
        "sync_interval_minutes": (1, 1440),  # 1 minute to 1 day
        "auto_merge_threshold_commits": (1, 1000),
        "pulse_interval_seconds": (1, 3600)
    }
    
    for field, (min_val, max_val) in numeric_fields.items():
        if field in config:
            value = config[field]
            if not isinstance(value, (int, float)):
                errors.append(f"'{field}' must be a number, got {type(value).__name__}")
            elif value < min_val or value > max_val:
                errors.append(f"'{field}' must be between {min_val} and {max_val}, got {value}")
    
    return len(errors) == 0, errors

def validate_workflow_config(workflow_path: str) -> Tuple[bool, List[str]]:
    """Validate GitHub Actions workflow file"""
    errors = []
    
    if not Path(workflow_path).exists():
        errors.append(f"Workflow file not found: {workflow_path}")
        return False, errors
    
    try:
        import yaml
        with open(workflow_path) as f:
            workflow = yaml.safe_load(f)
        
        # Basic workflow validation
        if not isinstance(workflow, dict):
            errors.append("Workflow must be a dictionary")
            return False, errors
        
        # Check required fields
        if 'name' not in workflow:
            errors.append("Missing 'name' field")
        
        if 'on' not in workflow:
            errors.append("Missing 'on' trigger field")
        
        if 'jobs' not in workflow:
            errors.append("Missing 'jobs' field")
        
    except ImportError:
        # PyYAML not available, do basic check
        with open(workflow_path) as f:
            content = f.read()
            if not content.strip():
                errors.append("Workflow file is empty")
    except Exception as e:
        errors.append(f"Could not parse workflow: {e}")
    
    return len(errors) == 0, errors

def main():
    """Main validation function"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Validate automation configuration files"
    )
    parser.add_argument(
        "--config",
        default="config/ecosystem-repos.json",
        help="Path to ecosystem config file"
    )
    parser.add_argument(
        "--workflow",
        help="Path to workflow file to validate"
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Exit with error on any warnings"
    )
    
    args = parser.parse_args()
    
    all_valid = True
    
    # Validate ecosystem config
    print(f"🔍 Validating ecosystem config: {args.config}")
    is_valid, errors = validate_ecosystem_config(args.config)
    
    if is_valid:
        print("✅ Ecosystem configuration is valid")
    else:
        print("❌ Ecosystem configuration has errors:")
        for error in errors:
            print(f"   - {error}")
        all_valid = False
    
    # Validate workflow if specified
    if args.workflow:
        print(f"\n🔍 Validating workflow: {args.workflow}")
        is_valid, errors = validate_workflow_config(args.workflow)
        
        if is_valid:
            print("✅ Workflow configuration is valid")
        else:
            print("❌ Workflow configuration has errors:")
            for error in errors:
                print(f"   - {error}")
            all_valid = False
    
    if all_valid:
        print("\n✅ All configurations are valid")
        sys.exit(0)
    else:
        print("\n❌ Configuration validation failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
