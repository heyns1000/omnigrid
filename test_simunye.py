#!/usr/bin/env python3
"""
Test Suite - Simunye Lattice Verification
==========================================

Check lattice integrity
"""

import asyncio
import json
from pathlib import Path


class TestSimunye:
    """Test the Simunye lattice"""
    
    def __init__(self):
        self.config_path = Path("ONE_GRID_TIEKIEBOKS.json")
        
    async def test_lattice_initialization(self):
        """Test lattice initializes correctly"""
        from simunye_lattice import SimunyeLattice
        
        lattice = SimunyeLattice()
        lattice.initialize_lattice()
        
        # Should have nodes for all repositories
        with open(self.config_path, 'r') as f:
            config = json.load(f)
        
        assert len(lattice.lattice) == len(config['repositories']), "Should have node for each repository"
        assert lattice.dimensions == 40, "Should have 40 dimensions"
        assert lattice.sovereign_nodes == 817, "Should have 817 sovereign nodes"
        
        print(f"✅ Lattice initialized: {len(lattice.lattice)} nodes, {lattice.dimensions}D, {lattice.sovereign_nodes} sovereign")
        
    async def test_ubuntu_principle(self):
        """Test Ubuntu 'I am because we are' principle"""
        from simunye_lattice import SimunyeLattice
        
        lattice = SimunyeLattice()
        lattice.initialize_lattice()
        
        # All nodes should be connected
        for node_name, node in lattice.lattice.items():
            assert len(node['connections']) > 0, f"Node {node_name} should have connections"
            assert node['ubuntu_score'] >= 1.0, f"Node {node_name} should have ubuntu score >= 1.0"
        
        print(f"✅ Ubuntu principle: All nodes connected and supporting each other")
        
    async def test_hypercube_integration(self):
        """Test 40D hypercube integration"""
        from simunye_lattice import SimunyeLattice
        
        lattice = SimunyeLattice()
        lattice.initialize_lattice()
        
        # Check dimensions for each node
        for node_name, node in lattice.lattice.items():
            assert 'dimensions' in node, f"Node {node_name} should have dimensions"
            assert len(node['dimensions']) == 40, f"Node {node_name} should have 40 dimensions"
            
            # Check dimension format
            for dim_name in node['dimensions'].keys():
                assert dim_name.startswith('D'), f"Dimension should start with 'D': {dim_name}"
        
        print(f"✅ 40D hypercube: All nodes have 40 dimensions")
        
    async def test_vaultmesh_connections(self):
        """Test VaultMesh sovereign node connections"""
        from simunye_lattice import SimunyeLattice
        
        lattice = SimunyeLattice()
        lattice.initialize_lattice()
        
        # Should have connections established
        assert len(lattice.connections) > 0, "Should have connections"
        
        # Each connection should be bidirectional
        for repo1, repo2 in lattice.connections:
            assert repo2 in lattice.lattice[repo1]['connections']
            assert repo1 in lattice.lattice[repo2]['connections']
        
        print(f"✅ VaultMesh: {len(lattice.connections)} bidirectional connections")
        
    async def test_ubuntu_sync(self):
        """Test Ubuntu synchronization"""
        from simunye_lattice import SimunyeLattice
        
        lattice = SimunyeLattice()
        lattice.initialize_lattice()
        
        support = await lattice.ubuntu_sync()
        
        assert support > 0, "Should have support flows"
        print(f"✅ Ubuntu sync: {support} support flows")
        
    async def test_lattice_pulse(self):
        """Test single lattice pulse"""
        from simunye_lattice import SimunyeLattice
        
        lattice = SimunyeLattice()
        lattice.initialize_lattice()
        
        # Run pulse
        await lattice.lattice_pulse()
        
        # Check that ubuntu scores are updated
        for node in lattice.lattice.values():
            assert node['ubuntu_score'] >= 1.0
            assert node['sovereign_strength'] >= 1.0
        
        print(f"✅ Lattice pulse: Complete")
    
    async def run_all_tests(self):
        """Run all Simunye tests"""
        print("🧪 Running Simunye Lattice Tests...")
        print("=" * 60)
        
        await self.test_lattice_initialization()
        await self.test_ubuntu_principle()
        await self.test_hypercube_integration()
        await self.test_vaultmesh_connections()
        await self.test_ubuntu_sync()
        await self.test_lattice_pulse()
        
        print("=" * 60)
        print("✅ All Simunye lattice tests passed!")


async def main():
    """Main entry point"""
    test_suite = TestSimunye()
    await test_suite.run_all_tests()


if __name__ == "__main__":
    asyncio.run(main())
