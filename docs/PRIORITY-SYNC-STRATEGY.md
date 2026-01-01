# Priority Sync Strategy Documentation

## Overview

The **Priority Sync Engine** is an intelligent, automated synchronization system for the OmniGrid ecosystem that manages 104+ repositories with dynamic urgency-based prioritization. It ensures critical infrastructure repos are always synced first while efficiently managing the rest based on their urgency scores.

## Architecture

### Core Components

1. **Priority Sync Engine** (`scripts/priority_sync_engine.py`)
   - Main orchestrator for intelligent synchronization
   - Implements urgency scoring algorithm
   - Handles batch processing and retry logic

2. **Speed Dashboard Generator** (`scripts/generate_speed_dashboard.py`)
   - Real-time metrics visualization
   - HTML dashboard with live status
   - SVG badge generation for README

3. **Unified Workflow** (`.github/workflows/unified-ecosystem-propagation.yml`)
   - Multi-schedule automation (2hr, 6hr, weekly)
   - Parallel processing for Top 12
   - Integration with PR #69 audit tools

## Top 12 Priority Repositories

These repositories are **ALWAYS** synced first, in exact order, every run:

| Priority | Repository | Role | Criticality |
|----------|-----------|------|-------------|
| 1 | `heyns1000/omnigrid` | Orchestrator | CRITICAL |
| 2 | `heyns1000/codenest` | Hub | CRITICAL |
| 3 | `heyns1000/hotstack` | E-commerce Engine | HIGH |
| 4 | `heyns1000/buildnest` | Build Automation | HIGH |
| 5 | `Fruitful-Global-Planet/FruitfulPlanetChange` | Primary Intake | HIGH |
| 6 | `heyns1000/payment-gateway-hub` | Financial Engine | HIGH |
| 7 | `heyns1000/banimal` | Styling Engine | MEDIUM |
| 8 | `heyns1000/vaultmesh` | Vault Engine | MEDIUM |
| 9 | `heyns1000/pulse-engine` | Pulse Engine | MEDIUM |
| 10 | `heyns1000/zoho` | Integration Engine | MEDIUM |
| 11 | `heyns1000/toynest` | Education Engine | MEDIUM |
| 12 | `heyns1000/data-warehouse` | Growth Tracking | MEDIUM |

### Rationale

- **Positions 1-2**: Core infrastructure - everything depends on these
- **Positions 3-6**: Revenue-generating and critical business systems
- **Positions 7-12**: Supporting infrastructure and integration engines

## Urgency Score Formula

The urgency score determines sync priority for the remaining 92 repositories:

```python
urgency_score = (commits_behind × 10) +           # High impact
                (days_since_last_sync × 5) +      # Medium impact
                (open_prs × 3) +                  # Active development
                (security_alerts × 50) +          # CRITICAL
                (is_codenest_connected ? 20 : 0) + # Bonus
                (has_workflows ? 10 : 0)          # Bonus
```

### Weight Explanation

- **Commits Behind (×10)**: Most critical factor - repos far behind need urgent attention
- **Days Since Last Sync (×5)**: Prevents repos from being forgotten
- **Open PRs (×3)**: Indicates active development requiring sync
- **Security Alerts (×50)**: Security is paramount - massive weight
- **CodeNest Connected (+20)**: Bonus for integrated repos
- **Has Workflows (+10)**: Bonus for repos with CI/CD automation

### Example Calculations

**High Urgency Repo:**
```
celestial-payroll: 50 commits behind, 15 days, 2 PRs, 1 security alert, connected, has workflows
Score = (50×10) + (15×5) + (2×3) + (1×50) + 20 + 10 = 711
```

**Medium Urgency Repo:**
```
learning-mesh: 5 commits behind, 7 days, 1 PR, 0 security alerts, not connected, has workflows
Score = (5×10) + (7×5) + (1×3) + (0×50) + 0 + 10 = 98
```

**Low Urgency Repo:**
```
cache-manager: 0 commits behind, 2 days, 0 PRs, 0 security alerts, not connected, has workflows
Score = (0×10) + (2×5) + (0×3) + (0×50) + 0 + 10 = 20
```

## Batch Processing Strategy

### Phase 1: Top 12 Priority (ALWAYS FIRST)
- **Frequency**: Every 2 hours
- **Repos**: 12 critical infrastructure repos
- **Processing**: Sequential by priority order
- **Time Target**: <15 minutes
- **Failure Handling**: Continue to next repo, log failure

