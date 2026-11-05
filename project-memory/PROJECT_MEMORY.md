# MiKing's Cameras — Project Memory

**Last Updated:** October 31, 2026  
**Project:** MiKing's Cameras E-Commerce Platform  
**Version:** 0.1.0 (Phase 1 — Discovery & Architecture)

---

## 1. Project Objectives

Build a complete, production-ready, premium e-commerce platform for MiKing's Cameras featuring:
- Customer-facing storefront with premium UI/UX
- Comprehensive administration dashboard
- Inventory management system
- POS (Point of Sale) system
- Payment gateway integration (Razorpay, Cashfree)
- Shipping integration (Shiprocket, Delhivery, Blue Dart)
- GST-compliant invoicing
- Dynamic CMS
- Social commerce integration (Meta)
- PWA with mobile app-like experience

---

## 2. Business Requirements

| Requirement | Status |
|------------|--------|
| Product catalog with variants | Planned |
| Multi-payment gateway | Planned |
| Indian shipping providers | Planned |
| GST invoicing | Planned |
| POS for physical store | Planned |
| Inventory sync (online + offline) | Planned |
| RBAC for team access | Planned |
| CMS for all content | Planned |
| Mobile-first responsive | Planned |
| PWA | Planned |
| SEO optimization | Planned |
| Social commerce (Meta) | Planned |
| WhatsApp integration | Planned |
| Customer accounts | Planned |
| Advanced search | Planned |

---

## 3. Brand Guidelines

