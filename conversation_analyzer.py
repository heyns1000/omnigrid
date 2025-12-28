#!/usr/bin/env python3
"""
Claude Conversation Analyzer
Advanced conversation analysis and search tool

Author: Heyns Schoeman / Fruitful Holdings
Date: 2025-12-28
"""

import json
import re
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any
from collections import Counter, defaultdict


class ConversationAnalyzer:
    """Analyze Claude conversations for insights and patterns"""

    def __init__(self, conversations_file: str = "./metdata/conversations.json"):
        self.conversations_file = Path(conversations_file)
        self.conversations = []
        self.loaded = False

    def load_conversations(self):
        """Load conversations from JSON file"""
        if self.loaded:
            return

        print("🔄 Loading conversations...")
        with open(self.conversations_file, 'r') as f:
            self.conversations = json.load(f)
        self.loaded = True
        print(f"✅ Loaded {len(self.conversations)} conversations")

    def search_conversations(self, query: str, limit: int = 10) -> List[Dict]:
        """Search conversations by content"""
        self.load_conversations()

        results = []
        query_lower = query.lower()

        for conv in self.conversations:
            # Search in name and summary
            if (query_lower in conv.get('name', '').lower() or
                query_lower in conv.get('summary', '').lower()):

                results.append({
                    'name': conv.get('name', 'Untitled'),
                    'uuid': conv.get('uuid', ''),
                    'summary': conv.get('summary', '')[:300],
                    'created_at': conv.get('created_at', ''),
                    'message_count': len(conv.get('chat_messages', []))
                })

            # Search in messages
            else:
                for msg in conv.get('chat_messages', []):
                    if query_lower in msg.get('text', '').lower():
                        results.append({
                            'name': conv.get('name', 'Untitled'),
                            'uuid': conv.get('uuid', ''),
                            'summary': conv.get('summary', '')[:300],
                            'created_at': conv.get('created_at', ''),
                            'message_count': len(conv.get('chat_messages', [])),
                            'match_preview': msg.get('text', '')[:200]
                        })
                        break

            if len(results) >= limit:
                break

        return results

    def get_conversation_by_uuid(self, uuid: str) -> Dict:
        """Get a specific conversation by UUID"""
        self.load_conversations()

        for conv in self.conversations:
            if conv.get('uuid') == uuid:
                return conv
        return {}

    def analyze_topics(self) -> Dict[str, int]:
        """Extract common topics from conversations"""
        self.load_conversations()

        topics = Counter()

        # Common technical keywords to look for
        keywords = [
            'python', 'javascript', 'typescript', 'react', 'node',
            'api', 'database', 'docker', 'git', 'github',
            'deployment', 'cloudflare', 'aws', 'vercel',
            'frontend', 'backend', 'fullstack',
            'authentication', 'security', 'oauth',
            'testing', 'debugging', 'optimization',
            'wordpress', 'woocommerce', 'e-commerce',
            'banking', 'payment', 'paypal', 'stripe',
            'brand', 'ecosystem', 'platform'
        ]

        for conv in self.conversations:
            text = f"{conv.get('name', '')} {conv.get('summary', '')}".lower()

            for keyword in keywords:
                if keyword in text:
                    topics[keyword] += 1

        return dict(topics.most_common(20))

    def get_timeline_stats(self) -> Dict[str, Any]:
        """Analyze conversation timeline"""
        self.load_conversations()

        monthly_counts = defaultdict(int)
        monthly_messages = defaultdict(int)

        for conv in self.conversations:
            created = conv.get('created_at', '')
            if created:
                # Extract year-month
                month = created[:7]  # YYYY-MM format
                monthly_counts[month] += 1
                monthly_messages[month] += len(conv.get('chat_messages', []))

        return {
            'monthly_conversations': dict(sorted(monthly_counts.items())),
            'monthly_messages': dict(sorted(monthly_messages.items()))
        }

    def extract_code_snippets(self, language: str = None) -> List[Dict]:
        """Extract code snippets from conversations"""
        self.load_conversations()

        snippets = []

        # Regex patterns for code blocks
        code_pattern = r'```(\w+)?\n(.*?)```'

        for conv in self.conversations:
            for msg in conv.get('chat_messages', []):
                text = msg.get('text', '')

                matches = re.finditer(code_pattern, text, re.DOTALL)
                for match in matches:
                    lang = match.group(1) or 'unknown'
                    code = match.group(2)

                    if language is None or lang.lower() == language.lower():
                        snippets.append({
                            'conversation': conv.get('name', 'Untitled'),
                            'language': lang,
                            'code': code[:500],  # First 500 chars
                            'length': len(code)
                        })

        return snippets[:50]  # Return top 50

    def get_assistant_vs_user_stats(self) -> Dict[str, Any]:
        """Analyze user vs assistant message patterns"""
        self.load_conversations()

        total_user_messages = 0
        total_assistant_messages = 0
        user_chars = 0
        assistant_chars = 0

        for conv in self.conversations:
            for msg in conv.get('chat_messages', []):
                sender = msg.get('sender', '')
                text = msg.get('text', '')

                if sender == 'human':
                    total_user_messages += 1
                    user_chars += len(text)
                elif sender == 'assistant':
                    total_assistant_messages += 1
                    assistant_chars += len(text)

        return {
            'user_messages': total_user_messages,
            'assistant_messages': total_assistant_messages,
            'avg_user_message_length': user_chars / total_user_messages if total_user_messages > 0 else 0,
            'avg_assistant_message_length': assistant_chars / total_assistant_messages if total_assistant_messages > 0 else 0,
            'total_characters': user_chars + assistant_chars
        }

    def generate_analytics_report(self) -> str:
        """Generate comprehensive analytics report"""
        self.load_conversations()

        topics = self.analyze_topics()
        timeline = self.get_timeline_stats()
        msg_stats = self.get_assistant_vs_user_stats()

        report = """
╔════════════════════════════════════════════════════════════════╗
║           CLAUDE CONVERSATION ANALYTICS REPORT                 ║
╚════════════════════════════════════════════════════════════════╝

📊 MESSAGE STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total User Messages:       {user_messages:,}
Total Assistant Messages:  {assistant_messages:,}
Avg User Message Length:   {avg_user_len:.0f} characters
Avg Assistant Length:      {avg_asst_len:.0f} characters
Total Characters:          {total_chars:,}

🔍 TOP CONVERSATION TOPICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
""".format(
            user_messages=msg_stats['user_messages'],
            assistant_messages=msg_stats['assistant_messages'],
            avg_user_len=msg_stats['avg_user_message_length'],
            avg_asst_len=msg_stats['avg_assistant_message_length'],
            total_chars=msg_stats['total_characters']
        )

        for i, (topic, count) in enumerate(sorted(topics.items(), key=lambda x: x[1], reverse=True)[:15], 1):
            report += f"{i:2d}. {topic.title():<20} {count:>3} mentions\n"

        report += "\n📅 MONTHLY ACTIVITY\n"
        report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"

        monthly_convs = timeline['monthly_conversations']
        for month in sorted(monthly_convs.keys())[-6:]:  # Last 6 months
            count = monthly_convs[month]
            msgs = timeline['monthly_messages'][month]
            report += f"{month}:  {count:3d} conversations, {msgs:4d} messages\n"

        return report


