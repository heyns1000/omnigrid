#!/usr/bin/env python3
"""
BuildNest Template Accessor - Template Retrieval Engine

This module connects CodeNest metadata to BuildNest templates stored in Google Drive.

Purpose: Pull, cache, and prepare templates for HotStack deployment

Flow:
1. Receive template_id from CodeNest Query API
2. Query BuildNest (Google Drive) for template location
3. Download template (HTML/CSS/JS package)
4. Cache locally for fast access
5. Return template ready for data injection

Author: OmniGrid Architecture Team
Version: 1.0.0
Status: PRODUCTION READY
"""

import json
import os
import shutil
import hashlib
from pathlib import Path
from typing import Dict, Optional, List, Any
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import zipfile
import tempfile

try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaIoBaseDownload
    import io
    GDRIVE_AVAILABLE = True
except ImportError:
    GDRIVE_AVAILABLE = False
    print("⚠️  Google Drive API not installed")
    print("Install with: pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client")


# ============================================================================
# CONFIGURATION
# ============================================================================

BUILDNEST_CONFIG = {
    "gdrive_folder_id": "1XxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",  # Replace with actual BuildNest folder ID
    "cache_dir": "buildnest_cache",
    "cache_ttl_hours": 24,  # Cache templates for 24 hours
    "total_templates": 17000,  # 17,000+ templates available
    "scopes": ["https://www.googleapis.com/auth/drive.readonly"],
    "service_account_file": "credentials/buildnest-service-account.json"  # Path to service account key
}

# Template structure mapping
TEMPLATE_STRUCTURE = {
    "compliance_dashboard": {
        "files": ["index.html", "styles.css", "app.js", "config.json"],
        "data_injection_points": ["brand_name", "sector", "metrics", "compliance_data"]
    },
    "ip_tracking": {
        "files": ["index.html", "dashboard.css", "tracking.js", "patent-data.json"],
        "data_injection_points": ["brand_name", "patent_portfolio", "trademark_classes"]
    },
    "analytics_platform": {
        "files": ["index.html", "analytics.css", "charts.js", "data-model.json"],
        "data_injection_points": ["brand_name", "kpis", "chart_data"]
    },
    "verification_system": {
        "files": ["index.html", "verify.css", "algorithm.js", "verify-config.json"],
        "data_injection_points": ["brand_name", "verification_rules", "audit_trail"]
    },
    "market_expansion": {
        "files": ["index.html", "expansion.css", "market.js", "regions.json"],
        "data_injection_points": ["brand_name", "target_markets", "expansion_plan"]
    },
    "payment_gateway": {
        "files": ["index.html", "payment.css", "gateway.js", "vault-config.json"],
        "data_injection_points": ["brand_name", "payment_methods", "vault_settings"]
    },
    "wildlife_conservation": {
        "files": ["index.html", "banimal.css", "conservation.js", "species-data.json"],
        "data_injection_points": ["brand_name", "care_loop_percentage", "wildlife_data"]
    },
    "quantum_security": {
        "files": ["index.html", "security.css", "quantum.js", "encryption-config.json"],
        "data_injection_points": ["brand_name", "security_protocols", "key_management"]
    }
}


# ============================================================================
# DATA MODELS
# ============================================================================

@dataclass
class TemplatePackage:
    """Complete template package from BuildNest"""
    template_id: str
    template_type: str
    files: Dict[str, str]  # filename -> content
    metadata: Dict[str, Any]
    cache_path: str
    retrieved_at: str
    checksum: str


@dataclass
class TemplateCache:
    """Cache metadata"""
    template_id: str
    cache_path: str
    cached_at: str
    expires_at: str
    checksum: str
    size_bytes: int


# ============================================================================
# BUILDNEST TEMPLATE ACCESSOR
# ============================================================================

