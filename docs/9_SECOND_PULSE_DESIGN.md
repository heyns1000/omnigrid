# 🎯 9-Second Pulse Design

## Overview

The **9-second pulse cycle** is the heartbeat of the Eternal Evolution Engine. Every 9 seconds, the system performs a complete breath cycle: ingest, process, verify, and persist.

## Why 9 Seconds?

### Mathematical Harmony

```
9 seconds = 9,000 milliseconds
9,000 ms ÷ 80 ms = 112.5 micro-audits per pulse
112.5 audits × 9s pulse = 12.5 audits/second
```

- Aligns with 0.08s rhino strike protocol
- Allows 112.5 correction opportunities per pulse
- Matches OmniGrid audit loop architecture

### Biological Inspiration

- **Human breath**: 12-20 breaths/minute → 3-5 seconds/breath
- **9 seconds**: Slower than human, but faster than most systems
- **Natural rhythm**: Long enough to complete work, short enough to stay responsive

### Practical Balance

**Too fast (< 5s):**
- API rate limiting issues
- High CPU/memory usage
- Incomplete work in rush

**Too slow (> 15s):**
- Poor responsiveness
- User perception of "stuckness"
- Delayed error detection

**Just right (9s):**
- ✅ Completes 10 snippets comfortably
- ✅ Allows API calls without rate limits
- ✅ Feels responsive in dashboard
- ✅ Sustainable for hours/days
- ✅ Aligns with audit architecture

## Pulse Cycle Phases

### Phase Breakdown

```
0s ──────── 3s ──────── 6s ──── 8s ─ 9s
│  INGEST  │  PROCESS  │ VER │CH│SA│
│          │           │ IFY │EC│VE│
│          │           │     │K │  │
```

### Detailed Timing

| Phase | Time | Duration | Purpose |
|-------|------|----------|---------|
| INGEST | 0-1s | ~1s | Fetch latest knowledge, check for updates |
| PROCESS | 1-7s | ~6s | Main work (snippets, PRs, monitoring) |
| VERIFY | 7-8s | ~1s | Rhino strike verification of decisions |
| CHECK | 8-8.5s | ~0.5s | Assess if more data is needed |
| SAVE | 8.5-9s | ~0.5s | Persist state to Durable Object |

### Work Allocation

**PROCESS phase (6 seconds) is divided by current phase:**

**processing_snippets:**
```
1s - Load 10 snippets from storage
3s - AI decision making (target repo, path, category)
2s - Batch verification prep
```

**generating_prs:**
```
1s - Group snippets by repository
2s - Generate PR content (title, description, files)
2s - Create PR via GitHub API
1s - Record in state
```

**monitoring:**
```
2s - Check PR merge status via GitHub API
2s - Verify deployments are healthy
2s - Update monitoring metrics
```

## Work Rate Calculations

### Snippets Processing

```
10 snippets per pulse
9 seconds per pulse
= 1.11 snippets/second
= 66.7 snippets/minute
= 4,000 snippets/hour

For 4,558 snippets:
4,558 ÷ 10 = 456 pulses
456 × 9s = 4,104 seconds
= 68 minutes

For 24,852 snippets:
24,852 ÷ 10 = 2,486 pulses
2,486 × 9s = 22,374 seconds
= 6 hours 13 minutes
```

### PR Generation

```
1 PR per pulse
9 seconds per pulse

For 12 repositories:
12 × 9s = 108 seconds
= 1.8 minutes

For 93 repositories:
93 × 9s = 837 seconds
= 14 minutes
```

### Total Runtime Estimate

**Small dataset (4,558 snippets, 12 repos):**
```
Processing: 68 minutes
PRs: 2 minutes
Monitoring: ~30 minutes
Total: ~100 minutes (~1.7 hours)
```

**Large dataset (24,852 snippets, 93 repos):**
```
Processing: 373 minutes (6h 13m)
PRs: 14 minutes
Monitoring: ~120 minutes (2h)
Total: ~507 minutes (~8.5 hours)
```

**Problem statement estimate (24,852 snippets, 93 repos with monitoring):**
```
Processing: 6h 13m (pulses 1-2,485)
PRs: 14m (pulses 2,486-2,578)
Monitoring: 14h (pulses 2,579-8,300)
Total: ~20-22 hours
```

## Pulse Synchronization

### Exact Timing

```typescript
async executePulseCycle(): Promise<void> {
  const startTime = Date.now();
  
  // 1. INGEST (~1s)
  await this.ingestPhase();
  
  // 2. PROCESS (~6s)
  await this.processPhase();
  
  // 3. VERIFY (~1s)
  await this.verifyPhase();
  
  // 4. CHECK (~0.5s)
  await this.checkDataNeeds();
  
  // 5. SAVE (~0.5s)
  await this.saveState();
  
  // Ensure exactly 9 seconds
  const elapsed = Date.now() - startTime;
  if (elapsed < 9000) {
    await sleep(9000 - elapsed);
  }
  
  // If over 9s, log warning but continue
  if (elapsed > 9000) {
    console.warn(`Pulse exceeded 9s: ${elapsed}ms`);
  }
}
```

