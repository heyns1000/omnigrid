# Phase 38 Deployment Guide

## Production Deployment

### Prerequisites

#### System Requirements

- **OS:** Linux (Ubuntu 20.04+ or equivalent)
- **Python:** 3.8 or higher
- **Memory:** 4GB RAM minimum (8GB recommended)
- **CPU:** 4 cores minimum (8 cores recommended)
- **Disk:** 10GB available space

#### Dependencies

```bash
# Python dependencies
pip install numpy>=1.21.0

# Optional: For monitoring
pip install psutil
```

### Installation

#### 1. Clone Repository

```bash
git clone https://github.com/heyns1000/omnigrid.git
cd omnigrid
```

#### 2. Verify Installation

```bash
# Run tests
python test_phase38_quantum.py

# Should see: ✅ All tests passed!
```

#### 3. Configure System

```bash
# Copy default config
cp config/phase38-quantum-config.json config/phase38-production.json

# Edit production config
nano config/phase38-production.json
```

**Key Configuration Options:**

```json
{
  "components": {
    "tensorflow_quantum": {
      "n_qubits": 8,           # Increase for more complexity
      "learning_rate": 0.01
    },
    "oracle_feed": {
      "n_oracles": 24,         # Scale to 48 for higher redundancy
      "cycle_seconds": 9.0,
      "target_divergence_percent": 0.003
    },
    "quantum_subnodes": {
      "n_nodes": 24,          # Scale to 48 for larger capacity
      "qubits_per_node": 6
    }
  },
  "deployment": {
    "environment": "production",
    "region": "us-east-1"
  }
}
```

### Deployment Methods

#### Method 1: Systemd Service (Recommended)

Create service file: `/etc/systemd/system/phase38.service`

```ini
[Unit]
Description=Phase 38 Quantum Integration
After=network.target

[Service]
Type=simple
User=omnigrid
WorkingDirectory=/opt/omnigrid
Environment="PYTHONPATH=/opt/omnigrid"
ExecStart=/usr/bin/python3 /opt/omnigrid/scripts/phase38-orchestrator.py --mode continuous --config /opt/omnigrid/config/phase38-production.json
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

**Enable and start:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable phase38
sudo systemctl start phase38

# Check status
sudo systemctl status phase38

# View logs
sudo journalctl -u phase38 -f
```

#### Method 2: Docker Container

Create `Dockerfile`:

```dockerfile
FROM python:3.9-slim

# Install dependencies
RUN pip install numpy

# Copy application
WORKDIR /app
COPY . /app

# Run tests
RUN python test_phase38_quantum.py

# Set environment
ENV PYTHONPATH=/app

# Start orchestrator
CMD ["python", "scripts/phase38-orchestrator.py", "--mode", "continuous"]
```

**Build and run:**

```bash
# Build image
docker build -t phase38:latest .

# Run container
docker run -d \
  --name phase38 \
  --restart unless-stopped \
  -v $(pwd)/config:/app/config \
  -v $(pwd)/data:/app/data \
  phase38:latest

# View logs
docker logs -f phase38

# Check status
docker ps | grep phase38
```

#### Method 3: Manual Process

```bash
# Create screen session
screen -S phase38

# Activate environment (if using venv)
source venv/bin/activate

# Start orchestrator
python scripts/phase38-orchestrator.py \
  --mode continuous \
  --config config/phase38-production.json

# Detach: Ctrl+A, D
# Reattach: screen -r phase38
```

### Monitoring

#### Health Checks

```bash
# Check system health
python -c "
from scripts.phase38_orchestrator import Phase38Orchestrator
orch = Phase38Orchestrator('config/phase38-production.json')
orch.initialize()
health = orch.get_system_health()
print(f'Status: {health[\"status\"]}')
print(f'Uptime: {health[\"uptime_seconds\"]}s')
"
```

#### Metrics Collection

Phase 38 exports metrics to JSON files:

- `phase38_dashboard_data.json` - Real-time dashboard data
- `faa_actuary_core_state.json` - Actuary core state
- `quantum_subnodes_state.json` - Cluster state

**Automated collection:**

```bash
# Cron job for metrics backup
*/10 * * * * cp /opt/omnigrid/phase38_dashboard_data.json /backup/metrics/dashboard_$(date +\%Y\%m\%d_\%H\%M\%S).json
```

#### Dashboard Access

**Option 1: Local File**

```bash
# Open dashboard directly
open hotstack-v3.1-quantum-dashboard.html
```

**Option 2: Web Server**

```bash
# Serve via Python
cd /opt/omnigrid
python -m http.server 8080

# Access at: http://your-server:8080/hotstack-v3.1-quantum-dashboard.html
```

**Option 3: Nginx**

```nginx
server {
    listen 80;
    server_name phase38.yourdomain.com;

    root /opt/omnigrid;
    index hotstack-v3.1-quantum-dashboard.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location /data/ {
        alias /opt/omnigrid/data/;
        types {
            application/json json;
        }
    }
}
```

