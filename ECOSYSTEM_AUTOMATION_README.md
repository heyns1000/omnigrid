# 🌐 HotStack Ecosystem Automation Suite

**Unified automation framework for managing 102 repositories across the HotStack ecosystem**

**Version:** 2.0.0  
**Last Updated:** January 2026

---

## 🎯 Overview

This automation suite provides comprehensive tools for:
- **Cross-repository synchronization** with parallel processing
- **Unified deployment orchestration** with expanded compatibility
- **Real-time status monitoring** with JSON export
- **Automated consolidation merges**
- **Security validation** for automation scripts

### Ecosystem Scale
- **102 Repositories** across the HotStack platform
- **162 Brands** tracked and managed
- **24,852+ Code Snippets** in consolidated libraries
- **3,380 Technology Stack Entries**

### 🆕 New in Version 2.0
- ✨ **Parallel repository cloning** for 4x faster sync
- ✨ **Incremental sync mode** to update existing repositories
- ✨ **SSH + HTTPS fallback** authentication
- ✨ **Extended language support** (PHP, Ruby, pipenv, poetry, yarn, pnpm)
- ✨ **Security validator** for detecting vulnerabilities
- ✨ **Enhanced error handling** with retry logic and timeouts
- ✨ **JSON status reports** for programmatic access

---

## 📦 Components

### 1. **ecosystem_sync.sh**
Multi-repository synchronization and extraction tool with parallel processing.

**Features:**
- Clones or updates all 102 ecosystem repositories
- Parallel processing with GNU parallel (4 concurrent jobs)
- Incremental sync mode for faster updates
- SSH authentication with HTTPS fallback
- Retry logic with exponential backoff
- Extracts automation scripts across repos
- Generates branch maps and status reports
- Creates consolidated automation packages
- Produces compressed archives for distribution
- JSON export for programmatic access

**Usage:**
```bash
# Full sync (default)
./ecosystem_sync.sh

# Incremental sync (faster for updates)
SYNC_MODE=incremental ./ecosystem_sync.sh

# Custom parallel jobs
PARALLEL_JOBS=8 ./ecosystem_sync.sh

# Incremental with more parallelism
SYNC_MODE=incremental PARALLEL_JOBS=8 ./ecosystem_sync.sh
```

**Output:**
- `/tmp/ecosystem-sync/` - Workspace
- `~/ecosystem-sync.log` - Detailed logs
- `hotstack-automation-YYYYMMDD.tar.gz` - Consolidated package
- `ecosystem_status.json` - Machine-readable status

**Requirements:**
- Git
- GNU parallel (optional, for parallel processing)
- SSH keys configured (optional, falls back to HTTPS)

---

### 2. **hotstack_deploy_all.py**
Unified deployment orchestrator for the entire ecosystem with expanded compatibility.

**Features:**
- Auto-detects project types with extended language support
- Priority-based deployment ordering
- Automatic dependency installation with multiple package managers
- Build automation
- Test execution
- Health check integration
- Comprehensive error handling

**Usage:**
```bash
./hotstack_deploy_all.py
```

**Supported Project Types:**
- **Node.js**: npm, yarn, pnpm
- **Python**: pip/pip3, pipenv, poetry
- **Go**: go modules
- **Rust**: cargo
- **Java**: maven (pom.xml)
- **PHP**: composer
- **Ruby**: bundler

**Package Manager Detection:**
- Automatically selects the best package manager based on lock files
- Falls back to standard tools if preferred tool unavailable
- Examples:
  - `pnpm-lock.yaml` → uses pnpm
  - `yarn.lock` → uses yarn
  - `Pipfile` → uses pipenv
  - `poetry.lock` → uses poetry

**Deployment Order (by priority):**
1. omnigrid (Hub)
2. hotstack (Platform)
3. nexus-nair (AI)
4. vaultmesh (Security)
5. buildnest (Build)
6. codenest (Code)
7. seedwave (Data)
8. banimal (Brand)
9. faa.zone (FAA)

---

### 3. **ecosystem_status.py**
Real-time monitoring and status reporting.

**Features:**
- Scans all ecosystem repositories
- Tracks current branches and commits
- Monitors working tree status
- Generates Markdown and JSON reports
- Provides health dashboard

**Usage:**
```bash
./ecosystem_status.py
```

**Output:**
- `~/ecosystem_status_report.md` - Detailed markdown report
- `~/ecosystem_status.json` - JSON data export
- Console output with emoji status indicators

---

### 4. **consolidation_merge.sh**
One-command consolidation merge automation.

**Features:**
- Automatic branch detection
- Creates backup tags
- Merges all work streams
- Conflict detection
- Rollback capability

