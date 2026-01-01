# 🌍 Global Standardization Research System

## Overview

The Global Standardization Research System is a continuous scanning and analysis engine that:
- Scans all 94 repositories every 9 seconds
- Extracts UI patterns (footers, headers, navigation, links)
- Builds global standards from findings
- Generates canonical components
- Maintains href integrity across the entire ecosystem
- Supports 111 languages globally
- Never stops researching, always refining

## Architecture

### Phase 1: Discovery (Current Implementation)

```
┌──────────────────────────────────────────────────────┐
│              Research Configuration                   │
│         (research-config.json)                       │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│           Research Engine (Python)                    │
│        - Pulse orchestration (9s cycle)              │
│        - Main coordination                           │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│         TypeScript Research Modules                   │
│                                                       │
│  ┌──────────────┐  ┌──────────────┐                 │
│  │ RepoScanner  │  │  Pattern     │                 │
│  │              │  │  Extractor   │                 │
│  │ - Scan repos │  │ - Extract    │                 │
│  │ - Detect     │  │   footers    │                 │
│  │   changes    │  │ - Extract    │                 │
│  │ - Fetch      │  │   headers    │                 │
│  │   files      │  │ - Extract    │                 │
│  │              │  │   navs       │                 │
│  └──────────────┘  └──────────────┘                 │
│                                                       │
│  ┌──────────────┐  ┌──────────────┐                 │
│  │ Standards    │  │ Href         │                 │
│  │ Analyzer     │  │ Verifier     │                 │
│  │              │  │              │                 │
│  │ - Find       │  │ - Verify     │                 │
│  │   canonical  │  │   links      │                 │
│  │ - Calculate  │  │ - Detect     │                 │
│  │   common     │  │   404s       │                 │
│  │ - Generate   │  │ - Fix        │                 │
│  │   components │  │   recommend  │                 │
│  └──────────────┘  └──────────────┘                 │
│                                                       │
│  ┌──────────────┐                                   │
│  │ i18n         │                                   │
│  │ Scanner      │                                   │
│  │              │                                   │
│  │ - Detect     │                                   │
│  │   hardcoded  │                                   │
│  │ - Build      │                                   │
│  │   keys       │                                   │
│  │ - Generate   │                                   │
│  │   locales    │                                   │
│  └──────────────┘                                   │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│           Research Dashboard (HTML)                   │
│        - Live status display                         │
│        - Pattern visualization                       │
│        - Link integrity report                       │
│        - Activity log                                │
└──────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+ (optional, for TypeScript modules)
- GitHub Token (optional, for higher rate limits)

### Installation

```bash
# Clone the repository
git clone https://github.com/heyns1000/omnigrid.git
cd omnigrid

# Install Python dependencies (if needed)
pip install -r requirements.txt

# Set GitHub token (optional, for higher API rate limits)
export GITHUB_TOKEN=your_token_here
# or
export GH_TOKEN=your_token_here
```

### Running the Research Engine

```bash
# Start the continuous pulse engine
python3 research_engine.py

# Open the dashboard in your browser
open research-dashboard.html
# or
xdg-open research-dashboard.html
```

### Viewing the Dashboard

1. Start the research engine: `python3 research_engine.py`
2. Open `research-dashboard.html` in your browser
3. Dashboard auto-refreshes every 3 seconds
4. Watch patterns being discovered in real-time!

## Configuration

Edit `research-config.json` to customize:

```json
{
  "research": {
    "pulse_interval_seconds": 9,  // Pulse frequency
    "github_api_rate_limit": 5000,  // API rate limit
    "cache_duration_seconds": 300,  // Cache TTL
    "max_parallel_requests": 10,  // Concurrent requests
    "supported_languages": 111  // i18n target languages
  },
  "repositories": {
    "core_systems": [...],  // Core system repos
    "sector_hubs": [...]  // Sector hub repos
  },
  "patterns": {
    "file_extensions": [".html", ".tsx", ...],
    "verify_hrefs": true,
    "detect_hardcoded_text": true
  }
}
```

## System Components

### 1. Repository Scanner (`lib/research/repo-scanner.ts`)

Continuously scans repositories for changes:
- Fetches latest commits from all 94 repos
- Uses GitHub API with rate limiting
- Caches results to avoid redundant scans
- Detects file changes (new, modified, deleted)
- Extracts file contents for pattern matching

**Key Methods:**
```typescript
scanAllRepos(): Promise<ScanResult[]>
scanRepository(repo: Repository): Promise<ScanResult>
fetchRepoFiles(repo: Repository): Promise<FileInfo[]>
```

### 2. Pattern Extractor (`lib/research/pattern-extractor.ts`)

Extracts UI patterns from scanned files:
- Finds footer variations across HTML/TSX files
- Finds header variations
- Finds navigation patterns
- Extracts all href links
- Detects hardcoded text for i18n

**Pattern Types:**
- `FooterPattern`: Footer structure and content
- `HeaderPattern`: Header structure and content
- `NavigationPattern`: Nav items and structure
- `HrefLink`: All anchor tags with hrefs
- `TextString`: Hardcoded translatable text

### 3. Standards Analyzer (`lib/research/standards-analyzer.ts`)

Analyzes patterns to determine global standards:
- Takes all pattern variations
- Calculates commonality scores
- Determines canonical versions
- Generates global components

**Output:**
```typescript
interface GlobalStandards {
  canonicalFooter: FooterPattern | null;
  canonicalHeader: HeaderPattern | null;
  canonicalNavigation: NavigationPattern | null;
  validatedHrefs: HrefLink[];
  translationKeys: Record<string, string>;
}
```

### 4. Href Verifier (`lib/research/href-verifier.ts`)

Validates link integrity:
- Extracts all `<a href="...">` from all repos
- Validates each link (internal/external)
- Detects 404s and broken links
- Generates fix recommendations
- Caches verification results

**Features:**
- HEAD requests for efficiency
- Timeout handling (5s)
- Rate limiting
- Broken link reports by repository

### 5. i18n Scanner (`lib/research/i18n-scanner.ts`)

Builds translation system:
- Detects hardcoded text across all repos
- Extracts strings for translation
- Builds translation keys
- Supports 111 languages
- Coverage reports

**Output:**
- Translation key registry
- Language files (JSON)
- Coverage statistics
- Missing translation reports

### 6. Research Dashboard (`research-dashboard.html`)

Real-time visualization:
- Live research progress
- Patterns found statistics
- Global standards preview
- Broken links list
- Translation coverage
- Recent activity log
- Auto-refresh every 3 seconds

## Research Pulse Cycle

Every 9 seconds, the system executes:

```
1. SCAN: Fetch latest from all 94 repos (parallel, rate-limited)
2. EXTRACT: Find new patterns/changes in relevant files
3. ANALYZE: Update global standards based on all findings
4. VERIFY: Check all hrefs are still valid
5. TRANSLATE: Update i18n files with new strings
6. REPORT: Log pulse findings to dashboard
7. REPEAT: Forever (until stopped)
```

## Output Files

```
research-dashboard.html        # Dashboard UI
research-dashboard.json        # Dashboard data (auto-generated)
research-config.json           # Configuration