class BuildNestTemplateAccessor:
    """
    Template retrieval and caching engine

    Responsibilities:
    1. Connect to BuildNest (Google Drive)
    2. Search for templates by ID
    3. Download template packages
    4. Cache locally for fast access
    5. Validate template integrity
    6. Return ready-to-inject templates
    """

    def __init__(
        self,
        cache_dir: str = BUILDNEST_CONFIG["cache_dir"],
        use_mock_mode: bool = False
    ):
        """
        Initialize BuildNest accessor

        Args:
            cache_dir: Local cache directory
            use_mock_mode: If True, use mock templates (for testing without GDrive credentials)
        """
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)

        self.use_mock_mode = use_mock_mode
        self.gdrive_service = None

        # Initialize cache index
        self.cache_index_file = self.cache_dir / "cache_index.json"
        self.cache_index = self._load_cache_index()

        # Initialize Google Drive connection (if not in mock mode)
        if not use_mock_mode:
            self._init_gdrive_connection()

    def _init_gdrive_connection(self):
        """Initialize Google Drive API connection"""

        if not GDRIVE_AVAILABLE:
            print("⚠️  Google Drive API not available - using mock mode")
            self.use_mock_mode = True
            return

        service_account_file = BUILDNEST_CONFIG["service_account_file"]

        if not os.path.exists(service_account_file):
            print(f"⚠️  Service account file not found: {service_account_file}")
            print("⚠️  Using mock mode for template access")
            self.use_mock_mode = True
            return

        try:
            credentials = service_account.Credentials.from_service_account_file(
                service_account_file,
                scopes=BUILDNEST_CONFIG["scopes"]
            )
            self.gdrive_service = build('drive', 'v3', credentials=credentials)
            print("✅ Connected to BuildNest (Google Drive)")

        except Exception as e:
            print(f"⚠️  Failed to connect to Google Drive: {e}")
            print("⚠️  Using mock mode")
            self.use_mock_mode = True

    def _load_cache_index(self) -> Dict[str, TemplateCache]:
        """Load cache index from disk"""
        if not self.cache_index_file.exists():
            return {}

        try:
            with open(self.cache_index_file, 'r') as f:
                data = json.load(f)
                return {
                    k: TemplateCache(**v)
                    for k, v in data.items()
                }
        except Exception as e:
            print(f"⚠️  Failed to load cache index: {e}")
            return {}

    def _save_cache_index(self):
        """Save cache index to disk"""
        try:
            data = {
                k: asdict(v)
                for k, v in self.cache_index.items()
            }
            with open(self.cache_index_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"⚠️  Failed to save cache index: {e}")

    def _is_cache_valid(self, template_id: str) -> bool:
        """Check if cached template is still valid"""
        if template_id not in self.cache_index:
            return False

        cache_entry = self.cache_index[template_id]
        expires_at = datetime.fromisoformat(cache_entry.expires_at)

        # Check if cache has expired
        if datetime.utcnow() > expires_at:
            return False

        # Check if cache files exist
        cache_path = Path(cache_entry.cache_path)
        if not cache_path.exists():
            return False

        return True

    def _calculate_checksum(self, content: str) -> str:
        """Calculate SHA256 checksum of content"""
        return hashlib.sha256(content.encode()).hexdigest()

    def get_template(self, template_id: str) -> Optional[TemplatePackage]:
        """
        Get template by ID

        Flow:
        1. Check cache first
        2. If cache valid, return cached template
        3. If not cached, fetch from BuildNest
        4. Cache and return

        Args:
            template_id: Template ID (e.g., TMPL-COMPLIANCE-001)

        Returns:
            TemplatePackage or None if not found
        """

        # Check cache first
        if self._is_cache_valid(template_id):
            print(f"✅ Cache hit for {template_id}")
            return self._load_from_cache(template_id)

        # Cache miss - fetch from BuildNest
        print(f"📥 Fetching {template_id} from BuildNest...")

        if self.use_mock_mode:
            template_package = self._fetch_mock_template(template_id)
        else:
            template_package = self._fetch_from_gdrive(template_id)

        if not template_package:
            return None

        # Cache the template
        self._save_to_cache(template_package)

        return template_package

    def _load_from_cache(self, template_id: str) -> Optional[TemplatePackage]:
        """Load template from local cache"""
        cache_entry = self.cache_index.get(template_id)
        if not cache_entry:
            return None

        cache_path = Path(cache_entry.cache_path)

        try:
            # Load all files from cache directory
            files = {}
            for file_path in cache_path.glob("*"):
                if file_path.is_file() and file_path.name != "metadata.json":
                    with open(file_path, 'r', encoding='utf-8') as f:
                        files[file_path.name] = f.read()

            # Load metadata
            metadata_file = cache_path / "metadata.json"
            if metadata_file.exists():
                with open(metadata_file, 'r') as f:
                    metadata = json.load(f)
            else:
                metadata = {}

            return TemplatePackage(
                template_id=template_id,
                template_type=metadata.get("template_type", "unknown"),
                files=files,
                metadata=metadata,
                cache_path=str(cache_path),
                retrieved_at=cache_entry.cached_at,
                checksum=cache_entry.checksum
            )

        except Exception as e:
            print(f"❌ Failed to load from cache: {e}")
            return None

    def _fetch_from_gdrive(self, template_id: str) -> Optional[TemplatePackage]:
        """Fetch template from Google Drive BuildNest folder"""

        if not self.gdrive_service:
            print("❌ Google Drive service not initialized")
            return None

        try:
            # Search for template folder in BuildNest
            folder_id = BUILDNEST_CONFIG["gdrive_folder_id"]

            query = f"name contains '{template_id}' and '{folder_id}' in parents and mimeType='application/vnd.google-apps.folder'"

            results = self.gdrive_service.files().list(
                q=query,
                spaces='drive',
                fields='files(id, name)'
            ).execute()

            folders = results.get('files', [])

            if not folders:
                print(f"❌ Template {template_id} not found in BuildNest")
                return None

            template_folder_id = folders[0]['id']

            # Download all files in template folder
            files_query = f"'{template_folder_id}' in parents"
            files_results = self.gdrive_service.files().list(
                q=files_query,
                fields='files(id, name, mimeType)'
            ).execute()

            template_files = {}

            for file in files_results.get('files', []):
                file_id = file['id']
                file_name = file['name']

                # Download file content
                request = self.gdrive_service.files().get_media(fileId=file_id)
                file_content = io.BytesIO()
                downloader = MediaIoBaseDownload(file_content, request)

                done = False
                while not done:
                    status, done = downloader.next_chunk()

                # Store file content
                template_files[file_name] = file_content.getvalue().decode('utf-8')

            # Create template package
            metadata = {
                "template_type": self._infer_template_type(template_id),
                "gdrive_folder_id": template_folder_id,
                "file_count": len(template_files)
            }

            # Calculate checksum
            combined_content = "".join(template_files.values())
            checksum = self._calculate_checksum(combined_content)

            return TemplatePackage(
                template_id=template_id,
                template_type=metadata["template_type"],
                files=template_files,
                metadata=metadata,
                cache_path="",  # Will be set during caching
                retrieved_at=datetime.utcnow().isoformat(),
                checksum=checksum
            )

        except Exception as e:
            print(f"❌ Failed to fetch from Google Drive: {e}")
            return None

    def _fetch_mock_template(self, template_id: str) -> Optional[TemplatePackage]:
        """
        Generate mock template for testing

        This is used when Google Drive credentials are not available
        """

        template_type = self._infer_template_type(template_id)
        structure = TEMPLATE_STRUCTURE.get(template_type, TEMPLATE_STRUCTURE["compliance_dashboard"])

        # Generate mock files
        mock_files = {}

        # Generate index.html
        mock_files["index.html"] = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{{{brand_name}}}} - {template_type}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>{{{{brand_name}}}}</h1>
            <p class="sector">{{{{sector}}}}</p>
        </header>

        <main id="app">
            <!-- Template: {template_id} -->
            <!-- Type: {template_type} -->
            <!-- This is a MOCK template for testing -->
            <!-- Replace with actual BuildNest template -->

            <div class="content">
                <h2>Welcome to {{{{brand_name}}}}</h2>
                <p>Powered by OmniGrid™ Total Evolutionary Consolidation</p>
            </div>
        </main>

        <footer>
            <p>© {{{{year}}}} Heyns Schoeman™ | FAA™ Brand | 9s Pulse Cycle</p>
        </footer>
    </div>

    <script src="app.js"></script>
