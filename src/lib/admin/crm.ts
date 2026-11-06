// CRM domain: customer profiles derived from orders, sales leads and follow-up tasks.
// Persisted in localStorage like the rest of the admin panel.

import type { CustomerOrderRecord } from '@/data/admin-orders';

export type Segment = 'VIP' | 'Loyal' | 'New' | 'At Risk';
export type LeadStage = 'New' | 'Contacted' | 'Quoted' | 'Won' | 'Lost';
export type LeadSource = 'WhatsApp' | 'Walk-in' | 'Website' | 'Instagram' | 'Phone Call';
export type FollowUpType = 'Call' | 'WhatsApp' | 'Email' | 'Visit';
export type Priority = 'High' | 'Medium' | 'Low';

export interface CRMNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface CRMProfile {
  tags: string[];
  notes: CRMNote[];
}

export interface CRMCustomer {
  key: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  orders: CustomerOrderRecord[];
  orderCount: number;
  lifetimeValue: number;
  avgOrderValue: number;
  pendingAmount: number;
  lastOrderAt: Date;
  firstOrderAt: Date;
  favouriteCategory: string;
  segment: Segment;
  tags: string[];
  notes: CRMNote[];
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  interest: string;
  budget: number;
  source: LeadSource;
  stage: LeadStage;
  createdAt: string;
  note?: string;
}

export interface FollowUp {
  id: string;
  title: string;
  contactName: string;
  phone?: string;
  type: FollowUpType;
  priority: Priority;
  dueDate: string; // yyyy-mm-dd
  done: boolean;
}

export const LEAD_STAGES: LeadStage[] = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];
export const LEAD_SOURCES: LeadSource[] = ['WhatsApp', 'Walk-in', 'Website', 'Instagram', 'Phone Call'];
export const SEGMENTS: Segment[] = ['VIP', 'Loyal', 'New', 'At Risk'];

export const STORAGE_KEYS = {
  profiles: 'mikings_crm_profiles',
  leads: 'mikings_crm_leads',
  followUps: 'mikings_crm_followups',
} as const;

// ------------------------------------------------------------------
// Storage helpers
// ------------------------------------------------------------------

