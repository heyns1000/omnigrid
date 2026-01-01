# 📊 Data Request System

## Overview

The Data Request System allows the Eternal Evolution Engine to request additional data when stuck, while **never stopping**. The engine continues pulsing in "waiting_for_data" state until the request is fulfilled or ignored.

## Trigger Conditions

### 1. Snippets Processed But PRs Incomplete
**Condition:** `processedSnippets >= totalSnippets && generatedPRs < (totalSnippets / 10)`
**Reason:** Not enough repositories to distribute all snippets
**Solution:** Provide repository mapping with additional repos

### 2. High Low-Confidence Decisions
**Condition:** `lowConfidenceCount > 100`
**Reason:** Too many ambiguous snippets without clear placement
**Solution:** Provide conversation context or clarification

### 3. No Data Ingested in 1+ Hour
**Condition:** `lastIngestTime < (now - 1 hour)`
**Reason:** Knowledge API may be stale or unreachable
**Solution:** Update knowledge API or provide fresh data

### 4. Stuck in Same Phase 1+ Hour
**Condition:** No phase change in 1+ hour
**Reason:** Processing stuck, no progress being made
**Solution:** Manual intervention or fresh data

## Request Structure

```typescript
interface DataRequest {
  id: string;                    // "req_1704067200000"
  type: 'conversations' | 'snippets' | 'repositories' | 'clarification';
  reason: string;                // Human-readable reason
  details: string;               // Detailed explanation
  status: 'pending' | 'fulfilled' | 'ignored';
  createdAt: string;             // ISO timestamp
  fulfilledAt?: string;          // ISO timestamp (when resolved)
  githubIssueUrl?: string;       // Link to GitHub issue
}
```

## Request Flow

### 1. Detection
```typescript
const request = dataRequestHandler.checkNeedsMoreData(state);
if (request) {
  // Request created
}
```

### 2. Storage
```typescript
// Store in Durable Object state
state.activeRequest = request;
state.currentPhase = 'waiting_for_data';
```

### 3. Notification
```typescript
// Create GitHub issue
await dataRequestHandler.createGitHubIssue(request);

// Update dashboard banner
dashboardBanner.show(request);

// Send notifications (optional)
await dataRequestHandler.sendNotification(request);
```

### 4. Continuous Pulsing
```typescript
// Engine KEEPS PULSING even while waiting
while (!state.isDone) {
  await executePulseCycle(); // Every 9 seconds
  
  if (state.currentPhase === 'waiting_for_data') {
    // Check if request fulfilled or ignored
    if (!dataRequestHandler.hasActiveRequest()) {
      state.currentPhase = 'processing_snippets';
    }
  }
}
```

### 5. Resolution
```typescript
// Option A: Fulfill with data
dataRequestHandler.fulfillRequest(requestId, newData);

// Option B: Ignore and continue
dataRequestHandler.ignoreRequest(requestId);
```

## Dashboard Integration

### Banner Display

When request is active, dashboard shows:

```html
┌─────────────────────────────────────────────┐
│ ⚠️  Data Request Active                     │
│                                             │
│ Reason: All snippets processed but not      │
│         enough repositories for PRs         │
│                                             │
│ Details: Processed 4,558 snippets but       │
│          only have 12 repos for PRs         │
│                                             │
│ [📤 Upload Data]  [⏭️ Ignore & Continue]    │
└─────────────────────────────────────────────┘
```

### Upload Button

Clicking "Upload Data" opens file picker:
- Accept: `.zip`, `.json`, `.csv`
- Process: Parse and integrate new data
- Result: Fulfill request automatically

### Ignore Button

Clicking "Ignore & Continue":
- Mark request as ignored
- Return to previous phase
- Continue processing with existing data

## API Endpoints

### GET /api/data-request
Get active request (if any).

**Response (active):**
```json
{
  "id": "req_1704067200000",
  "type": "repositories",
  "reason": "All snippets processed but not enough repositories",
  "details": "Processed 4558 snippets but only have 12 repos for PRs",
  "status": "pending",
  "createdAt": "2025-12-31T18:00:00Z",
  "githubIssueUrl": "https://github.com/heyns1000/omnigrid/issues/XX"
}
```

**Response (none):**
```json
{
  "noRequest": true
}
```

### POST /api/fulfill-request
Fulfill request with new data.

