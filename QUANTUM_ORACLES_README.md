# Multi-Chain Quantum Oracles - Quick Reference

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure chains
# Edit config/chains/multi-chain-config.json

# 3. Deploy oracles
npm run deploy:oracles

# 4. Run tests
npm test
```

## 📦 Components

### Smart Contracts
- **`contracts/ethereum/QuantumOracle.sol`** - EVM oracle for Ethereum Sepolia & Polygon Mumbai
- **`contracts/solana/quantum_oracle.rs`** - Solana program for Devnet

### TypeScript Library
- **`lib/oracles/multi-chain-aggregator.ts`** - Multi-chain data aggregator
- **`lib/oracles/index.ts`** - Main export file

### Dashboard
- **`components/quantum-dashboard/QuantumNodesDashboard.tsx`** - HotStack Quantum Nodes v4 UI

### Configuration
- **`config/chains/multi-chain-config.json`** - Chain configurations and RPC endpoints

### Scripts
- **`scripts/oracles/deploy-multi-chain-oracles.sh`** - Deployment automation

### Tests
- **`tests/multi-chain-oracle.spec.ts`** - Comprehensive test suite

### Documentation
- **`docs/oracles/MULTI_CHAIN_ORACLES.md`** - Complete documentation

## 🌐 Supported Chains

1. **Ethereum Sepolia** (Chain ID: 11155111)
2. **Polygon Mumbai** (Chain ID: 80001)
3. **Solana Devnet** (Cluster: devnet)

## ⚡ Features

- ✅ **9-second pulse intervals** across all chains
- ✅ **94-repository fidelity tracking**
- ✅ **Chainlink Automation** for decentralized orchestration
- ✅ **HotStack Quantum Nodes v4** dashboard integration
- ✅ **Real-time consensus monitoring**
- ✅ **Multi-chain aggregation**

## 📊 Usage Example

```typescript
import { 
  MultiChainOracleAggregator,
  QuantumNodesDashboard 
} from './lib/oracles';

// Initialize aggregator
const aggregator = new MultiChainOracleAggregator(
  chains,
  9,  // pulse interval
  80, // fidelity threshold
  94  // max repositories
);

// Start monitoring
await aggregator.startPulseMonitoring((data) => {
  console.log('Pulse:', data);
});

// Use dashboard
<QuantumNodesDashboard refreshInterval={9000} />
```

## 🔗 Integration Points

- **Chainlink Automation**: Automated 9-second pulse triggers
- **HotStack v4**: Real-time dashboard visualization
- **94 Repositories**: Full ecosystem fidelity tracking
- **Multi-chain**: Ethereum, Polygon, and Solana support

## 📚 Documentation

See `docs/oracles/MULTI_CHAIN_ORACLES.md` for complete documentation.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run oracle tests only
npm test tests/multi-chain-oracle.spec.ts

# Watch mode
npm run test:watch
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run type checking
npx tsc --noEmit

# Deploy oracles
npm run deploy:oracles
```

## 📄 License

Proprietary - Fruitful Holdings (Pty) Ltd
