# Dockerfile for Mechaura International
# Multi-stage build for production optimization

# Base image - use latest Bun 1.x for lockfile compatibility
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Generate Prisma Client (no DB connection needed - just code generation)
FROM deps AS prisma
COPY prisma ./prisma/
RUN bunx prisma generate
RUN bun add -g prisma

# Build the application (no DB env vars needed at build time)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production image
FROM oven/bun:1-alpine AS runner
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
COPY --from=prisma --chown=nextjs:bunjs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:bunjs /app/prisma ./prisma

# Copy prisma binary so db push works at runtime
COPY --from=prisma /usr/local/bin/prisma /usr/local/bin/prisma

USER nextjs

EXPOSE 3000

# Run db push at startup (has access to env vars), then start server.
# The db push is bounded by a timeout and its failure is ignored so that
# the server always starts and can respond to health checks, even if the
# database is unreachable or the push hangs/fails.
CMD ["sh", "-c", "timeout 30 bunx prisma db push --accept-data-loss --skip-generate || true; exec node server.js"]