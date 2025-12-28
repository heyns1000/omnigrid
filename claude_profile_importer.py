#!/usr/bin/env python3
"""
Claude Profile Data Importer for OmniGrid
Imports and analyzes Claude.ai profile export data

Author: Heyns Schoeman / Fruitful Holdings
Date: 2025-12-28
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any
import re


class ClaudeProfileImporter:
    """Import and process Claude profile data export"""

    def __init__(self, data_dir: str = "./metdata"):
        self.data_dir = Path(data_dir)
        self.users = None
        self.memories = None
        self.projects = None
        self.conversations = None

    def load_all_data(self):
        """Load all JSON files from the export"""
        print("🔄 Loading Claude profile data...")

        # Load users
        with open(self.data_dir / "users.json", 'r') as f:
            self.users = json.load(f)
        print(f"✅ Loaded {len(self.users)} user(s)")

        # Load memories
        with open(self.data_dir / "memories.json", 'r') as f:
            self.memories = json.load(f)[0]  # First item contains all memories
        print(f"✅ Loaded memories with {len(self.memories.get('project_memories', {}))} project memories")

        # Load projects
        with open(self.data_dir / "projects.json", 'r') as f:
            self.projects = json.load(f)
        print(f"✅ Loaded {len(self.projects)} projects")

        # Load conversations
        print("🔄 Loading conversations (this may take a moment)...")
        with open(self.data_dir / "conversations.json", 'r') as f:
            self.conversations = json.load(f)
        print(f"✅ Loaded {len(self.conversations)} conversations")

        return True

    def get_user_info(self) -> Dict:
        """Extract user information"""
        if not self.users:
            return {}
        return self.users[0]

    def get_work_context(self) -> str:
        """Extract work context from memories"""
        if not self.memories:
            return ""
        return self.memories.get('conversations_memory', '')

    def analyze_projects(self) -> Dict[str, Any]:
        """Analyze project data"""
        if not self.projects:
            return {}

        analysis = {
            'total_projects': len(self.projects),
            'private_projects': sum(1 for p in self.projects if p.get('is_private', False)),
            'starter_projects': sum(1 for p in self.projects if p.get('is_starter_project', False)),
            'total_documents': sum(len(p.get('docs', [])) for p in self.projects),
            'projects_list': []
        }

        for project in self.projects:
            project_info = {
                'name': project.get('name', 'Unknown'),
                'description': project.get('description', ''),
                'created_at': project.get('created_at', ''),
                'doc_count': len(project.get('docs', [])),
                'is_private': project.get('is_private', False)
            }
            analysis['projects_list'].append(project_info)

        return analysis

    def analyze_conversations(self) -> Dict[str, Any]:
        """Analyze conversation data"""
        if not self.conversations:
            return {}

        total_messages = 0
        conversation_summaries = []

        for conv in self.conversations:
            msg_count = len(conv.get('chat_messages', []))
            total_messages += msg_count

            conversation_summaries.append({
                'name': conv.get('name', 'Untitled'),
                'summary': conv.get('summary', '')[:200],  # First 200 chars
                'created_at': conv.get('created_at', ''),
                'message_count': msg_count
            })

        # Sort by message count (most active conversations first)
        conversation_summaries.sort(key=lambda x: x['message_count'], reverse=True)

        return {
            'total_conversations': len(self.conversations),
            'total_messages': total_messages,
            'avg_messages_per_conversation': total_messages / len(self.conversations) if self.conversations else 0,
            'top_conversations': conversation_summaries[:10]  # Top 10 most active
        }

    def extract_brands_from_memories(self) -> List[str]:
        """Extract brand mentions from memory"""
        brands = set()
        work_context = self.get_work_context()

        # Look for brand patterns in the text
        # This is a simple extraction - can be enhanced
        if "9,000+ brands" in work_context or "9000" in work_context:
            brands.add("9,000+ brands ecosystem (Fruitful Holdings)")

        # Extract specific brand mentions from project memories
        if self.memories and 'project_memories' in self.memories:
            for project_id, project_mem in self.memories['project_memories'].items():
                # Look for trademark symbols
                trademark_brands = re.findall(r'(\w+)™', str(project_mem))
                brands.update(trademark_brands)

        return sorted(list(brands))

    def generate_summary_report(self) -> str:
        """Generate a comprehensive summary report"""
        user = self.get_user_info()
        project_analysis = self.analyze_projects()
        conv_analysis = self.analyze_conversations()
        brands = self.extract_brands_from_memories()

        report = f"""
╔════════════════════════════════════════════════════════════════╗
║           CLAUDE PROFILE DATA IMPORT SUMMARY                   ║
╚════════════════════════════════════════════════════════════════╝

👤 USER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:    {user.get('full_name', 'N/A')}
Email:   {user.get('email_address', 'N/A')}
Phone:   {user.get('verified_phone_number', 'N/A')}

📊 PROJECT STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Projects:        {project_analysis.get('total_projects', 0)}
Private Projects:      {project_analysis.get('private_projects', 0)}
Starter Projects:      {project_analysis.get('starter_projects', 0)}
Total Documents:       {project_analysis.get('total_documents', 0)}

💬 CONVERSATION STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Conversations:   {conv_analysis.get('total_conversations', 0)}
Total Messages:        {conv_analysis.get('total_messages', 0)}
Avg Messages/Conv:     {conv_analysis.get('avg_messages_per_conversation', 0):.1f}

🏢 BRAND ECOSYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Identified Brands:     {len(brands)}
"""

        if brands:
            report += "\nTop Brands:\n"
            for i, brand in enumerate(brands[:15], 1):
                report += f"  {i:2d}. {brand}\n"

        report += "\n📈 TOP 5 MOST ACTIVE CONVERSATIONS\n"
        report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"

        for i, conv in enumerate(conv_analysis.get('top_conversations', [])[:5], 1):
            report += f"{i}. {conv['name'][:50]}\n"
            report += f"   Messages: {conv['message_count']} | Created: {conv['created_at'][:10]}\n"
            if conv['summary']:
                report += f"   Summary: {conv['summary'][:100]}...\n"
            report += "\n"

        return report

    def export_to_omnigrid_format(self, output_file: str = "omnigrid_claude_data.json"):
        """Export processed data in OmniGrid-compatible format"""
        omnigrid_data = {
            'metadata': {
                'source': 'Claude Profile Export',
                'import_date': datetime.now().isoformat(),
                'exporter': 'claude_profile_importer.py'
            },
            'user': self.get_user_info(),
            'work_context': self.get_work_context(),
            'project_analysis': self.analyze_projects(),
            'conversation_analysis': self.analyze_conversations(),
            'brands': self.extract_brands_from_memories(),
            'project_memories': self.memories.get('project_memories', {}) if self.memories else {}
        }

        output_path = Path(output_file)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(omnigrid_data, f, indent=2, ensure_ascii=False)

        print(f"\n✅ Exported OmniGrid data to: {output_path.absolute()}")
        return output_path


def main():
    """Main execution function"""
    print("╔════════════════════════════════════════════════════════════════╗")
    print("║     Claude Profile Data Importer for OmniGrid                 ║")
    print("║     Fruitful Holdings (Pty) Ltd                                ║")
    print("╚════════════════════════════════════════════════════════════════╝\n")

    importer = ClaudeProfileImporter()

    # Load all data
    importer.load_all_data()

    # Generate and display summary report
    print("\n" + importer.generate_summary_report())

    # Export to OmniGrid format
    importer.export_to_omnigrid_format()

    print("\n✨ Import complete! Data ready for OmniGrid integration.\n")


if __name__ == "__main__":
    main()
