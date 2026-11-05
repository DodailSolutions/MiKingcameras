'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { admin, isAuthenticated, isLoading, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      badge: null,
      subItems: [
        { name: 'Home & Activity', href: '/admin' },
      ],
    },
    {
      name: 'WooCommerce Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      badge: '3',
      badgeColor: 'bg-[#F5821F] text-black',
      subItems: [
        { name: 'All Orders', href: '/admin/orders' },
        { name: 'Customer Reorders', href: '/admin/orders?view=reorders' },
      ],
    },
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
    {
      name: 'Photo BG Remover',
      href: '/admin/media',
      icon: Wand2,
      badge: 'AI',
      badgeColor: 'bg-purple-600 text-white',
    },
    {
      name: 'Pages & Blog CMS',
      href: '/admin/content',
      icon: BookOpen,
      badge: null,
    },
    {
      name: 'Theme & Hotline',
      href: '/admin/theme',
      icon: Palette,
      badge: null,
    },
    {
      name: 'Staff & Roles',
      href: '/admin/users',
      icon: Users,
      badge: '4',
      badgeColor: 'bg-stone-700 text-stone-300',
    },
  ];

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
              <span>Orders <span className="bg-[#F5821F] text-black px-1 rounded text-[9px] font-black">3</span></span>
            </Link>
          </div>
        </div>

        {/* Right Toolbar Items: Howdy Admin & Sign Out */}
        <div className="flex items-center gap-3">
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
        {/* WordPress Style Left Sidebar (#1d2327) */}
        <aside
          className={`${
            mobileMenuOpen ? 'block fixed inset-y-10 left-0 z-40 w-64' : 'hidden'
          } md:block md:w-56 bg-[#1d2327] text-stone-300 flex flex-col justify-between shrink-0 select-none border-r border-stone-800`}
        >
          <div className="overflow-y-auto py-2">
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold transition-colors group relative ${
                        isActive
                          ? 'bg-[#2271b1] text-white font-bold'
                          : 'text-stone-300 hover:bg-[#2c3338] hover:text-[#F5821F]'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#F5821F]" />
                      )}
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

                    {/* Submenu links when active or hover */}
                    {isActive && item.subItems && (
                      <div className="bg-[#2c3338] py-1 pl-9 pr-3 space-y-1 text-[11px]">
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-stone-300 hover:text-[#F5821F] py-0.5 transition-colors font-medium"
                          >
                            &bull; {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
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
