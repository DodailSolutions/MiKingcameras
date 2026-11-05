export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  category: 'Policy' | 'Company' | 'Support' | 'Custom';
  metaDescription: string;
  content: string;
  lastUpdated: string;
  isPublished: boolean;
  navSection?: 'footer' | 'header' | 'none';
}

export const INITIAL_CUSTOM_PAGES: CustomPage[] = [
  {
    id: 'page-terms',
    title: 'Terms & Conditions',
    slug: 'terms',
    category: 'Policy',
    metaDescription: 'Official terms of sale, device inspection, store warranty guidelines, and customer agreement for Mi King’s Cameras Hyderabad.',
    content: `
# Terms and Conditions of Sale

Welcome to Mi King's Cameras. By accessing our platform or purchasing photographic equipment from our retail showroom at Pillar 103, Bank Colony, Mir Alam Tank, Hyderabad, or via our online store, you agree to comply with the following conditions:

## 1. Product Authenticity & Verification
- All new products are sourced through authorized manufacturer distribution networks with valid GST invoices.
- Pre-owned items undergo our mandatory 25-point physical and diagnostic inspection. Shutter count and physical condition are documented transparently on each product invoice.

## 2. Store Warranty Guidelines
- All certified pre-owned camera bodies and lenses carry a **1-Year In-House Store Warranty** covering internal mechanical and electronic motherboard defects.
- Accidental drops, liquid ingress, customer misuse, unauthorized third-party tampering, and laser sensor burns from events are excluded from standard warranty coverage.

## 3. Pricing & Taxes
- All prices listed on mikcameras.in and in our store are inclusive of applicable GST unless explicitly stated otherwise.
- We reserve the right to revise pricing or rectify typographical pricing errors before order fulfillment.
    `,
    lastUpdated: '2026-11-01',
    isPublished: true,
    navSection: 'footer',
  },
  {
    id: 'page-privacy',
    title: 'Privacy Policy',
    slug: 'privacy',
    category: 'Policy',
    metaDescription: 'Learn how Mi King’s DSLR Camera Shop safeguards your personal data, payment info, and customer records.',
    content: `
# Privacy and Data Protection Policy

Mi King's Cameras respects the privacy of photographers, creators, and business clients who trust us with their gear requirements.

## Information We Collect
1. **Contact Information:** Name, shipping address, mobile contact number, and email ID for GST billing and courier dispatch.
2. **Device Service Records:** Serial numbers, model names, and diagnostic notes for cameras submitted for service, trade-in evaluation, or warranty claims.
3. **Transaction Details:** Payment confirmation receipts (we do NOT store credit card CVV numbers or banking passwords on our servers).

## How We Use Your Data
- Order fulfillment, express courier tracking updates via SMS / WhatsApp, and warranty registry maintenance.
- Direct customer support communication through our dedicated Hyderabad concierge desk.
- We never sell or lease customer information to third-party marketing companies.
    `,
    lastUpdated: '2026-11-01',
    isPublished: true,
    navSection: 'footer',
  },
  {
    id: 'page-returns',
    title: 'Return & Refund Policy',
    slug: 'returns',
    category: 'Policy',
    metaDescription: 'Our transparent 7-day return and instant replacement policy for hardware defects and courier discrepancies.',
    content: `
# 7-Day Hassle-Free Return & Replacement Policy

At Mi King's Cameras, we take immense pride in ensuring our customers receive equipment in pristine working condition.

## Return Window
- Customers are eligible for a replacement or return within **7 days of delivery** if the device exhibits an unadvertised hardware defect or discrepancies in specifications.
- In-store pickup purchases may be tested thoroughly on our demonstration counter with technician assistance before leaving our showroom.

## Return Procedure
1. Contact our WhatsApp Support desk at **+91 90322 85420** with your Order ID and an unboxing video.
2. Pack the equipment securely in its original packaging with all included caps, hoods, straps, chargers, and batteries.
3. Our verified logistics partner will initiate a safe pickup, or you may bring the unit to our Mir Alam Tank counter for instant on-the-spot evaluation.
    `,
    lastUpdated: '2026-11-01',
    isPublished: true,
    navSection: 'footer',
  },
  {
    id: 'page-shipping',
    title: 'Shipping & Delivery Policy',
    slug: 'shipping',
    category: 'Policy',
    metaDescription: 'Fast insured pan-India delivery, same-day Hyderabad local courier, and in-store pickup options.',
    content: `
# Pan-India Shipping & Hyderabad Local Delivery

We ensure every delicate camera body and fragile optical glass lens is shock-packed in multilayer bubble cushioning and tamper-evident sealed packaging.

## Shipping Times
- **Hyderabad Local Metro:** Same-day or next-day express delivery via local courier service or counter pickup at Pillar 103.
- **Telangana & Andhra Pradesh:** 1 to 2 business days.
- **Rest of India:** 2 to 4 business days via Bluedart, Delhivery, or DTDC Air Express.

## Insurance & Tracking
- High-value consignments are shipped with full transit insurance protection.
- Live tracking numbers and courier links are dispatched via SMS & WhatsApp immediately upon parcel dispatch.
    `,
    lastUpdated: '2026-11-01',
    isPublished: true,
    navSection: 'footer',
  },
  {
    id: 'page-warranty',
    title: '1-Year Store Warranty Details',
    slug: 'warranty',
    category: 'Support',
    metaDescription: 'Mi King’s certified 1-year in-house warranty covering pre-owned and new camera gear.',
    content: `
# 1-Year Certified Store Warranty

Unlike unverified marketplace sellers, Mi King's Cameras stands firmly behind every camera and lens we sell with our comprehensive **1-Year Store Warranty**.

## What is Covered
- Motherboard circuit board issues and sudden power failures.
- Mechanical shutter errors (Err 20, Err 30, Err 99 on Canon; ERR on Nikon; shutter assembly jams).
- Autofocus motor and aperture diaphragm communication errors on lenses.
- Sensor stabilization (IBIS) motor defects.

## Fast-Track Repair Turnaround
In-house repairs at our Hyderabad tech lab are typically completed within **3 to 7 business days** using original manufacturer components.
    `,
    lastUpdated: '2026-11-01',
    isPublished: true,
    navSection: 'footer',
  },
];
