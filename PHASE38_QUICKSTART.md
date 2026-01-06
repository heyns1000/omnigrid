# Phase 38 Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites

```bash
# Python 3.8 or higher
python3 --version

# NumPy (only dependency)
pip install numpy
```

### Step 1: Initialize Phase 38

```bash
cd /home/runner/work/omnigrid/omnigrid

# Run orchestrator in test mode
python scripts/phase38-orchestrator.py --mode test
```

Expected output:
```
⚛️  Phase 38 Blueprint - Integration Orchestrator
==================================================================
🚀 Initializing Phase 38 Blueprint...

⚛️  Initializing FAA Actuary Quantum Core...
   ✓ Quantum ML: INITIALIZED
     Signature: Q38-abc123de
   ✓ Oracle Feed: INITIALIZED
     Oracles: 24

🔷 Initializing Quantum Sub-Node Cluster...
   ✓ Cluster: 24 nodes initialized
   ✓ Redundancy: VERIFIED

✅ Phase 38 Initialization Complete
```

### Step 2: Run Tests

```bash
# Run comprehensive test suite
python test_phase38_quantum.py
```

Expected: All 29 tests pass

### Step 3: Open Dashboard

```bash
# Open HotStack v3.1 Dashboard
open hotstack-v3.1-quantum-dashboard.html

# Or with Python HTTP server
python -m http.server 8000
# Navigate to: http://localhost:8000/hotstack-v3.1-quantum-dashboard.html
```

### Step 4: Continuous Operation

```bash
# Run continuous predictions (9-second cycles)
python scripts/phase38-orchestrator.py --mode continuous --interval 9.0
```

---

## 📊 Component Demo Scripts

### TensorFlow Quantum ML

```bash
# Run quantum ML demonstration
python lib/tensorflow-quantum-integration.py
```

### Oracle Feed System

```bash
# Run oracle feed demonstration
python lib/oracle-feed-quantum.py
```

### Quantum Sub-Nodes

```bash
# Run sub-node cluster demonstration
python lib/quantum-subnodes.py
```

### FAA Actuary Core

```bash
# Run actuary core demonstration
python lib/faa-actuary-quantum-core.py
```

---

## 🔧 Configuration

Edit `config/phase38-quantum-config.json`:

```json
{
  "components": {
    "tensorflow_quantum": {
      "n_qubits": 8,          // Adjust quantum circuit size
      "learning_rate": 0.01    // Adjust learning rate
    },
    "oracle_feed": {
      "n_oracles": 24,         // Number of oracles
      "target_divergence_percent": 0.003  // Target divergence
    }
  }
}
```

---

## 📈 Monitoring

### View Metrics

```bash
# Check system status
python -c "
from scripts.phase38_orchestrator import Phase38Orchestrator
orch = Phase38Orchestrator()
orch.initialize()
print(orch.get_system_health())
"
```

### Export Data

Metrics are automatically exported to:
- `phase38_dashboard_data.json` - Dashboard metrics
- `faa_actuary_core_state.json` - Actuary state
- `quantum_subnodes_state.json` - Cluster state

---

## 🐛 Troubleshooting

### Import Errors

```bash
# Set PYTHONPATH
export PYTHONPATH=/home/runner/work/omnigrid/omnigrid:$PYTHONPATH
```

### NumPy Not Found

```bash
pip install --upgrade numpy
```

### Config Not Found

```bash
# Use absolute path
python scripts/phase38-orchestrator.py \
  --config $(pwd)/config/phase38-quantum-config.json
```

---

## 📚 Documentation

- **Full Docs:** `docs/PHASE38_BLUEPRINT.md`
- **API Reference:** In-code docstrings
- **Examples:** Demo scripts in each component

---

## ✅ Success Indicators

Phase 38 is working correctly when you see:

- ✅ Oracle divergence < 0.003%
- ✅ Quantum advantage > 15%
- ✅ 24/24 nodes operational
- ✅ Prediction accuracy > 98%
- ✅ Cycle time < 9 seconds

---

*Ready to deploy? See `docs/PHASE38_BLUEPRINT.md` for production setup.*
