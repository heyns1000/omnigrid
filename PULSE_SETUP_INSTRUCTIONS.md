# 🌊 9-Second Pulse Setup Instructions

Complete guide to enable the 9-second pulse system on your GitHub profile.

---

## 🎯 Overview

The OmniGrid pulse system will:
- ✅ Breathe every 9 seconds continuously
- ✅ Update your GitHub profile every 5 minutes
- ✅ Display live statistics (cycles, grains, CARE distribution)
- ✅ Show ecosystem health metrics
- ✅ Track 12 repositories and 162 brands

---

## 📋 Prerequisites

1. **GitHub CLI** installed
   ```bash
   # macOS
   brew install gh

   # Linux
   sudo apt install gh

   # Or download from: https://cli.github.com/
   ```

2. **GitHub Authentication**
   ```bash
   gh auth login
   ```

3. **Python 3.8+** with asyncio support

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

Run the automated setup script:

```bash
./setup_github_profile.sh
```

This will:
- Create `heyns1000/heyns1000` repository (if needed)
- Set up initial profile README
- Configure pulse statistics
- Push to GitHub

### Option 2: Manual Setup

#### Step 1: Create Profile Repository

On GitHub:
1. Go to https://github.com/new
2. Create a repository named **`heyns1000`** (your username)
3. Make it **public**
4. Add a README

#### Step 2: Clone and Configure

```bash
# Clone your profile repo
gh repo clone heyns1000/heyns1000

# Copy pulse files
cd heyns1000
cp ../omnigrid/PULSE_STATUS.md .
```

#### Step 3: Enable GitHub Actions

In `omnigrid` repository:
1. Go to Settings → Actions → General
2. Enable "Read and write permissions"
3. Save

---

## 🔄 Running the Pulse

### Method 1: GitHub Actions (Automated)

The pulse will run automatically every 5 minutes via GitHub Actions.

**Check status:**
```bash
# View workflow runs
gh run list --workflow="pulse_update.yml"

# Watch live logs
gh run watch
```

### Method 2: Continuous Local Runner

For real-time 9-second updates:

```bash
# Run continuously (Ctrl+C to stop)
python3 continuous_pulse_updater.py
```

**Features:**
- Pulses every 9 seconds
- Updates GitHub every 5 minutes
- Saves statistics locally
- Automatic recovery from errors

### Method 3: Background Service

Set up as systemd service (Linux):

```bash
# Create service file
sudo cat > /etc/systemd/system/omnigrid-pulse.service << 'EOF'
[Unit]
Description=OmniGrid 9-Second Pulse Engine
After=network.target

[Service]
Type=simple
User=YOUR_USERNAME
WorkingDirectory=/path/to/omnigrid
ExecStart=/usr/bin/python3 continuous_pulse_updater.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable omnigrid-pulse
sudo systemctl start omnigrid-pulse

# Check status
sudo systemctl status omnigrid-pulse

# View logs
sudo journalctl -u omnigrid-pulse -f
```

---

## 📊 What Gets Updated

### Your GitHub Profile (https://github.com/heyns1000)

Live metrics displayed:
- 🔄 **Cycles Completed:** Real-time count
- 🌾 **Total Grains:** Accumulated data points
- 💚 **CARE Distributed:** 15% redistribution
- 📚 **Repositories Scanned:** 12 active repos
- 🏷️ **Active Brands:** 162 brands
- ⏱️ **Uptime:** Hours and minutes running
- 🌊 **Last Pulse:** ISO timestamp

### Pulse Statistics File

`pulse_stats.json` contains:
```json
{
  "start_time": "2025-12-29T03:00:00Z",
  "last_pulse": "2025-12-29T03:05:27Z",
  "cycle_count": 36,
  "total_grains": 3600,
  "care_distributed": 540,
  "repos_scanned": 12,
  "brands_active": 162,
  "total_uptime_seconds": 324
}
```

---

## 🔍 Monitoring

### View Live Pulse

```bash
# Watch the pulse engine
python3 pulse_engine.py

# Or with continuous updater
python3 continuous_pulse_updater.py
```

