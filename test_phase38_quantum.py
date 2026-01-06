#!/usr/bin/env python3
"""
Test Suite for Phase 38 Quantum Integration
Tests all quantum components and integrations
"""

import sys
import os

# Add lib directory to path
lib_path = os.path.join(os.path.dirname(__file__), 'lib')
if lib_path not in sys.path:
    sys.path.insert(0, lib_path)

import unittest
import numpy as np

# Import Phase 38 components
from tensorflow_quantum_integration import (
    QuantumCircuitSimulator,
    QuantumPredictiveModel
)
from oracle_feed_quantum import QuantumOracleFeed
from quantum_subnodes import QuantumSubNode, QuantumSubNodeCluster
from faa_actuary_quantum_core import FAAActuaryQuantumCore


class TestQuantumCircuitSimulator(unittest.TestCase):
    """Test quantum circuit simulation"""
    
    def setUp(self):
        self.simulator = QuantumCircuitSimulator(n_qubits=4)
    
    def test_initialization(self):
        """Test circuit initialization"""
        self.assertEqual(self.simulator.n_qubits, 4)
        self.assertEqual(self.simulator.circuit_depth, 10)
        self.assertEqual(self.simulator.measurement_shots, 1024)
    
    def test_classical_encoding(self):
        """Test classical data encoding"""
        data = np.array([0.5, 0.3, 0.8, 0.2])
        quantum_state = self.simulator.encode_classical_data(data)
        
        # Check state is normalized
        norm = np.linalg.norm(quantum_state)
        self.assertAlmostEqual(norm, 1.0, places=5)
        
        # Check dimension matches qubits
        expected_dim = 2 ** self.simulator.n_qubits
        self.assertEqual(len(quantum_state), expected_dim)
    
    def test_quantum_prediction(self):
        """Test quantum prediction generation"""
        classical_input = np.array([0.1, 0.5, 0.3, 0.8])
        circuit_params = np.random.randn(40)
        
        prediction = self.simulator.quantum_prediction(classical_input, circuit_params)
        
        # Check prediction is in valid range
        self.assertGreaterEqual(prediction, 0.0)
        self.assertLessEqual(prediction, 1.0)
    
    def test_measurement(self):
        """Test quantum measurement"""
        state = np.zeros(16, dtype=complex)
        state[0] = 1.0  # Ground state
        
        measurement = self.simulator.measure(state)
        
        # Check measurement is valid probability distribution
        total_prob = sum(measurement.values())
        self.assertAlmostEqual(total_prob, 1.0, places=5)


class TestQuantumPredictiveModel(unittest.TestCase):
    """Test quantum predictive model"""
    
    def setUp(self):
        self.model = QuantumPredictiveModel(n_qubits=6, learning_rate=0.01)
    
    def test_initialization(self):
        """Test model initialization"""
        self.assertEqual(self.model.quantum_circuit.n_qubits, 6)
        self.assertEqual(self.model.learning_rate, 0.01)
        self.assertIsNotNone(self.model.circuit_params)
    
    def test_prediction(self):
        """Test prediction generation"""
        features = np.random.randn(10)
        pred = self.model.predict(features)
        
        # Check prediction structure
        self.assertIn('prediction', pred)
        self.assertIn('quantum_advantage', pred)
        self.assertIn('coherence', pred)
        self.assertIn('confidence', pred)
        
        # Check values are in valid ranges
        self.assertGreaterEqual(pred['prediction'], 0.0)
        self.assertLessEqual(pred['prediction'], 1.0)
        self.assertGreater(pred['quantum_advantage'], 1.0)
    
    def test_training_step(self):
        """Test training step"""
        features = np.random.randn(10)
        target = 0.75
        
        initial_params = self.model.circuit_params.copy()
        loss = self.model.train_step(features, target)
        
        # Check loss is computed
        self.assertGreaterEqual(loss, 0.0)
        
        # Check parameters were updated
        self.assertFalse(np.allclose(initial_params, self.model.circuit_params))
    
    def test_quantum_signature(self):
        """Test quantum signature generation"""
        signature = self.model.get_quantum_signature()
        
        # Check signature format
        self.assertEqual(len(signature), 16)
        self.assertTrue(all(c in '0123456789abcdef' for c in signature))


