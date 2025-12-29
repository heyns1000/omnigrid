# BushPortal™ Signup Application

A complete fullstack signup and authentication experience for the BushPortal™ digital tree house network, seamlessly integrated into the CodeNest monorepo.

## 📁 Structure

```
bushportal-signup/
├── frontend/          # React + Vite frontend application
├── backend/           # Express.js backend API
└── shared/            # Shared types and utilities
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+

### Installation

From the codenest root:

```bash
pnpm install
```

### Development

#### Frontend (Terminal 1)
```bash
cd apps/bushportal-signup/frontend
pnpm dev
```
Frontend runs on `http://localhost:5173`

#### Backend (Terminal 2)
```bash
cd apps/bushportal-signup/backend
pnpm dev
```
Backend runs on `http://localhost:3000`

### Build

```bash
# Build all packages
pnpm build

# Or individual packages
cd apps/bushportal-signup/frontend && pnpm build
cd apps/bushportal-signup/backend && pnpm build
```

## 📋 Features

### Frontend
- **Login Page**: User authentication with email/password
- **Registration Page**: New user onboarding with validation
- **Dashboard**: Post-login user welcome experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode Support**: System theme detection and toggle
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client-side validation with feedback

### Backend
- **User Registration**: Create new accounts with secure password hashing
- **User Login**: JWT-based authentication
- **User Retrieval**: Get current user information
- **Session Management**: Secure HTTP-only cookie handling
- **Error Handling**: Standardized error responses
- **CORS Support**: Configured for frontend communication

### Shared
- TypeScript interfaces for type safety
- Request/Response types
- User model definition

## 🔐 Security Features

- **Password Hashing**: bcryptjs with 10 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **HTTP-only Cookies**: XSS protection
- **CORS**: Restricted to frontend origin
- **Input Validation**: Server-side validation
- **Error Messages**: Non-sensitive error responses

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: CSS class-based dark mode
- **Components**: Reusable UI component library

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm run test:watch
```

## 🌍 Global Integration

This application is designed to work globally within the CodeNest ecosystem:

- Accessible via `https://signup.bushportal.global` (when deployed)
- Integrated with CodeNest auth infrastructure
- Part of the 149-brand FAA™ ecosystem
- Multi-language support ready (i18n framework included)

## 📦 Dependencies

### Frontend
- React 18.3.1
- Vite 5.4.11
- TanStack Query (React Query)
- Wouter (routing)
- Lucide React (icons)
- Tailwind CSS 3.4.1

### Backend
- Express.js 4.18.2
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- CORS (cross-origin support)

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Frontend
cd frontend
vercel deploy

# Backend
cd backend
vercel --prod
```

### Docker

```bash
docker build -t bushportal-signup .
docker run -p 3000:3000 -p 5173:5173 bushportal-signup
```

## 📚 API Endpoints

### Authentication Routes

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user

## 🔧 Configuration

### Environment Variables

Backend (`.env`):
```
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-secret-key-here
```

Frontend (`.env`):
```
VITE_API_URL=http://localhost:3000
```

## 👥 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

PROPRIETARY - CodeNest™ & BushPortal™

## 🤝 Support

For support, contact: support@bushportal.global

---

**Built with ❤️ for the BushPortal™ Global Community**
