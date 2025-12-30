#!/usr/bin/env python3
"""
Claude Data Consolidation Engine
Complete analysis and reconstruction of Claude profile data

This engine extracts, analyzes, and consolidates:
- All conversations (122 total)
- All projects (14 total)
- All memories (11 project memories)
- Code snippets, brands, repos, systems, architectures

Author: Heyns Schoeman / Fruitful Holdings
Date: 2025-12-28
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Any, Set
from collections import defaultdict, Counter
from datetime import datetime


class ClaudeDataConsolidator:
    """Complete consolidation engine for Claude profile data"""

    def __init__(self, data_dir: str = "./metdata"):
        self.data_dir = Path(data_dir)
        self.conversations = []
        self.projects = []
        self.memories = {}
        self.users = []

        # Consolidated data structures
        self.all_brands = set()
        self.all_repos = set()
        self.all_technologies = Counter()
        self.all_domains = set()
        self.code_snippets = []
        self.architecture_decisions = []
        self.system_integrations = []
        self.deployment_configs = []

        # Brand ecosystem mapping
        self.brand_to_repos = defaultdict(set)
        self.brand_to_technologies = defaultdict(set)
        self.brand_to_domains = defaultdict(set)
        self.repo_to_brands = defaultdict(set)

        # System mapping
        self.systems = {}
        self.api_endpoints = []
        self.database_schemas = []

    def load_all_data(self):
        """Load all JSON files"""
        print("🔄 Loading complete Claude profile data...")

        with open(self.data_dir / "users.json", 'r') as f:
            self.users = json.load(f)

        with open(self.data_dir / "memories.json", 'r') as f:
            self.memories = json.load(f)[0]

        with open(self.data_dir / "projects.json", 'r') as f:
            self.projects = json.load(f)

        print("🔄 Loading conversations (52MB)...")
        with open(self.data_dir / "conversations.json", 'r') as f:
            self.conversations = json.load(f)

        print(f"✅ Loaded: {len(self.conversations)} conversations, {len(self.projects)} projects")

    def extract_brands(self):
        """Extract ALL brand mentions from conversations and memories"""
        print("\n🏢 EXTRACTING BRAND ECOSYSTEM...")

        # Trademark brands from all text
        trademark_pattern = r'(\w+)™'

        # Search in memories
        memory_text = json.dumps(self.memories)
        trademarks = re.findall(trademark_pattern, memory_text)
        self.all_brands.update(trademarks)

        # Search all conversations
        for conv in self.conversations:
            conv_text = f"{conv.get('name', '')} {conv.get('summary', '')}"

            # Extract trademarks
            trademarks = re.findall(trademark_pattern, conv_text)
            self.all_brands.update(trademarks)

            # Search in messages
            for msg in conv.get('chat_messages', []):
                msg_text = msg.get('text', '')
                trademarks = re.findall(trademark_pattern, msg_text)
                self.all_brands.update(trademarks)

        # Known brand patterns from memories
        known_brands = [
            'Fruitful', 'HotStack', 'BuildNest', 'CodeNest', 'ToyNest',
            'VaultMesh', 'VaultPay', 'VaultKey', 'VaultDNA', 'VaultRouter',
            'ClaimRoot', 'ScrollStack', 'ScrollClaim', 'ScrollBinder',
            'GhostTrace', 'Banimal', 'BareCart', 'PulseTrade', 'PulseGrid',
            'Seedwave', 'FAA', 'HSOMNI', 'MonsterOmni', 'OmniGrid',
            'Shanana', 'Store40D', 'CrateLogic', 'MeshNest',
            'YouthID', 'FutureMinds', 'NEXUS_NAIR'
        ]
        self.all_brands.update(known_brands)

        print(f"✅ Extracted {len(self.all_brands)} unique brands")
        return sorted(self.all_brands)

    def extract_repositories(self):
        """Extract all GitHub repository mentions"""
        print("\n📦 EXTRACTING GITHUB REPOSITORIES...")

        # Patterns for repo mentions
        repo_patterns = [
            r'github\.com/([a-zA-Z0-9_-]+)/([a-zA-Z0-9_.-]+)',
            r'@([a-zA-Z0-9_-]+)/([a-zA-Z0-9_.-]+)',
            r'repository[:\s]+([a-zA-Z0-9_.-]+)',
            r'repo[:\s]+([a-zA-Z0-9_.-]+)'
        ]

        all_text = json.dumps(self.memories) + json.dumps([
            {'name': c.get('name', ''), 'summary': c.get('summary', '')}
            for c in self.conversations
        ])

        for pattern in repo_patterns[:2]:  # GitHub patterns
            matches = re.findall(pattern, all_text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    repo = f"{match[0]}/{match[1]}"
                else:
                    repo = match
                self.all_repos.add(repo)

        # Known repos from memories
        known_repos = [
            'heyns1000/hotstack',
            'heyns1000/codenest',
            'heyns1000/buildnest',
            'heyns1000/seedwave',
            'heyns1000/vaultmesh',
            'heyns1000/omnigrid',
            'heyns1000/banimal',
            'heyns1000/faa.zone',
            'fruitful-global-planet/fruitfulplanetchange'
        ]
        self.all_repos.update(known_repos)

        print(f"✅ Extracted {len(self.all_repos)} repositories")
        return sorted(self.all_repos)

    def extract_technologies(self):
        """Extract all technologies and tools mentioned"""
        print("\n💻 EXTRACTING TECHNOLOGY STACK...")

        tech_keywords = [
            # Languages
            'python', 'javascript', 'typescript', 'html', 'css', 'sql',
            'bash', 'shell', 'go', 'rust', 'java', 'php',

            # Frameworks
            'react', 'vue', 'angular', 'express', 'fastapi', 'django',
            'flask', 'next.js', 'node.js', 'nest.js',

            # Databases
            'postgresql', 'mysql', 'mongodb', 'redis', 'sqlite',
            'supabase', 'neon', 'planetscale',

            # Cloud/Deploy
            'cloudflare', 'vercel', 'aws', 'docker', 'kubernetes',
            'nginx', 'apache', 'workers', 'pages', 'r2',

            # Tools
            'git', 'github', 'gitlab', 'npm', 'yarn', 'pip',
            'webpack', 'vite', 'rollup', 'esbuild',

            # CMS/Ecommerce
            'wordpress', 'woocommerce', 'shopify', 'magento',

            # Payment
            'stripe', 'paypal', 'payfast',

            # Other
            'api', 'rest', 'graphql', 'websocket', 'oauth',
            'jwt', 'ssl', 'dns', 'cdn'
        ]

        all_text = json.dumps(self.conversations).lower()

        for tech in tech_keywords:
            count = all_text.count(tech.lower())
            if count > 0:
                self.all_technologies[tech] = count

        print(f"✅ Extracted {len(self.all_technologies)} technologies")
        return self.all_technologies.most_common(30)

    def extract_code_snippets(self):
        """Extract ALL code snippets from conversations"""
        print("\n💾 EXTRACTING CODE SNIPPETS...")

        code_pattern = r'```(\w+)?\n(.*?)```'

        for conv in self.conversations:
            for msg in conv.get('chat_messages', []):
                text = msg.get('text', '')
                matches = re.finditer(code_pattern, text, re.DOTALL)

                for match in matches:
                    lang = match.group(1) or 'unknown'
                    code = match.group(2)

                    self.code_snippets.append({
                        'conversation': conv.get('name', 'Untitled'),
                        'language': lang,
                        'code': code,
                        'length': len(code),
                        'created_at': conv.get('created_at', '')
                    })

        print(f"✅ Extracted {len(self.code_snippets)} code snippets")

        # Count by language
        lang_counts = Counter(s['language'] for s in self.code_snippets)
        return lang_counts

    def map_brand_ecosystem(self):
        """Map brands to repos, technologies, and domains"""
        print("\n🗺️  MAPPING BRAND ECOSYSTEM...")

        # Map brands to repos
        for brand in self.all_brands:
            brand_lower = brand.lower()
            for repo in self.all_repos:
                if brand_lower in repo.lower():
                    self.brand_to_repos[brand].add(repo)
                    self.repo_to_brands[repo].add(brand)

        # Map brands to technologies (from conversation context)
        for conv in self.conversations:
            conv_text = f"{conv.get('name', '')} {conv.get('summary', '')}".lower()

            # Find brands in this conversation
            conv_brands = [b for b in self.all_brands if b.lower() in conv_text]

            # Find technologies in this conversation
            conv_techs = [t for t in self.all_technologies.keys() if t in conv_text]

            # Map them
            for brand in conv_brands:
                for tech in conv_techs:
                    self.brand_to_technologies[brand].add(tech)

        print(f"✅ Mapped {len(self.brand_to_repos)} brands to repositories")
        print(f"✅ Mapped {len(self.brand_to_technologies)} brands to technologies")

    def extract_systems(self):
        """Extract and define core systems from conversations"""
        print("\n🏗️  EXTRACTING CORE SYSTEMS...")

        # Known systems from memories
        core_systems = {
            'HotStack': {
                'description': 'Rapid deployment platform (180-second deployment)',
                'technologies': ['cloudflare', 'workers', 'r2', 'dns'],
                'repos': ['heyns1000/hotstack'],
                'brands': ['HotStack', 'BuildNest', 'DeployNest']
            },
            'VaultMesh': {
                'description': 'Payment and checkout system',
                'technologies': ['paypal', 'payfast', 'stripe', 'api'],
                'repos': ['heyns1000/vaultmesh'],
                'brands': ['VaultMesh', 'VaultPay', 'VaultKey', 'VaultDNA']
            },
            'Seedwave': {
                'description': 'Multi-brand licensing and management',
                'technologies': ['postgresql', 'node.js', 'react'],
                'repos': ['heyns1000/seedwave'],
                'brands': ['Seedwave', 'FAA']
            },
            'Banimal': {
                'description': 'E-commerce and charitable platform',
                'technologies': ['wordpress', 'woocommerce', 'php'],
                'repos': ['heyns1000/banimal'],
                'brands': ['Banimal', 'BareCart']
            },
            'OmniGrid': {
                'description': 'CI/CD and ecosystem orchestration',
                'technologies': ['python', 'docker', 'git'],
                'repos': ['heyns1000/omnigrid'],
                'brands': ['OmniGrid', 'OmniSignal', 'PulseGrid']
            },
            'CodeNest': {
                'description': 'Repository orchestration and metadata',
                'technologies': ['git', 'github', 'node.js'],
                'repos': ['heyns1000/codenest'],
                'brands': ['CodeNest', 'BuildNest']
            }
        }

        self.systems = core_systems
        print(f"✅ Defined {len(self.systems)} core systems")
        return self.systems

    def generate_brand_registry(self) -> Dict:
        """Generate complete brand registry database"""
        print("\n📊 GENERATING BRAND REGISTRY DATABASE...")

        brand_registry = {
            'metadata': {
                'total_brands': len(self.all_brands),
                'generated_at': datetime.now().isoformat(),
                'source': 'Claude Profile Data Export'
            },
            'brands': []
        }

        for brand in sorted(self.all_brands):
            brand_entry = {
                'name': brand,
                'repositories': sorted(list(self.brand_to_repos.get(brand, set()))),
                'technologies': sorted(list(self.brand_to_technologies.get(brand, set()))),
                'domains': sorted(list(self.brand_to_domains.get(brand, set()))),
                'system': self._find_system_for_brand(brand)
            }
            brand_registry['brands'].append(brand_entry)

        print(f"✅ Generated registry for {len(brand_registry['brands'])} brands")
        return brand_registry

    def _find_system_for_brand(self, brand: str) -> str:
        """Find which system a brand belongs to"""
        for system_name, system_data in self.systems.items():
            if brand in system_data.get('brands', []):
                return system_name
        return 'Independent'

    def generate_consolidated_report(self) -> str:
        """Generate comprehensive consolidation report"""

        report = f"""
