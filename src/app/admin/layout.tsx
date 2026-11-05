'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  ShieldAlert,
  ArrowLeft,
  Settings,
  Store,
  Sparkles,
  Palette,
  Wand2,
  BookOpen,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { admin, isAuthenticated, isLoading, logout } = useAdminAuth();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products & Inventory', href: '/admin/products', icon: Package },
    { name: 'Blogs & Pages CMS', href: '/admin/content', icon: BookOpen },
    { name: 'Photo BG Remover', href: '/admin/media', icon: Wand2 },
    { name: 'Orders & GST Invoices', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Theme & Layout Editor', href: '/admin/theme', icon: Palette },
    { name: 'User Management', href: '/admin/users', icon: Users },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-[#0c0b09] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#F5821F] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-stone-500 font-bold">Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  // Authentication Guard
  if (!isAuthenticated || !admin) {
    return <AdminLoginForm />;
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#0c0b09] text-stone-900 dark:text-stone-100 flex flex-col md:flex-row transition-colors">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-[#151311] border-r border-stone-200 dark:border-[#24211d] flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header */}
          <div className="p-5 border-b border-stone-200 dark:border-[#24211d] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F5821F] text-black font-black flex items-center justify-center text-sm shadow-md">
                MI
              </div>
              <div>
                <h1 className="text-sm font-black text-stone-900 dark:text-white leading-tight">
                  Admin Console
                </h1>
                <span className="text-[10px] text-[#F5821F] font-bold">Mi King&apos;s Cameras</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">Live</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#F5821F] text-black shadow-md shadow-[#F5821F]/20'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#1f1c18]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Info, Sign Out & Return to Store */}
        <div className="p-4 border-t border-stone-200 dark:border-[#24211d] space-y-3">
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#1a1815] border border-stone-200 dark:border-[#2a2621]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-stone-900 dark:text-white truncate max-w-[130px]">
                  {admin.name}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                title="Sign out of admin console"
                className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px]">
              <span className="text-[#F5821F] font-bold">{admin.role}</span>
              <span className="text-stone-400">{admin.email}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 text-[11px] font-bold text-stone-700 dark:text-stone-300 transition-colors text-center"
            >
              <Store className="w-3.5 h-3.5 text-[#F5821F]" />
              <span>Store</span>
            </Link>

            <button
              type="button"
              onClick={logout}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-8">
        {children}
      </main>
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
