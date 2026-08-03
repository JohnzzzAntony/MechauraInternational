# Dockerfile for Mechaura International
# Multi-stage build for production optimization

# Base image
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
COPY package.json bun.lock* package-lock.json* ./
RUN bun install --frozen-lockfile || bun install

# Generate Prisma Client (no DB env vars needed - just code generation)
FROM deps AS prisma
COPY prisma ./prisma/
RUN bunx prisma generate

# Build the application
FROM base AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma /app/node_modules/@prisma ./node_modules/@prisma
COPY . .
RUN bunx next build

# Production runner image using Node 20
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install openssl for Prisma runtime engine
RUN apk add --no-cache openssl libc6-compat

# Copy built Next.js standalone application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Copy Prisma generated client engine binaries for runtime DB queries
COPY --from=prisma --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma --chown=node:node /app/node_modules/@prisma ./node_modules/@prisma

USER node

EXPOSE 3000

# Start the Next.js standalone server directly
CMD ["node", "server.js"]