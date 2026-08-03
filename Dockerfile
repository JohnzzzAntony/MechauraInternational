# Dockerfile for Mechaura International
# Multi-stage build for production optimization

# Base image
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Generate Prisma Client (no DB env vars needed - just code generation)
FROM deps AS prisma
COPY prisma ./prisma/
RUN bunx prisma generate

# Build the application
# Copy pre-generated Prisma client from the prisma stage so the build
# has access to the generated types without needing a DB connection.
FROM base AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY --from=deps /app/node_modules ./node_modules
# Overlay the generated prisma client on top of node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma /app/node_modules/@prisma ./node_modules/@prisma
COPY . .
# Run next build only — prisma generate was already done above
RUN bunx next build

# Production image
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install openssl for Prisma runtime
RUN apk add --no-cache openssl

# Create non-root user
RUN addgroup --system --gid 1001 bunjs \
    && adduser --system --uid 1001 nextjs

# Copy built Next.js standalone app
# Note: .next/standalone/ already contains server.js at its root
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:bunjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:bunjs /app/.next/static ./.next/static

# Copy Prisma generated client
COPY --from=prisma --chown=nextjs:bunjs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma --chown=nextjs:bunjs /app/node_modules/@prisma ./node_modules/@prisma

# Copy the full prisma package (includes build/index.js + ALL .wasm files)
# Do NOT copy only .bin/prisma — it looks for .wasm files relative to build/index.js
COPY --from=deps --chown=nextjs:bunjs /app/node_modules/prisma ./node_modules/prisma

# Copy prisma schema (needed for db push)
COPY --from=builder --chown=nextjs:bunjs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

# Run db push at startup via node (resolves wasm from node_modules/prisma/build/)
# Use || true so server always starts even if db push fails
# server.js is the standalone Next.js server created by `next build --output standalone`
CMD ["sh", "-c", "timeout 30 node node_modules/prisma/build/index.js db push --accept-data-loss --skip-generate || true; exec node server.js"]