# Dockerfile for OpenBudget Next.js App
# Multi-stage build for production optimization

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    linux-headers \
    eudev-dev \
    libusb-dev
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using npm install for better Docker compatibility)
RUN npm install --legacy-peer-deps --no-audit --prefer-offline

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Git info build arguments
ARG GIT_COMMIT_HASH=unknown
ARG GIT_BRANCH=unknown
ARG BUILD_TIME

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js app with git info
ENV NEXT_TELEMETRY_DISABLED 1
ENV GIT_COMMIT_HASH=${GIT_COMMIT_HASH}
ENV GIT_BRANCH=${GIT_BRANCH}
ENV BUILD_TIME=${BUILD_TIME}
RUN npm run build

# Stage 3: Runner (Production)
FROM node:20-alpine AS runner
WORKDIR /app

# Git info build arguments (need to redeclare in new stage)
ARG GIT_COMMIT_HASH=unknown
ARG GIT_BRANCH=unknown
ARG BUILD_TIME

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV GIT_COMMIT_HASH=${GIT_COMMIT_HASH}
ENV GIT_BRANCH=${GIT_BRANCH}
ENV BUILD_TIME=${BUILD_TIME}

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start application
CMD ["node", "server.js"]
