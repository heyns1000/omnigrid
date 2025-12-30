#!/usr/bin/env python3
"""
Test Suite - Pulse Cycle Verification
======================================

Verify 9s breathing rhythm
"""

import asyncio
import time
import json
from pathlib import Path


class TestPulseCycle:
    """Test the 9-second pulse cycle"""
    
    def __init__(self):
        self.config_path = Path("ONE_GRID_TIEKIEBOKS.json")
        
    async def test_config_exists(self):
        """Test that configuration file exists"""
        assert self.config_path.exists(), "ONE_GRID_TIEKIEBOKS.json not found"
        print("✅ Configuration file exists")
        
    async def test_config_valid(self):
        """Test that configuration is valid JSON"""
        with open(self.config_path, 'r') as f:
            config = json.load(f)
        
        assert config['pulse_cycle'] == '9s', "Pulse cycle should be 9s"
        assert config['protocol'] == 'SIMUNYE_v1', "Protocol should be SIMUNYE_v1"
        print("✅ Configuration is valid")
        
    async def test_pulse_timing(self):
        """Test pulse cycle timing accuracy"""
        from pulse_engine import PulseEngine
        
        engine = PulseEngine()
        
        # Measure single cycle
        start_time = time.time()
        await engine.breath_cycle()
        cycle_duration = time.time() - start_time
        
        # Should be 9s ± 0.1s tolerance
        assert 8.9 <= cycle_duration <= 9.1, f"Cycle duration {cycle_duration:.3f}s not within 9s ± 0.1s"
        print(f"✅ Pulse cycle timing: {cycle_duration:.3f}s (target: 9.000s ± 0.1s)")
        
    async def test_breath_phases(self):
        """Test that all breath phases execute"""
        from pulse_engine import PulseEngine
        
        engine = PulseEngine()
        
        # Run one cycle
        await engine.breath_cycle()
        
        # Verify cycle completed
        assert engine.cycle_count == 1, "Cycle count should be 1"
        assert engine.grain_count > 0, "Grain count should increase"
        print(f"✅ Breath phases complete - Cycle count: {engine.cycle_count}, Grains: {engine.grain_count}")
    
    async def run_all_tests(self):
        """Run all pulse cycle tests"""
        print("🧪 Running Pulse Cycle Tests...")
        print("=" * 60)
        
        await self.test_config_exists()
        await self.test_config_valid()
        await self.test_pulse_timing()
        await self.test_breath_phases()
        
        print("=" * 60)
        print("✅ All pulse cycle tests passed!")


async def main():
    """Main entry point"""
    test_suite = TestPulseCycle()
    await test_suite.run_all_tests()


if __name__ == "__main__":
    asyncio.run(main())
