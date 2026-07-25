#!/usr/bin/env python3

import tempfile
import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
import verify_automation_engine as verifier


class VerifyAutomationEngineTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.repo_root = Path(self.temp_dir.name)
        (self.repo_root / ".github/workflows").mkdir(parents=True)

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def write_workflow(self, name: str, content: str) -> None:
        (self.repo_root / ".github/workflows" / name).write_text(content, encoding="utf-8")

    def test_validation_passes_for_safe_workflows(self) -> None:
        self.write_workflow(
            "automation-engine-bootstrap.yml",
            """
name: Bootstrap
on:
  workflow_dispatch:
    inputs:
      dry_run:
        default: true
  schedule:
    - cron: '17 * * * *'
permissions:
  contents: read
concurrency:
  group: one
jobs:
  bootstrap:
    timeout-minutes: 10
    runs-on: ubuntu-latest
    steps:
      - run: echo ok

env:
  ENGINE_ENABLED: ${{ vars.ENGINE_ENABLED || 'false' }}
  DRY_RUN_DEFAULT: ${{ vars.DRY_RUN_DEFAULT || 'true' }}
""",
        )
        self.write_workflow(
            "automation-engine-verify.yml",
            """
name: Verify
on:
  workflow_dispatch:
  schedule:
    - cron: '47 */6 * * *'
permissions:
  contents: read
concurrency:
  group: two
jobs:
  verify:
    timeout-minutes: 10
    runs-on: ubuntu-latest
    steps:
      - run: echo "x" >> "$GITHUB_STEP_SUMMARY"
""",
        )

        errors, _ = verifier.run_validation(self.repo_root)
        self.assertEqual(errors, [])

    def test_validation_fails_without_concurrency(self) -> None:
        self.write_workflow(
            "automation-engine-bootstrap.yml",
            """
name: Bootstrap
on:
  workflow_dispatch:
    inputs:
      dry_run:
        default: true
  schedule:
    - cron: '17 * * * *'
permissions:
  contents: read
jobs:
  bootstrap:
    timeout-minutes: 10
    runs-on: ubuntu-latest
    steps:
      - run: echo ok

env:
  ENGINE_ENABLED: true
  DRY_RUN_DEFAULT: true
""",
        )
        self.write_workflow(
            "automation-engine-verify.yml",
            """
name: Verify
on:
  workflow_dispatch:
  schedule:
    - cron: '47 */6 * * *'
permissions:
  contents: read
concurrency:
  group: two
jobs:
  verify:
    timeout-minutes: 10
    runs-on: ubuntu-latest
    steps:
      - run: echo "x" >> "$GITHUB_STEP_SUMMARY"
""",
        )

        errors, _ = verifier.run_validation(self.repo_root)
        self.assertTrue(any("bootstrap: missing concurrency" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
