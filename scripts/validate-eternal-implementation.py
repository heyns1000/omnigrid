#!/usr/bin/env python3
"""
Validation script for Eternal Evolution Engine implementation
Verifies all components are in place and ready for deployment
"""

import os
import json
from pathlib import Path

def check_file_exists(path: str, description: str) -> bool:
    """Check if a file exists"""
    if os.path.exists(path):
        print(f"✅ {description}: {path}")
        return True
    else:
        print(f"❌ {description}: {path} NOT FOUND")
        return False

def check_directory_exists(path: str, description: str) -> bool:
    """Check if a directory exists"""
    if os.path.isdir(path):
        print(f"✅ {description}: {path}")
        return True
    else:
        print(f"❌ {description}: {path} NOT FOUND")
        return False

def main():
    print("=" * 70)
    print("🌊 Eternal Evolution Engine - Implementation Validation")
    print("=" * 70)
    print()
    
    checks_passed = 0
    checks_total = 0
    
    # Check directory structure
    print("📁 Directory Structure:")
    checks_total += 4
    checks_passed += check_directory_exists("workers/eternal-research", "Workers directory")
    checks_passed += check_directory_exists("src", "Source modules directory")
    checks_passed += check_directory_exists("scripts", "Scripts directory")
    checks_passed += check_directory_exists("docs", "Documentation directory")
    print()
    
    # Check TypeScript source modules
    print("📦 TypeScript Modules:")
    modules = [
        ("src/adaptive-knowledge-sync.ts", "Adaptive Knowledge Sync"),
        ("src/rhino-strike-verifier.ts", "Rhino Strike Verifier"),
        ("src/data-request-handler.ts", "Data Request Handler"),
        ("src/snippet-processor.ts", "Snippet Processor"),
        ("src/pr-generator.ts", "PR Generator"),
    ]
    checks_total += len(modules)
    for path, desc in modules:
        checks_passed += check_file_exists(path, desc)
    print()
    
    # Check Cloudflare Worker
    print("⚡ Cloudflare Worker:")
    worker_files = [
        ("workers/eternal-research/eternal-engine.ts", "Main Worker (Durable Object)"),
        ("workers/eternal-research/package.json", "Package configuration"),
        ("workers/eternal-research/wrangler.toml", "Wrangler configuration"),
        ("workers/eternal-research/tsconfig.json", "TypeScript configuration"),
    ]
    checks_total += len(worker_files)
    for path, desc in worker_files:
        checks_passed += check_file_exists(path, desc)
    print()
    
    # Check deployment scripts
    print("🚀 Deployment Scripts:")
    scripts = [
        ("scripts/activate-eternal-research.sh", "Activation script"),
        ("scripts/check-eternal-status.sh", "Status checker script"),
    ]
    checks_total += len(scripts)
    for path, desc in scripts:
        if check_file_exists(path, desc):
            # Check if executable
            if os.access(path, os.X_OK):
                print(f"   ✓ Script is executable")
                checks_passed += 1
            else:
                print(f"   ⚠️  Script not executable (run: chmod +x {path})")
        else:
            checks_passed += 0
    print()
    
    # Check documentation
    print("📚 Documentation:")
    docs = [
        ("docs/ETERNAL_EVOLUTION.md", "Main architecture"),
        ("docs/RHINO_STRIKE_PROTOCOL.md", "Rhino strike mechanics"),
        ("docs/9_SECOND_PULSE_DESIGN.md", "Pulse cycle design"),
        ("docs/DATA_REQUEST_SYSTEM.md", "Data request system"),
        ("docs/GIT_BRANCHING_STRATEGY.md", "Git branching guide"),
        ("docs/GROK_ALIGNMENT.md", "Grok AI verification"),
    ]
    checks_total += len(docs)
    for path, desc in docs:
        checks_passed += check_file_exists(path, desc)
    print()
    
    # Check package.json has correct dependencies
    print("🔧 Dependencies Check:")
    checks_total += 1
    try:
        with open("workers/eternal-research/package.json") as f:
            pkg = json.load(f)
            required_deps = ["@cloudflare/workers-types", "typescript", "wrangler"]
            has_all = all(dep in pkg.get("devDependencies", {}) for dep in required_deps)
            if has_all:
                print(f"✅ All required dependencies present")
                checks_passed += 1
            else:
                print(f"❌ Missing dependencies in package.json")
    except Exception as e:
        print(f"❌ Error reading package.json: {e}")
    print()
    
    # Check README updated
    print("📖 README Update:")
    checks_total += 1
    try:
        with open("README.md") as f:
            content = f.read()
            if "Eternal Evolution Engine" in content:
                print("✅ README.md updated with Eternal Engine section")
                checks_passed += 1
            else:
                print("❌ README.md not updated")
    except Exception as e:
        print(f"❌ Error reading README.md: {e}")
    print()
    
    # Summary
    print("=" * 70)
    print(f"🎯 Validation Results: {checks_passed}/{checks_total} checks passed")
    print("=" * 70)
    
    if checks_passed == checks_total:
        print()
        print("✨ All checks passed! Implementation is complete and ready for deployment.")
        print()
        print("Next steps:")
        print("1. Deploy to Cloudflare: ./scripts/activate-eternal-research.sh")
        print("2. Monitor dashboard: https://eternal-research-engine.heynsschoeman.workers.dev/dashboard")
        print("3. Check status: ./scripts/check-eternal-status.sh")
        print()
        print("瓷勺旋渦已築，脈買已通！ 🌊🦍🐜")
        return 0
    else:
        print()
        print(f"⚠️  {checks_total - checks_passed} checks failed. Please review the errors above.")
        return 1

if __name__ == "__main__":
    exit(main())