╔════════════════════════════════════════════════════════════════╗
║        CLAUDE DATA COMPLETE CONSOLIDATION REPORT               ║
║        Fruitful Holdings (Pty) Ltd                             ║
╚════════════════════════════════════════════════════════════════╝

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

═══════════════════════════════════════════════════════════════
📊 CONSOLIDATION SUMMARY
═══════════════════════════════════════════════════════════════

Data Sources Processed:
  • {len(self.conversations)} Conversations (52 MB)
  • {len(self.projects)} Projects
  • {len(self.memories.get('project_memories', {}))} Project Memories
  • {sum(len(c.get('chat_messages', [])) for c in self.conversations)} Total Messages

═══════════════════════════════════════════════════════════════
🏢 BRAND ECOSYSTEM
═══════════════════════════════════════════════════════════════

Total Brands Identified: {len(self.all_brands)}

Top Brands:
"""
        for i, brand in enumerate(sorted(self.all_brands)[:20], 1):
            repos = len(self.brand_to_repos.get(brand, set()))
            techs = len(self.brand_to_technologies.get(brand, set()))
            report += f"  {i:2d}. {brand:<20} ({repos} repos, {techs} technologies)\n"

        report += f"""
═══════════════════════════════════════════════════════════════
📦 REPOSITORY ECOSYSTEM
═══════════════════════════════════════════════════════════════

