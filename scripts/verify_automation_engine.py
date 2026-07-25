#!/usr/bin/env python3
"""Validate automation engine workflow invariants."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import yaml

DANGEROUS_PATTERNS = (
    "git push --force",
    "git push -f",
    "git branch -D",
    "git push origin --delete",
    "gh repo delete",
    "rm -rf",
)


def load_workflow(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        data = yaml.safe_load(handle)
    if not isinstance(data, dict):
        raise ValueError(f"{path} must be a YAML object")
    return data


def on_section(workflow: dict[str, Any]) -> dict[str, Any]:
    section = workflow.get("on", workflow.get(True, {}))
    return section if isinstance(section, dict) else {}


def collect_run_commands(workflow: dict[str, Any]) -> str:
    commands: list[str] = []
    jobs = workflow.get("jobs", {})
    if not isinstance(jobs, dict):
        return ""
    for job in jobs.values():
        if not isinstance(job, dict):
            continue
        for step in job.get("steps", []):
            if isinstance(step, dict) and isinstance(step.get("run"), str):
                commands.append(step["run"])
    return "\n".join(commands)


def validate_bootstrap(workflow: dict[str, Any], errors: list[str]) -> None:
    triggers = on_section(workflow)
    dispatch = triggers.get("workflow_dispatch")
    if not isinstance(dispatch, dict):
        errors.append("bootstrap: missing workflow_dispatch trigger")
    else:
        dry_run = dispatch.get("inputs", {}).get("dry_run", {})
        if dry_run.get("default") is not True:
            errors.append("bootstrap: workflow_dispatch dry_run default must be true")

    if "schedule" not in triggers:
        errors.append("bootstrap: missing schedule trigger")

    env = workflow.get("env", {})
    if not isinstance(env, dict) or "ENGINE_ENABLED" not in env or "DRY_RUN_DEFAULT" not in env:
        errors.append("bootstrap: missing ENGINE_ENABLED/DRY_RUN_DEFAULT feature flags")


def validate_common(name: str, workflow: dict[str, Any], errors: list[str]) -> None:
    permissions = workflow.get("permissions", {})
    if not isinstance(permissions, dict) or permissions.get("contents") != "read":
        errors.append(f"{name}: permissions.contents must be read")

    if "concurrency" not in workflow:
        errors.append(f"{name}: missing concurrency configuration")

    jobs = workflow.get("jobs", {})
    if not isinstance(jobs, dict) or not jobs:
        errors.append(f"{name}: must define at least one job")
        return

    for job_name, job in jobs.items():
        if not isinstance(job, dict) or "timeout-minutes" not in job:
            errors.append(f"{name}: job '{job_name}' missing timeout-minutes")


def validate_verify(workflow: dict[str, Any], errors: list[str]) -> None:
    triggers = on_section(workflow)
    if "workflow_dispatch" not in triggers:
        errors.append("verify: missing workflow_dispatch trigger")
    if "schedule" not in triggers:
        errors.append("verify: missing schedule trigger")

    command_block = collect_run_commands(workflow)
    if "GITHUB_STEP_SUMMARY" not in command_block:
        errors.append("verify: must write actionable status to GITHUB_STEP_SUMMARY")


def validate_no_destructive_commands(workflow: dict[str, Any], errors: list[str], name: str) -> None:
    command_block = collect_run_commands(workflow).lower()
    for pattern in DANGEROUS_PATTERNS:
        if pattern in command_block:
            errors.append(f"{name}: prohibited command pattern detected: '{pattern}'")


def run_validation(repo_root: Path) -> tuple[list[str], dict[str, Any]]:
    bootstrap_path = repo_root / ".github/workflows/automation-engine-bootstrap.yml"
    verify_path = repo_root / ".github/workflows/automation-engine-verify.yml"

    errors: list[str] = []
    report: dict[str, Any] = {
        "bootstrap_workflow": str(bootstrap_path),
        "verify_workflow": str(verify_path),
        "checks": [],
        "errors": errors,
    }

    if not bootstrap_path.exists():
        errors.append(f"missing file: {bootstrap_path}")
    if not verify_path.exists():
        errors.append(f"missing file: {verify_path}")
    if errors:
        return errors, report

    bootstrap = load_workflow(bootstrap_path)
    verify = load_workflow(verify_path)

    validate_common("bootstrap", bootstrap, errors)
    validate_common("verify", verify, errors)
    validate_bootstrap(bootstrap, errors)
    validate_verify(verify, errors)
    validate_no_destructive_commands(bootstrap, errors, "bootstrap")
    validate_no_destructive_commands(verify, errors, "verify")

    report["checks"] = [
        "workflow files exist",
        "minimal read-only permissions",
        "concurrency present",
        "job timeouts present",
        "bootstrap trigger + feature flag invariants",
        "verify summary + trigger invariants",
        "no destructive command patterns",
    ]

    return errors, report


def write_summary(summary_path: Path, errors: list[str]) -> None:
    lines = ["## Automation engine verification"]
    if errors:
        lines.append("\n### Status: ❌ failed")
        lines.append("\nInvariant violations:")
        for error in errors:
            lines.append(f"- {error}")
    else:
        lines.append("\n### Status: ✅ passed")
        lines.append("\nAll required safety and scheduling invariants are satisfied.")
    summary_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify automation engine workflow invariants")
    parser.add_argument("--repo-root", default=".", help="Repository root path")
    parser.add_argument("--summary-file", default="automation-engine-verify-summary.md")
    parser.add_argument("--report-file", default="automation-engine-verify-report.json")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    errors, report = run_validation(repo_root)

    summary_path = repo_root / args.summary_file
    report_path = repo_root / args.report_file

    write_summary(summary_path, errors)
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
