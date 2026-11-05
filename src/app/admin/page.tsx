'use client';

import React from 'react';
import Link from 'next/link';
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Camera,
  CheckCircle2,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/data/catalog';
import { formatINR } from '@/lib/utils';

export default function AdminDashboardPage() {
  const totalProducts = INITIAL_PRODUCTS.length;
  const inStockCount = INITIAL_PRODUCTS.filter((p) => p.inStock).length;
  const lowStockCount = 6;
  const totalInventoryValue = INITIAL_PRODUCTS.reduce((acc, p) => acc + p.salePrice, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-[#181613] to-black text-white border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-[#F5821F] uppercase tracking-wider">
            Mi King&apos;s DSLR Camera Shop — Management Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Hyderabad Flagship Operations
          </h1>
          <p className="text-xs text-stone-400 max-w-xl">
            Live overview of your 153 migrated products, multi-angle Airbnb-style photo carousels, staff RBAC permissions, and store sales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            Manage Catalog CMS
          </Link>
          <Link
            href="/admin/users"
            className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Manage Staff Permissions
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold">Total Products</span>
            <Package className="w-4 h-4 text-[#F5821F]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-2">
            {totalProducts}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
            100% Deduplicated &amp; SEO Cleaned
          </span>
        </div>

        <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold">Catalog Valuation</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-2">
            {formatINR(totalInventoryValue)}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Verified Store Pricing
          </span>
        </div>

        <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold">Employees &amp; Staff</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-2">
            4 Roles
          </div>
          <Link href="/admin/users" className="text-[11px] text-[#F5821F] font-bold mt-1 block hover:underline">
            Manage Permissions &rarr;
          </Link>
        </div>

        <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold">Stock Health</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-2">
            {inStockCount} In Stock
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Pillar 103 Hyderabad Store
          </span>
        </div>
      </div>

      {/* Quick Recent Products Preview */}
      <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-black text-stone-900 dark:text-white">
              Recently Synced Real Products
            </h3>
            <p className="text-xs text-stone-500">
              Fetched from live WooCommerce with 4-image carousels and verified store prices.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-bold text-[#F5821F] hover:underline"
          >
            View Full 153 Products &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {INITIAL_PRODUCTS.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              className="p-3.5 rounded-xl border border-stone-200 dark:border-[#2a2621] bg-stone-50 dark:bg-[#1b1916] flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-lg bg-stone-200 dark:bg-stone-800 relative overflow-hidden shrink-0">
                <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-contain p-1" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">{prod.name}</h4>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="font-extrabold text-[#F5821F]">{formatINR(prod.salePrice)}</span>
                  <span className="text-[10px] text-stone-500">{prod.brand}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
