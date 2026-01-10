# RealtyX Backend

Express TypeScript + Neon Postgres + Drizzle ORM

## Features

- 🔐 SIWE authentication & JWT
- 📊 Double-entry ledger with millisecond timestamps
- 🏘️ 95 properties management
- 💰 RLX token tracking
- 🇿🇦 SA VAT (15%) calculation
- ⚡ RESTful API
- 🌊 9s pulse monitoring

## Stack

- Express 4.18
- TypeScript 5.3
- Drizzle ORM 0.29
- Neon Postgres (serverless)
- JWT authentication

## Getting Started

```bash
npm install

# Setup environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run migrations
npm run db:migrate

# Start dev server
npm run dev
```

API runs on http://localhost:3000

## Environment Variables

Create `.env` file:

```
DATABASE_URL=postgresql://user:password@host:5432/realtyx
JWT_SECRET=your_jwt_secret_here
ETHEREUM_RPC_URL=https://eth.llamarpc.com
CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
PRIVATE_KEY=your_private_key
PORT=3000
NODE_ENV=development
```

## Database Schema

See `../../config/realtyx-stack.json` for complete schema.

Tables:
- users (SIWE auth)
- properties (95 tokenized)
- tokens (RLX holdings)
- ledger_entries (double-entry)
- transactions (with VAT)
- compliance_checks (KYC)
- pulse_logs (9s heartbeat)

## API Routes

- `POST /api/auth/siwe/challenge` - Get SIWE challenge
- `POST /api/auth/siwe/verify` - Verify & login
- `GET /api/properties` - List properties
- `GET /api/tokens/balance` - Get balance
- `POST /api/tokens/transfer` - Transfer tokens
- `GET /api/pulse/status` - Pulse status

## Build

```bash
npm run build
npm start
```

## Status

🦁 RealtyX Backend - SYNC_HIGH ✅
