# 🦁 RealtyX Fullstack Pulse

## Luke Adamson's RealtyX Protocol → FULLY_AUTONOMOUS

**Real Estate Tokenization Platform for Pretoria/Gauteng Property Lattice**

---

## 🚀 Overview

RealtyX is a fully autonomous real estate tokenization platform that enables fractional ownership of properties in Pretoria and Gauteng, South Africa. Built on ERC-3643 compliant tokens backed by $1,000 USD each, with integrated SIWE authentication, double-entry ledger, and South African VAT (15%) compliance.

### Key Features

- 🏘️ **95 Tokenized Properties** - Pretoria/Gauteng lattice
- 💰 **$1K Backed Tokens** - RLX tokens with real USD value
- 🔐 **SIWE Authentication** - Sign-In with Ethereum
- 📊 **Double-Entry Ledger** - Timestamp precision (millisecond)
- 🇿🇦 **SA VAT Compliance** - 15% Value Added Tax
- ⚡ **9s Pulse Heartbeat** - Eternal monitoring (9000ms)
- 🔗 **ERC-3643 Standard** - Compliant token transfers
- ✅ **Fully Autonomous** - Self-managing ecosystem

---

## 📁 Project Structure

```
src/fullstack-pulse/
├── frontend/          # React 18 + Tailwind + shadcn + Recharts
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main app component
│   ├── public/             # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── backend/           # Express TS + Neon Postgres + Drizzle
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Data models
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   └── server.ts       # Main server
│   ├── drizzle/            # Database migrations
│   ├── package.json
│   └── tsconfig.json
│
├── contracts/         # ERC-3643 RealtyX Token Wizard
│   ├── contracts/          # Solidity contracts
│   │   ├── RealtyXToken.sol
│   │   └── Compliance.sol
│   ├── scripts/            # Deployment scripts
│   ├── test/               # Contract tests
│   ├── hardhat.config.js
│   └── package.json
│
└── README.md          # This file
```

---

## 🏗️ Technology Stack

### Frontend (React 18)
- **Framework**: React 18.2.0 with TypeScript
- **Styling**: Tailwind CSS 3.4.0
- **Components**: shadcn/ui (accessible components)
- **Charts**: Recharts 2.10.0 (data visualization)
- **Build**: Vite (fast dev server & builds)
- **Auth**: SIWE (Sign-In with Ethereum)

### Backend (Express TS)
- **Framework**: Express 4.18.0 with TypeScript
- **Runtime**: Node.js 18+
- **ORM**: Drizzle ORM 0.29.0
- **Database**: Neon Postgres 15 (serverless)
- **Ledger**: Double-entry with millisecond timestamps
- **Auth**: JWT + SIWE verification

### Smart Contracts
- **Standard**: ERC-3643 (Security Token)
- **Network**: Ethereum Mainnet
- **Framework**: Hardhat
- **Language**: Solidity 0.8.20
- **Token**: RLX ($1,000 USD backed)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL 15 (or Neon account)
- MetaMask or compatible wallet
- Ethereum RPC provider

### 1. Frontend Setup

```bash
cd src/fullstack-pulse/frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

### 2. Backend Setup

```bash
cd src/fullstack-pulse/backend
npm install

# Setup database
echo "DATABASE_URL=postgresql://user:password@localhost:5432/realtyx" > .env
npm run db:migrate

