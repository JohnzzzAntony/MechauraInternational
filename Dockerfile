# Dockerfile for Mechaura International
# Multi-stage build for production optimization

# Base image
FROM oven/bun:1.1-alpine AS base
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Generate Prisma Client
FROM deps AS prisma
COPY prisma ./prisma/
RUN bunx prisma generate

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production image
FROM oven/bun:1.1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 bunjs \
    && adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:bunjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:bunjs /app/.next/static ./.next/static
COPY --from=prisma --chown=nextjs:bunjs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:bunjs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["bun", "server.js"]