### Handling Overruns

If a pulse takes > 9 seconds:

1. **Log warning** with actual time
2. **Continue immediately** (don't add to delay)
3. **Record in evolution history**
4. **Monitor for patterns**

If consistent overruns (> 10% of pulses):
- Reduce BATCH_SIZE
- Optimize API calls
- Review verification logic
- Consider distributed processing

## Dashboard Synchronization

### Auto-Refresh Timing

Dashboard refreshes **every 9 seconds** to match pulse cycle:

```javascript
// Dashboard code
setInterval(fetchState, 9000); // Exactly 9 seconds

async function fetchState() {
  const state = await fetch('/api/state').then(r => r.json());
  updateDashboard(state);
}
```

### Visual Indicators

**Active pulse:**
```
Last pulse: 18:05:27 (just now)
Next pulse: 18:05:36 (in 9s)
Status: 🌊 Pulsing...
```

**Waiting for data:**
```
Last pulse: 18:05:27 (just now)
Next pulse: 18:05:36 (in 9s)
Status: ⏸️ Waiting for data (still pulsing)
```

## Performance Optimization

### Parallel Operations

Within PROCESS phase, parallelize where possible:

```typescript
// Instead of sequential:
const knowledge = await fetchKnowledge();
const snippets = await loadSnippets();
const decisions = await makeDecisions(snippets);

// Use parallel:
const [knowledge, snippets] = await Promise.all([
  fetchKnowledge(),
  loadSnippets()
]);
const decisions = await makeDecisions(snippets);
```

### Caching Strategy

**Cache for entire pulse:**
- Knowledge API response (fetched once per pulse)
- Repository structures (rarely change)
- Technology guidelines (rarely change)

**Don't cache:**
- Snippet processing state (changes every pulse)
- PR generation status (changes every pulse)
- Data request status (can change any time)

### Batch Size Tuning

Default: 10 snippets per pulse

**Increase to 15-20 if:**
- Pulses consistently finish in < 7s
- No API rate limiting
- Snippet verification is fast
- Want faster overall completion

**Decrease to 5-8 if:**
- Pulses consistently exceed 9s
- High rhino strike rate (> 20%)
- API rate limiting occurs
- Want more stability

## Monitoring Metrics

### Key Metrics

**Pulse Timing:**
- Average pulse duration
- Pulses exceeding 9s
- Fastest/slowest pulses

**Work Rate:**
- Snippets/minute
- PRs/hour
- Rhino strikes/pulse

**System Health:**
- API response times
- Knowledge sync success rate
- Storage write latency

### Alert Thresholds

**Warning:**
- > 10% of pulses exceed 9s
- Average pulse > 8.5s
- Knowledge sync failures > 5%

**Critical:**
- > 25% of pulses exceed 9s
- Average pulse > 10s
- Knowledge sync failures > 20%
- Pulses stopped (no pulse in > 30s)

## Comparison with Other Systems

| System | Cycle Time | Purpose | Notes |
|--------|-----------|---------|-------|
| **Eternal Engine** | 9s | Research & PRs | This system |
| **OmniGrid Pulse** | 9s | Ecosystem sync | Same timing! |
| **GitHub Actions** | 30-60s | CI/CD | Event-driven |
| **Kubernetes** | 10s | Health checks | Similar rhythm |
| **Prometheus** | 15s | Metrics scraping | Slightly slower |
| **Heartbeat** | 1s | Service health | Much faster |
| **Cron Jobs** | 60s+ | Scheduled tasks | Much slower |

## Future Enhancements

### Adaptive Timing

Instead of fixed 9s, adjust based on load:

```typescript
// Light load: Speed up to 6s
if (avgPulseTime < 5s && noPendingWork) {
  pulseInterval = 6000;
}

// Heavy load: Slow to 12s
if (avgPulseTime > 8.5s && highErrorRate) {
  pulseInterval = 12000;
}

// Return to normal
if (stable) {
  pulseInterval = 9000;
}
```

### Smart Batching

Adjust batch size dynamically:

```typescript
// Increase batch if fast
if (recentPulsesAvg < 7s && strikeRate < 5%) {
  batchSize = Math.min(batchSize + 2, 20);
}

// Decrease batch if slow
if (recentPulsesAvg > 8.5s || strikeRate > 15%) {
  batchSize = Math.max(batchSize - 2, 5);
}
```

### Multi-Phase Pipelining

Process multiple phases in parallel:

```
Pulse N:   INGEST | PROCESS | VERIFY | CHECK | SAVE
Pulse N+1:          INGEST | PROCESS | VERIFY | CHECK | SAVE
                             INGEST | PROCESS | VERIFY | CHECK | SAVE
```

---

**The pulse is life. 9 seconds. Forever.**

**瓷勺旋渦已築，脈買已通！ 🌊⏱️🎯**