**Request:**
```json
{
  "requestId": "req_1704067200000",
  "data": {
    "repositories": [
      {"name": "repo1", "url": "..."},
      {"name": "repo2", "url": "..."}
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Request fulfilled, resuming normal operations"
}
```

### POST /api/ignore-request
Ignore request and continue.

**Request:**
```json
{
  "requestId": "req_1704067200000"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Request ignored, continuing without new data"
}
```

### POST /api/upload-data
Upload file to fulfill request.

**Request:**
- Content-Type: `multipart/form-data`
- Body: File upload (ZIP/JSON)

**Response:**
```json
{
  "success": true,
  "message": "Data uploaded and processed",
  "itemsAdded": {
    "snippets": 1250,
    "repositories": 15,
    "conversations": 23
  }
}
```

## GitHub Issue Integration

### Issue Template

When data request created, GitHub issue is opened:

**Title:** `[Data Request] All snippets processed but not enough repositories`

**Body:**
```markdown
## 🌊 Eternal Research Engine - Data Request

**Request ID:** req_1704067200000
**Type:** repositories
**Created:** 2025-12-31 18:00:00 UTC

### Reason
All snippets processed but not enough repositories for PRs

### Details
Processed 4,558 snippets but only have 12 repositories mapped. Need additional repository information to generate PRs for remaining snippets.

### Current State
- Processed Snippets: 4,558 / 4,558 (100%)
- Generated PRs: 12 / 12 (100%)
- Current Phase: waiting_for_data
- Total Pulses: 456

### What's Needed
- Additional repository mappings
- OR Clarification on which repos should receive which snippets
- OR Indication to consolidate into fewer repos

### How to Fulfill
1. Via API: `POST /api/fulfill-request` with new data
2. Via Dashboard: Upload ZIP/JSON file
3. Via Comment: Add data in issue comment (will be parsed)

### How to Ignore
1. Via API: `POST /api/ignore-request`
2. Via Dashboard: Click "Ignore & Continue"
3. Via Comment: Add "ignore" comment

---

**Dashboard:** https://eternal-research-engine.heynsschoeman.workers.dev/dashboard
**API:** https://eternal-research-engine.heynsschoeman.workers.dev/api/state
```

### Issue Labels
- `data-request`
- `eternal-engine`
- `automated`

## Example Scenarios

### Scenario 1: Repository Shortage

**Situation:**
- 4,558 snippets processed
- Only 12 repositories available
- Need to distribute snippets

**Request:**
```json
{
  "type": "repositories",
  "reason": "Need more repositories for PR generation",
  "details": "Processed 4,558 snippets, need ~90 repos based on snippet diversity"
}
```

**Resolution:**
Upload `repositories.json` with 81 additional repos:
```json
{
  "repositories": [
    {"name": "seedwave", "url": "https://github.com/heyns1000/seedwave"},
    {"name": "banimal", "url": "https://github.com/heyns1000/banimal"},
    ...
  ]
}
```

### Scenario 2: Low Confidence Pile-Up

**Situation:**
- 143 snippets with < 0.5 confidence
- Ambiguous placement decisions
- Need conversation context

**Request:**
```json
{
  "type": "clarification",
  "reason": "Too many low-confidence decisions",
  "details": "143 snippets have ambiguous placement, need conversation context"
}
```

**Resolution:**
Either:
- Upload conversation data with context
- Or ignore and accept lower quality placements

### Scenario 3: Stale Knowledge

**Situation:**
- Knowledge API hasn't updated in 2 hours
- Decisions may be based on outdated info
- Need fresh architecture

**Request:**
```json
{
  "type": "conversations",
  "reason": "Knowledge API stale",
  "details": "No knowledge updates in 2+ hours, may have outdated architecture"
}
```

**Resolution:**
- Fix knowledge API
- Or upload fresh architecture snapshot
- Or ignore if acceptable

## Best Practices

### When to Fulfill
- You have the requested data available
- The data will meaningfully improve quality
- The engine is truly stuck

### When to Ignore
- Data not available and won't be soon
- Current quality is acceptable
- Engine can continue productively

### Avoiding Requests
- Keep knowledge API healthy and updated
- Provide complete initial data
- Include conversation context with snippets
- Map all repositories up front

---

**The engine never stops. It requests, waits, and resumes.**

**瓷勺旋渦已築，脈買已通！ 🌊📊🔔**
