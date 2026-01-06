#!/usr/bin/env python3
"""
Quantum State Validator
Phase 38 Blueprint - Validation utilities for quantum components

Validates:
- Quantum state normalization
- Oracle divergence thresholds
- Node health requirements
- Performance targets
"""

import numpy as np
from typing import Dict, List, Tuple, Optional


class QuantumStateValidator:
    """Validates quantum states and system metrics"""
    
    @staticmethod
    def validate_quantum_state(state: np.ndarray, tolerance: float = 1e-6) -> Dict:
        """
        Validate quantum state is properly normalized
        
        Args:
            state: Quantum state vector
            tolerance: Tolerance for normalization check
            
        Returns:
            Validation result dictionary
        """
        norm = np.linalg.norm(state)
        is_normalized = abs(norm - 1.0) < tolerance
        
        return {
            "valid": is_normalized,
            "norm": float(norm),
            "deviation": float(abs(norm - 1.0)),
            "tolerance": tolerance,
            "message": "State is normalized" if is_normalized else "State normalization failed"
        }
    
    @staticmethod
    def validate_oracle_divergence(divergence_percent: float,
                                   target: float = 0.003) -> Dict:
        """
        Validate oracle divergence meets target
        
        Args:
            divergence_percent: Current divergence percentage
            target: Target divergence threshold
            
        Returns:
            Validation result dictionary
        """
        meets_target = divergence_percent <= target
        achievement = (target / divergence_percent * 100) if divergence_percent > 0 else 100
        
        status = "EXCELLENT" if divergence_percent <= target * 0.8 else \
                "GOOD" if divergence_percent <= target else \
                "ACCEPTABLE" if divergence_percent <= target * 1.5 else \
                "POOR"
        
        return {
            "valid": meets_target,
            "divergence_percent": divergence_percent,
            "target_percent": target,
            "achievement_percent": achievement,
            "status": status,
            "message": f"Divergence {divergence_percent:.4f}% vs target {target:.4f}%"
        }
    
    @staticmethod
    def validate_node_health(operational_nodes: int,
                           total_nodes: int,
                           min_threshold: float = 0.8) -> Dict:
        """
        Validate node cluster health
        
        Args:
            operational_nodes: Number of operational nodes
            total_nodes: Total number of nodes
            min_threshold: Minimum acceptable ratio
            
        Returns:
            Validation result dictionary
        """
        ratio = operational_nodes / total_nodes
        meets_threshold = ratio >= min_threshold
        
        status = "HEALTHY" if ratio >= 0.95 else \
                "DEGRADED" if ratio >= min_threshold else \
                "CRITICAL"
        
        return {
            "valid": meets_threshold,
            "operational_nodes": operational_nodes,
            "total_nodes": total_nodes,
            "availability_ratio": ratio,
            "availability_percent": ratio * 100,
            "min_threshold": min_threshold,
            "status": status,
            "message": f"{operational_nodes}/{total_nodes} nodes operational ({ratio*100:.1f}%)"
        }
    
    @staticmethod
    def validate_quantum_advantage(advantage: float,
                                   min_advantage: float = 1.05) -> Dict:
        """
        Validate quantum advantage over classical methods
        
        Args:
            advantage: Quantum advantage multiplier
            min_advantage: Minimum acceptable advantage
            
        Returns:
            Validation result dictionary
        """
        meets_target = advantage >= min_advantage
        improvement_percent = (advantage - 1.0) * 100
        
        status = "EXCELLENT" if advantage >= 1.15 else \
                "GOOD" if advantage >= 1.10 else \
                "ACCEPTABLE" if advantage >= min_advantage else \
                "INSUFFICIENT"
        
        return {
            "valid": meets_target,
            "advantage": advantage,
            "improvement_percent": improvement_percent,
            "min_advantage": min_advantage,
            "status": status,
            "message": f"Quantum advantage: {improvement_percent:.1f}% improvement"
        }
    
    @staticmethod
    def validate_prediction_accuracy(accuracy_percent: float,
                                    min_accuracy: float = 95.0) -> Dict:
        """
        Validate prediction accuracy meets requirements
        
        Args:
            accuracy_percent: Prediction accuracy percentage
            min_accuracy: Minimum acceptable accuracy
            
        Returns:
            Validation result dictionary
        """
        meets_target = accuracy_percent >= min_accuracy
        
        status = "EXCELLENT" if accuracy_percent >= 98.0 else \
                "GOOD" if accuracy_percent >= min_accuracy else \
                "POOR"
        
        return {
            "valid": meets_target,
            "accuracy_percent": accuracy_percent,
            "min_accuracy": min_accuracy,
            "status": status,
            "message": f"Prediction accuracy: {accuracy_percent:.1f}%"
        }
    
    @staticmethod
    def validate_phase_38_targets(metrics: Dict) -> Dict:
        """
        Comprehensive validation of all Phase 38 targets
        
        Args:
            metrics: Dictionary containing all system metrics
            
        Returns:
            Comprehensive validation report
        """
        validations = {}
        
        # Validate oracle divergence if available
        if "oracle_divergence" in metrics:
            validations["oracle_divergence"] = QuantumStateValidator.validate_oracle_divergence(
                metrics["oracle_divergence"]
            )
        
        # Validate node health if available
        if "operational_nodes" in metrics and "total_nodes" in metrics:
            validations["node_health"] = QuantumStateValidator.validate_node_health(
                metrics["operational_nodes"],
                metrics["total_nodes"]
            )
        
        # Validate quantum advantage if available
        if "quantum_advantage" in metrics:
            validations["quantum_advantage"] = QuantumStateValidator.validate_quantum_advantage(
                metrics["quantum_advantage"]
            )
        
        # Validate prediction accuracy if available
        if "prediction_accuracy" in metrics:
            validations["prediction_accuracy"] = QuantumStateValidator.validate_prediction_accuracy(
                metrics["prediction_accuracy"]
            )
        
        # Overall status
        all_valid = all(v["valid"] for v in validations.values())
        
        return {
            "overall_status": "PASS" if all_valid else "FAIL",
            "validations": validations,
            "total_checks": len(validations),
            "passed_checks": sum(1 for v in validations.values() if v["valid"]),
            "failed_checks": sum(1 for v in validations.values() if not v["valid"])
        }


