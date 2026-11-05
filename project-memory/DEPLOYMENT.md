# MiKing's Cameras — Deployment Guide

**Last Updated:** October 31, 2026  
**Status:** Template (Pre-Implementation)

---

## 1. Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│   Vercel        │────▶│   Supabase       │────▶│   Upstash       │
│   (Next.js)     │     │   (PostgreSQL +  │     │   (Redis)       │
│                 │     │    Auth + Storage)│     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │
        │                        │
        ▼                        ▼
┌─────────────────┐     ┌──────────────────┐
│   CDN           │     │   Object Storage │
│   (Vercel Edge) │     │   (Supabase)     │
└─────────────────┘     └──────────────────┘
```

---

## 2. Hosting Requirements

### Frontend (Vercel)
- **Plan:** Pro recommended for production
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Node Version:** 20.x
- **Framework:** Next.js

### Database (Supabase)
- **Plan:** Pro recommended for production
- **Region:** ap-south-1 (Mumbai) for Indian market
- **Database:** PostgreSQL 15+
- **Auth:** Supabase Auth with email, phone, social providers
- **Storage:** Supabase Storage for product images, invoices

### Cache (Upstash Redis)
- **Plan:** Pay-as-you-go
- **Region:** ap-south-1 (Mumbai)
- **Use:** Rate limiting, session cache, background jobs

---

## 3. Environment Variables

### Required (Production)

```env
# Application
NEXT_PUBLIC_APP_URL=https://mikcameras.in
NEXT_PUBLIC_APP_NAME=MiKing's Cameras
NODE_ENV=production

# Supabase
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>

# Database
DATABASE_URL=<postgres-connection-string-pooled>
DIRECT_URL=<postgres-connection-string-direct>

# Redis
REDIS_URL=<upstash-redis-url>
REDIS_TOKEN=<upstash-redis-token>

# Razorpay
RAZORPAY_KEY_ID=<razorpay-key-id>
RAZORPAY_KEY_SECRET=<razorpay-key-secret>
RAZORPAY_WEBHOOK_SECRET=<razorpay-webhook-secret>

# Cashfree
CASHFREE_APP_ID=<cashfree-app-id>
CASHFREE_SECRET_KEY=<cashfree-secret-key>
CASHFREE_WEBHOOK_SECRET=<cashfree-webhook-secret>
CASHFREE_ENV=PRODUCTION

# Shiprocket
SHIPROCKET_EMAIL=<shiprocket-email>
SHIPROCKET_PASSWORD=<shiprocket-password>

# Meta (Facebook/Instagram)
NEXT_PUBLIC_META_PIXEL_ID=<meta-pixel-id>
META_ACCESS_TOKEN=<meta-access-token>
META_CATALOG_ID=<meta-catalog-id>

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=<whatsapp-number>

# Email (SMTP or Resend)
SMTP_HOST=<smtp-host>
SMTP_PORT=<smtp-port>
SMTP_USER=<smtp-user>
SMTP_PASS=<smtp-password>

# Security
WEBHOOK_TOLERANCE_SECONDS=300
RATE_LIMIT_MAX=100
```

### Development Only
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Database Migrations

### Initial Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data (roles, permissions, admin user)
npx prisma db seed
```

### Migration Process
1. Create migration: `npx prisma migrate dev --name <description>`
2. Review generated SQL
3. Test on staging
4. Deploy to production: `npx prisma migrate deploy`

---

## 5. Build & Deploy

### Local Development
```bash
npm install
npx prisma generate
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Set build command: `npx prisma generate && npm run build`
4. Set Node.js version: 20.x
5. Deploy

---

## 6. Domain Configuration

### DNS Setup
1. Add CNAME record: `www` → `cname.vercel-dns.com`
2. Add A record: `@` → Vercel IP
3. Enable SSL (automatic via Vercel)

### Domain Verification
- Google Search Console
- Bing Webmaster Tools

---

## 7. Monitoring & Alerting

### Recommended Services
- **Error Tracking:** Sentry
- **Performance:** Vercel Analytics + Lighthouse CI
- **Uptime:** Vercel or BetterUptime
- **Database:** Supabase Dashboard
- **Logs:** Vercel Logs

### Health Checks
- `GET /api/health` — Application health
- Database connectivity
- Redis connectivity
- Storage accessibility

---

## 8. Backup Strategy

### Database
- Supabase automatic daily backups (Pro plan)
- Point-in-time recovery (Pro plan)
- Manual backup before major migrations

### Files
- Supabase Storage (redundant)
- Periodic export of critical data

### Configuration
- All config in version control (git)
- Environment variables in Vercel dashboard
- Secrets rotated quarterly

---

## 9. Rollback Procedure

1. Identify the issue
2. Revert to previous Vercel deployment (instant)
3. If database migration caused the issue:
   - Assess data impact
   - Create rollback migration
   - Test on staging
   - Deploy rollback
4. Document the incident

---

## 10. Pre-Launch Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Seed data (roles, permissions, admin) applied
- [ ] SSL certificate active
- [ ] Domain DNS configured
- [ ] Payment gateways in production mode
- [ ] Shipping provider configured
- [ ] Email delivery tested
- [ ] WhatsApp number configured
- [ ] Meta Pixel configured
- [ ] Google Analytics configured
- [ ] Search Console verified
- [ ] Sitemap accessible
- [ ] Robots.txt verified
- [ ] Error tracking configured
- [ ] Backup strategy verified
- [ ] Admin account created
- [ ] Security headers verified
- [ ] Rate limiting active
- [ ] Smoke tests passed
