# RealtyX Smart Contracts

ERC-3643 Security Token Implementation

## Features

- 🪙 ERC-3643 compliant token (RLX)
- 💰 $1,000 USD backing per token
- 🔐 Identity registry & KYC
- 🛡️ Transfer restrictions & compliance
- 🏘️ 95 properties tokenization
- 🇿🇦 South African regulatory compliance

## Stack

- Solidity 0.8.20
- Hardhat 2.19
- OpenZeppelin Contracts 5.0
- T-REX (ERC-3643) 4.1
- ethers.js 6.9

## Contracts

- `RealtyXToken.sol` - Main ERC-3643 token
- `RealtyXCompliance.sol` - Compliance module
- `PropertyRegistry.sol` - Property management
- `IdentityRegistry.sol` - KYC/Identity
- `ClaimTopicsRegistry.sol` - Claims management

## Getting Started

```bash
npm install

# Compile contracts
npm run compile

# Run tests
npm run test

# Coverage report
npm run coverage
```

## Environment Variables

Create `.env` file:

```
PRIVATE_KEY=your_private_key_here
ETHEREUM_RPC_URL=https://eth.llamarpc.com
SEPOLIA_RPC_URL=https://rpc.sepolia.org
ETHERSCAN_API_KEY=your_etherscan_api_key
COINMARKETCAP_API_KEY=your_cmc_api_key
REPORT_GAS=true
```

## Deploy

### Testnet (Sepolia)

```bash
npm run deploy:testnet
```

### Mainnet

```bash
npm run deploy:mainnet
```

## Verify

```bash
npx hardhat verify --network mainnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Token Details

- **Name**: RealtyX Token
- **Symbol**: RLX
- **Standard**: ERC-3643
- **Decimals**: 18
- **Value**: $1,000 USD per token
- **Network**: Ethereum Mainnet
- **Total Supply**: Dynamic (based on properties)

## Compliance

- ✅ ERC-3643 Security Token
- ✅ Identity Registry (KYC)
- ✅ Transfer Restrictions
- ✅ Modular Compliance
- ✅ Claim-based verification
- ✅ South African property law

## Testing

```bash
npm test
```

Tests cover:
- Token deployment
- ERC-3643 compliance
- Transfer restrictions
- KYC verification
- Property tokenization
- Compliance modules

## Security

- OpenZeppelin audited contracts
- T-REX framework (ERC-3643)
- Comprehensive test coverage
- Gas optimization
- Access control

## Status

🦁 RealtyX Contracts - SYNC_HIGH ✅  
💰 $1K USD Backed Tokens ✅  
🔐 ERC-3643 Compliant ✅