class Phase38PerformanceMonitor:
    """Monitors performance against Phase 38 targets"""
    
    def __init__(self):
        self.targets = {
            "oracle_divergence_percent": 0.003,
            "quantum_advantage_percent": 15.0,
            "prediction_cycle_seconds": 9.0,
            "node_availability_percent": 99.9,
            "prediction_accuracy_percent": 98.5
        }
        
        self.measurements = []
    
    def measure_performance(self, metrics: Dict) -> Dict:
        """
        Measure current performance against targets
        
        Args:
            metrics: Current system metrics
            
        Returns:
            Performance measurement report
        """
        measurement = {
            "timestamp": metrics.get("timestamp"),
            "targets": self.targets,
            "current": {},
            "deltas": {},
            "achievement": {}
        }
        
        # Calculate for each target
        for key, target in self.targets.items():
            if key in metrics:
                current = metrics[key]
                measurement["current"][key] = current
                
                # For divergence and cycle time, lower is better
                if "divergence" in key or "cycle" in key:
                    delta = target - current
                    achievement = (target / current * 100) if current > 0 else 100
                else:
                    delta = current - target
                    achievement = (current / target * 100) if target > 0 else 100
                
                measurement["deltas"][key] = delta
                measurement["achievement"][key] = achievement
        
        self.measurements.append(measurement)
        
        return measurement
    
    def get_performance_summary(self) -> Dict:
        """Get summary of performance over time"""
        if not self.measurements:
            return {"status": "NO_DATA"}
        
        recent = self.measurements[-100:]  # Last 100 measurements
        
        summary = {
            "total_measurements": len(self.measurements),
            "recent_measurements": len(recent),
            "targets": self.targets,
            "averages": {}
        }
        
        # Calculate averages for each metric
        for key in self.targets.keys():
            values = [
                m["current"][key]
                for m in recent
                if key in m["current"]
            ]
            
            if values:
                summary["averages"][key] = {
                    "mean": sum(values) / len(values),
                    "min": min(values),
                    "max": max(values)
                }
        
        return summary


def main():
    """Demonstration of validation utilities"""
    print("✅ Quantum State Validator - Phase 38")
    print("=" * 70)
    
    validator = QuantumStateValidator()
    
    # Test quantum state validation
    print("\n🔬 Testing Quantum State Validation:")
    test_state = np.array([0.6, 0.8j])
    result = validator.validate_quantum_state(test_state)
    print(f"   Valid: {result['valid']}")
    print(f"   Norm: {result['norm']:.6f}")
    print(f"   Message: {result['message']}")
    
    # Test oracle divergence validation
    print("\n🔮 Testing Oracle Divergence Validation:")
    result = validator.validate_oracle_divergence(0.0025, target=0.003)
    print(f"   Valid: {result['valid']}")
    print(f"   Status: {result['status']}")
    print(f"   Achievement: {result['achievement_percent']:.1f}%")
    
    # Test node health validation
    print("\n🔷 Testing Node Health Validation:")
    result = validator.validate_node_health(23, 24)
    print(f"   Valid: {result['valid']}")
    print(f"   Status: {result['status']}")
    print(f"   Availability: {result['availability_percent']:.1f}%")
    
    # Test quantum advantage validation
    print("\n⚛️  Testing Quantum Advantage Validation:")
    result = validator.validate_quantum_advantage(1.15)
    print(f"   Valid: {result['valid']}")
    print(f"   Status: {result['status']}")
    print(f"   Improvement: {result['improvement_percent']:.1f}%")
    
    # Test comprehensive validation
    print("\n📋 Testing Comprehensive Phase 38 Validation:")
    test_metrics = {
        "oracle_divergence": 0.0025,
        "operational_nodes": 23,
        "total_nodes": 24,
        "quantum_advantage": 1.15,
        "prediction_accuracy": 98.7
    }
    
    result = validator.validate_phase_38_targets(test_metrics)
    print(f"   Overall Status: {result['overall_status']}")
    print(f"   Passed Checks: {result['passed_checks']}/{result['total_checks']}")
    
    # Test performance monitor
    print("\n📊 Testing Performance Monitor:")
    monitor = Phase38PerformanceMonitor()
    
    test_metrics_with_timestamp = {
        **test_metrics,
        "oracle_divergence_percent": 0.0025,
        "quantum_advantage_percent": 15.0,
        "prediction_cycle_seconds": 8.7,
        "node_availability_percent": 95.8,
        "prediction_accuracy_percent": 98.7,
        "timestamp": "2026-01-06T04:34:33Z"
    }
    
    measurement = monitor.measure_performance(test_metrics_with_timestamp)
    print(f"   Targets: {len(monitor.targets)}")
    print(f"   Measured: {len(measurement['current'])}")
    
    print("\n✅ Validation Utilities Complete")
    print("=" * 70)


if __name__ == "__main__":
    main()
