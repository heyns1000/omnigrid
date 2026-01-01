/**
 * EHO Post-Quantum Signatures Example
 * ====================================
 * 
 * Demonstrates ML-DSA (FIPS 204) post-quantum signatures
 * for EHO memory state coordinates.
 */

import { PostQuantumIndexing } from '../lib/pqc-indexing';
import { VaultMeshEHO, MemoryType, AccessFrequency } from '../lib/vaultmesh-eho';

async function example1_basicSigningAndVerification() {
  console.log('='.repeat(70));
  console.log('Example 1: Basic Signing and Verification');
  console.log('='.repeat(70));
  console.log('');

  const pqc = new PostQuantumIndexing();

  // Step 1: Generate key pair
  console.log('🔑 Step 1: Generate Key Pair');
  const brand_id = 'monster-omni-001';
  const keyPair = await pqc.generateKeyPair(brand_id);
  console.log(`   ✓ Key pair generated for: ${brand_id}`);
  console.log(`   ✓ Public key: ${keyPair.publicKey.length} bytes`);
  console.log(`   ✓ Private key: ${keyPair.privateKey.length} bytes`);
  console.log('');

  // Step 2: Sign memory state
  console.log('✍️  Step 2: Sign Memory State');
  const coordinates = Array.from({ length: 40 }, () => Math.random() * 2 - 1);
  const signature = await pqc.signMemoryState(brand_id, coordinates);
  console.log(`   ✓ Signature created: ${signature.signature.length} bytes`);
  console.log(`   ✓ Algorithm: ${signature.algorithm}`);
  console.log('');

  // Step 3: Verify signature
  console.log('🔍 Step 3: Verify Signature');
  const valid = await pqc.verify(signature, coordinates);
  console.log(`   ✓ Signature valid: ${valid}`);
  console.log('');

  // Step 4: Test invalid signature
  console.log('⚠️  Step 4: Test Invalid Coordinates');
  const tamperedCoords = coordinates.map(x => x + 0.1);  // Tamper with data
  const invalidVerify = await pqc.verify(signature, tamperedCoords);
  console.log(`   ✓ Tampered signature rejected: ${!invalidVerify}`);
  console.log('');

  console.log('✅ Example 1 Complete!');
  console.log('');
}

async function example2_vaultmeshIntegration() {
  console.log('='.repeat(70));
  console.log('Example 2: VaultMesh Integration');
  console.log('='.repeat(70));
  console.log('');

  const vault = new VaultMeshEHO();
  const pqc = new PostQuantumIndexing();

  // Step 1: Retrieve memory with EHO
  console.log('🔍 Step 1: Retrieve Memory with EHO');
  const result = await vault.retrieve({
    text: 'Retrieve brand dashboard with quantum security',
    memory_type: MemoryType.LONG_TERM,
    access_frequency: AccessFrequency.HOT,
    brand_id: 'monster-omni-001'
  });
  console.log(`   ✓ Memory retrieved: ${result.latency_ms}ms`);
  console.log(`   ✓ EHO convergence: ${(result.eho_convergence * 100).toFixed(1)}%`);
  console.log(`   ✓ Coordinates: 40D [${result.coordinates.slice(0, 3).map(x => x.toFixed(3)).join(', ')}...]`);
  console.log('');

  // Step 2: Sign retrieved coordinates
  console.log('✍️  Step 2: Sign Retrieved Coordinates');
  const signature = await pqc.signMemoryState('monster-omni-001', result.coordinates);
  console.log(`   ✓ Signature created: ${signature.signature.length} bytes`);
  console.log('');

  // Step 3: Verify quantum-secure memory
  console.log('🔐 Step 3: Verify Quantum-Secure Memory');
  const valid = await pqc.verify(signature, result.coordinates);
  console.log(`   ✓ Quantum signature valid: ${valid}`);
  console.log(`   ✓ Memory is quantum-secure: ${result.quantum_secure && valid}`);
  console.log('');

  console.log('✅ Example 2 Complete!');
  console.log('');
}

