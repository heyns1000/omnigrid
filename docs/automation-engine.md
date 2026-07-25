# Automation Engine

## Overview

The automation engine is restarted from current `main` with two workflows:

- `/home/runner/work/omnigrid/omnigrid/.github/workflows/automation-engine-bootstrap.yml`
- `/home/runner/work/omnigrid/omnigrid/.github/workflows/automation-engine-verify.yml`

The bootstrap workflow provides a safe heartbeat loop (`workflow_dispatch` + hourly `schedule`) and produces an auditable run artifact. The verify workflow continuously checks invariants and fails clearly if safety or configuration assumptions drift.

## Architecture

1. **Bootstrap workflow**
   - Triggered manually and hourly.
   - Uses explicit feature flags and computes an effective dry-run mode.
   - Writes run status to `automation-engine-status.json` and uploads it as an artifact.
   - Writes a human-readable execution summary to the Actions run summary.

2. **Verification workflow**
   - Triggered manually, every 6 hours, and on PRs that modify engine files.
   - Runs `scripts/verify_automation_engine.py`.
   - Produces markdown + JSON verification outputs and uploads them as artifacts.
   - Fails on invariant violations so regressions are visible immediately.

## Triggers

- Bootstrap:
  - `workflow_dispatch` with `dry_run` input (default `true`)
  - `schedule`: `17 * * * *` (hourly)
- Verify:
  - `workflow_dispatch`
  - `schedule`: `47 */6 * * *`
  - `pull_request` on engine-related files

## Safety model

- Default permissions are read-only (`contents: read`).
- Concurrency groups prevent overlapping bootstrap or verify runs.
- Job-level timeouts prevent runaway execution.
- Feature flags are explicit:
  - `ENGINE_ENABLED` (repository variable, default `false`)
  - `DRY_RUN_DEFAULT` (repository variable, default `true`)
- No force push, branch deletion, or destructive mutation commands are used.

## Runbook

### First run

1. Open **Actions** → **Automation Engine Bootstrap**.
2. Run workflow manually with `dry_run=true`.
3. Confirm the run summary indicates guardrails and effective mode.
4. Download the `automation-engine-bootstrap-status-*` artifact and confirm fields.
5. Run **Automation Engine Verify** and confirm status is `passed`.

### Enable schedule

1. In repository **Settings** → **Secrets and variables** → **Actions** → **Variables**:
   - Set `ENGINE_ENABLED=true`
   - Keep `DRY_RUN_DEFAULT=true` initially.
2. Observe one scheduled bootstrap run.
3. If behavior is stable, optionally set `DRY_RUN_DEFAULT=false` for future operational phases.

### Disable quickly

Fast stop path (no code change required):

1. Set `ENGINE_ENABLED=false` in repository variables.
2. Optional: disable the two workflows in the Actions UI.
3. Re-run verify workflow to confirm safety invariants still hold.

### Troubleshooting

- **Bootstrap appears blocked**: check summary for `ENGINE_ENABLED` value and guardrail reason.
- **Verify fails**: open `automation-engine-verify-report.json` artifact and fix listed invariants.
- **Missing artifacts**: ensure workflow reached upload step and did not fail before output file creation.
- **Fork limitations**: keep permissions read-only and rely on summaries/artifacts when write scopes are unavailable.

## Incident rollback steps

1. Set `ENGINE_ENABLED=false` immediately.
2. Disable scheduled workflows from Actions UI if additional containment is needed.
3. Review latest bootstrap + verify artifacts for root cause clues.
4. Re-enable only after verify is green and manual dry-run checks pass.
