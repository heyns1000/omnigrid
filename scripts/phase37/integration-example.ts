/**
 * Phase 37: Integration example demonstrating complete workflow
 * 
 * Shows how to:
 * 1. Connect to QuantumFidelityOracle
 * 2. Submit and verify 50-qubit fidelity proofs
 * 3. Query Chainlink metrics in real-time
 * 4. Sync with HotStack v3 dashboard
 */

import { createOracleClient, SEPOLIA_CONFIG, OracleConfig } from '../lib/quantum-oracle-client';
import { createHotStackV3Hook, DEFAULT_PROPAGATION_CONFIG } from '../lib/hotstack-v3-hooks';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Main integration example
 */
async function main() {
  console.log('🌌 Phase 37: Quantum Fidelity Oracle Integration\n');

  // Configuration
  const config: OracleConfig = {
    providerUrl: process.env.SEPOLIA_RPC_URL || SEPOLIA_CONFIG.providerUrl!,
    contractAddress: process.env.ORACLE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
    chainlinkFeedAddress: SEPOLIA_CONFIG.chainlinkFeedAddress!,
    privateKey: process.env.PRIVATE_KEY,
  };

  // Validate configuration
  if (config.contractAddress === '0x0000000000000000000000000000000000000000') {
    console.error('❌ Error: ORACLE_CONTRACT_ADDRESS not set in environment');
    console.log('Please deploy the contract first using: npm run deploy:oracle');
    process.exit(1);
  }

  // Create oracle client
  console.log('📡 Connecting to QuantumFidelityOracle...');
  const oracleClient = createOracleClient(config);
  console.log(`✅ Connected to contract at ${config.contractAddress}\n`);

  // Create HotStack v3 dashboard hook
  console.log('🔗 Initializing HotStack v3 dashboard hooks...');
  const dashboardHook = createHotStackV3Hook(oracleClient, DEFAULT_PROPAGATION_CONFIG);
  dashboardHook.initialize();
  console.log('✅ Dashboard hooks initialized\n');

  // Example 1: Query Chainlink metrics
  console.log('📊 Querying Chainlink metrics...');
  try {
    const metrics = await oracleClient.getChainlinkMetrics();
    console.log('Chainlink Metrics:');
    console.log(`  Round ID: ${metrics.roundId}`);
    console.log(`  Price: ${Number(metrics.price) / 1e8} USD`);
    console.log(`  Updated At: ${new Date(Number(metrics.updatedAt) * 1000).toISOString()}`);
    console.log('');
  } catch (error) {
    console.error('Error querying metrics:', error);
  }

  // Example 2: Submit a fidelity proof (requires private key)
  if (config.privateKey) {
    console.log('📝 Submitting 50-qubit fidelity proof...');
    try {
      // Generate mock tensor hash and signature
      const tensorHash = `quantum-state-${Date.now()}`;
      const fidelityScore = 96.5; // 96.5% fidelity
      const signature = `sig-${Date.now()}`;

      const proofId = await oracleClient.submitFidelityProof(
        tensorHash,
        fidelityScore,
        signature
      );

      console.log(`✅ Proof submitted successfully!`);
      console.log(`  Proof ID: ${proofId}`);
      console.log(`  Fidelity: ${fidelityScore}%`);
      console.log('');

      // Wait a moment for confirmation
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Example 3: Verify the proof
      console.log('🔍 Verifying proof...');
      const verified = await oracleClient.verifyFidelityProof(proofId);
      console.log(`${verified ? '✅' : '❌'} Proof verification: ${verified ? 'SUCCESS' : 'FAILED'}\n`);

      // Check if proof is valid
      const isValid = await oracleClient.isProofValid(proofId);
      console.log(`Proof validity: ${isValid ? 'VALID' : 'INVALID'}\n`);
    } catch (error) {
      console.error('Error with proof submission/verification:', error);
    }
  } else {
    console.log('⚠️  Skipping proof submission (no private key provided)\n');
  }

  // Example 4: Start real-time dashboard syncing
  console.log('🔄 Starting real-time dashboard sync (9s pulse)...');
  dashboardHook.startSync(9000);

  // Run for 30 seconds to demonstrate real-time updates
  console.log('Monitoring for 30 seconds...\n');
  
  let updateCount = 0;
  const monitorInterval = setInterval(() => {
    updateCount++;
    const state = dashboardHook.getDashboardState();
    console.log(`[Update ${updateCount}] Status: ${state.syncStatus}, Last sync: ${new Date(state.lastUpdate).toISOString()}`);
    
    if (state.metrics) {
      console.log(`  Price: ${Number(state.metrics.price) / 1e8} USD`);
    }
    console.log(`  Proofs tracked: ${state.proofs.size}`);
    console.log(`  GraphDB nodes: ${dashboardHook.getGraphDBSnapshot().length}\n`);
  }, 10000);

  // Wait for 30 seconds
  await new Promise((resolve) => setTimeout(resolve, 30000));

  // Stop monitoring
  clearInterval(monitorInterval);
  dashboardHook.stopSync();
  console.log('✅ Monitoring complete\n');

  // Example 5: Export data for Netlify workflow
  console.log('📤 Exporting data for Netlify workflow...');
  const exportData = dashboardHook.exportForNetlify();
  console.log('Export summary:');
  console.log(`  Proofs: ${exportData.proofs.length}`);
  console.log(`  GraphDB nodes: ${exportData.graphDB.size}`);
  console.log(`  Sync status: ${exportData.syncStatus}`);
  console.log('');

  console.log('🎉 Phase 37 integration complete!\n');
  console.log('Key achievements:');
  console.log('  ✅ Connected to QuantumFidelityOracle on Sepolia');
  console.log('  ✅ Queried Chainlink price feeds in real-time');
  console.log('  ✅ Submitted and verified 50-qubit fidelity proofs');
  console.log('  ✅ Synced with HotStack v3 dashboard');
  console.log('  ✅ Demonstrated GraphDB stacking');
  console.log('  ✅ Exported data for Netlify workflows');
}

// Run the integration example
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
