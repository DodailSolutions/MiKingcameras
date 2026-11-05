# Mi King's Cameras — Next.js Enterprise E-Commerce Platform

> Premium E-Commerce Storefront & Headless Admin CMS for **Mi King's DSLR Camera Shop** (Pillar 103, Bank Colony, Near Tadbun, Mir Alam Tank, Hyderabad, Telangana 500064).  
> **Official Store Hotline:** +91 90322 85420 | **WhatsApp Support:** +91 63058 75376

---

## 🌟 Highlights & Key Features

### 🛒 High-Performance Storefront
- **Zero-Flicker Next.js 16 App Router & SSG:** 178+ static pages generated at build time for sub-100ms load times and top SEO scores.
- **Staggered Independent Auto-Scroll Carousels:** Dedicated carousels for *Featured Products*, *Camera Bodies & Kits*, and *Premium Lenses & Optics* with non-interfering staggered animation delays, touch/hover pause, and infinite loop.
- **Strict Category Isolation:** Guaranteed zero crossover—camera bodies never leak into lens carousels, and lenses never appear in body sections.
- **Uniform Airbnb-Style Product Cards:** Standardized card bounds (`min-h-[385px]`, `h-[210px]` photo containers) with pure clean backgrounds (`bg-white` / `bg-[#12110f]`) eliminating artificial gray photo borders.
- **Out-of-Stock Purchasing Restrictions:** Out-of-stock items disable cart additions and surface an instant WhatsApp Pre-Order & Restock Request button pre-filled with equipment details.
- **Responsive Mobile & Tablet Viewports:** Streamlined top utility bar, non-crowded hero sections, and tablet-optimized 2-column promo banners.
- **Full Legal & Support Coverage:** `/warranty` (1-Year store warranty & 25-point check), `/returns` (3-step return policy), `/shipping` (insured courier timelines), `/track` (live AWB & status tracker), `/terms`, and `/privacy`.

### 🛡️ Headless Admin CMS & Invoicing Hub
- **Admin Inventory Manager (`/admin/products`):** Real-time search, brand filter, category filter, instant stock toggle, and "Add / Edit Product" modals.
- **AI 1-Click Background Removal Studio (`/admin/media`):** In-browser HTML5 Canvas chroma/luma edge feathering that eliminates gray/white backgrounds with single-click batch removal and transparent PNG download.
- **GST & Non-GST Invoicing Center (`/admin/orders`):** One-click toggle between standard 18% CGST/SGST Tax Invoice and Section 31(3)(c) Bill of Supply for second-hand dealer margin sales with print/PDF export.
- **Theme & Layout Customizer (`/admin/theme`):** Live controls for branding, announcement bars, homepage section visibility, and WhatsApp numbers.
- **Role-Based Access Control (`/admin/users`):** Permissions matrix for Super Admins, Store Managers, Support, and Accountants.

---

## 🔒 Cyber Security & Hardening

Refer to [`SECURITY.md`](file:///Users/ravitejmathurthi/Desktop/Mikingscameras/SECURITY.md) for full architecture details:
- **HSTS:** `max-age=63072000; includeSubDomains; preload`
- **Clickjacking Protection:** `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'`
- **XSS Prevention:** Automatic JSX escaping, no untrusted DOM innerHTML
- **MIME Protection:** `X-Content-Type-Options: nosniff`
- **Permissions Policy:** Strict camera, microphone, and geolocation blacklists
- **API Protection:** Bearer token authentication on sensitive admin endpoints (`/api/seed-products`)
- **SQL Injection Defense:** Parameterized queries and Supabase Row Level Security (RLS)

---

## 📁 Project Architecture

```
Mikingscameras/
├── public/                       # Static assets (logos, fallback images)
├── scripts/                      # Automated test scripts & utilities
├── src/
│   ├── app/                      # Next.js 16 App Router
│   │   ├── page.tsx              # Staggered multi-section home storefront
│   │   ├── layout.tsx            # Root shell with Header, Footer, Providers
│   │   ├── catalog/              # Search & multi-filter equipment catalog
│   │   ├── product/[slug]/       # SSG product detail page with pre-order logic
│   │   ├── cart/                 # Cart breakdown & GST summary
│   │   ├── checkout/             # Order reservation & delivery collection
│   │   ├── wishlist/             # Saved equipment wishlist
│   │   ├── track/                # Real-time AWB & 6-stage order timeline
│   │   ├── contact/              # Hyderabad showroom address & contact form
│   │   ├── warranty/             # 1-Year store guarantee & diagnostics
│   │   ├── returns/              # Return policy & reverse pickup guide
│   │   ├── shipping/             # Courier timelines & transit insurance
│   │   ├── terms/ & privacy/     # RBI-compliant legal documentation
│   │   ├── admin/                # Headless Admin Portal
│   │   │   ├── page.tsx          # Analytics dashboard & KPI cards
│   │   │   ├── products/         # Product inventory table with Add/Edit modals
│   │   │   ├── orders/           # Invoicing & GST/Non-GST generator
│   │   │   ├── theme/            # Real-time theme & layout customizer
│   │   │   ├── users/            # RBAC staff & permissions management
│   │   └── media/            # 1-Click Background Removal Studio
│   │   └── api/
│   │       └── seed-products/    # Protected catalog database seeder
│   ├── components/               # Reusable UI components
│   │   ├── Header.tsx            # Sticky desktop & mobile navigation
│   │   ├── Footer.tsx            # Footer with Hyderabad address & badges
│   │   ├── ProductCard.tsx       # Standardized 385px card with stock controls
│   │   ├── WhatsAppButton.tsx    # Direct WhatsApp floating contact widget
│   │   └── home/
│   │       ├── ProductCarousel.tsx # Staggered auto-scrolling carousel
│   │       ├── ValueStrip.tsx    # Customer value props
│   │       ├── PromoBanners.tsx  # Responsive promo tiles
│   │       └── BrandLogos.tsx    # Authorized brand marks
│   ├── context/                  # Cart & Theme React context state
│   ├── data/
│   │   └── catalog.ts            # Clean, deduplicated 153 Hyderabad products
│   └── lib/
│       ├── supabase.ts           # Public Supabase client
│       └── supabase-service.ts   # Secure service role database layer
├── supabase/
│   └── schema.sql                # Complete PostgreSQL schema & RLS policies
├── next.config.ts                # Security headers, remote image whitelist
├── SECURITY.md                   # Application security policy & threat model
└── project-memory/
    └── TASK_SHEET.md             # Master roadmap & progress tracking sheet
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or Node.js 20+
- npm or yarn

### Installation
```bash
# Clone and enter directory
cd Mikingscameras

# Install dependencies
npm install

# Set up local environment variables (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_SECRET_KEY=your_secure_admin_key

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) for the Admin CMS.

### Production Build & Verification
```bash
# Compile and build optimized production bundle
npm run build

# Start production server
npm run start
```