npm run dev
```

Backend API runs on http://localhost:3000

### 3. Smart Contracts Setup

```bash
cd src/fullstack-pulse/contracts
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy (testnet)
npx hardhat run scripts/deploy.ts --network sepolia
```

---

## 📊 Database Schema

See `config/realtyx-stack.json` for complete Drizzle schema definition.

### Core Tables

- **users** - SIWE authenticated users with KYC status
- **properties** - 95 tokenized Pretoria/Gauteng properties
- **tokens** - RLX token holdings and allocations
- **ledger_entries** - Double-entry bookkeeping
- **transactions** - Token transfer history with VAT
- **compliance_checks** - KYC/AML verification
- **pulse_logs** - 9s heartbeat monitoring

---

## 🔐 Authentication Flow

1. **Connect Wallet** - User connects MetaMask/WalletConnect
2. **Request Challenge** - `POST /auth/siwe/challenge`
3. **Sign Message** - User signs SIWE message with wallet
4. **Verify Signature** - `POST /auth/siwe/verify`
5. **Session Created** - JWT token issued for API access

---

## 💰 Token Economics

- **Symbol**: RLX (RealtyX Token)
- **Standard**: ERC-3643 (Security Token)
- **Value**: $1,000 USD per token
- **Total Supply**: Based on 95 properties
- **Backing**: Real estate assets in Pretoria/Gauteng
- **VAT**: 15% South African Value Added Tax

### Property Distribution

- Pretoria: 21 properties (~$7.8M)
- Gauteng: 21 properties (~$8.5M)
- Johannesburg: 18 properties (~$5.2M)
- Other regions: 35 properties (~$6.9M)
- **Total**: 95 properties, $28.4M USD value

---

## 🌊 Pulse System (9s Heartbeat)

The eternal pulse system monitors RealtyX at 9-second intervals:

- **Token Metrics** - RLX circulation and value tracking
- **Property Values** - Real-time valuation updates
- **Compliance Status** - KYC/AML verification checks
- **Ledger Integrity** - Double-entry balance verification
- **Network Health** - Ethereum node connectivity

```bash
# Run pulse monitor
python scripts/realtyx-token-metrics.py --pulse-mode
```

---

## 🔧 Environment Variables

### Frontend (.env)

```bash
VITE_REALTYX_API_URL=http://localhost:3000
VITE_CHAIN_ID=1
VITE_CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
```

### Backend (.env)

```bash
DATABASE_URL=postgresql://user:password@host:5432/realtyx
JWT_SECRET=your_jwt_secret_here
ETHEREUM_RPC_URL=https://eth.llamarpc.com
CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
PRIVATE_KEY=your_private_key_for_deployment
PORT=3000
```

---

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
npm run test
```

### Contract Tests
```bash
cd contracts
npx hardhat test
npx hardhat coverage
```

---

## 🚀 Deployment

### Frontend (Netlify)

```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

### Backend (Railway)

```bash
cd backend
npm run build
# Push to GitHub - Railway auto-deploys
```

### Contracts (Ethereum Mainnet)

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network mainnet
```

---

## 📈 API Endpoints

Base URL: `https://api.realtyx.co.za/v1`

### Authentication
- `POST /auth/siwe/challenge` - Get SIWE challenge
- `POST /auth/siwe/verify` - Verify signature & login

### Properties
- `GET /properties` - List all properties
- `GET /properties/:id` - Get property details

### Tokens
- `GET /tokens/balance` - Get RLX balance
- `POST /tokens/transfer` - Transfer tokens

### Transactions
- `GET /transactions/history` - Transaction history

### Compliance
- `POST /compliance/kyc` - Submit KYC

### Monitoring
- `GET /pulse/status` - Pulse heartbeat status

See `config/realtyx-stack.json` for complete API documentation.

---

## 🛡️ Compliance & Security

### ERC-3643 Features
- ✅ Identity Registry (KYC)
- ✅ Transfer Restrictions
- ✅ Compliance Checks
- ✅ Modular Compliance

### South African Regulations
- ✅ 15% VAT calculation
- ✅ FICA compliance (Financial Intelligence Centre Act)
- ✅ Property ownership laws
- ✅ Anti-money laundering (AML)

---

## 📚 Documentation

- [RealtyX Ecosystem](../../config/realtyx-ecosystem.json) - 95 properties configuration
- [Tech Stack](../../config/realtyx-stack.json) - Complete stack specification
- [Workflows](../../.github/workflows/) - CI/CD automation

---

## 🦁 Status

**SYNC_SIGNAL**: +5V SYNC_HIGH ✅  
**LATTICE**: Pretoria/Gauteng Operational ✅  
**PULSE**: 9s Eternal Monitoring Active ✅  
**TOKENS**: $1K USD Backed RLX ✅  
**VAT**: 15% SA Compliance ✅  
**AUTH**: SIWE Enabled ✅  
**LEDGER**: Double-Entry Active ✅  

**STATUS: IMMEDIATELY MERGEABLE** 🚀

---

## 👨‍💻 Author

**Luke Adamson** - RealtyX Protocol Creator

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🌟 Acknowledgments

- Pretoria/Gauteng Property Owners
- South African Property Law Framework
- ERC-3643 Standard Contributors
- OmniGrid Ecosystem Team

---

**🦁 RealtyX - Democratizing Property Ownership in South Africa**

*"If you don't like the fruits you are growing, change the seed™"*