class TestQuantumOracleFeed(unittest.TestCase):
    """Test quantum oracle feed system"""
    
    def setUp(self):
        self.oracle_feed = QuantumOracleFeed(n_oracles=12, cycle_seconds=9.0)
    
    def test_initialization(self):
        """Test oracle feed initialization"""
        self.assertEqual(self.oracle_feed.n_oracles, 12)
        self.assertEqual(self.oracle_feed.cycle_seconds, 9.0)
        self.assertEqual(self.oracle_feed.target_divergence, 0.003)
        self.assertEqual(len(self.oracle_feed.oracle_states), 12)
    
    def test_entanglement_matrix(self):
        """Test entanglement matrix generation"""
        matrix = self.oracle_feed.entanglement_matrix
        
        # Check matrix shape
        self.assertEqual(matrix.shape, (12, 12))
        
        # Check diagonal is 1.0
        for i in range(12):
            self.assertAlmostEqual(matrix[i, i], 1.0, places=5)
        
        # Check matrix is symmetric
        self.assertTrue(np.allclose(matrix, matrix.T))
    
    def test_quantum_consensus(self):
        """Test quantum consensus prediction"""
        market_data = np.random.randn(40)
        
        prediction = self.oracle_feed.quantum_consensus_prediction(market_data)
        
        # Check prediction structure
        self.assertIn('consensus_prediction', prediction)
        self.assertIn('divergence_percent', prediction)
        self.assertIn('cycle_time_seconds', prediction)
        self.assertIn('n_oracles', prediction)
        
        # Check divergence is low
        self.assertLess(prediction['divergence_percent'], 1.0)
        
        # Check cycle time is reasonable
        self.assertLess(prediction['cycle_time_seconds'], 1.0)
    
    def test_oracle_update(self):
        """Test oracle accuracy update"""
        market_data = np.random.randn(40)
        
        # Generate prediction
        prediction = self.oracle_feed.quantum_consensus_prediction(market_data)
        
        # Simulate actual outcome
        actual = prediction['consensus_prediction'] + 0.01
        
        # Update accuracy
        initial_accuracy = [o['accuracy_score'] for o in self.oracle_feed.oracle_states]
        self.oracle_feed.update_oracle_accuracy(actual)
        final_accuracy = [o['accuracy_score'] for o in self.oracle_feed.oracle_states]
        
        # Check accuracy scores were updated
        self.assertFalse(all(
            abs(i - f) < 1e-10 
            for i, f in zip(initial_accuracy, final_accuracy)
        ))
    
    def test_divergence_metrics(self):
        """Test divergence metrics calculation"""
        # Generate some predictions
        for _ in range(10):
            market_data = np.random.randn(40)
            self.oracle_feed.quantum_consensus_prediction(market_data)
        
        metrics = self.oracle_feed.get_divergence_metrics()
        
        # Check metrics structure
        self.assertIn('current_divergence_percent', metrics)
        self.assertIn('mean_divergence_percent', metrics)
        self.assertIn('achievement_percent', metrics)
        self.assertIn('status', metrics)


class TestQuantumSubNodes(unittest.TestCase):
    """Test quantum sub-node cluster"""
    
    def setUp(self):
        self.cluster = QuantumSubNodeCluster(n_nodes=12, qubits_per_node=4)
    
    def test_initialization(self):
        """Test cluster initialization"""
        self.assertEqual(self.cluster.n_nodes, 12)
        self.assertEqual(len(self.cluster.nodes), 12)
        
        # Check all nodes are operational
        for node in self.cluster.nodes:
            self.assertEqual(node.status, "OPERATIONAL")
    
    def test_redundancy_setup(self):
        """Test redundancy configuration"""
        # Check all nodes have backups
        for node in self.cluster.nodes:
            self.assertEqual(len(node.backup_nodes), 2)
            self.assertIsNotNone(node.primary_node)
    
    def test_task_distribution(self):
        """Test task distribution to nodes"""
        task_data = np.random.randn(10)
        
        result = self.cluster.distribute_task(task_data)
        
        # Check result structure
        self.assertIn('status', result)
        self.assertIn('node_id', result)
        
        # Should succeed
        self.assertEqual(result['status'], 'SUCCESS')
    
    def test_batch_processing(self):
        """Test batch task processing"""
        tasks = [np.random.randn(10) for _ in range(20)]
        
        results = self.cluster.batch_process(tasks)
        
        # Check all tasks processed
        self.assertEqual(len(results), 20)
        
        # Check success rate
        successful = sum(1 for r in results if r['status'] == 'SUCCESS')
        self.assertGreater(successful, 15)  # At least 75% success
    
    def test_cluster_health(self):
        """Test cluster health metrics"""
        health = self.cluster.get_cluster_health()
        
        # Check health structure
        self.assertIn('cluster_status', health)
        self.assertIn('operational_nodes', health)
        self.assertIn('average_load', health)
        self.assertIn('success_rate', health)
        
        # Should be healthy initially
        self.assertEqual(health['cluster_status'], 'HEALTHY')
    
    def test_redundancy_proof(self):
        """Test redundancy proofing"""
        redundancy = self.cluster.redundancy_proof_check()
        
        # Check proof structure
        self.assertIn('redundancy_proof_status', redundancy)
        self.assertIn('checks', redundancy)
        
        # Should be verified
        self.assertEqual(redundancy['redundancy_proof_status'], 'VERIFIED')


