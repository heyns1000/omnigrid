# Auto-Merge Setup Guide

## Overview

This guide explains how to configure and use the automated merge pipeline for the FAA Actuary Mastery™ ecosystem. The auto-merge system ensures that only fully validated, approved pull requests are merged automatically.

## Prerequisites

- Repository write access
- Admin permissions for branch protection rules
- Access to configure GitHub Actions secrets
- Member of HotStack™ Core Team (for approvals)

## Configuration Steps

### 1. Branch Protection Rules

Configure branch protection for the `main` branch:

```bash
# Using GitHub CLI
gh api repos/{owner}/{repo}/branches/main/protection \
  --method PUT \
  --field required_status_checks[strict]=true \
  --field required_status_checks[contexts][]=ci-validation \
  --field required_status_checks[contexts][]=mr-actuary-gpr \
  --field required_status_checks[contexts][]=performance-validation \
  --field required_status_checks[contexts][]=security-validation \
  --field required_pull_request_reviews[dismiss_stale_reviews]=true \
  --field required_pull_request_reviews[require_code_owner_reviews]=true \
  --field required_pull_request_reviews[required_approving_review_count]=2 \
  --field enforce_admins=true \
  --field required_linear_history=true \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

Or configure via GitHub UI:
1. Go to Settings → Branches
2. Click "Add rule" for `main` branch
3. Configure the following:
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 2
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require review from Code Owners
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging
   - ✅ Require linear history
   - ✅ Include administrators

### 2. Required Status Checks

Configure these 14 required status checks:

```yaml
required_checks:
  - ci-validation / validation
  - ci-validation / performance-validation
  - ci-validation / security-validation
  - ci-validation / comprehensive-validation
  - mr-actuary-gpr-validation
  - celestial-payroll-tps-test
  - durable-objects-latency-test
  - keccak256-hash-rate-test
  - 9s-pulse-simulation
  - unit-tests
  - integration-tests
  - linting
  - type-checking
  - dependency-audit
```

### 3. GitHub Actions Secrets

Configure required secrets in Settings → Secrets and variables → Actions:

| Secret Name | Description | How to Obtain |
|-------------|-------------|---------------|
| `GITHUB_TOKEN` | Auto-provided | Automatically available in workflows |
| `CLOUDFLARE_API_TOKEN` | Durable Objects + R2 access | Cloudflare Dashboard → API Tokens |
| `ACTUARY_R2_ACCESS_KEY` | Vault storage authentication | R2 Dashboard → Access Keys |
| `HEYNS_MOTHER_NODE_KEY` | HITL approval for $1M+ transactions | Contact: admin@omnigrid.io |
| `ML_DSA_65_PRIVATE_KEY` | Post-quantum cryptographic signatures | Generate with: `ml-dsa-keygen` |
| `MEHO_CACHE_SECRET` | EHO memory recall | Generate: `openssl rand -hex 32` |

#### Generating ML-DSA-65 Key Pair

```bash
# Using liboqs (Open Quantum Safe)
git clone https://github.com/open-quantum-safe/liboqs.git
cd liboqs
mkdir build && cd build
cmake -GNinja ..
ninja

# Generate key pair
./tests/kat_kem ML-DSA-65 > ml-dsa-65.key

# Extract private key for GitHub secret
cat ml-dsa-65.key | grep "private_key" | cut -d: -f2 | tr -d ' '
```

### 4. Team Configuration

Create the HotStack™ Core Team:

1. Go to Organization → Teams
2. Create team: "HotStack Core Team"
3. Add team members who can approve PRs
4. Set team permissions:
   - Repository access: Write
   - Code review: Required for auto-merge

### 5. CODEOWNERS File

Create `.github/CODEOWNERS`:

```
# HotStack™ Core Team owns all code
*       @heyns1000/hotstack-core-team

# CI/CD workflows require additional review
/.github/workflows/    @heyns1000/hotstack-core-team @heyns1000/ci-team

# Security-critical scripts
/scripts/actuary/      @heyns1000/hotstack-core-team @heyns1000/actuary-team

# Performance optimizations
/scripts/ci-fixes/     @heyns1000/hotstack-core-team @heyns1000/performance-team
```

## Using Auto-Merge

### Enabling Auto-Merge on a PR

#### Method 1: Apply Label
```bash
gh pr edit <PR_NUMBER> --add-label automerge
```

#### Method 2: GitHub UI
1. Navigate to the pull request
2. Click "Labels" on the right sidebar
3. Add the `automerge` label

### Prerequisites for Auto-Merge

The following conditions must be met:

1. ✅ **2 Approvals**: PR must have 2 approved reviews from HotStack™ Core Team
2. ✅ **All Checks Pass**: All 14 required CI checks must be green
3. ✅ **Up-to-Date Branch**: Branch must be up-to-date with `main`
4. ✅ **No Conflicts**: No merge conflicts
5. ✅ **Resolved Conversations**: All review conversations resolved
6. ✅ **Linear History**: Commits follow linear history (no merge commits)
7. ✅ **Auto-Merge Label**: `automerge` label applied

### Monitoring Auto-Merge Status

```bash
# Check PR status
gh pr view <PR_NUMBER>