**Usage:**
```bash
./consolidation_merge.sh
```

**What it does:**
1. Creates backup tag: `pre-consolidation-YYYYMMDD-HHMMSS`
2. Checks out/creates consolidation branch
3. Scans for all feature branches (claude/*, copilot/*, staging/*)
4. Merges each branch with --no-ff
5. Reports merge status

---

### 5. **security_validator.py** 🆕
Security validation tool for automation scripts.

**Features:**
- Detects command injection patterns
- Identifies hardcoded credentials
- Flags dangerous commands (rm -rf, chmod 777, etc.)
- Checks for SQL injection vulnerabilities
- Generates detailed security reports

**Usage:**
```bash
./security_validator.py
```

**What it checks:**
- Command injection via string concatenation
- Hardcoded passwords, API keys, secrets
- Dangerous filesystem operations
- SQL query string concatenation
- Overly permissive file permissions

**Output:**
```
🔒 Security Validation Report
============================================================
Total Issues: 3

COMMAND INJECTION: 1 issues
HARDCODED CREDENTIALS: 2 issues

Recommendation: Review and address security issues before deployment.
```

---

## 🚀 Quick Start

### Initial Setup
```bash
# 1. Clone repositories (first time, full sync)
./ecosystem_sync.sh

# 2. Check ecosystem status
./ecosystem_status.py

# 3. Validate security
./security_validator.py

# 4. Deploy all services
./hotstack_deploy_all.py
```

### Daily Workflow
```bash
# Morning: Check status
./ecosystem_status.py

# Development: Work on features...

# Evening: Quick incremental sync
SYNC_MODE=incremental ./ecosystem_sync.sh

# Consolidate changes
./consolidation_merge.sh

# Deploy: Push to production
./hotstack_deploy_all.py
```

### Performance-Optimized Workflow
```bash
# Fast incremental sync with 8 parallel jobs
SYNC_MODE=incremental PARALLEL_JOBS=8 ./ecosystem_sync.sh

# Run security checks
./security_validator.py

# Deploy with automated health checks
./hotstack_deploy_all.py
```

---

## 📊 Repository Structure

```
hotstack-ecosystem/
├── omnigrid/              # Central hub (current repo)
├── hotstack/              # Main platform
├── nexus-nair/            # AI operations
├── vaultmesh/             # Security mesh
├── buildnest/             # Build automation
├── codenest/              # Code management
├── seedwave/              # Data seeding
├── banimal/               # Brand system
├── faa.zone/              # FAA management
├── FruitfulPlanetChange/  # Fruitful Global Planet integration
└── ... (92 more repositories)
```

---

## 🔄 Workflow Integration

### Continuous Integration
```bash
# Add to CI pipeline
on:
  push:
    branches: [main, develop]

jobs:
  ecosystem-sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Sync Ecosystem
        run: ./ecosystem_sync.sh
```

### Pre-commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

./ecosystem_status.py
```

### Deployment Pipeline
```bash
#!/bin/bash
# deploy.sh

# 1. Run tests
npm test

# 2. Sync ecosystem
./ecosystem_sync.sh

# 3. Deploy all
./hotstack_deploy_all.py

# 4. Health check
./ecosystem_status.py
```

---

## 📈 Monitoring & Reporting

### Status Dashboard
```bash
# Quick status check
./ecosystem_status.py

# Output:
# 🔍 Scanning HotStack Ecosystem...
#
# ✅ omnigrid          - exists    - main
# ✅ hotstack          - exists    - develop
# ✅ nexus-nair        - exists    - main
# ...
```

### Detailed Reports
```markdown
# HotStack Ecosystem Status Report

**Generated:** 2025-12-29 03:00:00

## omnigrid
**Status:** ✅ Clean
**Current Branch:** `main`
**Total Commits:** 156
**Last Commit:** 2 hours ago
```

---

## 🔒 Security & Best Practices

### Backup Strategy
- Automatic backup tags before consolidation
- Format: `pre-consolidation-YYYYMMDD-HHMMSS`
- Rollback capability: `git reset --hard <tag>`

### Security Best Practices

#### 1. Authentication
- **Prefer SSH keys** over HTTPS for Git operations
- Configure SSH keys: `ssh-keygen -t ed25519 -C "your_email@example.com"`
- Add to GitHub: `gh auth login` or manually via Settings → SSH Keys
- Test SSH: `ssh -T git@github.com`

#### 2. Credential Management
- **Never commit secrets** to repositories
- Use environment variables for sensitive data
- Store credentials in:
  - GitHub Secrets (for Actions)
  - `.env` files (add to `.gitignore`)
  - Secret management tools (Vault, AWS Secrets Manager)

#### 3. Script Security
- Run `./security_validator.py` before deploying automation
- Review flagged issues carefully
- Use parameterized commands instead of string concatenation
- Validate all user inputs
- Set proper file permissions (`chmod 755` for scripts)

#### 4. Command Safety
```bash
# ❌ Dangerous - No input validation
rm -rf $USER_INPUT

# ✅ Safe - Input validation
if [[ "$USER_INPUT" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    rm -rf "/tmp/safe-prefix-$USER_INPUT"
fi

# ❌ Dangerous - String concatenation in subprocess
subprocess.run(f"git clone {user_repo}", shell=True)

# ✅ Safe - Use list arguments
subprocess.run(["git", "clone", user_repo])
```

#### 5. Timeout Configuration
- All network operations have timeouts
- Default timeouts in continuous_pulse_updater.py:
  - Repository checks: 10s
  - Git pull: 30s
  - Git push: 30s
- Adjust `timeout=X` parameters as needed

#### 6. Error Handling
- Scripts fail fast with `set -e` in bash
- Python scripts use try/except blocks
- All errors logged to appropriate log files
- Non-critical failures don't stop entire pipeline

### Conflict Resolution
```bash
# If consolidation_merge.sh reports conflicts:
git status
# Resolve conflicts manually
git add <resolved-files>
git commit
./consolidation_merge.sh  # Continue
```

### Access Control
- Scripts require git access to all repos
- Use SSH keys or GitHub tokens
- Configure: `gh auth login`
- Verify: `gh auth status`

---

## 📝 Logs & Debugging

### Log Locations
- `~/ecosystem-sync.log` - Sync operations
- `~/hotstack-deployment.log` - Deployment logs
- `~/ecosystem_status.json` - Status data

### Verbose Mode
```bash
# Enable debug output
export DEBUG=1
./ecosystem_sync.sh
```

---

## 🎯 Use Cases

### 1. New Developer Onboarding
```bash
# Clone entire ecosystem
./ecosystem_sync.sh

# Check what's available
./ecosystem_status.py

# Set up development environment
./hotstack_deploy_all.py
```

### 2. Release Management
```bash
# Before release
./ecosystem_status.py  # Ensure all clean

# Create release
./consolidation_merge.sh

# Deploy
./hotstack_deploy_all.py

# Verify
./ecosystem_status.py
```

### 3. Ecosystem Audit
```bash
# Full ecosystem sync
./ecosystem_sync.sh

# Generate reports
./ecosystem_status.py

# Review consolidated automation
tar -xzf hotstack-automation-*.tar.gz
```

---

## 🆘 Troubleshooting

### Common Issues

**1. Repository not found**
```bash
# Ensure repositories are cloned
./ecosystem_sync.sh
```

**2. Permission denied**
```bash
chmod +x *.sh *.py
```

**3. GitHub authentication**
```bash
gh auth login
# or
export GITHUB_TOKEN=<your-token>
```

**4. Merge conflicts**
```bash
# Check which branch has conflicts
git status

# Resolve manually or skip
git merge --abort
```

---

## 📚 Documentation

### Related Documents
- `HOTSTACK_ECOSYSTEM_CONSOLIDATION.md` - Master consolidation strategy
- `ecosystem_config.yaml` - Configuration reference
- `CONSOLIDATION_MASTER_GUIDE.md` - Data consolidation guide
- `ECOSYSTEM_README.md` - Ecosystem overview

---

## 👥 Maintenance

### Regular Tasks

**Daily:**
- `./ecosystem_status.py` - Check health

**Weekly:**
- `./ecosystem_sync.sh` - Sync automation
- Review generated reports

**Monthly:**
- `./consolidation_merge.sh` - Consolidate work
- Update `ecosystem_config.yaml`
- Archive old logs

---

## 🚀 Roadmap

### Planned Features
- [ ] Web-based status dashboard
- [ ] Slack/Discord notifications
- [ ] Automated dependency updates
- [ ] Performance metrics tracking
- [ ] Cross-repo code search
- [ ] Automated security scanning

---

## 👤 Owner & Support

**Owner:** Heyns Schoeman / Fruitful Holdings (Pty) Ltd
**Maintainer:** OmniGrid Automation Team
**Support:** heynsschoeman@gmail.com
**GitHub:** @heyns1000

---

## 📜 License

Part of the HotStack ecosystem.
Fruitful Holdings (Pty) Ltd © 2025

---

**Last Updated:** December 29, 2025
**Version:** 1.0.0
**Status:** 🟢 Production Ready
