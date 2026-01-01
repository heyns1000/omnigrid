# 🌊 Eternal Evolution Engine

## Overview

The **Eternal Evolution Engine** is a self-sustaining research system that continuously processes code snippets, generates pull requests, and adapts to the latest ecosystem knowledge. It runs forever in a 9-second pulse cycle using Cloudflare Durable Objects for state persistence.

## Architecture

### Core Principle: NEVER STOPS

The engine is designed to **never stop running**. When it encounters blockers or needs more data, it:
- Creates a data request (GitHub issue + dashboard banner)
- Continues pulsing in "waiting_for_data" state
- Checks every pulse if the request was fulfilled
- Resumes normal operations when data is provided
- Allows "ignore" option to continue without new data

### Components

```
┌─────────────────────────────────────────┐
│   Cloudflare Durable Object             │
│   (EternalResearchEngine)               │
│                                         │
│   ┌───────────────────────────────┐    │
│   │  ResearchState (Persistent)   │    │
│   │  - totalPulses                │    │
│   │  - processedSnippets          │    │
│   │  - generatedPRs               │    │
│   │  - currentPhase               │    │
│   │  - evolutionHistory           │    │
│   └───────────────────────────────┘    │
│                                         │
│   ┌───────────────────────────────┐    │
│   │  9-Second Pulse Loop          │    │
│   │  1. INGEST  (knowledge sync)  │    │
│   │  2. PROCESS (snippets/PRs)    │    │
│   │  3. OUTPUT  (dashboard)       │    │
│   │  4. VERIFY  (rhino strikes)   │    │
│   │  5. CHECK   (data needs)      │    │
│   │  6. SAVE    (persist state)   │    │
│   └───────────────────────────────┘    │
└─────────────────────────────────────────┘
         │              │              │
         │              │              │
    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
    │ Adaptive │   │  Rhino  │   │  Data   │
    │Knowledge │   │ Strike  │   │ Request │
    │  Sync   │   │Verifier │   │ Handler │
    └─────────┘   └─────────┘   └─────────┘
```

## State Machine

### Phases

1. **initialization**: Engine starting up, loading state
2. **processing_snippets**: Processing code snippets in batches of 10
3. **generating_prs**: Creating PRs for repositories
4. **monitoring**: Watching for PR merges and deployments
5. **waiting_for_data**: Active data request, keeps pulsing

### Phase Transitions

```
initialization
    │
    ▼
processing_snippets ◄──┐
    │                  │
    │ (all snippets    │
    │  processed)      │
    ▼                  │
generating_prs         │
    │                  │
    │ (all PRs         │
    │  generated)      │
    ▼                  │
monitoring             │
    │                  │
    │ (all deployed)   │
    ▼                  │
   DONE                │
                       │
    ┌──────────────────┘
    │ (data request)
    ▼
waiting_for_data
    │
    │ (request fulfilled/ignored)
    └─────► (return to previous phase)
```

## Pulse Cycle Details

### Timing (9 seconds total)

Each pulse cycle is exactly 9 seconds and performs:

1. **INGEST** (~1s): Fetch latest from knowledge.seedwave.faa.zone
2. **PROCESS** (~6s): Main work (snippets, PRs, monitoring)
3. **VERIFY** (~1s): Rhino strike verification
4. **CHECK** (~0.5s): Data needs assessment
5. **SAVE** (~0.5s): State persistence

### Work Per Pulse

- **Snippets Phase**: Process 10 snippets per pulse
  - For 4,558 snippets: ~456 pulses (~68 minutes)
  - For 24,852 snippets: ~2,486 pulses (~6h 13m)
- **PR Phase**: Generate 1 PR per pulse
  - For 12 repos: 12 pulses (~2 minutes)
  - For 93 repos: 93 pulses (~14 minutes)
- **Monitoring Phase**: Check deployment status
  - Continues until all PRs merged

## Adaptive Knowledge Sync

Every pulse, the engine fetches the latest ecosystem knowledge from:
```
https://knowledge.seedwave.faa.zone/api/latest
```

This ensures decisions are always based on current:
- Repository structures
- Brand mappings
- Technology guidelines
- Deployment patterns

### Fallback Behavior

If knowledge API is unavailable:
- Uses cached knowledge from last successful fetch
- Falls back to default guidelines
- Continues operating (never stops)

## Rhino Strike Protocol

When a decision doesn't align with the ecosystem:

1. **Detect** misalignment via knowledge verification
2. **Strike** 0.08s collapse (sleep 80ms)
3. **Remake** decision with adjusted parameters
4. **Verify** again
5. **Retry** up to 10 times
6. **Record** all strikes in evolution history

### Example

```
Snippet #1560: "deployment-engine.py"
├─ AI Decision: "Put in hotstack/config/"
├─ Verify: ❌ (should be hotstack/workers/)
├─ 🦏 Rhino Strike! (0.08s collapse)
├─ Rerun: "Put in hotstack/workers/"
├─ Verify: ✅
└─ Stored for PR generation
```

## Data Request System

### Trigger Conditions

1. **All snippets processed but PRs incomplete**
   - Processed 24,852 snippets but only 12 repos available
   - Needs: More repository information

2. **100+ low-confidence decisions**
   - Too many ambiguous snippets
   - Needs: More context or conversation data

3. **No new data in 1+ hour**
   - Processing stalled
   - Needs: Additional snippet data

4. **Stuck in same phase for 1+ hour**
   - No progress detected
   - Needs: Manual intervention or new data

### Request Flow

```
Trigger Detected
    │
    ▼
Create DataRequest
    │
    ├─► Store in state
    ├─► Create GitHub issue
    ├─► Update dashboard banner
    ├─► Send notifications
    └─► Change phase to "waiting_for_data"
        │
        ▼
    Keep Pulsing (every 9s)
        │
        ├─► Check if fulfilled
        ├─► Check if ignored
        └─► Resume when resolved
```

