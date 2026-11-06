'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Store,
  Palette,
  Wand2,
  BookOpen,
  LogOut,
  ExternalLink,
  Plus,
  Bell,
  Layers,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  Contact,
  Search,
  UserPlus,
  CalendarClock,
  PenSquare,
  type LucideIcon,
} from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { CommandPalette, type CommandItem } from '@/components/admin/CommandPalette';
import { loadAdminOrders } from '@/data/admin-orders';
import { STORAGE_KEYS, isoDate, readStore, seedFollowUps, type FollowUp } from '@/lib/admin/crm';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string | null;
  badgeColor?: string;
  subItems?: { name: string; href: string }[];
}

function isNavActive(pathname: string, href: string) {
  return href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(`${href}/`);
}

/** Sub-item is active when its path matches and every query param it declares matches. */
function isSubActive(pathname: string, params: URLSearchParams, href: string, siblings: string[]): boolean {
  const [path, query] = href.split('?');
  if (pathname !== path) return false;
  if (query) return Array.from(new URLSearchParams(query)).every(([k, v]) => params.get(k) === v);
  // Plain link is active only when no sibling's query matches.
  return !siblings.some((h) => h !== href && h.includes('?') && isSubActive(pathname, params, h, []));
}

function SidebarNav({ groups, onNavigate }: { groups: { label: string; items: NavItem[] }[]; onNavigate: () => void }) {
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <nav className="space-y-3" aria-label="Admin navigation">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-3.5 pb-1 text-[9px] font-black uppercase tracking-[0.14em] text-stone-500">{group.label}</p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = isNavActive(pathname, item.href);
              const subHrefs = item.subItems?.map((s) => s.href) ?? [];
              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold transition-colors group relative ${
                      isActive
                        ? 'bg-[#2271b1] text-white font-bold'
                        : 'text-stone-300 hover:bg-[#2c3338] hover:text-[#F5821F]'
                    }`}
                  >
                    {isActive && <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#F5821F]" />}
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-[#F5821F]'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${item.badgeColor || 'bg-stone-700 text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>

                  {isActive && item.subItems && (
                    <div className="bg-[#2c3338] py-1.5 pl-9 pr-3 space-y-0.5 text-[11px]">
                      {item.subItems.map((sub) => {
                        const subActive = isSubActive(pathname, params, sub.href, subHrefs);
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={onNavigate}
                            className={`block py-1 transition-colors ${
                              subActive ? 'text-white font-bold' : 'text-stone-400 hover:text-[#F5821F] font-medium'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { admin, isAuthenticated, isLoading, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [paletteOpen, setPaletteOpen] = useState(false);

  // Live sidebar badges, re-read on every navigation so counts stay fresh
  const { pendingOrders, dueFollowUps } = useMemo(() => {
    void pathname;
    const today = isoDate(0);
    return {
      pendingOrders: loadAdminOrders().filter((o) => o.status === 'Processing').length,
      dueFollowUps: readStore<FollowUp[]>(STORAGE_KEYS.followUps, seedFollowUps()).filter(
        (f) => !f.done && f.dueDate <= today
      ).length,
    };
  }, [pathname]);

  // ⌘K / Ctrl+K command palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navGroups: { label: string; items: NavItem[] }[] = [
    {
      label: 'Overview',
      items: [{ name: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
    },
    {
      label: 'Sales & CRM',
      items: [
        {
          name: 'Store Orders',
          href: '/admin/orders',
          icon: ShoppingCart,
          badge: pendingOrders ? String(pendingOrders) : null,
          badgeColor: 'bg-[#F5821F] text-black',
          subItems: [
            { name: 'All Orders', href: '/admin/orders' },
            { name: 'Customer Reorders', href: '/admin/orders?view=reorders' },
          ],
        },
        {
          name: 'Customers & CRM',
          href: '/admin/customers',
          icon: Contact,
          badge: dueFollowUps ? String(dueFollowUps) : null,
          badgeColor: 'bg-rose-500 text-white',
          subItems: [
            { name: 'Customers', href: '/admin/customers' },
            { name: 'Leads Pipeline', href: '/admin/customers?tab=leads' },
            { name: 'Follow-ups', href: '/admin/customers?tab=followups' },
          ],
        },
      ],
    },
    {
      label: 'Catalog',
      items: [
        {
          name: 'Products & Catalog',
          href: '/admin/products',
          icon: Package,
          badge: '153',
          badgeColor: 'bg-stone-700 text-stone-200',
          subItems: [
            { name: 'All Products', href: '/admin/products' },
            { name: 'Categories', href: '/admin/products?tab=categories' },
            { name: 'Add New', href: '/admin/products?action=new' },
          ],
        },
        { name: 'Photo BG Remover', href: '/admin/media', icon: Wand2, badge: 'AI', badgeColor: 'bg-purple-600 text-white' },
      ],
    },
    {
      label: 'Content',
      items: [
        {
          name: 'Pages & Blog CMS',
          href: '/admin/content',
          icon: BookOpen,
          subItems: [
            { name: 'Blog Posts', href: '/admin/content' },
            { name: 'Static Pages', href: '/admin/content?tab=pages' },
          ],
        },
      ],
    },
    {
      label: 'Settings',
      items: [
        { name: 'Theme & Hotline', href: '/admin/theme', icon: Palette },
        { name: 'Staff & Roles', href: '/admin/users', icon: Users, badge: '4', badgeColor: 'bg-stone-700 text-stone-300' },
      ],
    },
  ];

  const commandItems = useMemo<CommandItem[]>(
    () => [
      { id: 'go-dash', group: 'Go to', label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { id: 'go-orders', group: 'Go to', label: 'Store Orders', href: '/admin/orders', icon: ShoppingCart, keywords: 'sales invoices awb' },
      { id: 'go-crm', group: 'Go to', label: 'Customers & CRM', href: '/admin/customers', icon: Contact, keywords: 'clients buyers segments' },
      { id: 'go-leads', group: 'Go to', label: 'Leads Pipeline', href: '/admin/customers?tab=leads', icon: Layers, keywords: 'enquiries kanban deals' },
      { id: 'go-fu', group: 'Go to', label: 'Follow-ups', href: '/admin/customers?tab=followups', icon: CalendarClock, keywords: 'tasks reminders' },
      { id: 'go-products', group: 'Go to', label: 'Products & Catalog', href: '/admin/products', icon: Package, keywords: 'inventory stock' },
      { id: 'go-cats', group: 'Go to', label: 'Product Categories', href: '/admin/products?tab=categories', icon: Layers },
      { id: 'go-media', group: 'Go to', label: 'Photo BG Remover', href: '/admin/media', icon: Wand2, keywords: 'images ai' },
      { id: 'go-cms', group: 'Go to', label: 'Blog Posts', href: '/admin/content', icon: BookOpen, keywords: 'cms articles' },
      { id: 'go-pages', group: 'Go to', label: 'Static & Policy Pages', href: '/admin/content?tab=pages', icon: BookOpen, keywords: 'cms policy' },
      { id: 'go-theme', group: 'Go to', label: 'Theme & Hotline', href: '/admin/theme', icon: Palette, keywords: 'branding whatsapp colors' },
      { id: 'go-staff', group: 'Go to', label: 'Staff & Roles', href: '/admin/users', icon: Users, keywords: 'employees permissions' },
      { id: 'act-product', group: 'Create', label: 'New product', href: '/admin/products?action=new', icon: Plus },
      { id: 'act-lead', group: 'Create', label: 'Add lead to pipeline', href: '/admin/customers?tab=leads', icon: UserPlus },
      { id: 'act-post', group: 'Create', label: 'Write blog post', href: '/admin/content', icon: PenSquare },
      { id: 'ext-store', group: 'Storefront', label: 'Open public storefront', href: '/', icon: Store, external: true },
    ],
    []
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1d2327] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#F5821F] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-stone-300 font-bold">Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !admin) {
    return <AdminLoginForm />;
  }

  return (
    <div className="min-h-screen bg-[#f0f0f1] dark:bg-[#0f0e0c] text-stone-900 dark:text-stone-100 flex flex-col font-sans">
      {/* ------------------------------------------------------------- */}
      {/* 1. Iconic WordPress Top Admin Toolbar (#1d2327) */}
      {/* ------------------------------------------------------------- */}
      <header className="h-9 sm:h-10 bg-[#1d2327] text-stone-300 px-3 sm:px-4 flex items-center justify-between text-xs border-b border-stone-800 z-30 shrink-0 select-none">
        {/* Left Toolbar Items */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-stone-300 hover:text-white p-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* WordPress / Store Logo Icon */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#F5821F] text-black font-black flex items-center justify-center text-[10px] shadow-xs">
              MI
            </div>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 hover:text-[#F5821F] font-semibold transition-colors truncate max-w-[150px] sm:max-w-none"
              title="Visit Public Storefront"
            >
              <Store className="w-3.5 h-3.5 text-stone-400" />
              <span>Mi King&apos;s DSLR Camera Shop</span>
              <ExternalLink className="w-3 h-3 opacity-60 hidden sm:inline" />
            </Link>
          </div>

          {/* Quick Add Buttons */}
          <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-stone-700">
            <Link
              href="/admin/products?action=new"
              className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-stone-800 hover:text-white text-[11px] text-stone-400 font-medium transition-colors"
            >
              <Plus className="w-3 h-3 text-[#F5821F]" />
              <span>New Product</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-stone-800 hover:text-white text-[11px] text-stone-400 font-medium transition-colors"
            >
              <ShoppingCart className="w-3 h-3 text-emerald-400" />
              <span>Orders {pendingOrders ? <span className="bg-[#F5821F] text-black px-1 rounded text-[9px] font-black">{pendingOrders}</span> : null}</span>
            </Link>
          </div>
        </div>

        {/* Right Toolbar Items: Search, Howdy Admin & Sign Out */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-0.5 rounded bg-[#2c3338] hover:bg-stone-700 text-stone-400 hover:text-white text-[11px] transition-colors cursor-pointer"
            aria-label="Open command palette"
          >
            <Search className="w-3 h-3" />
            <span className="hidden md:inline">Search admin…</span>
            <kbd className="hidden md:inline text-[9px] font-bold bg-[#1d2327] border border-stone-700 rounded px-1">⌘K</kbd>
          </button>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-stone-400 hidden sm:inline">Howdy,</span>
            <span className="font-bold text-white">{admin.name}</span>
            <span className="bg-stone-800 text-[#F5821F] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-stone-700 hidden sm:inline">
              {admin.role}
            </span>
          </div>

          <div className="h-4 w-px bg-stone-700 hidden sm:block" />

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-rose-400 transition-colors cursor-pointer py-1"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. Main Admin Workspace (Classic Left Sidebar + Content) */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex min-h-0">
        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 top-9 z-30 bg-black/50"
          />
        )}
        {/* WordPress Style Left Sidebar (#1d2327) */}
        <aside
          className={`${
            mobileMenuOpen ? 'block fixed inset-y-10 left-0 z-40 w-64' : 'hidden'
          } md:block md:w-56 bg-[#1d2327] text-stone-300 flex flex-col justify-between shrink-0 select-none border-r border-stone-800`}
        >
          <div className="overflow-y-auto py-3">
            <Suspense fallback={null}>
              <SidebarNav groups={navGroups} onNavigate={() => setMobileMenuOpen(false)} />
            </Suspense>
          </div>

          {/* WordPress System Status Footer in Sidebar */}
          <div className="p-3 bg-[#181d20] border-t border-stone-800 text-[10px] text-stone-400 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-300">WooCommerce Next</span>
              <span className="text-emerald-400 font-mono">v16.4</span>
            </div>
            <div className="flex items-center justify-between text-stone-400">
              <span>Catalog Sync:</span>
              <span className="text-stone-200">153 items</span>
            </div>
            <div className="flex items-center justify-between text-stone-400">
              <span>Active Staff:</span>
              <span className="text-stone-200">{admin.name.split(' ')[0]} ({admin.role})</span>
            </div>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} items={commandItems} />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