### Phase 2: Urgent Batch
- **Frequency**: Every 6 hours
- **Repos**: Top 10-20 by urgency score (after Top 12)
- **Processing**: Parallel where possible
- **Time Target**: <20 minutes
- **Selection**: Dynamic based on current urgency scores

### Phase 3: Full Ecosystem Sync
- **Frequency**: Weekly (Sunday 2 AM UTC)
- **Repos**: All 104 repositories
- **Processing**: Batched (12 → 20 → remaining)
- **Time Target**: <90 minutes
- **Selection**: Includes all repos in urgency order

## Sync Modes

### CLI Usage

```bash
# Top 12 only (default)
python3 scripts/priority_sync_engine.py --mode top12

# Top 12 + top 10 urgent
python3 scripts/priority_sync_engine.py --mode urgent

# Full ecosystem sync
python3 scripts/priority_sync_engine.py --mode all

# Force specific repos
python3 scripts/priority_sync_engine.py --force omnigrid,codenest,hotstack

# Dry run (no actual syncs)
python3 scripts/priority_sync_engine.py --mode all --dry-run
```

### Workflow Dispatch

Via GitHub Actions UI:
1. Go to Actions → Unified Ecosystem Propagation
2. Click "Run workflow"
3. Select sync mode: `top12`, `urgent`, or `all`
4. Optionally specify `force_repos` (comma-separated)
5. Click "Run workflow"

## Schedule Configuration

The workflow runs on three different schedules:

```yaml
schedule:
  - cron: '0 */2 * * *'   # Every 2 hours: Top 12
  - cron: '0 */6 * * *'   # Every 6 hours: Top 12 + urgent
  - cron: '0 2 * * 0'     # Weekly Sunday 2 AM: Full sync
```

### Schedule Logic

The workflow automatically determines mode based on trigger:
- **2-hour cron**: Runs `top12` mode
- **6-hour cron**: Runs `urgent` mode  
- **Weekly cron**: Runs `all` mode
- **Manual dispatch**: Uses user-selected mode

## Dashboard Interpretation

### Speed Dashboard (`audit/speed-dashboard.html`)

The interactive HTML dashboard shows:

#### Key Metrics
- **Repos Synced Today**: Number of repos successfully synced
- **In Progress**: Repos currently being synced or awaiting PR
- **Repos Behind**: Repos needing sync (by urgency)
- **Sync Velocity**: Repos/hour throughput
- **ETA to Full Sync**: Estimated time to complete all pending syncs

#### Top 12 Status
Visual progress bar showing:
- ✅ SYNCED: Up to date
- 🔄 IN PROGRESS: Sync underway or PR pending
- ⚠️ INACCESSIBLE: Cannot access repo (permissions/404)

#### Top 20 Urgent Repos
List of highest urgency repos with:
- Urgency score (higher = more urgent)
- Commits behind count
- Visual status indicator

### Speed Metrics (`audit/speed-metrics.json`)

Raw JSON data for programmatic access:
```json
{
  "total_repos": 104,
  "synced_today": 18,
  "in_progress": 4,
  "pending": 82,
  "failed": 0,
  "sync_percentage": 17.3,
  "sync_velocity": 6.2,
  "eta_hours": 4.5,
  "last_sync": "2026-01-01T07:00:00Z"
}
```

### Status Badge (`audit/sync-status-badge.svg`)

SVG badge showing sync status:
- **Green (≥90%)**: Excellent sync status
- **Yellow (70-89%)**: Good sync status
- **Red (<70%)**: Needs attention

Can be embedded in README:
```markdown
![Sync Status](audit/sync-status-badge.svg)
```

## Conflict Resolution

### Auto-Resolve (Simple Fast-Forward)
- **Condition**: Clean fast-forward merge possible
- **Action**: Automatic merge, no PR needed
- **Notification**: Success log entry

### Auto-PR (Complex Conflicts)
- **Condition**: Conflicts detected OR >10 commits behind
- **Action**: Create PR for human review
- **Notification**: PR link in logs

### Skip + Alert (Critical Conflicts)
- **Condition**: Severe conflicts or sync failure
- **Action**: Skip repo, log error
- **Notification**: Slack webhook (if configured)

## Auto-Sync Triggers