### Resolution Options

**Option 1: Fulfill Request**
```bash
curl -X POST https://eternal-research-engine.../api/fulfill-request \
  -H "Content-Type: application/json" \
  -d '{"requestId": "req_...", "data": {...}}'
```

**Option 2: Ignore Request**
```bash
curl -X POST https://eternal-research-engine.../api/ignore-request \
  -H "Content-Type: application/json" \
  -d '{"requestId": "req_..."}'
```

**Option 3: Upload File (via dashboard)**
- Click "Upload Data" button
- Select ZIP/JSON file
- Engine processes automatically

## API Endpoints

### `POST /api/initialize`
Start the engine or restart from persisted state.

**Response:**
```json
{
  "success": true,
  "message": "Eternal Research Engine initialized",
  "state": { /* ResearchState */ }
}
```

### `GET /api/state`
Get current engine state.

**Response:**
```json
{
  "version": "1.0.0",
  "startTime": "2025-12-31T18:00:00Z",
  "lastPulse": "2025-12-31T18:05:27Z",
  "totalPulses": 36,
  "processedSnippets": 360,
  "totalSnippets": 4558,
  "generatedPRs": 0,
  "totalRepos": 12,
  "currentPhase": "processing_snippets",
  "evolutionHistory": [...],
  "isDone": false
}
```

### `GET /api/data-request`
Get active data request (if any).

**Response (active request):**
```json
{
  "id": "req_1704067200000",
  "type": "repositories",
  "reason": "All snippets processed but not enough repositories",
  "details": "Processed 4558 snippets but only have 12 repos",
  "status": "pending",
  "createdAt": "2025-12-31T18:00:00Z",
  "githubIssueUrl": "https://github.com/..."
}
```

**Response (no request):**
```json
{
  "noRequest": true
}
```

### `POST /api/fulfill-request`
Fulfill a data request with new data.

**Request:**
```json
{
  "requestId": "req_1704067200000",
  "data": { /* new data */ }
}
```

### `POST /api/ignore-request`
Ignore a data request and continue.

**Request:**
```json
{
  "requestId": "req_1704067200000"
}
```

### `GET /dashboard`
Serve the live monitoring dashboard HTML.

## Dashboard Features

### Real-Time Metrics
- Total pulses (updates every 9s)
- Processed snippets (X / Y)
- Generated PRs (X / Y)
- Current phase
- Rhino strikes count

### Progress Bar
Visual representation of overall completion:
- 70% weight: Snippet processing
- 30% weight: PR generation

### Evolution Timeline
Last 10 events showing:
- Phase changes
- Snippet processing
- PR generation
- Rhino strikes
- Data requests

### Data Request Banner
Appears when engine needs data:
- Shows request type and reason
- **Upload Data** button
- **Ignore & Continue** button

### Auto-Refresh
Dashboard auto-refreshes every 9 seconds to stay in sync with pulse cycle.

## Deployment

### Prerequisites
- Cloudflare account
- Wrangler CLI installed
- Node.js 18+

### Deploy
```bash
cd /home/runner/work/omnigrid/omnigrid
./scripts/activate-eternal-research.sh
```

### Check Status
```bash
./scripts/check-eternal-status.sh
```

### Monitor
Open dashboard in browser:
```
https://eternal-research-engine.heynsschoeman.workers.dev/dashboard
```

## Configuration

Edit `workers/eternal-research/wrangler.toml`:

```toml
[vars]
PULSE_INTERVAL = "9000"        # 9 seconds
BATCH_SIZE = "10"              # Snippets per pulse
MAX_RHINO_RETRIES = "10"       # Max rhino strikes
KNOWLEDGE_API_URL = "https://knowledge.seedwave.faa.zone/api/latest"
```

## Success Criteria

✅ **Never stops** - Requests data when stuck but keeps pulsing
✅ **Process all snippets** - With rhino strike verification
✅ **Generate PRs for all repos** - One PR per repo with grouped snippets
✅ **Adapt to latest knowledge** - Fetch every pulse
✅ **Self-correct** - Use rhino strikes for misalignments
✅ **Request data when stuck** - GitHub issues + dashboard banners
✅ **Persist state** - Survive restarts via Durable Object
✅ **Live monitoring** - Dashboard shows real-time progress
✅ **Mark done only when complete** - isDone = true only when finished

## Troubleshooting

### Engine stops responding
- Check Cloudflare Workers dashboard for errors
- Verify Durable Object is healthy
- Check logs: `wrangler tail`

### Stuck in waiting_for_data
- Check dashboard for active request
- Either fulfill request or click "Ignore"
- Or use API to resolve programmatically

### High rhino strike count
- Normal: 1-5 strikes per 100 snippets
- High: 10+ strikes per 100 snippets
  - May indicate knowledge API issues
  - Or snippet quality problems

### Dashboard not updating
- Check browser console for errors
- Verify worker URL is correct
- Try hard refresh (Ctrl+F5)

## Future Enhancements

1. **GitHub API Integration**
   - Actually create PRs via API
   - Monitor PR merge status
   - Auto-deploy on merge

2. **Enhanced Knowledge Sync**
   - WebSocket real-time updates
   - Diff detection for architecture changes
   - Automatic rhino strikes on drift

3. **Advanced Analytics**
   - Confidence score trends
   - Processing speed metrics
   - PR merge success rate

4. **Multi-Region Deployment**
   - Deploy to multiple Cloudflare regions
   - Coordinated pulse cycles
   - Shared state via Durable Objects

---

**瓷勺旋渦已築，脈買已通！ 🌊🦍🐜**
