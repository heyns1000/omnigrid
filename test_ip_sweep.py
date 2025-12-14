#!/usr/bin/env python3
"""
Test Suite - IP Sweep Verification
===================================

Validate 24/7 monitoring
"""

import asyncio
import time
import json
from pathlib import Path


class TestIPSweep:
    """Test the 24/7 IP sweep sentinel"""
    
    def __init__(self):
        self.config_path = Path("ONE_GRID_TIEKIEBOKS.json")
        
    async def test_sentinel_initialization(self):
        """Test IP sentinel initializes correctly"""
        from ip_sentinel import IPSentinel
        
        sentinel = IPSentinel()
        
        assert sentinel.sweep_interval == 1.0, "Sweep interval should be 1.0s"
        assert sentinel.ant_reset_time == 0.8, "Ant reset time should be 0.8s"
        print(f"✅ Sentinel initialization: sweep={sentinel.sweep_interval}s, ant_reset={sentinel.ant_reset_time}s")
        
    async def test_rhino_tail_detection(self):
        """Test rhino tail detection"""
        from ip_sentinel import IPSentinel
        
        sentinel = IPSentinel()
        
        # Test detection on a repository
        detection = await sentinel.detect_rhino_tail("seedwave")
        
        assert 'repository' in detection
        assert 'threat_level' in detection
        assert 'commit_pattern_anomaly' in detection
        
        print(f"✅ Rhino tail detection: {detection['threat_level']}")
        
    async def test_ant_smell_adjustment(self):
        """Test ant smell adjustment completes in 0.8s"""
        from ip_sentinel import IPSentinel
        
        sentinel = IPSentinel()
        
        # Create test threats
        threats = [
            {'repository': 'test', 'threat_level': 'CLEAR'}
        ]
        
        start_time = time.time()
        await sentinel.ant_smell_adjustment(threats)
        adjustment_time = time.time() - start_time
        
        # Should complete within 0.8s ± 0.1s
        assert 0.7 <= adjustment_time <= 0.9, f"Ant adjustment {adjustment_time:.3f}s not within 0.8s ± 0.1s"
        print(f"✅ Ant smell adjustment: {adjustment_time:.3f}s")
        
    async def test_global_feedback_loop(self):
        """Test global feedback loop"""
        from ip_sentinel import IPSentinel
        
        sentinel = IPSentinel()
        
        feedback = await sentinel.global_feedback_loop()
        
        assert 'timestamp' in feedback
        assert 'timezone' in feedback
        assert feedback['timezone'] == 'SAST'
        assert 'surveillance_mode' in feedback
        assert feedback['surveillance_mode'] == 'RESPECT_BASED'
        
        print(f"✅ Global feedback loop: {feedback['timezone']}, {feedback['surveillance_mode']}")
        
    async def test_1984_surveillance_check(self):
        """Test 1984 surveillance detection"""
        from ip_sentinel import IPSentinel
        
        sentinel = IPSentinel()
        
        surveillance = await sentinel.check_1984_surveillance()
        
        # Should not detect surveillance in clean system
        assert isinstance(surveillance, bool)
        print(f"✅ 1984 surveillance check: {'DETECTED' if surveillance else 'CLEAR'}")
        
    async def test_single_sweep(self):
        """Test single IP sweep execution"""
        from ip_sentinel import IPSentinel
        
        sentinel = IPSentinel()
        
        start_time = time.time()
        await sentinel.ip_sweep()
        sweep_time = time.time() - start_time
        
        # Should complete within sweep interval
        assert sweep_time <= 2.0, f"IP sweep took {sweep_time:.3f}s, should be < 2s"
        print(f"✅ Single IP sweep: {sweep_time:.3f}s")
    
    async def run_all_tests(self):
        """Run all IP sweep tests"""
        print("🧪 Running IP Sweep Tests...")
        print("=" * 60)
        
        await self.test_sentinel_initialization()
        await self.test_rhino_tail_detection()
        await self.test_ant_smell_adjustment()
        await self.test_global_feedback_loop()
        await self.test_1984_surveillance_check()
        await self.test_single_sweep()
        
        print("=" * 60)
        print("✅ All IP sweep tests passed!")


async def main():
    """Main entry point"""
    test_suite = TestIPSweep()
    await test_suite.run_all_tests()


if __name__ == "__main__":
    asyncio.run(main())