lib/
  research/
    types.ts                   # TypeScript type definitions
    repo-scanner.ts            # Repository scanner
    pattern-extractor.ts       # Pattern extraction
    standards-analyzer.ts      # Standards analysis
    href-verifier.ts           # Link verification
    i18n-scanner.ts            # i18n scanning

.research-cache/               # Cached scan results (auto-generated)
  *.json

lib/standards/                 # Generated standards (future)
  global-standards.json

components/global/             # Generated components (future)
  Footer.tsx
  Header.tsx
  Navigation.tsx
```

## API Rate Limiting

GitHub API has limits:
- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5,000 requests/hour

To use authenticated requests:
```bash
export GITHUB_TOKEN=ghp_your_token_here
```

The system automatically:
- Tracks rate limit status
- Waits when limit reached
- Batches requests efficiently
- Caches results to minimize API calls

## Extending the System

### Adding New Pattern Types

1. Add type to `lib/research/types.ts`:
```typescript
export interface CustomPattern {
  source: { repository: string; file: string };
  content: string;
  // ... custom fields
}
```

2. Add extraction in `pattern-extractor.ts`:
```typescript
private extractCustomPatterns(scanResult, change): CustomPattern[] {
  // Extraction logic
}
```

3. Add analysis in `standards-analyzer.ts`:
```typescript
private findCanonicalCustom(patterns: CustomPattern[]): CustomPattern | null {
  // Analysis logic
}
```

### Adding New Repositories

Edit `research-config.json`:
```json
{
  "repositories": {
    "core_systems": [
      "owner/repo-name"  // Add here
    ]
  }
}
```

### Adjusting Pulse Interval

Edit `research-config.json`:
```json
{
  "research": {
    "pulse_interval_seconds": 30  // Change from 9 to any value
  }
}
```

## Troubleshooting

### Rate Limit Exceeded
```
Error: Rate limit exceeded
Solution: Add GITHUB_TOKEN environment variable
```

### Repository Not Found
```
Warning: Could not fetch tree for owner/repo
Solution: Check repository exists and is public, or add access token
```

### Dashboard Not Updating
```
Issue: Dashboard shows "Waiting for first pulse..."
Solution: Ensure research_engine.py is running
```

### No Patterns Found
```
Issue: Pattern counts remain at 0
Solution: Check file_extensions in config match repository file types
```

## Performance

Expected performance:
- **Repositories**: 94 total
- **Pulse Duration**: ~5-15 seconds (depending on changes)
- **API Calls**: ~50-200 per pulse (with caching)
- **Memory**: ~100-500 MB
- **CPU**: Low (mostly I/O bound)

## Roadmap

### Phase 1: Discovery ✅ (Current)
- Repository scanner
- Pattern extraction
- Standards analysis
- Href verification
- i18n scanning
- Research dashboard

### Phase 2: Implementation (Next)
- Generate global components from research
- Create routing-dna.ts
- Build validated href registry
- Generate translation files for 111 languages
- Auto-PR generation

### Phase 3: Continuous Refinement (Future)
- Machine learning for pattern recognition
- Automatic component updates
- Intelligent link fixing
- AI-powered translations
- Cross-repository refactoring

## Contributing

This system is part of the OmniGrid™ ecosystem consolidation platform.

For questions:
- **Email**: heynsschoeman@gmail.com
- **GitHub**: [@heyns1000](https://github.com/heyns1000)

## License

Proprietary - Fruitful Holdings (Pty) Ltd

---

## 🌟 Key Features

✅ **Continuous Scanning** - 9-second pulse, never stops  
✅ **Pattern Detection** - Footers, headers, navs, links  
✅ **Global Standards** - Canonical versions from all repos  
✅ **Link Integrity** - Validates all hrefs, detects 404s  
✅ **i18n Support** - 111 languages, auto-detection  
✅ **Real-time Dashboard** - Live visualization  
✅ **Rate Limit Handling** - Smart API usage  
✅ **Caching** - Efficient, minimal redundant scans  

---

**Built with ❤️ by the OmniGrid Research Team**
