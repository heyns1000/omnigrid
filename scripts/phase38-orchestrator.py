#!/usr/bin/env python3
"""
Phase 38 Integration Orchestrator
Coordinates all quantum components and systems

Manages:
- Quantum ML model lifecycle
- Oracle feed synchronization
- Sub-node cluster coordination
- Dashboard metrics aggregation
- System health monitoring
"""

import sys
import os
import json
import time
import signal
from typing import Dict, Optional
from datetime import datetime, timezone

# Add lib to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from lib.faa_actuary_quantum_core import FAAActuaryQuantumCore
from lib.quantum_subnodes import QuantumSubNodeCluster

import numpy as np


class Phase38Orchestrator:
    """
    Orchestrates all Phase 38 components
    
    Responsibilities:
    - Initialize all quantum systems
    - Coordinate predictions across components
    - Monitor system health
    - Export metrics to dashboard
    - Handle graceful shutdown
    """
    
    def __init__(self, config_path: Optional[str] = None):
        # Load configuration
        if config_path is None:
            config_path = os.path.join(
                os.path.dirname(__file__),
                '../config/phase38-quantum-config.json'
            )
        
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        # Initialize components
        self.actuary_core = None
        self.subnode_cluster = None
        
        # State tracking
        self.running = False
        self.start_time = None
        
        # Metrics
        self.orchestration_metrics = {
            "total_cycles": 0,
            "successful_cycles": 0,
            "failed_cycles": 0,
            "total_predictions": 0,
            "average_cycle_time": 0.0
        }
        
        # Setup signal handlers
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
    
    def _signal_handler(self, signum, frame):
        """Handle shutdown signals gracefully"""
        print(f"\n⚠️  Received signal {signum}, shutting down gracefully...")
        self.shutdown()
    
    def initialize(self):
        """Initialize all Phase 38 components"""
        print("🚀 Initializing Phase 38 Blueprint...")
        
        # Initialize FAA Actuary Core
        print("\n⚛️  Initializing FAA Actuary Quantum Core...")
        actuary_config = {
            "quantum": self.config["components"]["tensorflow_quantum"],
            "oracle": self.config["components"]["oracle_feed"],
            "actuary": {
                "target_revenue": self.config["components"]["faa_actuary_core"]["target_revenue"],
                "care_loop_rate": self.config["components"]["faa_actuary_core"]["care_loop_rate"],
                "brands_total": self.config["components"]["faa_actuary_core"]["brands_total"]
            },
            "hotstack": self.config["components"]["hotstack_dashboard"]
        }
        
        self.actuary_core = FAAActuaryQuantumCore(config=actuary_config)
        
        # Initialize quantum model
        quantum_init = self.actuary_core.initialize_quantum_model()
        print(f"   ✓ Quantum ML: {quantum_init['status']}")
        print(f"     Signature: {quantum_init['signature']}")
        
        # Initialize oracle feed
        oracle_init = self.actuary_core.initialize_oracle_feed()
        print(f"   ✓ Oracle Feed: {oracle_init['status']}")
        print(f"     Oracles: {oracle_init['n_oracles']}")
        
        # Initialize quantum sub-node cluster
        if self.config["components"]["quantum_subnodes"]["enabled"]:
            print("\n🔷 Initializing Quantum Sub-Node Cluster...")
            cluster_config = self.config["components"]["quantum_subnodes"]
            
            self.subnode_cluster = QuantumSubNodeCluster(
                n_nodes=cluster_config["n_nodes"],
                qubits_per_node=cluster_config["qubits_per_node"]
            )
            print(f"   ✓ Cluster: {cluster_config['n_nodes']} nodes initialized")
            
            # Verify redundancy
            redundancy = self.subnode_cluster.redundancy_proof_check()
            print(f"   ✓ Redundancy: {redundancy['redundancy_proof_status']}")
        
        self.start_time = datetime.now(timezone.utc)
        print(f"\n✅ Phase 38 Initialization Complete")
        print(f"   Start Time: {self.start_time.isoformat()}")
    
    def run_prediction_cycle(self) -> Dict:
        """
        Run one complete prediction cycle
        
        Returns:
            Cycle results with metrics
        """
        cycle_start = time.time()
        
        try:
            # Generate random market features (40D)
            market_features = np.random.randn(40)
            
            # Get integrated prediction from actuary core
            prediction = self.actuary_core.integrated_prediction(market_features)
            
            # Process through sub-node cluster if available
            if self.subnode_cluster is not None:
                # Distribute prediction task to cluster
                task_result = self.subnode_cluster.distribute_task(market_features[:10])
                prediction["subnode_result"] = task_result
            
            cycle_time = time.time() - cycle_start
            
            # Update metrics
            self.orchestration_metrics["total_cycles"] += 1
            self.orchestration_metrics["successful_cycles"] += 1
            self.orchestration_metrics["total_predictions"] += 1
            
            # Update average cycle time
            n = self.orchestration_metrics["total_cycles"]
            prev_avg = self.orchestration_metrics["average_cycle_time"]
            self.orchestration_metrics["average_cycle_time"] = (
                (prev_avg * (n - 1) + cycle_time) / n
            )
            
            return {
                "status": "SUCCESS",
                "cycle_time": cycle_time,
                "prediction": prediction,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            
        except Exception as e:
            self.orchestration_metrics["total_cycles"] += 1
            self.orchestration_metrics["failed_cycles"] += 1
            
            return {
                "status": "FAILED",
                "error": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
    
    def get_system_health(self) -> Dict:
        """Get comprehensive system health status"""
        uptime = (datetime.now(timezone.utc) - self.start_time).total_seconds()
        
        health = {
            "phase": 38,
            "status": "OPERATIONAL" if self.running else "STOPPED",
            "uptime_seconds": uptime,
            "orchestration_metrics": self.orchestration_metrics
        }
        
        # Add actuary core metrics
        if self.actuary_core is not None:
            health["actuary_core"] = self.actuary_core.get_phase_38_status()
        
        # Add cluster health
        if self.subnode_cluster is not None:
            health["subnode_cluster"] = self.subnode_cluster.get_cluster_health()
        
        return health
    
    def export_dashboard_data(self, filepath: str = "phase38_dashboard_data.json"):
        """Export data for HotStack dashboard"""
        dashboard_data = {
            "phase": 38,
            "version": self.config["version"],
            "system_health": self.get_system_health(),
            "targets": self.config["targets"],
            "components": {
                name: {"enabled": comp["enabled"]}
                for name, comp in self.config["components"].items()
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        with open(filepath, 'w') as f:
            json.dump(dashboard_data, f, indent=2)
        
        return filepath
    
    def run_continuous(self, cycle_interval: Optional[float] = None):
        """
        Run continuous prediction cycles
        
        Args:
            cycle_interval: Seconds between cycles (default: from config)
        """
        if cycle_interval is None:
            cycle_interval = self.config["components"]["oracle_feed"]["cycle_seconds"]
        
        self.running = True
        cycle_count = 0
        
        print(f"\n🔄 Starting Continuous Operation")
        print(f"   Cycle Interval: {cycle_interval}s")
        print(f"   Press Ctrl+C to stop\n")
        
        try:
            while self.running:
                cycle_count += 1
                
                # Run prediction cycle
                result = self.run_prediction_cycle()
                
                # Print status every 10 cycles
                if cycle_count % 10 == 0:
                    health = self.get_system_health()
                    print(f"Cycle {cycle_count}:")
                    print(f"  Status: {result['status']}")
                    print(f"  Cycle Time: {result.get('cycle_time', 0):.3f}s")
                    print(f"  Success Rate: {health['orchestration_metrics']['successful_cycles']}/{health['orchestration_metrics']['total_cycles']}")
                    
                    # Export dashboard data
                    if cycle_count % 50 == 0:
                        self.export_dashboard_data()
                        print(f"  Dashboard data exported")
                
                # Wait for next cycle
                time.sleep(cycle_interval)
                
        except KeyboardInterrupt:
            print("\n⚠️  Keyboard interrupt received")
        finally:
            self.shutdown()
    
    def run_batch(self, n_cycles: int):
        """
        Run a fixed number of prediction cycles
        
        Args:
            n_cycles: Number of cycles to run
        """
        print(f"\n🔄 Running {n_cycles} Prediction Cycles")
        
        results = []
        
        for i in range(n_cycles):
            result = self.run_prediction_cycle()
            results.append(result)
            
            if (i + 1) % 10 == 0:
                print(f"  Completed {i + 1}/{n_cycles} cycles")
        
        # Print summary
        successful = sum(1 for r in results if r["status"] == "SUCCESS")
        avg_time = np.mean([r.get("cycle_time", 0) for r in results if "cycle_time" in r])
        
        print(f"\n✅ Batch Complete:")
        print(f"   Total Cycles: {n_cycles}")
        print(f"   Successful: {successful}")
        print(f"   Failed: {n_cycles - successful}")
        print(f"   Success Rate: {successful/n_cycles*100:.1f}%")
        print(f"   Avg Cycle Time: {avg_time:.3f}s")
        
        return results
    
    def shutdown(self):
        """Graceful shutdown of all components"""
        print("\n🛑 Shutting down Phase 38 Orchestrator...")
        
        self.running = False
        
        # Export final state
        if self.actuary_core is not None:
            print("   Exporting actuary core state...")
            self.actuary_core.export_state("phase38_final_state.json")
        
        if self.subnode_cluster is not None:
            print("   Exporting cluster state...")
            cluster_state = self.subnode_cluster.export_cluster_state()
            with open("phase38_cluster_final_state.json", 'w') as f:
                json.dump(cluster_state, f, indent=2)
        
        # Export final dashboard data
        self.export_dashboard_data("phase38_final_dashboard.json")
        
        # Print final metrics
        health = self.get_system_health()
        print("\n📊 Final Metrics:")
        print(f"   Total Cycles: {health['orchestration_metrics']['total_cycles']}")
        print(f"   Successful: {health['orchestration_metrics']['successful_cycles']}")
        print(f"   Failed: {health['orchestration_metrics']['failed_cycles']}")
        print(f"   Avg Cycle Time: {health['orchestration_metrics']['average_cycle_time']:.3f}s")
        print(f"   Uptime: {health['uptime_seconds']:.1f}s")
        
        print("\n✅ Shutdown Complete")


def main():
    """Main orchestrator entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Phase 38 Quantum Integration Orchestrator"
    )
    parser.add_argument(
        '--config',
        type=str,
        help='Path to configuration file'
    )
    parser.add_argument(
        '--mode',
        choices=['continuous', 'batch', 'test'],
        default='test',
        help='Operation mode'
    )
    parser.add_argument(
        '--cycles',
        type=int,
        default=10,
        help='Number of cycles for batch mode'
    )
    parser.add_argument(
        '--interval',
        type=float,
        help='Cycle interval in seconds for continuous mode'
    )
    
    args = parser.parse_args()
    
    print("⚛️  Phase 38 Blueprint - Integration Orchestrator")
    print("=" * 70)
    
    # Create orchestrator
    orchestrator = Phase38Orchestrator(config_path=args.config)
    
    # Initialize
    orchestrator.initialize()
    
    # Run in selected mode
    if args.mode == 'continuous':
        orchestrator.run_continuous(cycle_interval=args.interval)
    elif args.mode == 'batch':
        orchestrator.run_batch(n_cycles=args.cycles)
    else:  # test mode
        print("\n🧪 Test Mode: Running 5 prediction cycles")
        orchestrator.run_batch(n_cycles=5)
        
        # Show system health
        print("\n🏥 System Health:")
        health = orchestrator.get_system_health()
        print(json.dumps(health, indent=2))
    
    print("\n" + "=" * 70)


if __name__ == "__main__":
    main()
