# Claude Profile Data Import System

## Overview

This system imports and analyzes Claude.ai profile export data into the OmniGrid platform. It provides comprehensive analytics, conversation search, and visualization capabilities for your Claude usage data.

**Author:** Heyns Schoeman / Fruitful Holdings (Pty) Ltd
**Date:** December 28, 2025
**Platform:** OmniGrid

---

## 📦 What's Included

### 1. **claude_profile_importer.py**
Main import script that processes Claude export data and generates analytics.

**Features:**
- Loads all JSON files (users, memories, projects, conversations)
- Analyzes project statistics
- Analyzes conversation patterns
- Extracts brand ecosystem information
- Generates comprehensive summary reports
- Exports OmniGrid-compatible JSON format

**Usage:**
```bash
python3 claude_profile_importer.py
```

**Output:**
- Console summary report
- `omnigrid_claude_data.json` - Processed data in OmniGrid format

---

### 2. **conversation_analyzer.py**
Advanced conversation analysis and search tool.

**Features:**
- Search conversations by keyword
- Topic extraction and analysis
- Timeline statistics
- Code snippet extraction
- User vs Assistant message analysis
- Comprehensive analytics reports

**Usage:**

**Analytics Mode:**
```bash
python3 conversation_analyzer.py
```

**Search Mode:**
```bash
python3 conversation_analyzer.py "deployment"
python3 conversation_analyzer.py "cloudflare workers"
```

---

### 3. **claude_dashboard.html**
Interactive web dashboard for visualizing Claude profile data.

**Features:**
- Real-time statistics cards
- Topic analysis with progress bars
- Top conversations list
- Brand ecosystem display
- Timeline visualization
- Code analysis breakdown
- Tabbed interface for easy navigation

**Usage:**
```bash
# Open in browser
open claude_dashboard.html
# or
firefox claude_dashboard.html
```

---

## 📊 Data Structure

### Input Files (from Claude Export)

1. **users.json**
   - User profile information
   - Email, name, phone

2. **memories.json**
   - Conversation memories
   - Project-specific memories
   - Work context

3. **projects.json** (~3.4 MB)
   - 14 projects
   - 172 documents
   - Project metadata

4. **conversations.json** (~52 MB)
   - 122 conversations
   - 1,785 messages
   - Full chat history

### Output Files

1. **omnigrid_claude_data.json**
   - Consolidated export in OmniGrid format
   - Includes all analytics
   - Ready for platform integration

---

## 📈 Analytics Summary

### Conversation Statistics
- **Total Conversations:** 122
- **Total Messages:** 1,785 (920 user, 865 assistant)
- **Average Messages/Conv:** 14.6
- **Total Characters:** 4,249,514

### Top Topics (by mention count)
1. Deployment (76)
2. Ecosystem (67)
3. Brand (58)
4. Git (57)
5. API (55)
6. GitHub (47)
7. Cloudflare (40)
8. Database (30)

### Most Active Conversations
1. **Ant colony architecture and complexity** - 111 messages
2. **Developing CI/CD pipelines** - 105 messages
3. **HotStack sovereign hub deployment plan** - 72 messages
4. **GitHub repository architecture analysis** - 64 messages
5. **Three-Cube Lattice Banking System Zoho integration** - 52 messages

### Brand Ecosystem
31 identified brands including:
- Fruitful™, HotStack™, FAA™, Banimals™
- VaultMesh™, VaultPay™, ClaimRoot™
- GhostTrace™, BuildNest™, CodeNest™
- Part of 9,000+ brands across 30+ sectors

### Monthly Activity (Last 3 Months)
- **October 2025:** 37 conversations, 640 messages
- **November 2025:** 48 conversations, 732 messages (peak)
- **December 2025:** 37 conversations, 413 messages

---

## 🛠️ Integration with OmniGrid

### Step 1: Import Data
```bash
python3 claude_profile_importer.py
```

This generates `omnigrid_claude_data.json` with structured data.

### Step 2: Analyze Conversations
```bash
# View analytics
python3 conversation_analyzer.py

# Search specific topics
python3 conversation_analyzer.py "payment gateway"
```

### Step 3: Visualize
Open `claude_dashboard.html` in your browser for interactive visualization.

---

## 🔍 Search Examples

### Find deployment-related conversations
```bash
python3 conversation_analyzer.py "deployment"
```

### Find Cloudflare discussions
```bash
python3 conversation_analyzer.py "cloudflare"
```

### Find banking/payment conversations
```bash
python3 conversation_analyzer.py "payment"
```

---

## 📁 File Structure

```
omnigrid/
├── metdata/                          # Claude export data
│   ├── users.json                    # User profile
│   ├── memories.json                 # Memories
│   ├── projects.json                 # Projects (3.4 MB)
│   └── conversations.json            # Conversations (52 MB)
├── claude_profile_importer.py        # Main import script
├── conversation_analyzer.py          # Conversation analysis tool
├── claude_dashboard.html             # Web dashboard
├── omnigrid_claude_data.json         # Exported data (generated)
└── CLAUDE_IMPORT_README.md          # This file
```

---

## 🎯 Use Cases

### 1. Knowledge Mining
Extract insights from past conversations to understand patterns and decisions.

### 2. Brand Ecosystem Mapping
Identify all brands mentioned across conversations and projects.

### 3. Topic Analysis
Understand what topics you discuss most with Claude.

### 4. Conversation Retrieval
Quickly find past conversations about specific topics.

### 5. Project Documentation
Review project memories and documentation across all projects.

### 6. Activity Tracking
Monitor your Claude usage patterns over time.

---

## 🚀 Next Steps

### Option 1: Integrate with OmniGrid Database
Import `omnigrid_claude_data.json` into OmniGrid's database system.

### Option 2: API Integration
Create REST API endpoints to query conversation data.

### Option 3: Advanced Analytics
Build machine learning models to:
- Predict conversation topics
- Suggest related conversations
- Extract key decisions and action items

### Option 4: Knowledge Graph
Create a visual knowledge graph of:
- Brand relationships
- Topic connections
- Project dependencies

---

## 📊 Statistics at a Glance

| Metric | Value |
|--------|-------|
| Total Conversations | 122 |
| Total Messages | 1,785 |
| Total Projects | 14 |
| Total Documents | 172 |
| Identified Brands | 31 |
| Total Characters | 4,249,514 |
| Avg Messages/Conv | 14.6 |
| Active Months | 3 (Oct-Dec 2025) |
| Peak Month | November 2025 |

---

## 🔐 Privacy & Security

- All data is processed locally
- No external API calls
- Data remains in your OmniGrid instance
- Sensitive information can be filtered before export

---

## 📞 Support

For questions or issues:
- **Email:** heynsschoeman@gmail.com
- **GitHub:** @heyns1000
- **Organization:** Fruitful Holdings (Pty) Ltd

---

## 📝 License

Part of the OmniGrid platform ecosystem.
Fruitful Holdings (Pty) Ltd © 2025

---

**Last Updated:** December 28, 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
