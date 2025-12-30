#!/usr/bin/env python3
"""
9-Second Pulse Repository Merger
Continuous automation that audits and merges all ecosystem repos every 9 seconds

Author: OmniGrid Automation
Date: 2025-12-29
"""

import asyncio
import time
import subprocess
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple

class PulseRepoMerger:
    """Continuous 9-second pulse for repo auditing and merging"""

    def __init__(self):
        self.pulse_interval = 9.0  # 9 seconds
        self.git_proxy = "http://127.0.0.1:33459/git/heyns1000"
        self.workspace = Path("/home/user/ecosystem_workspace")
        self.workspace.mkdir(exist_ok=True)

        # All ecosystem repos (will auto-discover more)
        self.repos = [
            "omnigrid", "hotstack", "nexus-nair", "vaultmesh",
            "buildnest", "codenest", "seedwave", "banimal", "faa.zone",
            "Fruitful-global-deployment", "FruitfulAssist", "LicenseVault",
            "SeedwaveConnect", "baobab-bush-portal"
        ]

        self.repo_index = 0  # Track rotation
        self.repos_per_pulse = 3  # Process 3 repos per 9s cycle

        self.stats = {
            "total_pulses": 0,
            "repos_merged": 0,
            "branches_merged": 0,
            "errors": 0,
            "start_time": datetime.now().isoformat()
        }

    async def git_command(self, repo_dir: Path, command: str) -> Tuple[bool, str]:
        """Execute git command with proper proxy"""
        try:
            result = subprocess.run(
                f"cd {repo_dir} && {command}",
                shell=True,
                capture_output=True,
                text=True,
                timeout=30
            )
            return result.returncode == 0, result.stdout + result.stderr
        except Exception as e:
            return False, str(e)

    async def clone_or_update_repo(self, repo_name: str) -> Path:
        """Clone repo or update if exists"""
        repo_path = self.workspace / repo_name

        if repo_path.exists():
            # Update existing
            success, output = await self.git_command(repo_path, "git fetch --all --prune")
            if not success:
                print(f"  ⚠️  Fetch failed for {repo_name}")
        else:
            # Clone fresh
            clone_url = f"{self.git_proxy}/{repo_name}.git"
            cmd = f"cd {self.workspace} && git clone {clone_url}"
            subprocess.run(cmd, shell=True, capture_output=True)
            print(f"  📥 Cloned {repo_name}")

        return repo_path

    async def get_branches_behind_main(self, repo_path: Path) -> List[Dict]:
        """Get all branches that are behind main"""
        # Get all remote branches
        success, output = await self.git_command(
            repo_path,
            "git branch -r --list 'origin/*' | grep -v HEAD | grep -v main"
        )

        if not success:
            return []

        branches = []
        for line in output.strip().split('\n'):
            if not line.strip():
                continue

            branch = line.strip().replace('origin/', '')

            # Check if behind main
            success, count_output = await self.git_command(
                repo_path,
                f"git rev-list --count origin/{branch}..origin/main"
            )

            if success and count_output.strip().isdigit():
                behind = int(count_output.strip())
                if behind > 0:
                    branches.append({
                        "name": branch,
                        "behind": behind
                    })

        return branches

    async def merge_branch(self, repo_path: Path, repo_name: str, branch: str) -> bool:
        """Merge main into branch and push"""
        try:
            # Checkout branch
            success, _ = await self.git_command(
                repo_path,
                f"git checkout -B {branch} origin/{branch}"
            )
            if not success:
                return False

            # Merge main
            success, _ = await self.git_command(
                repo_path,
                f"git merge origin/main -m 'Auto-merge main into {branch} via 9s pulse' --no-gpg-sign"
            )
            if not success:
                # Merge conflict - abort and skip
                await self.git_command(repo_path, "git merge --abort")
                return False

            # Push
            for retry in range(4):
                if retry > 0:
                    await asyncio.sleep(2 ** retry)

                success, _ = await self.git_command(
                    repo_path,
                    f"git push origin {branch}"
                )
                if success:
                    self.stats["branches_merged"] += 1
                    return True

            return False

        except Exception as e:
            print(f"  ❌ Error merging {branch}: {e}")
            return False

    async def process_repo(self, repo_name: str):
        """Process one repo: check branches and merge"""
        print(f"\n🔍 {repo_name}")

        # Clone/update
        repo_path = await self.clone_or_update_repo(repo_name)

        # Get branches behind main
        branches_behind = await self.get_branches_behind_main(repo_path)

        if not branches_behind:
            print(f"  ✅ All branches up to date")
            return

        print(f"  ⚠️  {len(branches_behind)} branches behind main")

        # Merge branches
        merged_count = 0
        for branch_info in branches_behind[:5]:  # Limit to 5 per pulse
            branch = branch_info["name"]
            behind = branch_info["behind"]

            print(f"  🔄 Merging {branch} ({behind} commits behind)...")
            success = await self.merge_branch(repo_path, repo_name, branch)

            if success:
                print(f"  ✅ Merged and pushed {branch}")
                merged_count += 1
            else:
                print(f"  ❌ Failed to merge {branch}")

        if merged_count > 0:
            self.stats["repos_merged"] += 1

    async def pulse_cycle(self):
        """One 9-second pulse cycle"""
        cycle_start = time.time()
        self.stats["total_pulses"] += 1

        print(f"\n╔════════════════════════════════════════════════════════════════╗")
        print(f"║  PULSE #{self.stats['total_pulses']:04d} - {datetime.now().strftime('%H:%M:%S')}                                         ║")
        print(f"╚════════════════════════════════════════════════════════════════╝")

        # Get next batch of repos to process (rotating)
        start_idx = self.repo_index
        end_idx = min(start_idx + self.repos_per_pulse, len(self.repos))
        current_batch = self.repos[start_idx:end_idx]

        # Rotate index for next pulse
        self.repo_index = (self.repo_index + self.repos_per_pulse) % len(self.repos)

        print(f"🔄 Processing repos {start_idx + 1}-{end_idx} of {len(self.repos)}")

        # Process current batch
        tasks = [self.process_repo(repo) for repo in current_batch]
        await asyncio.gather(*tasks, return_exceptions=True)

        # Wait remaining time to complete 9s cycle
        elapsed = time.time() - cycle_start
        if elapsed < self.pulse_interval:
            await asyncio.sleep(self.pulse_interval - elapsed)

        # Stats
        print(f"\n📊 Stats: {self.stats['repos_merged']} repos, {self.stats['branches_merged']} branches merged")
        print(f"⏱️  Cycle: {elapsed:.2f}s")

    async def run_forever(self):
        """Run continuous 9-second pulse"""
        print(f"""
╔════════════════════════════════════════════════════════════════╗
║     9-SECOND PULSE REPOSITORY MERGER                          ║
║     Continuous Automation for {len(self.repos)} repos                         ║
╚════════════════════════════════════════════════════════════════╝

Starting continuous 9-second pulse automation...
Press Ctrl+C to stop.
""")

        try:
            while True:
                try:
                    await self.pulse_cycle()
                except Exception as e:
                    print(f"❌ Pulse error: {e}")
                    self.stats["errors"] += 1
                    await asyncio.sleep(9)
        except KeyboardInterrupt:
            print(f"\n\n⏹️  Stopping pulse automation...")
            print(f"\n📊 Final Stats:")
            print(f"   Total Pulses: {self.stats['total_pulses']}")
            print(f"   Repos Merged: {self.stats['repos_merged']}")
            print(f"   Branches Merged: {self.stats['branches_merged']}")
            print(f"   Errors: {self.stats['errors']}")
            print(f"\nSimunye. The grid breathes. 🌍\n")


async def main():
    """Main entry point"""
    merger = PulseRepoMerger()
    await merger.run_forever()


if __name__ == "__main__":
    asyncio.run(main())
