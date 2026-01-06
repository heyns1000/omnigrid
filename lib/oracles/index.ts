/**
 * Multi-Chain Quantum Oracles - Main Export
 * 
 * Provides access to all oracle system components:
 * - Smart contracts for Ethereum Sepolia and Polygon Mumbai
 * - Solana program for Devnet
 * - Multi-chain aggregator for data collection
 * - HotStack Quantum Nodes v4 dashboard
 */

// Oracle Aggregator
export { 
  MultiChainOracleAggregator,
  createOracleAggregatorFromConfig 
} from './lib/oracles/multi-chain-aggregator';

export type {
  ChainConfig,
  PulseData,
  AggregatedPulseData
} from './lib/oracles/multi-chain-aggregator';

// Dashboard Components
export { 
  QuantumNodesDashboard,
  default as QuantumDashboard 
} from './components/quantum-dashboard/QuantumNodesDashboard';

export type {
  QuantumNodeStatus,
  QuantumDashboardProps
} from './components/quantum-dashboard/QuantumNodesDashboard';

// Re-export configuration
export { default as multiChainConfig } from './config/chains/multi-chain-config.json';
