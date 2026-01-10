#!/usr/bin/env python3
"""
HotStack Ecosystem Deployment Orchestrator

Deploys and manages all repositories in the HotStack ecosystem.

Author: Fruitful Holdings (Pty) Ltd
Date: December 29, 2025
"""

import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

# ANSI Colors
class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    PURPLE = '\033[0;35m'
    CYAN = '\033[0;36m'
    NC = '\033[0m'  # No Color

# Ecosystem configuration
ECOSYSTEM_CONFIG = {
    "hub": {
        "name": "omnigrid",
        "role": "Central Hub",
        "deploy_priority": 1,
        "health_check": "http://localhost:3000/health"
    },
    "platform": {
        "name": "hotstack",
        "role": "Main Platform",
        "deploy_priority": 2,
        "health_check": "http://localhost:8080/status"
    },
    "ai": {
        "name": "nexus-nair",
        "role": "AI Operations",
        "deploy_priority": 3,
        "health_check": "http://localhost:5000/api/health"
    },
    "security": {
        "name": "vaultmesh",
        "role": "Secure Data Mesh",
        "deploy_priority": 4,
        "health_check": "http://localhost:4000/health"
    },
    "build": {
        "name": "buildnest",
        "role": "Build Automation",
        "deploy_priority": 5,
        "health_check": None
    },
    "code": {
        "name": "codenest",
        "role": "Code Management",
        "deploy_priority": 6,
        "health_check": None
    },
    "data": {
        "name": "seedwave",
        "role": "Seed & Deployment",
        "deploy_priority": 7,
        "health_check": None
    },
    "brand": {
        "name": "banimal",
        "role": "Brand System",
        "deploy_priority": 8,
        "health_check": None
    },
    "faa": {
        "name": "faa.zone",
        "role": "FAA Zone Management",
        "deploy_priority": 9,
        "health_check": None
    }
}


