# Phase 37 Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ 
- Ethereum wallet with Sepolia ETH
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/heyns1000/omnigrid.git
cd omnigrid

# Install dependencies
npm install

# Copy environment template
cp .env.phase37.example .env

# Edit .env with your credentials
nano .env
```

### Configuration

Add to `.env`:
```bash
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key  # Optional
```

### Deploy Contract

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia
npm run deploy:oracle

# Verify on Etherscan (optional)
npm run verify:oracle -- <CONTRACT_ADDRESS> "0x694AA1769357215DE4FAC081bf1f309aDC325306"
```

### Run Integration Example

```bash
# Set contract address from deployment
export ORACLE_CONTRACT_ADDRESS="0x..."

# Run the example
npm run integration:phase37
```

## 📚 Key Commands

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile Solidity contracts |
| `npm run test:contracts` | Run contract tests |
| `npm run deploy:oracle` | Deploy to Sepolia testnet |
| `npm run integration:phase37` | Run integration example |

## 🔑 Key Concepts

### 1. Proof Submission
```typescript
const proofId = await client.submitFidelityProof(
  tensorHash,    // Hash of quantum tensor state
  96.5,          // Fidelity score (%)
  signature      // Cryptographic signature
);
```

### 2. Chainlink Metrics
```typescript
const metrics = await client.getChainlinkMetrics();
console.log(`ETH Price: ${Number(metrics.price) / 1e8} USD`);
```

### 3. Dashboard Syncing
```typescript
const hook = createHotStackV3Hook(client, config);
hook.initialize();
hook.startSync(9000);  // 9-second pulse
```

## 📖 Documentation

- **Full Guide**: [PHASE_37_IMPLEMENTATION.md](../docs/PHASE_37_IMPLEMENTATION.md)
- **Contract Details**: [contracts/README.md](../contracts/README.md)
- **API Reference**: See documentation files

## 🆘 Troubleshooting

**"Cannot download compiler"**
- Requires internet access to download Solidity compiler
- Compiled artifacts may be cached after first successful compile

**"Insufficient funds"**
- Get Sepolia ETH from faucet: https://sepoliafaucet.com/

**"Transaction reverted"**
- Check fidelity score is >= 95%
- Ensure you're an authorized verifier
- Verify contract is not paused

## 🔗 Resources

- [Chainlink Sepolia Feeds](https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1)
- [Sepolia Block Explorer](https://sepolia.etherscan.io/)
- [Hardhat Documentation](https://hardhat.org/docs)

---

**Next Steps**: See [PHASE_37_IMPLEMENTATION.md](../docs/PHASE_37_IMPLEMENTATION.md) for detailed integration patterns.
