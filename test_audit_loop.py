#!/usr/bin/env python3
"""
Test Suite - Audit Loop Verification
=====================================

Confirm 0.08s micro-audits
"""

import asyncio
import time
import json
from pathlib import Path


class TestAuditLoop:
    """Test the 0.08-second audit loop"""
    
    def __init__(self):
        self.config_path = Path("ONE_GRID_TIEKIEBOKS.json")
        
    async def test_audit_interval(self):
        """Test that audit interval is correct"""
        from pulse_engine import PulseEngine
        
        engine = PulseEngine()
        
        assert engine.audit_interval == 0.08, "Audit interval should be 0.08s"
        print(f"✅ Audit interval: {engine.audit_interval}s")
        
    async def test_audits_per_cycle(self):
        """Test that correct number of audits run per cycle"""
        from pulse_engine import PulseEngine
        
        engine = PulseEngine()
        
        # 9s / 0.08s = 112.5 audits per cycle
        expected_audits = int(engine.pulse_cycle / engine.audit_interval)
        
        assert expected_audits == 112, f"Expected 112 audits per cycle, got {expected_audits}"
        print(f"✅ Audits per cycle: {expected_audits} (9s / 0.08s)")
        
    async def test_single_audit(self):
        """Test single audit execution"""
        from pulse_engine import PulseEngine
        
        engine = PulseEngine()
        
        # Run single audit
        start_time = time.time()
        audit_result = await engine.audit_check(1)
        audit_duration = time.time() - start_time
        
        # Should complete quickly
        assert audit_duration < 0.1, f"Audit took {audit_duration:.3f}s, should be < 0.1s"
        
        # Check audit result structure
        assert 'ip_integrity' in audit_result
        assert 'rhino_tail_detection' in audit_result
        assert 'treaty_compliance' in audit_result
        assert 'grain_count_accuracy' in audit_result
        
        print(f"✅ Single audit: {audit_duration:.4f}s")
        print(f"   Checks: IP integrity, rhino tail, treaty compliance, grain accuracy")
    
    async def test_audit_loop_timing(self):
        """Test that audit loop completes in expected time"""
        from pulse_engine import PulseEngine
        
        engine = PulseEngine()
        
        # Run audit loop
        start_time = time.time()
        await engine.audit_loop()
        loop_duration = time.time() - start_time
        
        # Should take approximately 9 seconds (112 audits * 0.08s)
        assert 8.5 <= loop_duration <= 9.5, f"Audit loop {loop_duration:.3f}s not within expected range"
        print(f"✅ Audit loop timing: {loop_duration:.3f}s")
    
    async def run_all_tests(self):
        """Run all audit loop tests"""
        print("🧪 Running Audit Loop Tests...")
        print("=" * 60)
        
        await self.test_audit_interval()
        await self.test_audits_per_cycle()
        await self.test_single_audit()
        await self.test_audit_loop_timing()
        
        print("=" * 60)
        print("✅ All audit loop tests passed!")


async def main():
    """Main entry point"""
    test_suite = TestAuditLoop()
    await test_suite.run_all_tests()


if __name__ == "__main__":
    asyncio.run(main())
