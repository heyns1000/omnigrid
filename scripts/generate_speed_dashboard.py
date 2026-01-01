#!/usr/bin/env python3
"""
Speed Dashboard Generator
Creates real-time dashboard showing sync metrics and urgency rankings
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional


class SpeedDashboardGenerator:
    """Generates HTML dashboard and metrics from sync results"""
    
    def __init__(self):
        """Initialize dashboard generator"""
        self.sync_data = None
        self.urgency_data = None
        self.audit_data = None
        
    def load_data(
        self,
        sync_file: str,
        urgency_file: str,
        audit_file: Optional[str] = None
    ):
        """Load all required data files"""
        print("📊 Loading dashboard data...")
        
        # Load sync progress
        sync_path = Path(sync_file)
        if sync_path.exists():
            with open(sync_path) as f:
                self.sync_data = json.load(f)
            print(f"   ✅ Loaded sync data: {sync_file}")
        else:
            print(f"   ⚠️  Sync data not found: {sync_file}")
            self.sync_data = self._empty_sync_data()
        
        # Load urgency rankings
        urgency_path = Path(urgency_file)
        if urgency_path.exists():
            with open(urgency_path) as f:
                self.urgency_data = json.load(f)
            print(f"   ✅ Loaded urgency data: {urgency_file}")
        else:
            print(f"   ⚠️  Urgency data not found: {urgency_file}")
            self.urgency_data = {"top_12_priority": [], "urgency_rankings": []}
        
        # Load audit data (optional)
        if audit_file:
            audit_path = Path(audit_file)
            if audit_path.exists():
                with open(audit_path) as f:
                    self.audit_data = json.load(f)
                print(f"   ✅ Loaded audit data: {audit_file}")
    
    def _empty_sync_data(self) -> Dict:
        """Return empty sync data structure"""
        return {
            "sync_timestamp": datetime.now(timezone.utc).isoformat(),
            "mode": "unknown",
            "top_12_status": [],
            "urgent_repos": [],
            "all_repos_urgency": [],
            "sync_summary": {
                "synced": 0,
                "in_progress": 0,
                "pending": 0,
                "failed": 0,
                "skipped": 0
            },
            "performance_metrics": {
                "duration_seconds": 0,
                "repos_per_hour": 0
            }
        }
    
    def calculate_metrics(self) -> Dict:
        """Calculate dashboard metrics"""
        summary = self.sync_data.get("sync_summary", {})
        performance = self.sync_data.get("performance_metrics", {})
        
        total_repos = (
            summary.get("synced", 0) +
            summary.get("in_progress", 0) +
            summary.get("pending", 0) +
            summary.get("failed", 0)
        )
        
        synced = summary.get("synced", 0)
        sync_percentage = (synced / total_repos * 100) if total_repos > 0 else 0
        
        # Calculate ETA
        repos_per_hour = performance.get("repos_per_hour", 0)
        pending = summary.get("pending", 0)
        eta_hours = (pending / repos_per_hour) if repos_per_hour > 0 else 0
        
        return {
            "total_repos": total_repos,
            "synced_today": synced,
            "in_progress": summary.get("in_progress", 0),
            "pending": pending,
            "failed": summary.get("failed", 0),
            "sync_percentage": sync_percentage,
            "sync_velocity": repos_per_hour,
            "eta_hours": eta_hours,
            "last_sync": self.sync_data.get("sync_timestamp", "Unknown")
        }
    
    def generate_html_dashboard(self, output_path: str):
        """Generate interactive HTML dashboard"""
        metrics = self.calculate_metrics()
        
        # Get Top 12 status
        top_12_status = self.sync_data.get("top_12_status", [])
        top_12_priority = self.urgency_data.get("top_12_priority", [])
        
        # Get urgent repos
        urgent_repos = self.urgency_data.get("urgency_rankings", [])[:20]
        
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OmniGrid Priority Sync Dashboard</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            padding: 20px;
            min-height: 100vh;
        }}
        
        .dashboard {{
            max-width: 1400px;
            margin: 0 auto;
        }}
        
        .header {{
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }}
        
        .header h1 {{
            font-size: 2.5em;
            margin-bottom: 10px;
        }}
        
        .header p {{
            opacity: 0.9;
            font-size: 1.1em;
        }}
        
        .metrics-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }}
        
        .metric-card {{
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
        }}
        
        .metric-card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }}
        
        .metric-icon {{
            font-size: 2.5em;
            margin-bottom: 10px;
        }}
        
        .metric-value {{
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }}
        
        .metric-label {{
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }}
        
        .section {{
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}
        
        .section-title {{
            font-size: 1.8em;
            margin-bottom: 20px;
            color: #667eea;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }}
        
        .progress-bar {{
            width: 100%;
            height: 30px;
            background: #e0e0e0;
            border-radius: 15px;
            overflow: hidden;
            margin-bottom: 10px;
        }}
        
        .progress-fill {{
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            transition: width 0.3s ease;
        }}
        
        .repo-list {{
            display: grid;
            gap: 15px;
        }}
        
        .repo-item {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }}
        
        .repo-name {{
            font-weight: 600;
            color: #333;
        }}
        
        .repo-status {{
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
        }}
        
        .status-synced {{
            background: #d4edda;
            color: #155724;
        }}
        
        .status-progress {{
            background: #fff3cd;
            color: #856404;
        }}
        
        .status-pending {{
            background: #f8d7da;
            color: #721c24;
        }}
        
        .urgency-score {{
            font-size: 1.2em;
            font-weight: bold;
            color: #667eea;
            margin-left: 15px;
        }}
        
        .timestamp {{
            text-align: center;
            color: white;
            margin-top: 20px;
            opacity: 0.8;
        }}
        
        .legend {{
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            margin-top: 15px;
        }}
        
        .legend-item {{
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        
        .legend-color {{
            width: 20px;
            height: 20px;
            border-radius: 4px;
        }}
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>🚀 Priority Sync Dashboard</h1>
            <p>Real-time OmniGrid Ecosystem Synchronization Metrics</p>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-icon">✅</div>
                <div class="metric-value">{metrics['synced_today']}</div>
                <div class="metric-label">Repos Synced Today</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-icon">⏰</div>
                <div class="metric-value">{metrics['in_progress']}</div>
                <div class="metric-label">In Progress</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-icon">⚠️</div>
                <div class="metric-value">{metrics['pending']}</div>
                <div class="metric-label">Repos Behind</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-icon">📊</div>
                <div class="metric-value">{metrics['sync_velocity']:.1f}</div>
                <div class="metric-label">Repos/Hour Velocity</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-icon">🎯</div>
                <div class="metric-value">{metrics['eta_hours']:.1f}h</div>
                <div class="metric-label">ETA to Full Sync</div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">🔥 Top 12 Priority Status</h2>
            <div class="progress-bar">
                <div class="progress-fill" style="width: {metrics['sync_percentage']:.1f}%">
                    {metrics['sync_percentage']:.1f}% Complete
                </div>
            </div>
            
            <div class="repo-list">
"""
        
        # Add Top 12 repos
        for i, repo_name in enumerate(top_12_priority, 1):
            status_class = "status-synced"
            status_text = "✅ SYNCED"
            
            # Find status in sync data
            for repo_status in top_12_status:
                if repo_status.get("repo") == repo_name:
                    if repo_status.get("status") == "inaccessible":
                        status_class = "status-pending"
                        status_text = "⚠️ INACCESSIBLE"
                    elif repo_status.get("status") in ["pr_required", "in_progress"]:
                        status_class = "status-progress"
                        status_text = "🔄 IN PROGRESS"
                    break
            
            html_content += f"""
                <div class="repo-item">
                    <span class="repo-name">{i}. {repo_name}</span>
                    <span class="repo-status {status_class}">{status_text}</span>
                </div>
"""
        
        html_content += """
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">🔥 Top 20 Urgent Repos (By Urgency Score)</h2>
            <div class="repo-list">
"""
        
        # Add urgent repos
        for i, repo_info in enumerate(urgent_repos, 1):
            repo_name = repo_info.get("repo", "unknown")
            urgency_score = repo_info.get("urgency_score", 0)
            metadata = repo_info.get("metadata", {})
            
            commits_behind = metadata.get("commits_behind", 0)
            
            status_class = "status-pending"
            status_text = f"⚠️ {commits_behind} commits behind"
            
            html_content += f"""
                <div class="repo-item">
                    <span class="repo-name">{i}. {repo_name}</span>
                    <div>
                        <span class="urgency-score">{urgency_score}</span>
                        <span class="repo-status {status_class}">{status_text}</span>
                    </div>
                </div>
"""
        
        html_content += f"""
            </div>
            
            <div class="legend">
                <div class="legend-item">
                    <div class="legend-color" style="background: #667eea;"></div>
                    <span>Urgency Score: Higher = More Urgent</span>
                </div>
            </div>
        </div>
        
        <div class="timestamp">
            Last updated: {metrics['last_sync']}<br>
            Auto-refreshing dashboard • OmniGrid v1.0
        </div>
    </div>
</body>
</html>
"""
        
        # Save HTML
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w') as f:
            f.write(html_content)
        
        print(f"✅ Dashboard saved: {output_path}")
    
    def generate_speed_metrics(self, output_path: str):
        """Generate speed metrics JSON"""
        metrics = self.calculate_metrics()
        
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(metrics, f, indent=2)
        
        print(f"✅ Speed metrics saved: {output_path}")
    
    def generate_badge_svg(self, output_path: str):
        """Generate SVG status badge"""
        metrics = self.calculate_metrics()
        
        synced = metrics['synced_today']
        total = metrics['total_repos']
        percentage = metrics['sync_percentage']
        
        # Determine color based on percentage
        if percentage >= 90:
            color = "#4c1"  # Green
        elif percentage >= 70:
            color = "#dfb317"  # Yellow
        else:
            color = "#e05d44"  # Red
        
        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" width="160" height="20">
    <linearGradient id="b" x2="0" y2="100%">
        <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
        <stop offset="1" stop-opacity=".1"/>
    </linearGradient>
    <mask id="a">
        <rect width="160" height="20" rx="3" fill="#fff"/>
    </mask>
    <g mask="url(#a)">
        <path fill="#555" d="M0 0h75v20H0z"/>
        <path fill="{color}" d="M75 0h85v20H75z"/>
        <path fill="url(#b)" d="M0 0h160v20H0z"/>
    </g>
    <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
        <text x="37.5" y="15" fill="#010101" fill-opacity=".3">sync status</text>
        <text x="37.5" y="14">sync status</text>
        <text x="116.5" y="15" fill="#010101" fill-opacity=".3">{synced}/{total} ({percentage:.0f}%)</text>
        <text x="116.5" y="14">{synced}/{total} ({percentage:.0f}%)</text>
    </g>