def main():
    """Main execution function"""
    import sys

    print("╔════════════════════════════════════════════════════════════════╗")
    print("║        Claude Conversation Analyzer                            ║")
    print("║        Fruitful Holdings (Pty) Ltd                             ║")
    print("╚════════════════════════════════════════════════════════════════╝\n")

    analyzer = ConversationAnalyzer()

    if len(sys.argv) > 1:
        # Search mode
        query = ' '.join(sys.argv[1:])
        print(f"🔍 Searching for: '{query}'\n")

        results = analyzer.search_conversations(query, limit=10)

        if not results:
            print("No results found.")
        else:
            print(f"Found {len(results)} results:\n")
            for i, result in enumerate(results, 1):
                print(f"{i}. {result['name']}")
                print(f"   Created: {result['created_at'][:10]} | Messages: {result['message_count']}")
                if result.get('summary'):
                    print(f"   {result['summary'][:150]}...")
                if result.get('match_preview'):
                    print(f"   Match: {result['match_preview'][:100]}...")
                print()
    else:
        # Analytics mode
        print(analyzer.generate_analytics_report())

        # Extract code statistics
        print("\n💻 CODE SNIPPET STATISTICS")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        snippets = analyzer.extract_code_snippets()

        lang_counts = Counter(s['language'] for s in snippets)
        for lang, count in lang_counts.most_common(10):
            print(f"{lang.title():<15} {count:>3} snippets")

    print("\n✨ Analysis complete!\n")


if __name__ == "__main__":
    main()
