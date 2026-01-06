#!/usr/bin/env python3
"""
Quantum Metrics Collector
Phase 38 Blueprint - Centralized metrics aggregation

Collects and aggregates metrics from:
- Quantum ML model
- Oracle feed system
- Sub-node cluster
- Actuary core
"""

import json
import time
from typing import Dict, List, Optional
from datetime import datetime, timezone
import os


class QuantumMetricsCollector:
    """
    Centralized metrics collection for Phase 38
    
    Aggregates metrics from all components and provides
    unified reporting interface
    """
    
    def __init__(self, collection_interval: int = 10):
        self.collection_interval = collection_interval
        self.metrics_history = []
        self.start_time = datetime.now(timezone.utc)
        
    def collect_quantum_ml_metrics(self, quantum_model) -> Dict:
        """Collect metrics from quantum ML model"""
        if quantum_model is None:
            return {"status": "NOT_INITIALIZED"}
        
        return {
            "status": "ACTIVE",
            "quantum_signature": quantum_model.get_quantum_signature(),
            "n_qubits": quantum_model.quantum_circuit.n_qubits,
            "circuit_depth": quantum_model.quantum_circuit.circuit_depth,
            "training_history_size": len(quantum_model.training_history),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    
    def collect_oracle_feed_metrics(self, oracle_feed) -> Dict:
        """Collect metrics from oracle feed"""
        if oracle_feed is None:
            return {"status": "NOT_INITIALIZED"}
        
        metrics = oracle_feed.get_divergence_metrics()
        health = oracle_feed.get_oracle_health()
        
        healthy_oracles = sum(1 for o in health if o["status"] == "HEALTHY")
        
        return {
            "status": "ACTIVE",
            "n_oracles": oracle_feed.n_oracles,
            "healthy_oracles": healthy_oracles,
            "divergence_metrics": metrics,
            "avg_accuracy": sum(o["accuracy_score"] for o in health) / len(health),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    
    def collect_subnode_cluster_metrics(self, cluster) -> Dict:
        """Collect metrics from sub-node cluster"""
        if cluster is None:
            return {"status": "NOT_INITIALIZED"}
        
        health = cluster.get_cluster_health()
        redundancy = cluster.redundancy_proof_check()
        
        return {
            "status": "ACTIVE",
            "cluster_health": health,
            "redundancy_proof": redundancy,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    
    def collect_actuary_core_metrics(self, actuary_core) -> Dict:
        """Collect metrics from FAA actuary core"""
        if actuary_core is None:
            return {"status": "NOT_INITIALIZED"}
        
        dashboard_metrics = actuary_core.get_hotstack_dashboard_metrics()
        phase_status = actuary_core.get_phase_38_status()
        
        return {
            "status": "ACTIVE",
            "dashboard_metrics": dashboard_metrics,
            "phase_38_status": phase_status,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    
    def collect_all_metrics(self, components: Dict) -> Dict:
        """
        Collect metrics from all components
        
        Args:
            components: Dict with 'quantum_model', 'oracle_feed',
                       'subnode_cluster', 'actuary_core' keys
        
        Returns:
            Aggregated metrics dictionary
        """
        aggregated = {
            "collection_timestamp": datetime.now(timezone.utc).isoformat(),
            "uptime_seconds": (datetime.now(timezone.utc) - self.start_time).total_seconds(),
            "quantum_ml": self.collect_quantum_ml_metrics(
                components.get("quantum_model")
            ),
            "oracle_feed": self.collect_oracle_feed_metrics(
                components.get("oracle_feed")
            ),
            "subnode_cluster": self.collect_subnode_cluster_metrics(
                components.get("subnode_cluster")
            ),
            "actuary_core": self.collect_actuary_core_metrics(
                components.get("actuary_core")
            )
        }
        
        # Store in history
        self.metrics_history.append(aggregated)
        
        # Keep last 1000 entries
        if len(self.metrics_history) > 1000:
            self.metrics_history = self.metrics_history[-1000:]
        
        return aggregated
    
    def get_summary_statistics(self) -> Dict:
        """Calculate summary statistics from metrics history"""
        if not self.metrics_history:
            return {"status": "NO_DATA"}
        
        # Calculate averages where applicable
        recent = self.metrics_history[-100:]  # Last 100 collections
        
        summary = {
            "collections_total": len(self.metrics_history),
            "recent_collections": len(recent),
            "uptime_seconds": (datetime.now(timezone.utc) - self.start_time).total_seconds(),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Oracle feed statistics
        oracle_divergences = [
            m["oracle_feed"]["divergence_metrics"]["current_divergence_percent"]
            for m in recent
            if m["oracle_feed"]["status"] == "ACTIVE" and "divergence_metrics" in m["oracle_feed"]
        ]
        
        if oracle_divergences:
            summary["oracle_feed"] = {
                "avg_divergence": sum(oracle_divergences) / len(oracle_divergences),
                "min_divergence": min(oracle_divergences),
                "max_divergence": max(oracle_divergences)
            }
        
        return summary
    
    def export_metrics(self, filepath: str = "quantum_metrics.json"):
        """Export metrics history to file"""
        export_data = {
            "start_time": self.start_time.isoformat(),
            "export_time": datetime.now(timezone.utc).isoformat(),
            "collection_interval": self.collection_interval,
            "total_collections": len(self.metrics_history),
            "summary_statistics": self.get_summary_statistics(),
            "recent_metrics": self.metrics_history[-50:],  # Last 50
        }
        
        with open(filepath, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        return filepath


def main():
    """Demonstration of metrics collector"""
    print("📊 Quantum Metrics Collector - Phase 38")
    print("=" * 70)
    
    collector = QuantumMetricsCollector(collection_interval=10)
    
    print("\n✓ Metrics Collector Initialized")
    print(f"   Collection Interval: {collector.collection_interval}s")
    
    # Simulate collection with dummy components
    print("\n📈 Simulating Metrics Collection...")
    
    for i in range(5):
        metrics = collector.collect_all_metrics({
            "quantum_model": None,
            "oracle_feed": None,
            "subnode_cluster": None,
            "actuary_core": None
        })
        
        print(f"   Collection {i+1}: {metrics['collection_timestamp']}")
        time.sleep(0.1)
    
    # Get summary
    print("\n📊 Summary Statistics:")
    summary = collector.get_summary_statistics()
    print(f"   Total Collections: {summary['collections_total']}")
    print(f"   Uptime: {summary['uptime_seconds']:.1f}s")
    
    # Export
    print("\n💾 Exporting Metrics:")
    filepath = collector.export_metrics()
    print(f"   Exported to: {filepath}")
    
    print("\n✅ Metrics Collector Complete")
    print("=" * 70)


if __name__ == "__main__":
    main()
