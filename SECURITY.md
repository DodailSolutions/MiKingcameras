# Security Policy & Architecture — Mi King's Cameras

This document outlines the security architecture, controls, and best practices implemented in the Mi King's DSLR Camera Shop web application to safeguard customer data, prevent cyber attacks, and maintain application integrity.

---

## 1. Threat Model & Security Posture

| Threat Category | Potential Risk | Implemented Countermeasure | Verification Status |
|:---|:---|:---|:---:|
| **Clickjacking / UI Redressing** | Embedding site in malicious iframes to trick users | `X-Frame-Options: DENY` & CSP `frame-ancestors 'none'` in `next.config.ts` | ✅ Enforced |
| **Cross-Site Scripting (XSS)** | Malicious scripts injected via user inputs | React auto-escaping in JSX; strict CSP headers; zero untrusted `dangerouslySetInnerHTML` | ✅ Enforced |
| **MIME-Sniffing Attacks** | Browsers executing malicious payloads disguised as text/images | `X-Content-Type-Options: nosniff` header on all responses | ✅ Enforced |
| **Man-In-The-Middle (MitM)** | Unencrypted traffic eavesdropping or protocol downgrade | Strict Transport Security (HSTS) with 2-year max-age, includeSubDomains, and preload | ✅ Enforced |
| **Cross-Origin Referrer Leakage** | Exposing sensitive order or tracking tokens in URLs | `Referrer-Policy: strict-origin-when-cross-origin` | ✅ Enforced |
| **Browser Feature Abuse** | Unauthorized webcam, microphone, or geolocation tracking | `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()` | ✅ Enforced |
| **SQL Injection** | Attacker manipulating backend database queries | Parameterized Supabase PostgREST client queries; Row Level Security (RLS) enabled on all tables | ✅ Enforced |
| **Unauthorized API Seeding** | Malicious trigger of mass database resets or catalog overwrite | Bearer Token authentication required on `/api/seed-products` via `ADMIN_SECRET_KEY` | ✅ Enforced |
| **Denial of Service (DoS)** | Overwhelming server with dynamic renders | Static Site Generation (SSG) for 178 product & category pages, served as static assets | ✅ Enforced |
| **Out-of-Stock Checkout Exploits** | Users placing orders for unavailable inventory | Strict client & server-side checkout restrictions; buy buttons disabled with pre-order request fallback | ✅ Enforced |

---

## 2. HTTP Security Headers Configuration

All responses served by the Next.js application include industry-standard security headers configured in [`next.config.ts`](file:///Users/ravitejmathurthi/Desktop/Mikingscameras/next.config.ts):

```typescript
headers: [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
]
```

---

## 3. Database Security & Row Level Security (RLS)

All database operations interact with Supabase PostgreSQL via:
- Public client restricted to safe read-only or self-created records.
- Service Role restricted strictly to authenticated server-side endpoints (`src/lib/supabase-service.ts`).
- Declarative RLS policies defined in [`supabase/schema.sql`](file:///Users/ravitejmathurthi/Desktop/Mikingscameras/supabase/schema.sql):
  - `products`: Public `SELECT` allowed; `INSERT`/`UPDATE`/`DELETE` restricted to admin role.
  - `orders`: Authenticated / anon can insert reservations; read and update restricted to store managers.
  - `admin_profiles`: Strictly accessible only by authenticated staff members.

---

## 4. Client-Side Image Processing & Privacy

The **1-Click Background Removal Studio** (`/admin/media`) executes entirely inside the user's browser via HTML5 Canvas chroma/luma sampling:
- **Zero Server Exposure:** Product images are processed client-side without transmitting raw files to third-party unvetted API services.
- **No Third-Party Tracking:** No ad trackers, marketing pixels, or analytics beacons access customer or product images.

---

## 5. Vulnerability Reporting

If you identify any security issue or vulnerability:
- **Direct Contact:** Mi King's DSLR Camera Shop, Pillar 103, Bank Colony, Hyderabad
- **Hotline:** +91 90322 85420 / +91 63058 75376
- **Email:** support@mikcameras.in