| Condition | Action | Priority | Auto-Action |
|-----------|--------|----------|-------------|
| Security alert detected | Immediate sync | CRITICAL | Create urgent PR |
| >50 commits behind | Urgent sync | HIGH | Next batch sync |
| >10 commits behind | Standard sync | MEDIUM | Scheduled sync |
| >30 days since last sync | Add to urgent | MEDIUM | Boost priority +50 |
| New PR opened | Bump urgency | LOW | Urgency +10 |
| CodeNest connected | Bonus priority | BONUS | Urgency +20 |

## Integration with PR #69 & #35

### Preserved from PR #69
✅ All audit scripts intact:
- `scripts/audit_repo_existence.py`
- `scripts/check_codenest_connection.py`
- Audit data structure

### Enhanced by Priority Sync
✅ Additional capabilities:
- Priority-based sync order
- Urgency scoring
- Real-time dashboard
- Multi-schedule automation

### Compatible with PR #35
✅ Works alongside:
- All 10 existing workflows
- Auto-merge automation
- Conflict resolution
- Pulse system

## Troubleshooting

### Issue: Top 12 repos not syncing

**Symptoms**: Top 12 always show as "pending"

**Solution**:
1. Check GitHub token permissions
2. Verify ECOSYSTEM_SYNC_TOKEN secret exists
3. Check network connectivity in Actions
4. Review audit logs for 403/404 errors

### Issue: Urgency scores seem wrong

**Symptoms**: Low-priority repos scoring higher than expected

**Solution**:
1. Verify audit data is current (`audit_repo_existence.py`)
2. Check connection data (`check_codenest_connection.py`)
3. Review formula weights - adjust if needed
4. Ensure metadata fetching isn't failing silently

### Issue: Dashboard not updating

**Symptoms**: Old data in `speed-dashboard.html`

**Solution**:
1. Verify workflow completed successfully
2. Check `generate_speed_dashboard.py` ran
3. Ensure audit files exist in `audit/` directory
4. Verify git commit/push succeeded

### Issue: Sync velocity too slow

**Symptoms**: <2 repos/hour throughput

**Solution**:
1. Check for API rate limiting (GitHub)
2. Verify parallel processing working for Top 12
3. Review batch sizes - may need tuning
4. Check for failing repos blocking progress

### Issue: Dry-run works but production fails

**Symptoms**: Dry-run succeeds, real sync fails

**Solution**:
1. Verify ECOSYSTEM_SYNC_TOKEN has correct permissions
2. Check token isn't expired
3. Ensure token has access to all 104 repos
4. Review workflow logs for auth errors

## Performance Targets

### Current Targets
- ✅ Top 12 sync: <15 minutes
- ✅ Full audit: <30 minutes
- ✅ Urgency calculation: <2 minutes
- ✅ Dashboard generation: <30 seconds

### Future Optimizations
- [ ] Parallel Top 12 processing (5-8 minutes)
- [ ] Caching mechanism for metadata
- [ ] Incremental urgency updates
- [ ] Predictive sync scheduling

## Security Considerations

### Token Management
- Never commit `GITHUB_TOKEN` to code
- Use GitHub Secrets for `ECOSYSTEM_SYNC_TOKEN`
- Rotate tokens quarterly
- Minimum required permissions: `repo`, `workflow`

### Rate Limiting
- Monitor GitHub API usage
- Implement exponential backoff
- Use conditional requests (ETags)
- Cache metadata when possible

### Data Privacy
- No sensitive data in logs
- Audit files committed safely
- Dashboard sanitizes repo names
- No hardcoded credentials

## Future Enhancements

### Planned (Q1 2026)
- [ ] ML-based urgency prediction
- [ ] Cross-repo dependency detection
- [ ] Slack/Teams notifications
- [ ] Advanced conflict resolution AI

### Under Consideration
- [ ] Custom urgency weights per repo
- [ ] Multi-region sync support
- [ ] Rollback mechanism
- [ ] Sync simulation mode

## Support & Maintenance

### Monitoring
- Review dashboard weekly
- Check failed syncs daily
- Monitor urgency trends
- Track sync velocity

### Updates
- Review Top 12 list quarterly
- Tune urgency weights based on feedback
- Update documentation as needed
- Test schedule changes in staging

### Contact
- Issues: Open GitHub issue with `priority-sync` label
- Questions: Discussion board or team chat
- Emergency: Alert on-call engineer

---

**Version**: 1.0  
**Last Updated**: 2026-01-01  
**Maintainer**: OmniGrid Infrastructure Team  
**Related**: PR #69 (Audit Tools), PR #35 (Automation Framework)
