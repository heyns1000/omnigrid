#!/usr/bin/env python3
"""
CodeNest Connection Status Checker
Analyzes which repositories are connected to the CodeNest monorepo
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Set


class CodeNestConnectionChecker:
    """Analyzes CodeNest connections and generates integration recommendations"""
    
    def __init__(self):
        """Initialize checker"""
        self.connection_status = {
            "audit_timestamp": datetime.now(timezone.utc).isoformat(),
            "total_repos_in_codenest": 0,
            "connection_paths": {},
            "connected_repos": [],
            "disconnected_repos": []
        }
        self.codenest_repos: Set[str] = set()
        self.omnigrid_repos: Set[str] = set()
    
    def load_codenest_manifest(self, manifest_path: str) -> Dict:
        """Load CodeNest ecosystem manifest"""
        manifest_file = Path(manifest_path)
        
        # For now, we'll simulate the manifest since we don't have access to codenest repo
        # In production, this would read from ../codenest/main/ecosystem-manifest.json
        print(f"📋 Loading CodeNest manifest: {manifest_path}")
        
        if manifest_file.exists():
            with open(manifest_file) as f:
                manifest = json.load(f)
        else:
            print("⚠️  CodeNest manifest not found, using known structure")
            manifest = {
                "packages": {
                    "apps": [
                        "adele", "banimal", "careers", "claimroot", "faau-realm",
                        "licensevault", "noodle-juice", "payment", "payroll",
                        "seedwave-connect", "seedwave-core", "wildbutcher", "zoho"
                    ],
                    "fruitful": [
                        "footer-global", "global-deployment", "planet-change",
                        "baobab", "python-backend", "core", "crate-dance",
                        "api-platform", "home", "drive", "banimal", "global",
                        "zerowaste", "admin"
                    ],
                    "seedwave-sectors": [
                        "mining", "fsf", "voice", "media", "education-ip",
                        "wildlife", "justice", "ai-logic", "agriculture",
                        "banking", "utilities", "trade", "toynest", "healthcare",
                        "entertainment", "transport", "energy", "water",
                        "sanitation", "housing", "food-security", "textiles",
                        "manufacturing", "construction", "tourism", "retail",
                        "wholesale", "import-export", "shipping", "aviation",
                        "maritime", "rail", "road", "telecom", "broadband",
                        "mobile", "satellite", "broadcasting", "publishing",
                        "printing", "packaging", "chemicals", "pharmaceuticals",
                        "cosmetics", "beverages", "tobacco", "furniture",
                        "appliances", "electronics", "semiconductors", "software",
                        "consulting", "legal", "accounting", "insurance",
                        "real-estate", "security", "cleaning", "catering"
                    ]
                }
            }
        
        # Extract all repos from manifest
        for category, repos in manifest.get("packages", {}).items():
            self.connection_status["connection_paths"][f"packages/{category}/"] = len(repos)
            for repo in repos:
                self.codenest_repos.add(repo.lower())
        
        self.connection_status["total_repos_in_codenest"] = len(self.codenest_repos)
        
        print(f"   ✅ Found {len(self.codenest_repos)} repos in CodeNest")
        print(f"   📦 packages/apps/: {len(manifest.get('packages', {}).get('apps', []))}")
        print(f"   🍎 packages/fruitful/: {len(manifest.get('packages', {}).get('fruitful', []))}")
        print(f"   🌾 packages/seedwave-sectors/: {len(manifest.get('packages', {}).get('seedwave-sectors', []))}")
        
        return manifest
    
    def load_omnigrid_config(self, config_path: str):
        """Load omnigrid ecosystem config"""
        config_file = Path(config_path)
        if not config_file.exists():
            raise FileNotFoundError(f"Config file not found: {config_path}")
        
        with open(config_file) as f:
            config = json.load(f)
        
        repositories = config.get("repositories", [])
        print(f"\n📋 Loading OmniGrid config: {config_path}")
        print(f"   ✅ Found {len(repositories)} repos in OmniGrid config")
        
        # Extract repo names (without owner prefix)
        for repo_full in repositories:
            if "/" in repo_full:
                repo_name = repo_full.split("/")[1]
                self.omnigrid_repos.add(repo_name.lower())
        
        return config
    
    def analyze_connections(self, omnigrid_config: Dict, audit_results: Dict = None):
        """Analyze connection status between OmniGrid and CodeNest"""
        print("\n🔍 Analyzing connections...")
        
        repositories = omnigrid_config.get("repositories", [])
        
        for repo_full in repositories:
            if "/" not in repo_full:
                continue
            
            owner, repo_name = repo_full.split("/", 1)
            repo_lower = repo_name.lower()
            
            # Check if repo exists (from audit results if available)
            exists = True
            if audit_results:
                exists = any(
                    r["name"] == repo_full and r["exists"]
                    for r in audit_results.get("existing_repos", [])
                )
            
            # Determine connection status
            is_connected = repo_lower in self.codenest_repos
            
            if is_connected:
                # Determine the package path
                integration_path = self._determine_package_path(repo_name)
                self.connection_status["connected_repos"].append({
                    "name": repo_full,
                    "repo_name": repo_name,
                    "exists": exists,
                    "integration_path": integration_path
                })
            else:
                # Not connected - suggest integration path
                integration_path = self._suggest_integration_path(repo_name, omnigrid_config)
                self.connection_status["disconnected_repos"].append({
                    "name": repo_full,
                    "repo_name": repo_name,
                    "exists": exists,
                    "reason": "standalone repo, not in codenest packages",
                    "integration_path": integration_path,
                    "action_required": "add to pnpm workspace, create package.json"
                })
        
        print(f"   ✅ Connected to CodeNest: {len(self.connection_status['connected_repos'])}")
        print(f"   ⚠️  Not connected: {len(self.connection_status['disconnected_repos'])}")
    
    def _determine_package_path(self, repo_name: str) -> str:
        """Determine which packages/ path the repo is in"""
        # This is a simplified heuristic
        repo_lower = repo_name.lower()
        
        # Check known patterns
        if any(keyword in repo_lower for keyword in [
            "seedwave", "sector", "mining", "agriculture", "banking",
            "healthcare", "education", "toynest"
        ]):
            return f"packages/seedwave-sectors/{repo_name}"
        
        if any(keyword in repo_lower for keyword in [
            "fruitful", "planet", "global", "baobab", "zerowaste"
        ]):
            return f"packages/fruitful/{repo_name}"
        
        # Default to apps
        return f"packages/apps/{repo_name}"
    
    def _suggest_integration_path(self, repo_name: str, config: Dict) -> str:
        """Suggest integration path based on repo characteristics"""
        repo_lower = repo_name.lower()
        
        # Infrastructure repos
        if any(keyword in repo_lower for keyword in [
            "omnigrid", "buildnest", "codenest", "hotstack",
            "vaultmesh", "pulse", "ci-", "deployment"
        ]):
            return f"packages/infrastructure/{repo_name}"
        
        # Financial services
        if any(keyword in repo_lower for keyword in [
            "payroll", "actuary", "finance", "payment", "custody",
            "ledger", "vault", "risk"
        ]):
            return f"packages/apps/{repo_name}"
        
        # Healthcare
        if any(keyword in repo_lower for keyword in [
            "health", "medical", "patient", "pharma", "clinical"
        ]):
            return f"packages/apps/{repo_name}"
        
        # Education
        if any(keyword in repo_lower for keyword in [
            "edu", "learning", "course", "student", "certification"
        ]):
            return f"packages/apps/{repo_name}"
        
        # E-commerce
        if any(keyword in repo_lower for keyword in [
            "inventory", "order", "shipping", "price", "product",
            "customer", "loyalty", "marketplace", "vendor", "fulfillment"
        ]):
            return f"packages/apps/{repo_name}"
        
        # Default to apps
        return f"packages/apps/{repo_name}"
    
    def save_report(self, output_path: str):
        """Save connection status to JSON file"""
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(self.connection_status, f, indent=2)
        
        print(f"\n✅ Connection status saved: {output_path}")
    
    def print_summary(self):
        """Print connection summary"""
        print("\n" + "=" * 70)
        print("📊 CODENEST CONNECTION SUMMARY")
        print("=" * 70)
        print(f"Total repos in CodeNest:  {self.connection_status['total_repos_in_codenest']}")
        print(f"Connected repos:          {len(self.connection_status['connected_repos'])}")
        print(f"Disconnected repos:       {len(self.connection_status['disconnected_repos'])}")
        print()
        
        if self.connection_status['disconnected_repos']:
            print("⚠️  REPOS NEEDING INTEGRATION:")
            for repo in self.connection_status['disconnected_repos'][:10]:
                print(f"   • {repo['name']} → {repo['integration_path']}")
            
            if len(self.connection_status['disconnected_repos']) > 10:
                remaining = len(self.connection_status['disconnected_repos']) - 10
                print(f"   ... and {remaining} more")
        
        print("=" * 70)


def main():
    """Main execution"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Check CodeNest connection status"
    )
    parser.add_argument(
        "--manifest",
        default="../codenest/main/ecosystem-manifest.json",
        help="Path to CodeNest ecosystem manifest"
    )
    parser.add_argument(
        "--config",
        default="config/ecosystem-repos.json",
        help="Path to OmniGrid ecosystem config"
    )
    parser.add_argument(
        "--audit-file",
        help="Optional: Path to audit results JSON for existence checks"
    )
    parser.add_argument(
        "--output",
        default="audit/codenest-connection-status.json",
        help="Output path for connection status"
    )
    
    args = parser.parse_args()
    
    try:
        checker = CodeNestConnectionChecker()
        
        # Load CodeNest manifest
        checker.load_codenest_manifest(args.manifest)
        
        # Load OmniGrid config
        omnigrid_config = checker.load_omnigrid_config(args.config)
        
        # Load audit results if provided
        audit_results = None
        if args.audit_file and Path(args.audit_file).exists():
            with open(args.audit_file) as f:
                audit_results = json.load(f)
        
        # Analyze connections
        checker.analyze_connections(omnigrid_config, audit_results)
        
        # Save and display results
        checker.save_report(args.output)
        checker.print_summary()
        
        return 0
        
    except Exception as e:
        print(f"\n❌ Check failed: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
