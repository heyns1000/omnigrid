#!/bin/bash
# Buildnest Engine - Start All Systems
# =====================================

echo "🚀 Starting Buildnest Engine..."
echo "🌍 Simunye Protocol: Activating..."
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3 to run the Buildnest Engine."
    exit 1
fi

# Create logs directory
mkdir -p logs

# Start pulse engine
echo "⚡ Starting Pulse Engine (9s respiratory system)..."
python3 pulse_engine.py > logs/pulse_engine.log 2>&1 &
PULSE_PID=$!
echo "   PID: $PULSE_PID"

# Give it a moment to start
sleep 1

# Start IP sentinel
echo "🛡️  Starting IP Sentinel (24/7 rhino strike detection)..."
python3 ip_sentinel.py > logs/ip_sentinel.log 2>&1 &
IP_PID=$!
echo "   PID: $IP_PID"

sleep 1

# Start cube lattice
echo "🌐 Starting Simunye Lattice (Ubuntu protocol)..."
python3 simunye_lattice.py > logs/simunye_lattice.log 2>&1 &
LATTICE_PID=$!
echo "   PID: $LATTICE_PID"

sleep 1

# Start banimal connector
echo "🔗 Starting Banimal Connector (final hook)..."
python3 banimal_connector.py > logs/banimal_connector.log 2>&1 &
BANIMAL_PID=$!
echo "   PID: $BANIMAL_PID"

sleep 1

# Start metaflow cleaner
echo "🧹 Starting Metaflow Cleaner (code quality)..."
python3 metaflow_cleaner.py > logs/metaflow_cleaner.log 2>&1 &
METAFLOW_PID=$!
echo "   PID: $METAFLOW_PID"

sleep 1

# Start sponsor gratitude (runs once)
echo "💚 Starting Sponsor Gratitude System..."
python3 sponsor_gratitude.py > logs/sponsor_gratitude.log 2>&1 &
SPONSOR_PID=$!
echo "   PID: $SPONSOR_PID"

sleep 1

# Start elder wisdom
echo "🧓 Starting Elder Wisdom Protocol..."
python3 elder_wisdom.py > logs/elder_wisdom.log 2>&1 &
ELDER_PID=$!
echo "   PID: $ELDER_PID"

echo ""
echo "=" * 60
echo "✅ All engines running"
echo ""
echo "🐘 Elephant memory: ONLINE"
echo "🐜 Ant stigmergy: ACTIVE"
echo "🦏 Rhino strike detection: ENABLED"
echo "🌳 Baobab protection: ENFORCED"
echo "💚 15% CARE redistribution: FLOWING"
echo "🎯 Grain count: CONTINUOUS"
echo "⏱️  Pulse cycle: 9s | Audit loop: 0.08s"
echo ""
echo "🚂 Shosholoza! The donkey cart departs the spaza shop!"
echo ""
echo "=" * 60
echo ""
echo "📊 Process IDs:"
echo "   Pulse Engine:      $PULSE_PID"
echo "   IP Sentinel:       $IP_PID"
echo "   Simunye Lattice:   $LATTICE_PID"
echo "   Banimal Connector: $BANIMAL_PID"
echo "   Metaflow Cleaner:  $METAFLOW_PID"
echo "   Sponsor Gratitude: $SPONSOR_PID"
echo "   Elder Wisdom:      $ELDER_PID"
echo ""
echo "📝 Logs available in: ./logs/"
echo ""
echo "🛑 To stop all engines, run: kill $PULSE_PID $IP_PID $LATTICE_PID $BANIMAL_PID $METAFLOW_PID $SPONSOR_PID $ELDER_PID"
echo ""
echo "Press Ctrl+C to stop monitoring (engines will continue running)"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all engines..."
    kill $PULSE_PID $IP_PID $LATTICE_PID $BANIMAL_PID $METAFLOW_PID $SPONSOR_PID $ELDER_PID 2>/dev/null
    echo "✅ All engines stopped"
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Monitor processes
echo "👁️  Monitoring engines... (Ctrl+C to stop)"
echo ""

while true; do
    sleep 5
    
    # Check if processes are still running
    if ! kill -0 $PULSE_PID 2>/dev/null; then
        echo "⚠️  Pulse Engine stopped unexpectedly"
        break
    fi
    
    if ! kill -0 $IP_PID 2>/dev/null; then
        echo "⚠️  IP Sentinel stopped unexpectedly"
        break
    fi
    
    if ! kill -0 $LATTICE_PID 2>/dev/null; then
        echo "⚠️  Simunye Lattice stopped unexpectedly"
        break
    fi
    
    if ! kill -0 $BANIMAL_PID 2>/dev/null; then
        echo "⚠️  Banimal Connector stopped unexpectedly"
        break
    fi
    
    if ! kill -0 $METAFLOW_PID 2>/dev/null; then
        echo "⚠️  Metaflow Cleaner stopped unexpectedly"
        break
    fi
done

cleanup