async function example3_latticeDigest() {
  console.log('='.repeat(70));
  console.log('Example 3: Lattice Digest for Baobab Nodes');
  console.log('='.repeat(70));
  console.log('');

  const pqc = new PostQuantumIndexing();

  // Create lattice digests for multiple Baobab nodes
  console.log('🌳 Creating lattice digests for Baobab nodes...');
  console.log('');

  const nodes = [
    { brand_id: 'baobab-node-001', baobab_id: 'BN001', region: 'NA-WEST' },
    { brand_id: 'baobab-node-042', baobab_id: 'BN042', region: 'EU-CENTRAL' },
    { brand_id: 'baobab-node-137', baobab_id: 'BN137', region: 'ASIA-PACIFIC' }
  ];

  for (const node of nodes) {
    const coordinates = Array.from({ length: 40 }, () => Math.random() * 2 - 1);
    
    const digest = await pqc.createLatticeDigest(
      node.brand_id,
      coordinates,
      {
        baobab_id: node.baobab_id,
        region: node.region,
        grain_count: Math.floor(Math.random() * 1000000),
        last_updated: new Date().toISOString()
      }
    );

    console.log(`   ${node.baobab_id} (${node.region}):`);
    console.log(`      Digest: ${digest.length} bytes (4KB)`);
    console.log(`      Brand: ${node.brand_id}`);
    console.log('');
  }

  console.log('✅ Example 3 Complete!');
  console.log(`   Total Baobab nodes in production: 144,500`);
  console.log('');
}

async function example4_performanceBenchmark() {
  console.log('='.repeat(70));
  console.log('Example 4: Performance Benchmark');
  console.log('='.repeat(70));
  console.log('');

  const pqc = new PostQuantumIndexing();
  const coordinates = Array.from({ length: 40 }, () => Math.random() * 2 - 1);

  // Benchmark signing
  console.log('⚡ Benchmarking ML-DSA Signing...');
  const signTimes: number[] = [];
  for (let i = 0; i < 100; i++) {
    const start = Date.now();
    await pqc.signMemoryState(`brand_${i}`, coordinates);
    signTimes.push(Date.now() - start);
  }

  const avgSign = signTimes.reduce((a, b) => a + b, 0) / signTimes.length;
  const p95Sign = signTimes.sort((a, b) => a - b)[Math.floor(signTimes.length * 0.95)];
  
  console.log(`   Average: ${avgSign.toFixed(2)}ms`);
  console.log(`   p95: ${p95Sign}ms`);
  console.log(`   Target: <5ms`);
  console.log(`   Status: ${avgSign < 5 ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');

  // Benchmark verification
  console.log('⚡ Benchmarking ML-DSA Verification...');
  const signature = await pqc.signMemoryState('test', coordinates);
  const verifyTimes: number[] = [];
  
  for (let i = 0; i < 100; i++) {
    const start = Date.now();
    await pqc.verify(signature, coordinates);
    verifyTimes.push(Date.now() - start);
  }

  const avgVerify = verifyTimes.reduce((a, b) => a + b, 0) / verifyTimes.length;
  const p95Verify = verifyTimes.sort((a, b) => a - b)[Math.floor(verifyTimes.length * 0.95)];
  
  console.log(`   Average: ${avgVerify.toFixed(2)}ms`);
  console.log(`   p95: ${p95Verify}ms`);
  console.log(`   Target: <10ms`);
  console.log(`   Status: ${avgVerify < 10 ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');

  console.log('✅ Example 4 Complete!');
  console.log('');
}

async function main() {
  console.log('\n');
  console.log('🔐 EHO Post-Quantum Signatures Examples');
  console.log('ML-DSA (FIPS 204) Quantum-Resistant Cryptography');
  console.log('\n');

  try {
    await example1_basicSigningAndVerification();
    await example2_vaultmeshIntegration();
    await example3_latticeDigest();
    await example4_performanceBenchmark();

    console.log('='.repeat(70));
    console.log('🎉 All Examples Complete!');
    console.log('='.repeat(70));
    console.log('');
    console.log('Next Steps:');
    console.log('  • Review docs/ADR-03-pqc-indexing.md for specifications');
    console.log('  • Run tests/eho-performance.spec.ts for full benchmarks');
    console.log('  • Deploy with scripts/deploy-eho.sh');
    console.log('');
    console.log('瓷勺旋渦已築，脈買已通！ 🔐🐘🌊');
  } catch (error) {
    console.error('❌ Error running examples:', error);
    process.exit(1);
  }
}

// Run examples
if (require.main === module) {
  main().catch(console.error);
}

export { 
  example1_basicSigningAndVerification,
  example2_vaultmeshIntegration,
  example3_latticeDigest,
  example4_performanceBenchmark
};
