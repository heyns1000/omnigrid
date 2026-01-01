# 🔬 Research System Quick Reference

## Start the Research Engine

```bash
# Quick start (interactive)
./start-research.sh

# Or directly with Python
python3 research_engine.py

# With GitHub token for higher rate limits
export GITHUB_TOKEN=your_token_here
python3 research_engine.py
```

## View the Dashboard

1. Start the research engine (above)
2. Open `research-dashboard.html` in your browser
3. Dashboard auto-updates every 3 seconds

```bash
# Open dashboard (macOS)
open research-dashboard.html

# Open dashboard (Linux)
xdg-open research-dashboard.html

# Or manually open the file in your browser
```

## What It Does

The research system continuously:
- 🔄 Scans all 94 repositories every 9 seconds
- 🔍 Extracts UI patterns (footers, headers, navs)
- 🔗 Verifies all href links for integrity
- 🌐 Detects hardcoded text for i18n
- 📊 Analyzes patterns to find global standards
- 📈 Updates live dashboard with findings

## Configuration

Edit `research-config.json` to customize:
- Pulse interval (default: 9 seconds)
- Repository list
- Pattern detection settings
- i18n language support

## Full Documentation

See [RESEARCH_SYSTEM_README.md](RESEARCH_SYSTEM_README.md) for:
- Complete architecture
- API documentation
- Extending the system
- Troubleshooting
- Phase 2 & 3 roadmap
