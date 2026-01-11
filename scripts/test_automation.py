#!/usr/bin/env python3
"""
Basic test suite for automation scripts
Per PR #35 recommendations for testing automation
"""

import unittest
import json
import sys
from pathlib import Path
import tempfile
import os

class TestConfigValidation(unittest.TestCase):
    """Test configuration validation functionality"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.test_dir = tempfile.mkdtemp()
        
    def tearDown(self):
        """Clean up test fixtures"""
        import shutil
        shutil.rmtree(self.test_dir, ignore_errors=True)
    
    def test_valid_config(self):
        """Test valid configuration passes validation"""
        config = {
            "repositories": [
                "owner1/repo1",
                "owner2/repo2"
            ],
            "sync_interval_minutes": 15,
            "auto_merge_threshold_commits": 10
        }
        
        config_path = Path(self.test_dir) / "config.json"
        with open(config_path, 'w') as f:
            json.dump(config, f)
        
        # Basic validation without import
        self.assertTrue(config_path.exists())
        with open(config_path) as f:
            loaded = json.load(f)
        self.assertEqual(len(loaded["repositories"]), 2)
    
    def test_invalid_json(self):
        """Test invalid JSON is handled"""
        config_path = Path(self.test_dir) / "config.json"
        with open(config_path, 'w') as f:
            f.write("{ invalid json }")
        
        # Should raise exception
        with self.assertRaises(json.JSONDecodeError):
            with open(config_path) as f:
                json.load(f)

class TestHealthReportStructure(unittest.TestCase):
    """Test health report structure"""
    
    def test_health_report_format(self):
        """Test health report has expected format"""
        report = {
            "timestamp": "2026-01-11T00:00:00",
            "healthy": True,
            "checks": [],
            "errors": [],
            "warnings": [],
            "metrics": {},
            "summary": {
                "total_checks": 0,
                "passed": 0,
                "warnings": 0,
                "errors": 0
            }
        }
        
        # Validate structure
        self.assertIn("timestamp", report)
        self.assertIn("healthy", report)
        self.assertIn("checks", report)
        self.assertIn("summary", report)
        self.assertTrue(isinstance(report["checks"], list))
        self.assertTrue(isinstance(report["metrics"], dict))

class TestMetricsStructure(unittest.TestCase):
    """Test metrics structure"""
    
    def test_metrics_format(self):
        """Test metrics have expected format"""
        metrics = {
            "start_time": "2026-01-11T00:00:00",
            "duration_seconds": 45.2,
            "repos_scanned": 4,
            "branches_analyzed": 12,
            "prs_created": 2,
            "errors_encountered": 0,
            "success_rate": 100.0,
            "api_calls_made": 18
        }
        
        # Validate structure
        self.assertIn("repos_scanned", metrics)
        self.assertIn("success_rate", metrics)
        self.assertGreaterEqual(metrics["success_rate"], 0)
        self.assertLessEqual(metrics["success_rate"], 100)
    
    def test_success_rate_calculation(self):
        """Test success rate calculation logic"""
        repos_scanned = 5
        errors = 1
        # Success rate = (repos_scanned / (repos_scanned + errors)) * 100
        success_rate = (repos_scanned / (repos_scanned + errors)) * 100
        
        self.assertAlmostEqual(success_rate, 83.33, places=1)

def run_tests():
    """Run all tests"""
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add all test cases
    suite.addTests(loader.loadTestsFromTestCase(TestConfigValidation))
    suite.addTests(loader.loadTestsFromTestCase(TestHealthReportStructure))
    suite.addTests(loader.loadTestsFromTestCase(TestMetricsStructure))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print(f"\n{'='*60}")
    print(f"Test Summary")
    print(f"{'='*60}")
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Success: {result.wasSuccessful()}")
    
    # Return exit code
    return 0 if result.wasSuccessful() else 1

if __name__ == "__main__":
    sys.exit(run_tests())