### Logo
- File: `/public/images/logo.png`
- Camera icon with orange (#F5821F) lens element
- "MI King's" text in dark gray/black
- "Camera's" in orange rounded badge

### Color Palette
| Name | Hex | CSS Variable |
|------|-----|-------------|
| Deep Black | #1A1A1A | `--color-black` |
| Charcoal | #2D2D2D | `--color-charcoal` |
| Dark Gray | #404040 | `--color-gray-dark` |
| Medium Gray | #6B6B6B | `--color-gray` |
| Light Gray | #F5F5F5 | `--color-gray-light` |
| White | #FFFFFF | `--color-white` |
| Orange (Primary) | #F5821F | `--color-orange` |
| Orange Hover | #E0741A | `--color-orange-hover` |
| Orange Light | #FFF3E8 | `--color-orange-light` |
| Success | #22C55E | `--color-success` |
| Warning | #EAB308 | `--color-warning` |
| Error | #EF4444 | `--color-error` |
| Info | #3B82F6 | `--color-info` |

### Typography
- Headings: Inter (or similar premium sans-serif)
- Body: Inter
- Monospace: JetBrains Mono (for specs, codes)

---

## 4. Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 14+ (App Router) | SSR, SSG, API routes, TypeScript-first |
| UI Library | shadcn/ui + Tailwind CSS | Premium components, full customization |
| Database | PostgreSQL via Supabase | Managed, scalable, auth built-in |
| ORM | Prisma | Type-safe, migrations, introspection |
| Auth | Supabase Auth + custom RBAC | Secure, MFA support, session management |
| State Management | Zustand + TanStack Query | Lightweight, server state caching |
| Animations | Framer Motion + GSAP + Three.js | Premium micro-animations & 3D |
| Forms | React Hook Form + Zod | Validation, performance |
| Payments | Razorpay + Cashfree (modular) | Indian market standard |
| Shipping | Shiprocket + Delhivery (modular) | Indian logistics standard |
| File Storage | Supabase Storage | Integrated, CDN-ready |
| Caching | Redis (Upstash) | Rate limiting, session cache |
| Deployment | Vercel (frontend) + Supabase (backend) | Optimized for Next.js |
| Testing | Vitest + Playwright | Unit + E2E testing |
| CI/CD | GitHub Actions | Automated testing, deployment |

---

## 5. Database Schema

See: `/project-memory/DATABASE_SCHEMA.md` (separate document)

---

## 6. API Structure

### Public APIs (No Auth)
- `GET /api/products` — Product listing
- `GET /api/products/[slug]` — Product detail
- `GET /api/categories` — Category listing
- `GET /api/brands` — Brand listing
- `GET /api/search` — Product search
- `GET /api/banners` — Homepage banners
- `GET /api/cms/[page]` — CMS page content
- `GET /api/blog` — Blog posts

### Customer APIs (Auth Required)
- `POST /api/auth/register` — Registration
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/account/profile` — Profile
- `PUT /api/account/profile` — Update profile
- `GET /api/account/orders` — Order history
- `GET /api/account/orders/[id]` — Order detail
- `POST /api/cart` — Cart operations
- `POST /api/checkout` — Checkout
- `POST /api/payments/create` — Create payment
- `POST /api/payments/verify` — Verify payment
- `POST /api/wishlist` — Wishlist operations
- `POST /api/reviews` — Submit review
- `POST /api/addresses` — Address management
- `POST /api/returns` — Return request

### Admin APIs (Auth + RBAC)
- `/api/admin/dashboard` — Dashboard stats
- `/api/admin/products` — Product CRUD
- `/api/admin/categories` — Category CRUD
- `/api/admin/brands` — Brand CRUD
- `/api/admin/orders` — Order management
- `/api/admin/customers` — Customer management
- `/api/admin/inventory` — Inventory management
- `/api/admin/shipping` — Shipping management
- `/api/admin/payments` — Payment management
- `/api/admin/coupons` — Coupon management
- `/api/admin/cms` — CMS management
- `/api/admin/settings` — System settings
- `/api/admin/users` — Team management
- `/api/admin/roles` — Role management
- `/api/admin/invoices` — Invoice management
- `/api/admin/pos` — POS management
- `/api/admin/reports` — Reports
- `/api/admin/audit` — Audit logs
- `/api/admin/integrations` — Integration settings

### Webhook APIs
- `POST /api/webhooks/razorpay` — Razorpay webhooks
- `POST /api/webhooks/cashfree` — Cashfree webhooks
- `POST /api/webhooks/shiprocket` — Shiprocket webhooks

---

## 7. Completed Modules

| Module | Status | Date |
|--------|--------|------|
| Project Memory | ✅ Complete | Oct 31, 2026 |
| Website Audit | ✅ Complete | Oct 31, 2026 |
| Architecture Plan | ✅ Complete | Oct 31, 2026 |
| Database Schema | 🔄 In Progress | — |

---

## 8. Pending Modules

| Module | Priority | Phase |
|--------|----------|-------|
| Database Schema Design | P0 | Phase 1 |
| Project Setup (Next.js) | P0 | Phase 2 |
| Design System | P0 | Phase 2 |
| Homepage | P0 | Phase 2 |
| Navigation | P0 | Phase 2 |
| Authentication | P0 | Phase 3 |
| Product Catalog | P0 | Phase 4 |
| Shopping Cart | P0 | Phase 4 |
| Checkout | P0 | Phase 4 |
| Payment Integration | P0 | Phase 5 |
| Shipping Integration | P0 | Phase 5 |
| Admin Dashboard | P1 | Phase 6 |
| Inventory Management | P1 | Phase 6 |
| POS System | P1 | Phase 6 |
| Invoice System | P1 | Phase 6 |
| CMS | P1 | Phase 7 |
| SEO | P1 | Phase 8 |
| Testing | P0 | Phase 9 |
| Deployment | P0 | Phase 10 |

---

## 9. Known Issues

None yet (project initialization phase).

---

## 10. Deployment Configuration

### Environment Variables Required
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=
DIRECT_URL=

# Redis
REDIS_URL=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Cashfree
CASHFREE_APP_ID=
CASHFREE_SECRET_KEY=
CASHFREE_WEBHOOK_SECRET=

# Shiprocket
SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=
SHIPROCKET_API_TOKEN=

# Meta / Facebook
META_PIXEL_ID=
META_ACCESS_TOKEN=
META_CATALOG_ID=

# WhatsApp
WHATSAPP_BUSINESS_NUMBER=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=MiKing's Cameras
```

---

## 11. Important Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Oct 31, 2026 | Next.js App Router (not Pages) | Modern routing, server components, streaming |
| Oct 31, 2026 | Supabase for DB + Auth | Managed PostgreSQL, built-in auth with MFA |
| Oct 31, 2026 | Prisma ORM | Type safety, migration management |
| Oct 31, 2026 | shadcn/ui over Material UI | Full customization, smaller bundle |
| Oct 31, 2026 | Modular payment architecture | Easy to add/swap payment providers |
| Oct 31, 2026 | Modular shipping architecture | Easy to add/swap shipping providers |
| Oct 31, 2026 | Zustand over Redux | Simpler, less boilerplate |
| Oct 31, 2026 | Soft deletion for business records | Audit trail, data recovery |