### Performance Tuning

#### Optimize for High Throughput

```json
{
  "components": {
    "oracle_feed": {
      "cycle_seconds": 5.0,    # Reduce cycle time
      "n_oracles": 48          # Increase parallelism
    },
    "quantum_subnodes": {
      "n_nodes": 48            # More processing capacity
    }
  },
  "performance": {
    "parallel_processing": true,
    "batch_processing": true
  }
}
```

#### Optimize for Accuracy

```json
{
  "components": {
    "tensorflow_quantum": {
      "n_qubits": 12,          # More qubits
      "circuit_depth": 15      # Deeper circuits
    },
    "oracle_feed": {
      "n_oracles": 48,         # More oracles
      "target_divergence_percent": 0.001  # Stricter target
    }
  }
}
```

### Backup & Recovery

#### State Backup

```bash
# Create backup script
cat > /opt/omnigrid/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/phase38/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

# Backup state files
cp /opt/omnigrid/*.json "$BACKUP_DIR/"

# Backup configuration
cp /opt/omnigrid/config/*.json "$BACKUP_DIR/config/"

# Compress
tar -czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"
rm -rf "$BACKUP_DIR"

echo "Backup complete: $BACKUP_DIR.tar.gz"
EOF

chmod +x /opt/omnigrid/backup.sh

# Schedule daily backups
echo "0 2 * * * /opt/omnigrid/backup.sh" | crontab -
```

#### State Recovery

```bash
# Stop service
sudo systemctl stop phase38

# Restore from backup
tar -xzf /backup/phase38/20260106.tar.gz
cp 20260106/*.json /opt/omnigrid/

# Restart service
sudo systemctl start phase38
```

### Scaling

#### Horizontal Scaling

Deploy multiple instances with load balancer:

```
                    ┌─────────────┐
                    │Load Balancer│
                    └──────┬──────┘
              ┌────────────┼────────────┐
              │            │            │
         ┌────▼────┐  ┌────▼────┐  ┌───▼─────┐
         │Phase 38 │  │Phase 38 │  │Phase 38 │
         │Instance1│  │Instance2│  │Instance3│
         └─────────┘  └─────────┘  └─────────┘
```

**Configuration per instance:**

```json
{
  "deployment": {
    "instance_id": "phase38-01",
    "region": "us-east-1a"
  }
}
```

#### Vertical Scaling

```json
{
  "components": {
    "tensorflow_quantum": {
      "n_qubits": 16          # Requires more memory
    },
    "quantum_subnodes": {
      "n_nodes": 96,          # More nodes
      "qubits_per_node": 8    # More qubits per node
    }
  }
}
```

### Troubleshooting

#### Service Won't Start

```bash
# Check logs
sudo journalctl -u phase38 -n 100 --no-pager

# Verify configuration
python -c "import json; json.load(open('config/phase38-production.json'))"

# Test manually
python scripts/phase38-orchestrator.py --mode test
```

#### High Memory Usage

```bash
# Check memory
free -h

# Reduce qubit count or node count
# Edit config and restart
```

#### Low Performance

```bash
# Check CPU usage
top -p $(pgrep -f phase38)

# Optimize configuration for your hardware
# Reduce cycle_seconds or increase parallel processing
```

### Security

#### File Permissions

```bash
# Set proper ownership
sudo chown -R omnigrid:omnigrid /opt/omnigrid

# Restrict config files
chmod 600 /opt/omnigrid/config/*.json

# Restrict state files
chmod 600 /opt/omnigrid/*.json
```

#### Network Security

```bash
# Firewall rules (if exposing dashboard)
sudo ufw allow 8080/tcp  # Dashboard port
sudo ufw enable
```

### Maintenance

#### Updates

```bash
# Stop service
sudo systemctl stop phase38

# Backup current state
/opt/omnigrid/backup.sh

# Pull updates
git pull origin main

# Run tests
python test_phase38_quantum.py

# Restart service
sudo systemctl start phase38
```

#### Log Rotation

```bash
# Create logrotate config
cat > /etc/logrotate.d/phase38 << 'EOF'
/var/log/phase38/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 omnigrid omnigrid
    sharedscripts
    postrotate
        systemctl reload phase38 > /dev/null 2>&1 || true
    endscript
}
EOF
```

### Production Checklist

- [ ] Tests pass (25/25)
- [ ] Configuration reviewed
- [ ] Service configured (systemd/Docker)
- [ ] Monitoring enabled
- [ ] Backup scheduled
- [ ] Dashboard accessible
- [ ] Security hardened
- [ ] Documentation reviewed
- [ ] Team trained
- [ ] Runbook prepared

---

## Support

**Issues:** https://github.com/heyns1000/omnigrid/issues  
**Docs:** `/docs/PHASE38_BLUEPRINT.md`  
**Contact:** heynsschoeman@gmail.com

---

*Deployment Guide Version: 38.0.0*  
*Last Updated: 2026-01-06*