Total Repositories: {len(self.all_repos)}

Repositories:
"""
        for i, repo in enumerate(sorted(self.all_repos), 1):
            brands = len(self.repo_to_brands.get(repo, set()))
            report += f"  {i:2d}. {repo:<40} ({brands} brands)\n"

        report += f"""
═══════════════════════════════════════════════════════════════
💻 TECHNOLOGY STACK
═══════════════════════════════════════════════════════════════

Total Technologies: {len(self.all_technologies)}

Top Technologies (by mentions):
"""
        for i, (tech, count) in enumerate(self.all_technologies.most_common(20), 1):
            report += f"  {i:2d}. {tech.title():<20} {count:>4} mentions\n"

        total_lines = sum(s['code'].count('\n') for s in self.code_snippets)
        report += f"""
═══════════════════════════════════════════════════════════════
💾 CODE CONSOLIDATION
═══════════════════════════════════════════════════════════════

Total Code Snippets: {len(self.code_snippets)}
Total Lines of Code: {total_lines:,}

Code by Language:
"""
        lang_counts = Counter(s['language'] for s in self.code_snippets)
        for i, (lang, count) in enumerate(lang_counts.most_common(15), 1):
            total_lines = sum(s['code'].count('\n') for s in self.code_snippets if s['language'] == lang)
            report += f"  {i:2d}. {lang.title():<15} {count:>3} snippets, {total_lines:>5} lines\n"

        report += f"""
