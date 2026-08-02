# Mechaura International — Production Deployment Guide

## Overview
Industrial equipment supplier website built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, and PostgreSQL (Prisma ORM).

## Quick Start

### Prerequisites
- Node.js 20+ / Bun 1.1+
- PostgreSQL 16+ (Neon, Supabase, or self-hosted)
- S3-compatible storage (R2, S3, MinIO) for production file uploads

### Local Development

```bash
# Clone and install
git clone <repo>
cd mechaura-international
bun install

# Environment setup
cp .env.example .env
# Edit .env with your credentials

# Database setup
bun run db:generate
bun run db:push
bun run db:seed

# Start development server
bun run dev
```

Visit http://localhost:3000

### Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

## Production Deployment

### Environment Variables (Required)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Pooled PostgreSQL connection string | Yes |
| `DIRECT_URL` | Direct PostgreSQL connection (for migrations) | Yes |
| `NEXTAUTH_URL` | Production URL (e.g., https://mechaurainternational.com) | Yes |
| `NEXTAUTH_SECRET` | 32+ char random string (`openssl rand -base64 32`) | Yes |
| `S3_BUCKET_NAME` | S3/R2 bucket for uploads | No (falls back to local) |
| `S3_ACCESS_KEY_ID` | S3 access key | No |
| `S3_SECRET_ACCESS_KEY` | S3 secret key | No |
| `S3_ENDPOINT` | S3 endpoint (e.g., https://account.r2.cloudflarestorage.com) | No |
| `S3_PUBLIC_URL` | Public CDN URL for bucket | No |

### Vercel Deployment (Recommended)

1. Connect repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy — Vercel auto-detects Next.js and configures builds

**Build Command:** `bun run build` (includes `prisma generate`)

### Docker Production

```bash
# Build image
docker build -t mechaura-international .

# Run container
docker run -d \
  --name mechaura \
  -p 3000:3000 \
  --env-file .env.production \
  mechaura-international
```

### Manual Server

```bash
# Build
bun run build

# Run migrations
bun run db:migrate:prod

# Start
bun run start
```

## Database Management

```bash
# Generate Prisma Client
bun run db:generate

# Push schema (dev)
bun run db:push

# Create migration
bun run db:migrate

# Deploy migrations (prod)
bun run db:migrate:prod

# Open Prisma Studio
bun run db:studio

# Reset database (dev only)
bun run db:reset
```

## Admin Panel

Access `/admin` with password (default: `Mechaura123` — change on first login).

**Features:**
- Products CRUD with image upload
- Services, Industries, Testimonials, Insights management
- Contact form inquiries with status tracking
- Company settings (social links, contact info, partner brands)

## File Uploads

- **Development:** Local filesystem (`public/images/products/`)
- **Production:** S3-compatible storage (R2, S3, MinIO)

Configure S3 environment variables for production uploads.

## Security Features

- Security headers (HSTS, CSP-ready, X-Frame-Options, etc.)
- API rate limiting (30 req/min per IP)
- Input validation with Zod
- SQL injection protection via Prisma
- Admin authentication required for mutations

## Performance

- Next.js 15 with Turbopack
- Static generation for marketing pages
- Image optimization (AVIF/WebP)
- Code splitting and lazy loading
- Bundle optimization with `optimizePackageImports`

## Monitoring

- Vercel Analytics (enable `NEXT_PUBLIC_VERCEL_ANALYTICS_ID`)
- Google Analytics (enable `NEXT_PUBLIC_GA_ID`)
- Sentry (enable `ENABLE_SENTRY=true` and add DSN)

## CI/CD

GitHub Actions workflow (`.github/workflows/ci-cd.yml`):
- Lint + TypeCheck
- Unit Tests
- Build verification
- Docker image build & push
- Preview deployments for PRs
- Production deployment on main branch merge

## Troubleshooting

### Database Connection Issues
```bash
# Check connection
bunx prisma db pull

# Reset and reseed
bun run db:reset
bun run db:seed
```

### Build Failures
```bash
# Clean install
rm -rf node_modules .next bun.lock
bun install
bun run build
```

### Image Upload Not Working
- Verify S3 credentials and bucket permissions
- Check bucket CORS policy allows your domain
- Ensure `S3_PUBLIC_URL` is accessible

## License
Proprietary — Mechaura International FZE LLC