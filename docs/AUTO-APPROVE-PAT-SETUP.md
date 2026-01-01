# Auto-Approve Workflow PAT Setup Guide

## Overview

The **Auto Approve Copilot PRs** workflow requires a Personal Access Token (PAT) to function correctly. GitHub Actions' default `GITHUB_TOKEN` is not permitted to approve pull requests as per GitHub's security policies.

## Why a PAT is Required

GitHub enforces the following restriction:
- **Bot accounts (including `github-actions[bot]`) cannot approve pull requests**
- The default `GITHUB_TOKEN` provided by GitHub Actions is associated with the github-actions bot
- To approve PRs automatically, we need a PAT from a real user account with appropriate permissions

## Setup Instructions

### 1. Create a Personal Access Token

1. Navigate to GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
   - URL: https://github.com/settings/tokens?type=beta

2. Click **"Generate new token"**

3. Configure the token:
   - **Token name**: `omnigrid-auto-approve` (or any descriptive name)
   - **Expiration**: Choose an appropriate expiration date (90 days, 1 year, etc.)
   - **Repository access**: Select "Only select repositories" → Choose `heyns1000/omnigrid`
   
4. **Repository permissions** (Required):
   - **Pull requests**: Read and write access
   - **Contents**: Read-only access
   - **Metadata**: Read-only access (automatically included)

5. Click **"Generate token"** and copy the token value (you won't be able to see it again!)

### 2. Add the Token to Repository Secrets

1. Navigate to the repository settings:
   - URL: https://github.com/heyns1000/omnigrid/settings/secrets/actions

2. Click **"New repository secret"**

3. Configure the secret:
   - **Name**: `PAT_TOKEN`
   - **Secret**: Paste the PAT you generated in step 1

4. Click **"Add secret"**

### 3. Verify the Workflow

Once the PAT is added:
1. The **Auto Approve Copilot PRs** workflow will automatically use it
2. Test by creating a PR from a bot account (copilot, dependabot, etc.)
3. Check that the workflow runs successfully and approves the PR

## Security Considerations

### Token Scope
- Use **fine-grained tokens** instead of classic tokens for better security
- Grant **minimum required permissions** (pull requests: read/write only)
- Limit repository access to **only this repository**

### Token Rotation
- **Regularly rotate** the PAT (recommended: every 90 days)
- Set an expiration date and create calendar reminders
- Update the repository secret when rotating

### Access Control
- Only **repository administrators** can access or modify secrets
- The token value is **encrypted** and never exposed in logs
- Audit token usage through GitHub's token activity logs

## Troubleshooting

### Workflow Still Failing?

**Check:**
1. The secret name is exactly `PAT_TOKEN` (case-sensitive)
2. The PAT has not expired
3. The PAT has correct permissions (pull requests: write)
4. The PAT is associated with a user who has write access to the repository

### Alternative: Use GitHub App

For enhanced security and better audit trails, consider using a GitHub App instead of a PAT:
- GitHub Apps can be granted specific permissions
- They provide better audit logs
- They can be installed on specific repositories

## Related Documentation

- [GitHub: Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [GitHub: Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [GitHub: Permissions for fine-grained PATs](https://docs.github.com/en/rest/overview/permissions-required-for-fine-grained-personal-access-tokens)
