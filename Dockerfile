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
# .next/standalone/ contains server.js at its root — run with `node server.js`
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:bunjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:bunjs /app/.next/static ./.next/static

# Copy Prisma generated client (needed at runtime for DB queries)
COPY --from=prisma --chown=nextjs:bunjs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma --chown=nextjs:bunjs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

# Start the Next.js standalone server directly.
# Schema is already in sync — prisma db push should be run as a one-off
# deploy step, not on every container start.
CMD ["node", "server.js"]