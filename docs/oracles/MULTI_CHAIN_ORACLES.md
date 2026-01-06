# Multi-Chain Quantum Oracles

## Overview

The Multi-Chain Quantum Oracle system provides decentralized, real-time data feeds across Ethereum Sepolia, Polygon Mumbai, and Solana Devnet with **9-second pulse intervals** and **94-repository fidelity tracking**.

## Features

### 🌐 Multi-Chain Support
- **Ethereum Sepolia**: EVM-compatible testnet with Chainlink Automation
- **Polygon Mumbai**: Layer 2 solution with low gas costs
- **Solana Devnet**: High-performance blockchain with Anchor framework

### ⚡ Real-Time Pulse Feeds
- **9-second intervals**: Synchronized across all chains
- **94-repository fidelity**: Tracks synchronization across the entire ecosystem
- **Chainlink Automation**: Decentralized keeper network for automated updates

### 📊 HotStack Quantum Nodes v4
- **Real-time dashboard**: Visual monitoring of all oracle nodes
- **Consensus tracking**: Monitors agreement across chains
- **Latency metrics**: Per-chain performance monitoring
- **Fidelity scoring**: Repository synchronization health

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Multi-Chain Oracle System                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  Ethereum    │    │   Polygon    │    │   Solana     │      │
│  │  Sepolia     │    │   Mumbai     │    │   Devnet     │      │
│  │              │    │              │    │              │      │
│  │ QuantumOracle│    │ QuantumOracle│    │quantum_oracle│      │
│  │   (Solidity) │    │   (Solidity) │    │    (Rust)    │      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                   │                   │               │
│         └───────────────────┼───────────────────┘               │
│                             │                                   │
│                    ┌────────▼────────┐                          │
│                    │   Aggregator    │                          │
│                    │  (TypeScript)   │                          │
│                    └────────┬────────┘                          │
│                             │                                   │
│                    ┌────────▼────────┐                          │
│                    │  HotStack v4    │                          │
│                    │   Dashboard     │                          │
│                    └─────────────────┘                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

        Chainlink Automation (9s pulse trigger)
```

## Quick Start

### 1. Deploy Oracles

```bash
# Deploy to all three chains
./scripts/oracles/deploy-multi-chain-oracles.sh
```

### 2. Configure Aggregator

```typescript
import { MultiChainOracleAggregator } from './lib/oracles/multi-chain-aggregator';
import config from './config/chains/multi-chain-config.json';

const aggregator = new MultiChainOracleAggregator(
  config.chains,
  config.pulseConfig.intervalSeconds,
  config.pulseConfig.fidelityThreshold,
  config.pulseConfig.maxRepositories
);

// Start monitoring
await aggregator.startPulseMonitoring((data) => {
  console.log('Pulse data:', data);
  console.log('Average fidelity:', data.averageFidelity);
  console.log('Consensus reached:', data.consensusReached);
});
```

### 3. Integrate Dashboard

```tsx
import { QuantumNodesDashboard } from './components/quantum-dashboard/QuantumNodesDashboard';

function App() {
  return (
    <QuantumNodesDashboard 
      refreshInterval={9000}
      showMetrics={true}
      compactMode={false}
    />
  );
}
```

## Smart Contracts

### Ethereum/Polygon: QuantumOracle.sol

**Key Features:**
- 9-second pulse interval
- Chainlink Automation integration
- 94-repository fidelity tracking
- Manual override capability

**Interface:**
```solidity
function checkUpkeep(bytes calldata checkData) 
  external view returns (bool upkeepNeeded, bytes memory performData);

function performUpkeep(bytes calldata performData) external;

function getLatestPulse() external view returns (OracleData memory);

function manualPulseUpdate(bytes32 dataHash, uint256 fidelityScore) external;
```

### Solana: quantum_oracle.rs

**Key Features:**
- Anchor framework
- 9-second pulse interval
- Authority-based access control
- Event emission for monitoring

**Instructions:**
```rust
pub fn initialize(ctx: Context<Initialize>) -> Result<()>;

pub fn update_pulse(
  ctx: Context<UpdatePulse>,
  data_hash: [u8; 32],
  fidelity_score: u8
) -> Result<()>;

pub fn manual_pulse_update(
  ctx: Context<ManualUpdate>,
  data_hash: [u8; 32],
  fidelity_score: u8
) -> Result<()>;
```

## Deployment

### Prerequisites

- Node.js 18+
- Ethereum wallet with Sepolia ETH
- Polygon wallet with Mumbai MATIC
- Solana wallet with Devnet SOL
- Chainlink LINK tokens for automation

### Deployment Steps

1. **Configure RPC URLs**
   ```bash
   # Edit config/chains/multi-chain-config.json
   # Add your RPC endpoints
   ```

2. **Deploy Contracts**
   ```bash
   ./scripts/oracles/deploy-multi-chain-oracles.sh
   ```

3. **Register with Chainlink**
   - Visit automation.chain.link
   - Register both Ethereum and Polygon contracts
   - Fund with LINK tokens

4. **Initialize Solana Program**
   ```bash
   # Use Anchor CLI
   anchor deploy
   anchor idl init <program-id>
   ```

5. **Start Aggregator**
   ```typescript
   import { createOracleAggregatorFromConfig } from './lib/oracles/multi-chain-aggregator';
   
   const aggregator = await createOracleAggregatorFromConfig(
     './config/chains/multi-chain-config.json'
   );
   
   await aggregator.startPulseMonitoring(callback);
   ```

## Testing

### Run All Tests

```bash
npm test
```

### Run Oracle-Specific Tests

```bash
npm test tests/multi-chain-oracle.spec.ts
```

## API Reference

### MultiChainOracleAggregator

**Constructor**
```typescript
constructor(
  chainsConfig: Record<string, ChainConfig>,
  pulseInterval?: number,
  fidelityThreshold?: number,
  maxRepositories?: number
)
```

**Methods**
- `getAggregatedPulse()`: Fetch current pulse data from all chains
- `startPulseMonitoring(callback)`: Start continuous monitoring
- `checkChainHealth(chainName)`: Check individual chain status
- `getSupportedChains()`: Get list of configured chains
- `getPulseInterval()`: Get pulse interval in seconds
- `getFidelityThreshold()`: Get consensus threshold

## License

Proprietary - Fruitful Holdings (Pty) Ltd

---

**Built with the OmniGrid™ Ecosystem**
