FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy monorepo files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy app files
COPY apps/bushportal-signup ./apps/bushportal-signup

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build frontend
WORKDIR /app/apps/bushportal-signup/frontend
RUN pnpm build

# Set backend as working directory
WORKDIR /app/apps/bushportal-signup/backend

# Expose ports
EXPOSE 3000 5173

# Start both services
CMD ["sh", "-c", "pnpm --filter @bushportal/signup-backend dev & pnpm --filter @bushportal/signup-frontend preview --host 0.0.0.0"]
