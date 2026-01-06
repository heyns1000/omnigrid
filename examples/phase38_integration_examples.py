#!/usr/bin/env python3
"""
Phase 38 Integration Examples
Demonstrates integration with existing OmniGrid systems
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'lib'))

import numpy as np
from faa_actuary_quantum_core import FAAActuaryQuantumCore


def example_1_basic_prediction():
    """Example 1: Basic quantum-enhanced prediction"""
    print("=" * 70)
    print("Example 1: Basic Quantum-Enhanced Prediction")
    print("=" * 70)
    
    # Initialize core
    core = FAAActuaryQuantumCore()
    core.initialize_quantum_model()
    core.initialize_oracle_feed()
    
    # Generate prediction
    market_features = np.random.randn(40)
    prediction = core.integrated_prediction(market_features)
    
    print(f"\nPrediction Results:")
    print(f"  Combined Prediction: ${prediction['combined_prediction']:,.0f}")
    print(f"  Care Loop (15%): ${prediction['care_loop_allocation']:,.0f}")
    print(f"  Net Revenue: ${prediction['net_revenue']:,.0f}")
    print(f"  Quantum Weight: {prediction['weights']['quantum']:.2%}")
    print(f"  Oracle Weight: {prediction['weights']['oracle']:.2%}")


def example_2_revenue_comparison():
    """Example 2: Compare quantum vs classical revenue projection"""
    print("\n" + "=" * 70)
    print("Example 2: Quantum vs Classical Revenue Projection")
    print("=" * 70)
    
    # Simulate classical revenue projection
    classical_revenue = 1.42e9  # $1.42B from classical model
    
    # Quantum prediction
    core = FAAActuaryQuantumCore()
    core.initialize_quantum_model()
    
    market_features = np.random.randn(40)
    quantum_pred = core.quantum_revenue_prediction(market_features)
    quantum_revenue = quantum_pred['predicted_revenue']
    
    # Calculate quantum advantage
    advantage = (quantum_revenue / classical_revenue - 1) * 100
    
    print(f"\nRevenue Comparison:")
    print(f"  Classical Prediction: ${classical_revenue:,.0f}")
    print(f"  Quantum Prediction: ${quantum_revenue:,.0f}")
    print(f"  Quantum Advantage: {advantage:+.2f}%")
    print(f"  Quantum Confidence: {quantum_pred['quantum_metrics']['confidence']:.2%}")


def example_3_oracle_divergence_tracking():
    """Example 3: Track oracle divergence over multiple cycles"""
    print("\n" + "=" * 70)
    print("Example 3: Oracle Divergence Tracking")
    print("=" * 70)
    
    core = FAAActuaryQuantumCore()
    core.initialize_oracle_feed()
    
    divergences = []
    
    print("\nRunning 10 prediction cycles...")
    for i in range(10):
        market_data = np.random.randn(40)
        prediction = core.oracle_consensus_prediction(market_data)
        divergences.append(prediction['divergence_percent'])
        
        if i < 3:  # Show first 3
            print(f"  Cycle {i+1}: Divergence = {prediction['divergence_percent']:.6f}%")
    
    # Statistics
    avg_divergence = sum(divergences) / len(divergences)
    min_divergence = min(divergences)
    max_divergence = max(divergences)
    
    print(f"\nDivergence Statistics:")
    print(f"  Average: {avg_divergence:.6f}%")
    print(f"  Min: {min_divergence:.6f}%")
    print(f"  Max: {max_divergence:.6f}%")
    print(f"  Target: 0.003%")
    print(f"  Status: {'✅ ON TARGET' if avg_divergence <= 0.003 else '⚠️ OPTIMIZING'}")


def example_4_cluster_health_monitoring():
    """Example 4: Monitor quantum sub-node cluster health"""
    print("\n" + "=" * 70)
    print("Example 4: Cluster Health Monitoring")
    print("=" * 70)
    
    from quantum_subnodes import QuantumSubNodeCluster
    
    # Create cluster
    cluster = QuantumSubNodeCluster(n_nodes=24, qubits_per_node=6)
    
    # Process some tasks
    print("\nProcessing 20 tasks...")
    tasks = [np.random.randn(10) for _ in range(20)]
    results = cluster.batch_process(tasks)
    
    # Check health
    health = cluster.get_cluster_health()
    
    print(f"\nCluster Health:")
    print(f"  Status: {health['cluster_status']}")
    print(f"  Operational Nodes: {health['operational_nodes']}/{health['total_nodes']}")
    print(f"  Average Load: {health['average_load']:.2%}")
    print(f"  Success Rate: {health['success_rate']:.2%}")
    print(f"  Tasks Completed: {health['total_tasks_completed']}")
    
    # Check redundancy
    redundancy = cluster.redundancy_proof_check()
    print(f"\nRedundancy Status: {redundancy['redundancy_proof_status']}")


def example_5_complete_workflow():
    """Example 5: Complete Phase 38 workflow"""
    print("\n" + "=" * 70)
    print("Example 5: Complete Phase 38 Workflow")
    print("=" * 70)
    
    # Initialize all components
    print("\n1. Initializing Phase 38 components...")
    core = FAAActuaryQuantumCore()
    core.initialize_quantum_model()
    core.initialize_oracle_feed()
    
    # Generate prediction
    print("\n2. Generating integrated prediction...")
    market_features = np.random.randn(40)
    prediction = core.integrated_prediction(market_features)
    
    # Get dashboard metrics
    print("\n3. Collecting dashboard metrics...")
    metrics = core.get_hotstack_dashboard_metrics()
    
    # Get Phase 38 status
    print("\n4. Getting Phase 38 status...")
    status = core.get_phase_38_status()
    
    # Export state
    print("\n5. Exporting system state...")
    filepath = core.export_state("example_state.json")
    
    # Display results
    print(f"\n✅ Workflow Complete!")
    print(f"\nPhase: {status['phase']}")
    print(f"Status: {status['blueprint_status']}")
    print(f"Uptime: {metrics['uptime_seconds']:.1f}s")
    print(f"Predictions: {metrics['performance']['predictions_made']}")
    print(f"State exported to: {filepath}")


def main():
    """Run all examples"""
    print("\n⚛️  Phase 38 Integration Examples")
    print("   Demonstrating OmniGrid quantum integration")
    
    examples = [
        example_1_basic_prediction,
        example_2_revenue_comparison,
        example_3_oracle_divergence_tracking,
        example_4_cluster_health_monitoring,
        example_5_complete_workflow
    ]
    
    for example in examples:
        try:
            example()
        except Exception as e:
            print(f"\n❌ Example failed: {str(e)}")
    
    print("\n" + "=" * 70)
    print("✅ All Examples Complete")
    print("=" * 70)


if __name__ == "__main__":
    main()