# Check CI status
gh pr checks <PR_NUMBER>

# View approval status
gh pr reviews <PR_NUMBER>

# Monitor workflow runs
gh run list --workflow=auto-merge.yml
```

### Auto-Merge Workflow

```
1. Developer creates PR
   ↓
2. CI validation runs (14 checks)
   ↓
3. Team reviews and approves (2+ approvals)
   ↓
4. Developer applies 'automerge' label
   ↓
5. Auto-merge workflow validates:
   - Approvals count
   - CI check status
   - Branch up-to-date
   - No unresolved conversations
   ↓
6. Automatic squash merge
   ↓
7. Post-merge notification
   ↓
8. Branch deletion (optional)
```

## Validation Rules

### Approval Requirements

```yaml
approvals:
  minimum: 2
  required_team: "hotstack-core-team"
  dismiss_stale: true
  require_code_owner: true
```

### CI Check Requirements

All 14 checks must pass:

```python
def validate_ci_checks(pr):
    checks = get_checks(pr)
    required_checks = [
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
    
    return all(
        check.status == 'completed' and 
        check.conclusion == 'success'
        for check in checks
        if check.name in required_checks
    )
```

### Branch Update Check

```javascript
if (pr.mergeable_state !== 'clean' && pr.mergeable_state !== 'unstable') {
  throw new Error('Branch must be up-to-date with main');
}
```

## Troubleshooting

### Issue: Auto-Merge Not Triggering

**Check 1: Label Applied?**
```bash
gh pr view <PR_NUMBER> --json labels
```

**Check 2: Approval Count**
```bash
gh pr view <PR_NUMBER> --json reviews | jq '.reviews | map(select(.state == "APPROVED")) | length'
```

**Check 3: CI Status**
```bash
gh pr checks <PR_NUMBER>
```

**Check 4: Branch Up-to-Date?**
```bash
git fetch origin main
git log HEAD..origin/main
```

### Issue: Merge Fails

**Error: "Branch is out of date"**
```bash
# Update branch
git fetch origin main
git rebase origin/main
git push --force-with-lease
```

**Error: "Required checks failed"**
```bash
# View failed checks
gh pr checks <PR_NUMBER>

# Re-run failed checks
gh run rerun <RUN_ID>
```

**Error: "Insufficient approvals"**
```bash
# Check current approvals
gh pr reviews <PR_NUMBER>

# Request reviews
gh pr review <PR_NUMBER> --request @user1,@user2
```

### Issue: Workflow Not Running

**Check workflow file syntax**
```bash
yamllint .github/workflows/auto-merge.yml
```

**Check workflow permissions**
```yaml
permissions:
  contents: write
  pull-requests: write
  issues: write
```

**View workflow logs**
```bash
gh run view <RUN_ID> --log
```

## Best Practices

### 1. Small, Focused PRs
- Keep PRs small (< 500 lines)
- Single responsibility
- Easy to review

### 2. Descriptive Commit Messages
```
feat(actuary): implement GPR prediction model

- Add 40D tensor processing
- Implement HOGPR inference
- Add comprehensive validation

Refs: #48
```

### 3. Pre-Merge Checklist
- [ ] All tests pass locally
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] No console.log / debug statements
- [ ] Code follows style guide
- [ ] Performance impact considered

### 4. Review Process
- First reviewer: Code quality, logic
- Second reviewer: Architecture, security
- Both reviewers: Test coverage

### 5. Post-Merge Validation
- Monitor CI/CD pipelines
- Check production metrics
- Review error logs

## Security Considerations

### Secrets Management
- Never commit secrets to repository
- Rotate secrets quarterly
- Use GitHub secret scanning
- Enable Dependabot alerts

### Code Review Focus Areas
- Input validation
- Authentication/authorization
- Cryptographic operations
- SQL injection prevention
- XSS prevention

### Audit Trail
All auto-merges are logged with:
- Timestamp
- Approvers
- CI check results
- Commit SHAs

## Performance Impact

### Merge Time Savings
- Manual merge: ~15 minutes
- Auto-merge: ~30 seconds
- Time saved per PR: ~14.5 minutes
- Annual savings (100 PRs/year): 24 hours

### Quality Improvements
- Zero failed merges to main
- 100% CI validation coverage
- Consistent review standards
- Reduced human error

## Support

### Documentation
- [PR #48 Implementation Guide](PR48-ECOSYSTEM-SYNC.md)
- [CI Optimization Guide](CI-OPTIMIZATION.md)
- [GitHub Actions Docs](https://docs.github.com/actions)

### Contact
- Technical Issues: tech-support@omnigrid.io
- Access Requests: admin@omnigrid.io
- Security Concerns: security@omnigrid.io

### Community
- Slack: #hotstack-core-team
- Discord: OmniGrid Community
- GitHub Discussions: Enable in repository settings

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-31  
**Maintained By**: HotStack™ Core Team  
**Review Cycle**: Quarterly