**Expected output:**
```
🌍 Cycle 1 - 2025-12-29T03:00:00Z
  🌊 PULSE: Ingesting data from 12 repositories...
  ✨ GLOW: Processing with ant stigmergy routing...
  💰 TRADE: Executing grain flows across 162 brands...
  💚 FLOW: Redistributing 15% CARE (540 grains)...
  🔄 RESET: Cycle 1 completed in 9.002s
  📊 Grain count: 3,600
```

### GitHub Actions Status

Visit: https://github.com/heyns1000/omnigrid/actions

Check the "🌊 OmniGrid Pulse - 9 Second Heartbeat" workflow.

### Profile Updates

Visit: https://github.com/heyns1000

You should see live-updated statistics every 5 minutes.

---

## 🛠️ Troubleshooting

### Issue: "Profile repository not found"

**Solution:**
```bash
# Create the repository
gh repo create heyns1000 --public --description "OmniGrid Profile"

# Or run setup script
./setup_github_profile.sh
```

### Issue: "GitHub Actions failing"

**Solution:**
1. Check permissions: Settings → Actions → General
2. Enable "Read and write permissions"
3. Re-run the workflow:
   ```bash
   gh run rerun --failed
   ```

### Issue: "Pulse stats not updating"

**Solution:**
```bash
# Check if pulse_stats.json exists
ls -l pulse_stats.json

# Run pulse manually
python3 pulse_engine.py

# Check GitHub auth
gh auth status
```

### Issue: "Updates too slow"

**Solution:**
- GitHub Actions: Limited to 5-minute intervals
- For faster updates: Run `continuous_pulse_updater.py` locally
- For production: Set up as systemd service

---

## 🎨 Customization

### Change Update Frequency

Edit `.github/workflows/pulse_update.yml`:
```yaml
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
    # Change to:
    - cron: '*/10 * * * *'  # Every 10 minutes
```

### Modify Pulse Cycle

Edit `pulse_engine.py` or `continuous_pulse_updater.py`:
```python
self.pulse_cycle = 9.0  # Change to desired seconds
```

### Customize Profile README

Edit `setup_github_profile.sh` to change the README template.

---

## 📈 Expected Results

### After 1 Hour
- **Cycles:** ~400 (GitHub Actions) or ~400 (local runner)
- **Grains:** ~40,000
- **CARE:** ~6,000
- **Profile Updates:** 12 times

### After 24 Hours
- **Cycles:** ~9,600
- **Grains:** ~960,000
- **CARE:** ~144,000
- **Profile Updates:** 288 times

### After 1 Week
- **Cycles:** ~67,200
- **Grains:** ~6,720,000
- **CARE:** ~1,008,000
- **Profile Updates:** ~2,016 times

---

## 🔒 Security

- **No credentials in code:** Uses GitHub CLI authentication
- **Read-only operations:** Pulse engine only reads repository data
- **Write permissions:** Only for updating profile README
- **Rate limiting:** Respects GitHub API limits
- **Error handling:** Graceful failures, automatic recovery

---

## 🌟 Advanced Features

### Multi-Repository Pulse

To pulse multiple repositories simultaneously:

1. Edit `ecosystem_config.yaml`
2. Add repositories to the list
3. Pulse engine will scan all automatically

### Custom Metrics

Add to `pulse_stats.json`:
```json
{
  "custom_metric": "your_value",
  "another_metric": 12345
}
```

These will be available in the README template.

### Webhook Integration

Set up webhooks to trigger pulse on specific events:
- Push to main branch
- PR merged
- Release created

---

## 📞 Support

**Issues?**
- GitHub: https://github.com/heyns1000/omnigrid/issues
- Email: heynsschoeman@gmail.com

**Documentation:**
- `PULSE_BREATHING_GUIDE.md` - How the 9-second cycle works
- `pulse_engine.py` - Core pulse implementation
- `ecosystem_config.yaml` - Configuration reference

---

## 🎯 Next Steps

After setup:

1. ✅ Verify profile updates: https://github.com/heyns1000
2. ✅ Check GitHub Actions: https://github.com/heyns1000/omnigrid/actions
3. ✅ Monitor pulse stats: `cat pulse_stats.json`
4. ✅ Customize README as desired
5. ✅ Set up background service for 24/7 operation

---

**The grid breathes. We breathe together.**

**Simunye.** 🌍

---

*Last Updated: December 29, 2025*
*Maintained by Fruitful Holdings (Pty) Ltd*