</svg>
"""
        
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w') as f:
            f.write(svg_content)
        
        print(f"✅ Status badge saved: {output_path}")


def main():
    """Main execution"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Generate speed dashboard and metrics"
    )
    parser.add_argument(
        "--sync-file",
        default="audit/sync-progress.json",
        help="Path to sync progress JSON"
    )
    parser.add_argument(
        "--urgency-file",
        default="audit/urgency-ranking.json",
        help="Path to urgency ranking JSON"
    )
    parser.add_argument(
        "--audit-file",
        default="audit/repo-existence-check.json",
        help="Path to audit results JSON"
    )
    parser.add_argument(
        "--html-output",
        default="audit/speed-dashboard.html",
        help="Output path for HTML dashboard"
    )
    parser.add_argument(
        "--metrics-output",
        default="audit/speed-metrics.json",
        help="Output path for metrics JSON"
    )
    parser.add_argument(
        "--badge-output",
        default="audit/sync-status-badge.svg",
        help="Output path for status badge SVG"
    )
    
    args = parser.parse_args()
    
    try:
        generator = SpeedDashboardGenerator()
        
        # Load data
        generator.load_data(
            args.sync_file,
            args.urgency_file,
            args.audit_file
        )
        
        # Generate outputs
        print("\n📊 Generating dashboard outputs...")
        generator.generate_html_dashboard(args.html_output)
        generator.generate_speed_metrics(args.metrics_output)
        generator.generate_badge_svg(args.badge_output)
        
        print("\n✅ Dashboard generation complete!")
        return 0
        
    except Exception as e:
        print(f"\n❌ Dashboard generation failed: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