═══════════════════════════════════════════════════════════════
🏗️  CORE SYSTEMS
═══════════════════════════════════════════════════════════════

Total Systems: {len(self.systems)}

"""
        for system_name, system_data in self.systems.items():
            report += f"  • {system_name}\n"
            report += f"    {system_data['description']}\n"
            report += f"    Technologies: {', '.join(system_data['technologies'])}\n"
            report += f"    Brands: {', '.join(system_data['brands'])}\n\n"

        report += """
═══════════════════════════════════════════════════════════════
✨ CONSOLIDATION COMPLETE
═══════════════════════════════════════════════════════════════

Generated Files:
  1. brand_registry.json - Complete brand database
  2. repository_mapping.json - Repo to brand mappings
  3. technology_stack.json - Complete tech inventory
  4. code_library/ - Consolidated code by language
  5. system_architectures.json - Core system definitions
  6. consolidated_knowledge.json - All extracted knowledge

"""
        return report

    def export_all_consolidated_data(self, output_dir: str = "consolidated_output"):
        """Export all consolidated data to structured files"""
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)

        print(f"\n📁 EXPORTING CONSOLIDATED DATA to {output_path}/")

        # 1. Brand Registry
        brand_registry = self.generate_brand_registry()
        with open(output_path / "brand_registry.json", 'w') as f:
            json.dump(brand_registry, f, indent=2)
        print("  ✅ brand_registry.json")

        # 2. Repository Mapping
        repo_mapping = {
            'total_repositories': len(self.all_repos),
            'repositories': [
                {
                    'name': repo,
                    'brands': sorted(list(self.repo_to_brands.get(repo, set())))
                }
                for repo in sorted(self.all_repos)
            ]
        }
        with open(output_path / "repository_mapping.json", 'w') as f:
            json.dump(repo_mapping, f, indent=2)
        print("  ✅ repository_mapping.json")

        # 3. Technology Stack
        tech_stack = {
            'total_technologies': len(self.all_technologies),
            'technologies': [
                {
                    'name': tech,
                    'mentions': count,
                    'brands_using': sorted([
                        b for b in self.all_brands
                        if tech in self.brand_to_technologies.get(b, set())
                    ])
                }
                for tech, count in self.all_technologies.most_common()
            ]
        }
        with open(output_path / "technology_stack.json", 'w') as f:
            json.dump(tech_stack, f, indent=2)
        print("  ✅ technology_stack.json")

        # 4. Code Library
        code_lib_path = output_path / "code_library"
        code_lib_path.mkdir(exist_ok=True)

        # Group code by language
        code_by_lang = defaultdict(list)
        for snippet in self.code_snippets:
            code_by_lang[snippet['language']].append(snippet)

        for lang, snippets in code_by_lang.items():
            lang_file = code_lib_path / f"{lang}_code.json"
            with open(lang_file, 'w') as f:
                json.dump(snippets, f, indent=2)
        print(f"  ✅ code_library/ ({len(code_by_lang)} languages)")

        # 5. System Architectures
        with open(output_path / "system_architectures.json", 'w') as f:
            json.dump(self.systems, f, indent=2)
        print("  ✅ system_architectures.json")

        # 6. Consolidated Knowledge
        consolidated = {
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'source': 'Claude Profile Data Export',
                'conversations_analyzed': len(self.conversations),
                'projects_analyzed': len(self.projects)
            },
            'brands': sorted(list(self.all_brands)),
            'repositories': sorted(list(self.all_repos)),
            'technologies': dict(self.all_technologies.most_common()),
            'systems': self.systems,
            'statistics': {
                'total_brands': len(self.all_brands),
                'total_repos': len(self.all_repos),
                'total_technologies': len(self.all_technologies),
                'total_code_snippets': len(self.code_snippets),
                'total_systems': len(self.systems)
            }
        }
        with open(output_path / "consolidated_knowledge.json", 'w') as f:
            json.dump(consolidated, f, indent=2)
        print("  ✅ consolidated_knowledge.json")

        print(f"\n✨ All consolidated data exported to {output_path}/")
        return output_path


def main():
    """Main consolidation process"""
    print("╔════════════════════════════════════════════════════════════════╗")
    print("║     CLAUDE DATA COMPLETE CONSOLIDATION ENGINE                 ║")
    print("║     Extracting, Analyzing, Rebuilding Everything              ║")
    print("╚════════════════════════════════════════════════════════════════╝\n")

    consolidator = ClaudeDataConsolidator()

    # Load all data
    consolidator.load_all_data()

    # Extract everything
    consolidator.extract_brands()
    consolidator.extract_repositories()
    consolidator.extract_technologies()
    consolidator.extract_code_snippets()

    # Map relationships
    consolidator.map_brand_ecosystem()

    # Define systems
    consolidator.extract_systems()

    # Generate report
    print(consolidator.generate_consolidated_report())

    # Export everything
    output_dir = consolidator.export_all_consolidated_data()

    print("\n" + "="*70)
    print("✨ CONSOLIDATION COMPLETE!")
    print("="*70)
    print(f"\nAll consolidated data available in: {output_dir}/")
    print("\nYou now have:")
    print("  • Complete brand registry with mappings")
    print("  • Repository to brand connections")
    print("  • Full technology stack inventory")
    print("  • All code organized by language")
    print("  • Core system architectures")
    print("  • Unified knowledge database")
    print("\n")


if __name__ == "__main__":
    main()
