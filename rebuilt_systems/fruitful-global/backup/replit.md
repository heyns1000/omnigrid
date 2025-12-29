# Fruitful Global™ Multi-Brand Orchestration Platform

## Overview

This is a full-stack web application built for managing multiple brands (Seedwave™, VaultMesh™, Banimal™, and Fruitful Global™) across different sectors with unified templates, analytics, and deployment control. The system serves as a centralized orchestration platform enabling scalable deployment across 29+ sectors.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for multi-theme support
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Chart.js for analytics visualization and interactive maps with Leaflet

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple

### Key Components

#### Multi-Brand System
The application manages four primary brands:
- **Seedwave™**: Analytics and global hub functionality
- **VaultMesh™**: Checkout systems and payment processing
- **Banimal™**: Interactive features and engagement tools
- **Fruitful Global™**: Core platform and orchestration

#### Template System
- **Template Types**: Header/Navigation, Footer/Legal, Checkout/Payment, Payment Hub, Sector Index/Dashboard, Interactive Features
- **Version Control**: Template versioning with activation/deactivation controls
- **Multi-Brand Deployment**: Templates can be deployed across different brands and sectors

#### Theme System
The application supports three distinct themes:
- **Light Mode**: Clean, minimal design with light backgrounds
- **Dark Mode**: Professional dark theme for reduced eye strain
- **Hyper Mode**: High-contrast theme with vibrant colors for enhanced visibility

## Data Flow

1. **Client Requests**: React frontend makes API calls through TanStack Query
2. **Server Processing**: Express.js server handles requests with TypeScript validation
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions with type safety
4. **Response Handling**: JSON responses with proper error handling and logging
5. **Real-time Updates**: Query invalidation ensures fresh data across components

## External Dependencies

### Payment Integration
- **PayPal SDK**: Complete payment processing with order creation and capture
- **Client Integration**: PayPal buttons with hosted components
- **Server Integration**: PayPal server SDK for secure transaction handling

### Maps and Visualization
- **Leaflet**: Interactive maps for global deployment visualization
- **OpenStreetMap**: Tile provider for map data
- **Chart.js**: Analytics charts and data visualization

### Development Tools
- **Replit Integration**: Development environment with hot reload and error handling
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast bundling for production builds

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for rapid development
- **Express Middleware**: Development server integration
- **Database Migrations**: Drizzle migrations with push commands

### Production Build
1. **Frontend Build**: Vite builds optimized React application to `dist/public`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Static Assets**: Served through Express static middleware
4. **Database**: Neon Database provides serverless PostgreSQL hosting

### Environment Configuration
- **Development**: `NODE_ENV=development` with TypeScript execution via tsx
- **Production**: `NODE_ENV=production` with compiled JavaScript execution
- **Database**: `DATABASE_URL` required for Neon Database connection
- **PayPal**: `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` for payment processing

### Key Features
- **Multi-brand management** with unified analytics across Seedwave™, VaultMesh™, Banimal™, and SecureSign™
- **Template orchestration** across 6 categories with authentic HTML templates from user planning sessions
- **Deployment control** with status monitoring and real-time updates
- **Global analytics** with Chart.js and OpenStreetMap (Leaflet.js) integration
- **Payment processing** through PayPal SDK integration with complete checkout workflows
- **SecureSign™ NDA Portal** with FAA™ Atom-Level Verification™ Protocol
- **Advanced Sector Index Dashboard** with global deployment visualization
- **Responsive design** with mobile-first approach and dark/light theme support
- **Type-safe development** with full TypeScript coverage

### Recent Updates (January 28, 2025)
- **Template Integration**: Successfully embedded 11 authentic HTML templates from user's planning phase
- **Global Synergy Hub**: Added comprehensive multi-brand dashboard with Seedwave™, VaultMesh™, and Banimal™ integration
- **Enhanced Banimal Footer**: Integrated premium footer with global impact messaging and Fruitful™ Treaty System integration
- **Advanced Dashboard**: Added comprehensive Sector Index with OpenStreetMap and Chart.js integration
- **SecureSign Portal**: Integrated complete NDA submission system with form validation
- **Enhanced VaultMesh Checkout**: Added advanced Banimal Loop checkout with Hyper Mode theming, multi-theme toggle (Light/Dark/Hyper), and complete payment processing
- **Seedwave Admin**: Included PayPal SDK and Google Maps functionality
- **Advanced Features Implementation**: Added all screenshot features including A/B testing, real-time collaboration, AI optimization, live preview, deployment wizard, recommendation engine, micro-animations, and accessibility scoring
- **Multi-Theme System**: Implemented comprehensive theming across all templates with CSS custom properties
- **Real-time Analytics**: Enhanced dashboard with interactive charts and global visualizations