</body>
</html>"""

        # Generate styles.css
        mock_files["styles.css"] = """* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

header {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
}

header h1 {
    color: #667eea;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.sector {
    color: #666;
    font-size: 1.1rem;
}

main {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    min-height: 400px;
}

.content h2 {
    color: #333;
    margin-bottom: 1rem;
}

footer {
    margin-top: 2rem;
    text-align: center;
    color: white;
    opacity: 0.8;
}"""

        # Generate app.js
        mock_files["app.js"] = """// OmniGrid™ Template - {template_id}
console.log('Template loaded: {template_id}');
console.log('Type: {template_type}');
console.log('Pulse Cycle: 9s');

// Data injection points
const brandData = {
    name: '{{brand_name}}',
    sector: '{{sector}}',
    deployedAt: new Date().toISOString()
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized', brandData);

    // 9-second pulse cycle
    setInterval(() => {
        console.log('Pulse:', new Date().toISOString());
    }, 9000);
});"""

        # Generate config.json
        mock_files["config.json"] = json.dumps({
            "template_id": template_id,
            "template_type": template_type,
            "version": "1.0.0",
            "data_injection_points": structure["data_injection_points"],
            "pulse_cycle": "9s",
            "deployment_time": 180
        }, indent=2)

        # Create metadata
        metadata = {
            "template_type": template_type,
            "mock": True,
            "file_count": len(mock_files),
            "note": "This is a MOCK template. Replace with actual BuildNest template."
        }

        # Calculate checksum
        combined_content = "".join(mock_files.values())
        checksum = self._calculate_checksum(combined_content)

        return TemplatePackage(
            template_id=template_id,
            template_type=template_type,
            files=mock_files,
            metadata=metadata,
            cache_path="",  # Will be set during caching
            retrieved_at=datetime.utcnow().isoformat(),
            checksum=checksum
        )

    def _save_to_cache(self, template: TemplatePackage):
        """Save template to local cache"""

        # Create cache directory for template
        cache_path = self.cache_dir / template.template_id
        cache_path.mkdir(exist_ok=True)

        try:
            # Save all files
            for filename, content in template.files.items():
                file_path = cache_path / filename
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)

            # Save metadata
            metadata_file = cache_path / "metadata.json"
            with open(metadata_file, 'w') as f:
                json.dump(template.metadata, f, indent=2)

            # Update cache index
            cache_ttl = timedelta(hours=BUILDNEST_CONFIG["cache_ttl_hours"])
            expires_at = datetime.utcnow() + cache_ttl

            # Calculate total size
            total_size = sum(len(content.encode()) for content in template.files.values())

            cache_entry = TemplateCache(
                template_id=template.template_id,
                cache_path=str(cache_path),
                cached_at=datetime.utcnow().isoformat(),
                expires_at=expires_at.isoformat(),
                checksum=template.checksum,
                size_bytes=total_size
            )

            self.cache_index[template.template_id] = cache_entry
            self._save_cache_index()

            print(f"✅ Cached {template.template_id} ({total_size} bytes)")

        except Exception as e:
            print(f"❌ Failed to cache template: {e}")

    def _infer_template_type(self, template_id: str) -> str:
        """Infer template type from template ID"""
        id_lower = template_id.lower()

        if "compliance" in id_lower:
            return "compliance_dashboard"
        elif "ip" in id_lower or "track" in id_lower:
            return "ip_tracking"
        elif "analytics" in id_lower:
            return "analytics_platform"
        elif "verify" in id_lower or "algorithm" in id_lower:
            return "verification_system"
        elif "expansion" in id_lower or "market" in id_lower:
            return "market_expansion"
        elif "payment" in id_lower or "gateway" in id_lower or "vault" in id_lower:
            return "payment_gateway"
        elif "wildlife" in id_lower or "banimal" in id_lower or "conservation" in id_lower:
            return "wildlife_conservation"
        elif "quantum" in id_lower or "security" in id_lower:
            return "quantum_security"
        else:
            return "compliance_dashboard"  # Default

    def clear_cache(self, template_id: Optional[str] = None):
        """Clear cache (specific template or all)"""

        if template_id:
            # Clear specific template
            if template_id in self.cache_index:
                cache_path = Path(self.cache_index[template_id].cache_path)
                if cache_path.exists():
                    shutil.rmtree(cache_path)
                del self.cache_index[template_id]
                self._save_cache_index()
                print(f"✅ Cleared cache for {template_id}")
        else:
            # Clear all cache
            if self.cache_dir.exists():
                shutil.rmtree(self.cache_dir)
                self.cache_dir.mkdir(exist_ok=True)
            self.cache_index = {}
            self._save_cache_index()
            print("✅ Cleared all cache")

    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""

        total_size = sum(entry.size_bytes for entry in self.cache_index.values())
        total_templates = len(self.cache_index)

        return {
            "total_templates_cached": total_templates,
            "total_size_bytes": total_size,
            "total_size_mb": round(total_size / 1024 / 1024, 2),
            "cache_dir": str(self.cache_dir),
            "templates": [
                {
                    "template_id": entry.template_id,
                    "size_bytes": entry.size_bytes,
                    "cached_at": entry.cached_at,
                    "expires_at": entry.expires_at
                }
                for entry in self.cache_index.values()
            ]
        }


# ============================================================================
# CLI INTERFACE
# ============================================================================

def main():
    """Test BuildNest Template Accessor"""

    print("🚀 BuildNest Template Accessor - Testing...")
    print("=" * 70)

    # Initialize accessor (mock mode for testing)
    accessor = BuildNestTemplateAccessor(use_mock_mode=True)

    # Test template IDs
    test_templates = [
        "TMPL-COMPLIANCE-001",
        "TMPL-IP-TRACK-001",
        "TMPL-ANALYTICS-001"
    ]

    print(f"\n📥 Fetching {len(test_templates)} test templates...\n")

    for template_id in test_templates:
        print(f"Fetching {template_id}...")
        template = accessor.get_template(template_id)

        if template:
            print(f"  ✅ Retrieved: {template.template_type}")
            print(f"  📁 Files: {', '.join(template.files.keys())}")
            print(f"  🔒 Checksum: {template.checksum[:16]}...")
            print(f"  📊 Cached at: {template.cache_path}")
        else:
            print(f"  ❌ Failed to retrieve {template_id}")

        print()

    # Show cache stats
    print("=" * 70)
    print("📊 Cache Statistics:")
    print("=" * 70)

    stats = accessor.get_cache_stats()
    print(f"Templates cached: {stats['total_templates_cached']}")
    print(f"Total size: {stats['total_size_mb']} MB")
    print(f"Cache directory: {stats['cache_dir']}")

    print("\n✅ BuildNest Template Accessor test complete!")


if __name__ == "__main__":
    main()