class TestFAAActuaryQuantumCore(unittest.TestCase):
    """Test FAA Actuary Quantum Core integration"""
    
    def setUp(self):
        self.core = FAAActuaryQuantumCore()
    
    def test_initialization(self):
        """Test core initialization"""
        self.assertIsNotNone(self.core.config)
        self.assertIn('quantum', self.core.config)
        self.assertIn('oracle', self.core.config)
        self.assertIn('actuary', self.core.config)
    
    def test_quantum_model_init(self):
        """Test quantum model initialization"""
        result = self.core.initialize_quantum_model()
        
        self.assertEqual(result['status'], 'INITIALIZED')
        self.assertIsNotNone(self.core.quantum_model)
    
    def test_oracle_feed_init(self):
        """Test oracle feed initialization"""
        result = self.core.initialize_oracle_feed()
        
        self.assertEqual(result['status'], 'INITIALIZED')
        self.assertIsNotNone(self.core.oracle_feed)
    
    def test_integrated_prediction(self):
        """Test integrated prediction"""
        market_features = np.random.randn(40)
        
        prediction = self.core.integrated_prediction(market_features)
        
        # Check prediction structure
        self.assertIn('combined_prediction', prediction)
        self.assertIn('quantum_prediction', prediction)
        self.assertIn('oracle_prediction', prediction)
        self.assertIn('care_loop_allocation', prediction)
        
        # Check values are reasonable
        self.assertGreater(prediction['combined_prediction'], 0)
    
    def test_dashboard_metrics(self):
        """Test dashboard metrics generation"""
        metrics = self.core.get_hotstack_dashboard_metrics()
        
        # Check metrics structure
        self.assertEqual(metrics['phase'], 38)
        self.assertEqual(metrics['version'], '3.1')
        self.assertIn('performance', metrics)
        self.assertIn('quantum', metrics)
        self.assertIn('oracle', metrics)
    
    def test_phase_38_status(self):
        """Test Phase 38 status report"""
        status = self.core.get_phase_38_status()
        
        # Check status structure
        self.assertEqual(status['phase'], 38)
        self.assertIn('components', status)
        self.assertIn('metrics', status)


def run_tests():
    """Run all tests"""
    print("🧪 Running Phase 38 Quantum Integration Tests")
    print("=" * 70)
    
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add all test classes
    suite.addTests(loader.loadTestsFromTestCase(TestQuantumCircuitSimulator))
    suite.addTests(loader.loadTestsFromTestCase(TestQuantumPredictiveModel))
    suite.addTests(loader.loadTestsFromTestCase(TestQuantumOracleFeed))
    suite.addTests(loader.loadTestsFromTestCase(TestQuantumSubNodes))
    suite.addTests(loader.loadTestsFromTestCase(TestFAAActuaryQuantumCore))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "=" * 70)
    print("📊 Test Summary:")
    print(f"   Tests Run: {result.testsRun}")
    print(f"   Successes: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"   Failures: {len(result.failures)}")
    print(f"   Errors: {len(result.errors)}")
    
    if result.wasSuccessful():
        print("\n✅ All tests passed!")
    else:
        print("\n❌ Some tests failed")
    
    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