export function readStore<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Could not persist ${key}:`, e);
  }
}

export function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function isoDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/** Digits-only phone for wa.me / tel: links. */
export function phoneDigits(phone: string) {
  return phone.replace(/\D/g, '');
}

// ------------------------------------------------------------------
// Customer aggregation
// ------------------------------------------------------------------

/** Order dates are display strings like "05 Nov 2026, 04:30 PM" or "Today, Just Now". */
export function parseOrderDate(label: string): Date {
  if (/today|just now/i.test(label)) return new Date();
  const parsed = Date.parse(label.replace(',', ''));
  return Number.isNaN(parsed) ? new Date() : new Date(parsed);
}

export function daysSince(date: Date) {
  return Math.floor((Date.now() - date.getTime()) / 86_400_000);
}

function segmentFor(orderCount: number, lifetimeValue: number, lastOrderAt: Date): Segment {
  if (lifetimeValue >= 200_000 || orderCount >= 3) return 'VIP';
  if (daysSince(lastOrderAt) > 90) return 'At Risk';
  if (orderCount >= 2) return 'Loyal';
  return 'New';
}

export function customerKey(order: Pick<CustomerOrderRecord, 'customerEmail' | 'customerPhone'>) {
  return (order.customerEmail || phoneDigits(order.customerPhone)).trim().toLowerCase();
}

export function buildCustomers(
  orders: CustomerOrderRecord[],
  profiles: Record<string, CRMProfile>
): CRMCustomer[] {
  const groups = new Map<string, CustomerOrderRecord[]>();
  for (const order of orders) {
    const key = customerKey(order);
    groups.set(key, [...(groups.get(key) ?? []), order]);
  }

  return Array.from(groups.entries())
    .map(([key, list]) => {
      const valid = list.filter((o) => o.status !== 'Cancelled');
      const dates = list.map((o) => parseOrderDate(o.date));
      const lifetimeValue = valid.reduce((sum, o) => sum + o.totalAmount, 0);
      const lastOrderAt = new Date(Math.max(...dates.map((d) => d.getTime())));

      const categoryCounts: Record<string, number> = {};
      list.flatMap((o) => o.items).forEach((it) => {
        categoryCounts[it.category] = (categoryCounts[it.category] ?? 0) + it.quantity;
      });
      const favouriteCategory =
        Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

      const latest = list[0];
      const profile = profiles[key] ?? { tags: [], notes: [] };
      return {
        key,
        name: latest.customerName,
        email: latest.customerEmail,
        phone: latest.customerPhone,
        address: latest.address,
        orders: list,
        orderCount: list.length,
        lifetimeValue,
        avgOrderValue: valid.length ? Math.round(lifetimeValue / valid.length) : 0,
        pendingAmount: list
          .filter((o) => o.paymentStatus === 'Pending' && o.status !== 'Cancelled')
          .reduce((sum, o) => sum + o.totalAmount, 0),
        lastOrderAt,
        firstOrderAt: new Date(Math.min(...dates.map((d) => d.getTime()))),
        favouriteCategory,
        segment: segmentFor(list.length, lifetimeValue, lastOrderAt),
        tags: profile.tags,
        notes: profile.notes,
      };
    })
    .sort((a, b) => b.lifetimeValue - a.lifetimeValue);
}

// ------------------------------------------------------------------
// Seed data (relative dates so "due today / overdue" stays meaningful)
// ------------------------------------------------------------------

export function seedLeads(): Lead[] {
  return [
    { id: 'lead-1', name: 'Rahul Deshmukh', phone: '+91 98660 44120', interest: 'Sony A7 IV body + 28-70mm kit', budget: 210000, source: 'WhatsApp', stage: 'New', createdAt: isoDate(0), note: 'Wedding shooter, wants EMI options.' },
    { id: 'lead-2', name: 'Fatima Begum', phone: '+91 90100 23456', interest: 'Used Canon 200D for beginner vlogging', budget: 35000, source: 'Instagram', stage: 'Contacted', createdAt: isoDate(-1) },
    { id: 'lead-3', name: 'Vikram Studios', phone: '+91 81234 56780', email: 'vikram.studios@gmail.com', interest: '2x Godox SL150 II lights + C-stands', budget: 62000, source: 'Phone Call', stage: 'Quoted', createdAt: isoDate(-3), note: 'Sent quote on WhatsApp, awaiting PO.' },
    { id: 'lead-4', name: 'Sneha Rao', phone: '+91 96520 77881', interest: 'Nikon Z6 II trade-in for Z6 III', budget: 145000, source: 'Walk-in', stage: 'Quoted', createdAt: isoDate(-4) },
    { id: 'lead-5', name: 'Imran Khan', phone: '+91 70130 99012', interest: 'DJI RS 4 gimbal', budget: 38000, source: 'Website', stage: 'Won', createdAt: isoDate(-6) },
    { id: 'lead-6', name: 'Kavya Iyer', phone: '+91 99595 11223', interest: 'Fujifilm X100VI', budget: 150000, source: 'Instagram', stage: 'Lost', createdAt: isoDate(-9), note: 'Bought elsewhere — stock unavailable.' },
  ];
}

export function seedFollowUps(): FollowUp[] {
  return [
    { id: 'fu-1', title: 'Confirm Sigma 24-70 payment (UPI pending)', contactName: 'Anil Reddy Photography', phone: '+91 99890 87654', type: 'Call', priority: 'High', dueDate: isoDate(-1), done: false },
    { id: 'fu-2', title: 'Share EMI plans for Sony A7 IV', contactName: 'Rahul Deshmukh', phone: '+91 98660 44120', type: 'WhatsApp', priority: 'High', dueDate: isoDate(0), done: false },
    { id: 'fu-3', title: 'Ask for review of RF 50mm order', contactName: 'Kishore Varma', phone: '+91 98490 12345', type: 'WhatsApp', priority: 'Low', dueDate: isoDate(2), done: false },
    { id: 'fu-4', title: 'Trade-in inspection appointment', contactName: 'Sneha Rao', phone: '+91 96520 77881', type: 'Visit', priority: 'Medium', dueDate: isoDate(1), done: false },
    { id: 'fu-5', title: 'Send FX3 accessory bundle offer', contactName: 'Syed Mansoor Ahmed', phone: '+91 70321 99887', type: 'Email', priority: 'Medium', dueDate: isoDate(-3), done: true },
  ];
}

// ------------------------------------------------------------------
// CSV export
// ------------------------------------------------------------------

export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((r) => r.map(escape).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