class DeploymentOrchestrator:
    """Manages deployment across the entire ecosystem."""

    def __init__(self, repos_path: str = "/tmp/ecosystem-sync/repos"):
        self.repos_path = Path(repos_path)
        self.deployment_log = []
        self.start_time = datetime.now()

    def log(self, message: str, color: str = Colors.NC):
        """Log a message with timestamp and color."""
        timestamp = datetime.now().strftime("%H:%M:%S")
        formatted_msg = f"{Colors.GREEN}[{timestamp}]{color} {message}{Colors.NC}"
        print(formatted_msg)
        self.deployment_log.append(f"[{timestamp}] {message}")

    def error(self, message: str):
        """Log an error message."""
        self.log(f"ERROR: {message}", Colors.RED)

    def warn(self, message: str):
        """Log a warning message."""
        self.log(f"WARN: {message}", Colors.YELLOW)

    def info(self, message: str):
        """Log an info message."""
        self.log(f"INFO: {message}", Colors.BLUE)

    def print_banner(self):
        """Print deployment banner."""
        banner = f"""{Colors.PURPLE}
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     HotStack Ecosystem Deployment Orchestrator             ║
║                                                            ║
║     Unified deployment across 12 repositories              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
{Colors.NC}"""
        print(banner)

    def check_repository_exists(self, repo_name: str) -> bool:
        """Check if a repository directory exists."""
        repo_path = self.repos_path / repo_name
        return repo_path.exists() and repo_path.is_dir()

    def run_command(self, cmd: List[str], cwd: Optional[Path] = None,
                    check: bool = True) -> subprocess.CompletedProcess:
        """Run a shell command and return the result."""
        try:
            result = subprocess.run(
                cmd,
                cwd=cwd,
                capture_output=True,
                text=True,
                check=check
            )
            return result
        except subprocess.CalledProcessError as e:
            self.error(f"Command failed: {' '.join(cmd)}")
            self.error(f"Output: {e.stdout}")
            self.error(f"Error: {e.stderr}")
            raise

    def detect_project_type(self, repo_path: Path) -> str:
        """Detect the type of project (Node.js, Python, Go, etc.)."""
        # Check for package manager lock files to determine preferred tool
        if (repo_path / "package.json").exists():
            if (repo_path / "pnpm-lock.yaml").exists():
                return "nodejs-pnpm"
            elif (repo_path / "yarn.lock").exists():
                return "nodejs-yarn"
            else:
                return "nodejs"
        elif (repo_path / "requirements.txt").exists() or (repo_path / "pyproject.toml").exists():
            return "python"
        elif (repo_path / "Pipfile").exists():
            return "python-pipenv"
        elif (repo_path / "poetry.lock").exists():
            return "python-poetry"
        elif (repo_path / "go.mod").exists():
            return "go"
        elif (repo_path / "Cargo.toml").exists():
            return "rust"
        elif (repo_path / "pom.xml").exists():
            return "java"
        elif (repo_path / "composer.json").exists():
            return "php"
        elif (repo_path / "Gemfile").exists():
            return "ruby"
        else:
            return "unknown"

    def install_dependencies(self, repo_path: Path, project_type: str):
        """Install project dependencies based on type."""
        self.info(f"Installing dependencies ({project_type})...")

        try:
            if project_type == "nodejs":
                self.run_command(["npm", "install"], cwd=repo_path)
            elif project_type == "nodejs-yarn":
                self.run_command(["yarn", "install"], cwd=repo_path)
            elif project_type == "nodejs-pnpm":
                self.run_command(["pnpm", "install"], cwd=repo_path)
            elif project_type == "python":
                # Try pip3 first, fall back to pip
                try:
                    self.run_command(["pip3", "install", "-r", "requirements.txt"], cwd=repo_path, check=False)
                except subprocess.CalledProcessError:
                    self.run_command(["pip", "install", "-r", "requirements.txt"], cwd=repo_path, check=False)
            elif project_type == "python-pipenv":
                self.run_command(["pipenv", "install"], cwd=repo_path)
            elif project_type == "python-poetry":
                self.run_command(["poetry", "install"], cwd=repo_path)
            elif project_type == "go":
                self.run_command(["go", "mod", "download"], cwd=repo_path)
            elif project_type == "rust":
                self.run_command(["cargo", "fetch"], cwd=repo_path)
            elif project_type == "php":
                self.run_command(["composer", "install"], cwd=repo_path)
            elif project_type == "ruby":
                self.run_command(["bundle", "install"], cwd=repo_path)
        except (subprocess.CalledProcessError, FileNotFoundError, OSError) as e:
            self.warn(f"Dependency installation failed: {e}")

    def build_project(self, repo_path: Path, project_type: str):
        """Build the project."""
        self.info(f"Building project ({project_type})...")

        try:
            if project_type in ["nodejs", "nodejs-yarn", "nodejs-pnpm"]:
                # Check if build script exists
                package_json = repo_path / "package.json"
                if package_json.exists():
                    with open(package_json) as f:
                        pkg_data = json.load(f)
                        if "build" in pkg_data.get("scripts", {}):
                            if project_type == "nodejs-yarn":
                                self.run_command(["yarn", "build"], cwd=repo_path)
                            elif project_type == "nodejs-pnpm":
                                self.run_command(["pnpm", "build"], cwd=repo_path)
                            else:
                                self.run_command(["npm", "run", "build"], cwd=repo_path)
            elif project_type == "go":
                self.run_command(["go", "build", "./..."], cwd=repo_path)
            elif project_type == "rust":
                self.run_command(["cargo", "build", "--release"], cwd=repo_path)
        except (subprocess.CalledProcessError, FileNotFoundError, json.JSONDecodeError, OSError) as e:
            self.warn(f"Build failed: {e}")

    def run_tests(self, repo_path: Path, project_type: str):
        """Run project tests."""
        self.info(f"Running tests ({project_type})...")

        try:
            if project_type == "nodejs":
                self.run_command(["npm", "test"], cwd=repo_path, check=False)
            elif project_type == "nodejs-yarn":
                self.run_command(["yarn", "test"], cwd=repo_path, check=False)
            elif project_type == "nodejs-pnpm":
                self.run_command(["pnpm", "test"], cwd=repo_path, check=False)
            elif project_type in ["python", "python-pipenv", "python-poetry"]:
                self.run_command(["pytest"], cwd=repo_path, check=False)
            elif project_type == "go":
                self.run_command(["go", "test", "./..."], cwd=repo_path, check=False)
            elif project_type == "rust":
                self.run_command(["cargo", "test"], cwd=repo_path, check=False)
            elif project_type == "php":
                self.run_command(["composer", "test"], cwd=repo_path, check=False)
            elif project_type == "ruby":
                self.run_command(["bundle", "exec", "rspec"], cwd=repo_path, check=False)
        except (subprocess.CalledProcessError, FileNotFoundError, OSError) as e:
            self.warn(f"Tests failed or not available: {e}")

    def deploy_repository(self, config: Dict) -> bool:
        """Deploy a single repository."""
        repo_name = config["name"]
        role = config["role"]

        self.log(f"\n{'=' * 60}")
        self.log(f"Deploying: {repo_name} ({role})", Colors.CYAN)
        self.log(f"{'=' * 60}")

        repo_path = self.repos_path / repo_name

        if not self.check_repository_exists(repo_name):
            self.error(f"Repository not found: {repo_path}")
            return False

        try:
            # Detect project type
            project_type = self.detect_project_type(repo_path)
            self.info(f"Project type: {project_type}")

            # Install dependencies
            if project_type != "unknown":
                self.install_dependencies(repo_path, project_type)

            # Build project
            self.build_project(repo_path, project_type)

            # Run tests
            self.run_tests(repo_path, project_type)

            self.log(f"✓ Successfully deployed {repo_name}", Colors.GREEN)
            return True

        except Exception as e:
            self.error(f"Deployment failed for {repo_name}: {e}")
            return False

    def deploy_all(self):
        """Deploy all repositories in priority order."""
        self.print_banner()
        self.log("Starting ecosystem-wide deployment...")

        # Sort by deploy priority
        sorted_configs = sorted(
            ECOSYSTEM_CONFIG.items(),
            key=lambda x: x[1]["deploy_priority"]
        )

        success_count = 0
        total_count = len(sorted_configs)

        for service_key, config in sorted_configs:
            if self.deploy_repository(config):
                success_count += 1

        # Print summary
        self.print_summary(success_count, total_count)

    def print_summary(self, success: int, total: int):
        """Print deployment summary."""
        duration = (datetime.now() - self.start_time).total_seconds()

        print(f"\n{Colors.PURPLE}{'=' * 60}")
        print("DEPLOYMENT SUMMARY")
        print(f"{'=' * 60}{Colors.NC}")
        print(f"  Total Repositories: {total}")
        print(f"  {Colors.GREEN}Successful: {success}{Colors.NC}")
        print(f"  {Colors.RED}Failed: {total - success}{Colors.NC}")
        print(f"  Duration: {duration:.2f}s")
        print(f"{Colors.PURPLE}{'=' * 60}{Colors.NC}\n")

        # Save log
        log_file = Path.home() / "hotstack-deployment.log"
        with open(log_file, "w") as f:
            f.write("\n".join(self.deployment_log))
        self.log(f"Log saved to: {log_file}")


def main():
    """Main entry point."""
    orchestrator = DeploymentOrchestrator()
    orchestrator.deploy_all()


if __name__ == "__main__":
    main()
