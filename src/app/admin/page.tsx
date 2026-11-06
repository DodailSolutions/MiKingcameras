'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Clock,
  Truck,
  RotateCcw,
  Sparkles,
  ExternalLink,
  MessageSquare,
  FileText,
  Filter,
  Search,
  Layers,
  ChevronRight,
  Eye,
  Plus,
  RefreshCw,
  Download,
  Check,
  Phone,
  Mail,
  MapPin,
  Star,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { INITIAL_PRODUCTS, Product } from '@/data/catalog';
import { formatINR } from '@/lib/utils';
import { CustomerInvoiceModal, InvoiceData } from '@/components/invoice/CustomerInvoiceModal';
import { type CustomerOrderRecord, loadAdminOrders } from '@/data/admin-orders';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'reviews' | 'inventory'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'reorders' | 'processing' | 'dispatched'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [ordersList, setOrdersList] = useState<CustomerOrderRecord[]>(loadAdminOrders); // real checkout orders + baseline
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // Moderation state for customer reviews
  const [reviewsList, setReviewsList] = useState<Array<{
    id: string;
    productName: string;
    customerName: string;
    location: string;
    rating: number;
    title: string;
    comment: string;
    date: string;
    verifiedPurchase: boolean;
    orderReference?: string;
    photos?: string[];
    isApproved: boolean;
  }>>([
    {
      id: 'rev-mod-1',
      productName: 'Canon 1100D Body with 18-55mm',
      customerName: 'Arun Kumar V.',
      location: 'Banjara Hills, Hyderabad',
      rating: 5,
      title: 'Inspected in-person at Tadbun store, 100% spotless sensor!',
      comment: 'Tested shutter count on site. Clean sensor, 25-point inspection card given, with 1-Year store warranty.',
      date: '2 days ago',
      verifiedPurchase: true,
      orderReference: 'HYD-STORE-INV-8419',
      photos: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80'],
      isApproved: true,
    },
    {
      id: 'rev-mod-2',
      productName: 'Canon EF 50mm f/1.8 STM Standard Prime',
      customerName: 'Mohd Salman Farooqi',
      location: 'Bangalore (Insured Courier)',
      rating: 5,
      title: 'Video call verified before shipping. Perfect condition!',
      comment: 'Did WhatsApp video call with Mohd Shoeb to check glass clarity. Arrived in 48 hours with unbroken seals.',
      date: '1 week ago',
      verifiedPurchase: true,
      orderReference: 'HYD-EXP-559102',
      photos: ['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=400&q=80'],
      isApproved: true,
    },
  ]);

  // Update Status in-line
  const handleUpdateOrderStatus = (orderId: string, newStatus: CustomerOrderRecord['status']) => {
    setOrdersList((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );

    setStatusToast(`Order #${orderId} marked as ${newStatus}!`);
    setTimeout(() => setStatusToast(null), 3000);
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    const headers = ['Order Number', 'Customer Name', 'Phone', 'Date', 'Total Amount', 'Status', 'Courier AWB'];
    const rows = ordersList.map((o) => [
      o.orderNumber,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.date}"`,
      o.totalAmount,
      o.status,
      o.trackingAwb,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mikings_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations
  const totalProducts = INITIAL_PRODUCTS.length;
  const inStockCount = INITIAL_PRODUCTS.filter((p) => p.inStock).length;
  const outOfStockCount = totalProducts - inStockCount;
  const totalInventoryValue = INITIAL_PRODUCTS.reduce((acc, p) => acc + p.salePrice, 0);
  const totalSalesRevenue = ordersList.reduce((acc, o) => acc + o.totalAmount, 0);
  const reordersCount = ordersList.filter((o) => o.customerType.includes('Reordered')).length;
  const processingCount = ordersList.filter((o) => o.status === 'Processing').length;

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return ordersList.filter((order) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = order.customerName.toLowerCase().includes(q);
        const matchNum = order.orderNumber.toLowerCase().includes(q);
        const matchPhone = order.customerPhone.includes(q);
        const matchItem = order.items.some((it) => it.name.toLowerCase().includes(q));
        if (!matchName && !matchNum && !matchPhone && !matchItem) return false;
      }

      // Filter pills
      if (orderFilter === 'reorders') return order.customerType.includes('Reordered');
      if (orderFilter === 'processing') return order.status === 'Processing';
      if (orderFilter === 'dispatched') return order.status === 'Dispatched' || order.status === 'Delivered';

      return true;
    });
  }, [ordersList, searchQuery, orderFilter]);

  const openInvoiceForOrder = (order: CustomerOrderRecord) => {
    setSelectedInvoice({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.address,
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      items: order.items.map((it) => ({
        name: it.name,
        quantity: it.quantity,
        price: it.price,
        hsn: it.category === 'Lenses' ? '900211' : '900659',
      })),
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      date: order.date,
      trackingId: order.trackingAwb,
      courierPartner: order.courierPartner,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {statusToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-emerald-500/50 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusToast}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. Header Toolbar with Quick Action Dock */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-300 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              Command Dashboard
            </h1>
            <span className="bg-[#F5821F] text-black font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Real-time tracking of Hyderabad showroom sales, online orders, customer repeat rates, and verified photo reviews.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#F5821F]" />
            <span>Export Orders CSV</span>
          </button>

          <Link
            href="/admin/products?action=new"
            className="px-4 py-2 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Equipment</span>
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Executive KPI Analytics Cards */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Gross Sales */}
        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl p-4 sm:p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Sales</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            {formatINR(totalSalesRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
            <span>+24.6%</span>
            <span className="text-stone-400 font-normal">vs last month</span>
          </div>
        </div>

        {/* Orders in Pipeline */}
        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl p-4 sm:p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Orders Pipeline</span>
            <div className="w-7 h-7 rounded-lg bg-[#F5821F]/10 text-[#F5821F] flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            {ordersList.length} Orders
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#F5821F] font-bold pt-1">
            <span className="w-2 h-2 rounded-full bg-[#F5821F] animate-pulse" />
            <span>{processingCount} Pending Dispatch</span>
          </div>
        </div>

        {/* Customer Reorders */}
        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl p-4 sm:p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Repeat Buyers</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            {reordersCount} Reorders
          </div>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold pt-1 block">
            50% Customer Retention Rate
          </span>
        </div>

        {/* Showroom Inventory Health */}
        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl p-4 sm:p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Live Inventory</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            {totalProducts} Items
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
            <span className="text-emerald-500 font-bold">{inStockCount} In Stock</span>
            {outOfStockCount > 0 && (
              <span className="text-amber-500 font-bold">{outOfStockCount} Pre-Order Only</span>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Navigation View Switcher (Orders | Customer Reviews | Inventory) */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-[#2a2621]">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-[#F5821F] text-[#F5821F]'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Live Customer Orders ({ordersList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'border-[#F5821F] text-[#F5821F]'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Customer Reviews &amp; Test Shots ({reviewsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'border-[#F5821F] text-[#F5821F]'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Stock &amp; Category Distribution</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: LIVE ORDERS & REORDERS TABLE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl shadow-sm overflow-hidden space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-[#2a2621] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by customer name, phone, order #, or gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#F5821F]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => setOrderFilter('all')}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                  orderFilter === 'all'
                    ? 'bg-[#F5821F] text-black shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                All Orders ({ordersList.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('reorders')}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                  orderFilter === 'reorders'
                    ? 'bg-[#F5821F] text-black shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reorders Only ({reordersCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('processing')}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                  orderFilter === 'processing'
                    ? 'bg-[#F5821F] text-black shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                Pending Verification ({processingCount})
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 dark:bg-[#1f1c18] border-b border-stone-200 dark:border-[#2a2621] text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Order / Date</th>
                  <th className="py-3 px-4">Ordered Equipment</th>
                  <th className="py-3 px-4">Total &amp; Payment</th>
                  <th className="py-3 px-4">Status &amp; Actions</th>
                  <th className="py-3 px-4 text-right">Invoice &amp; Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-[#2a2621]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-500 space-y-1">
                      <p className="font-bold">No orders match your filter criteria.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setOrderFilter('all');
                        }}
                        className="text-xs text-[#F5821F] hover:underline font-bold"
                      >
                        Reset Search &amp; Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isReorder = order.customerType.includes('Reordered');

                    return (
                      <tr
                        key={order.id}
                        className={`hover:bg-stone-50/70 dark:hover:bg-stone-900/40 transition-colors ${
                          isReorder ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        {/* 1. Customer Column */}
                        <td className="py-3.5 px-4 align-top max-w-[220px]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-stone-900 dark:text-white">
                              {order.customerName}
                            </span>
                            {isReorder && (
                              <span className="text-[9px] bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold px-1.5 py-0.5 rounded-full border border-amber-500/30">
                                Repeat Buyer
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <a
                              href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 text-[11px] font-bold"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>{order.customerPhone}</span>
                            </a>
                          </div>

                          <span className="text-[10px] text-stone-400 block truncate mt-0.5">
                            {order.customerEmail}
                          </span>
                          <span className="text-[10px] text-stone-500 block truncate mt-0.5" title={order.address}>
                            📍 {order.address}
                          </span>
                        </td>

                        {/* 2. Order # & Date */}
                        <td className="py-3.5 px-4 align-top whitespace-nowrap">
                          <span className="font-mono font-bold text-stone-900 dark:text-white block">
                            {order.orderNumber}
                          </span>
                          <span className="text-[10px] text-stone-400 block mt-0.5">
                            {order.date}
                          </span>
                          <span className="text-[10px] text-stone-500 block mt-0.5">
                            AWB: <span className="font-mono">{order.trackingAwb}</span>
                          </span>
                        </td>

                        {/* 3. Items */}
                        <td className="py-3.5 px-4 align-top max-w-[280px]">
                          <div className="space-y-1.5">
                            {order.items.map((it, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 p-1.5 rounded-lg bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-stone-800"
                              >
                                {it.imageUrl && (
                                  <div className="relative w-8 h-8 rounded bg-white shrink-0 overflow-hidden border border-stone-200 dark:border-stone-800">
                                    <Image
                                      src={it.imageUrl}
                                      alt={it.name}
                                      fill
                                      className="object-contain p-0.5"
                                    />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-stone-800 dark:text-stone-200 text-[11px] truncate">
                                    {it.name}
                                  </div>
                                  <div className="text-[10px] text-stone-500 flex items-center justify-between">
                                    <span>Qty: {it.quantity}</span>
                                    <span className="font-bold text-[#F5821F]">
                                      {formatINR(it.price * it.quantity)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* 4. Total & Payment */}
                        <td className="py-3.5 px-4 align-top whitespace-nowrap">
                          <div className="font-black text-sm text-stone-900 dark:text-white">
                            {formatINR(order.totalAmount)}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                              {order.paymentStatus}
                            </span>
                            <span className="text-[10px] text-stone-500">{order.paymentMethod}</span>
                          </div>
                        </td>

                        {/* 5. In-line Status Changers */}
                        <td className="py-3.5 px-4 align-top whitespace-nowrap space-y-1.5">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, e.target.value as CustomerOrderRecord['status'])
                            }
                            className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-all cursor-pointer focus:outline-none ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                : order.status === 'Dispatched'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                                : order.status === 'Verified'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                            }`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Verified">Verified</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <div className="text-[10px] text-stone-400">
                            Partner: {order.courierPartner.split(' ')[0]}
                          </div>
                        </td>

                        {/* 6. Invoice & WhatsApp Dispatch Link */}
                        <td className="py-3.5 px-4 align-top text-right whitespace-nowrap space-y-1.5">
                          <button
                            type="button"
                            onClick={() => openInvoiceForOrder(order)}
                            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-[#F5821F] hover:text-black hover:border-[#F5821F] text-stone-700 dark:text-stone-300 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>18% GST Bill</span>
                          </button>

                          <div>
                            <a
                              href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hi ${order.customerName}, Greetings from Mi King's Cameras (Hyderabad). Your order #${order.orderNumber} has been verified and packed with our certified 1-Year Store Warranty. Tracking AWB: ${order.trackingAwb}. Live status: https://mikcameras.in/track`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp Dispatch AWB</span>
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: CUSTOMER REVIEWS & TEST SHOTS MODERATION */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'reviews' && (
        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-stone-900 dark:text-white">
                  Customer Review Submissions &amp; Equipment Photos
                </h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Verified Buyers Only
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Inspect customer-uploaded sample shots, verify store invoice receipts, and moderate public visibility.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-stone-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#F5821F] text-black font-black flex items-center justify-center text-xs">
                      {rev.customerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900 dark:text-white">
                          {rev.customerName}
                        </span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Verified: {rev.orderReference}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Product: <strong className="text-stone-800 dark:text-stone-200">{rev.productName}</strong> &bull; {rev.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400' : 'text-stone-300 dark:text-stone-700'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-amber-500 ml-1">{rev.rating}/5</span>
                  </div>
                </div>

                {/* Review Headline & Body */}
                <h4 className="text-xs font-bold text-stone-900 dark:text-white">{rev.title}</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                {/* Uploaded Customer Photos */}
                {rev.photos && rev.photos.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    {rev.photos.map((p, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 group"
                      >
                        <Image src={p} alt="Customer upload" fill className="object-cover" sizes="80px" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800 text-xs">
                  <span className="text-[11px] text-stone-400">Submitted {rev.date}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setReviewsList((prev) =>
                          prev.map((r) => (r.id === rev.id ? { ...r, isApproved: !r.isApproved } : r))
                        );
                        setStatusToast(`Review status updated!`);
                        setTimeout(() => setStatusToast(null), 2500);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        rev.isApproved
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {rev.isApproved ? '✓ Published on Product Page' : 'Pending Approval'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: INVENTORY HEALTH & STOCK DISTRIBUTION */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="font-bold text-stone-900 dark:text-white text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#F5821F]" />
                  <span>Category Inventory Allocation</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Breakdown across DSLR, Mirrorless, Lenses, Drones and Gimbals.
                </p>
              </div>
              <Link
                href="/admin/products"
                className="text-xs text-[#F5821F] hover:underline font-bold"
              >
                Full Catalog &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'DSLR Cameras', count: INITIAL_PRODUCTS.filter((p) => p.category === 'dslr').length, sample: 'Canon 80D, 90D, Nikon D7500' },
                { name: 'Mirrorless Bodies', count: INITIAL_PRODUCTS.filter((p) => p.category === 'mirrorless').length, sample: 'Sony A7 IV, FX3, Canon R6 II' },
                { name: 'Lenses & Optics', count: INITIAL_PRODUCTS.filter((p) => p.category === 'lenses').length, sample: 'Prime, Telephoto & Wide Lenses' },
                { name: 'Drones & Aerial', count: INITIAL_PRODUCTS.filter((p) => p.category === 'drones').length, sample: 'DJI Mini 4 Pro, Air 3, Mavic' },
                { name: 'Accessories & Gimbals', count: INITIAL_PRODUCTS.filter((p) => p.category === 'accessories').length, sample: 'DJI Ronin RS3, Bags, Batteries' },
              ].map((cat) => (
                <div
                  key={cat.name}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-[#110f0d] flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-stone-900 dark:text-white">{cat.name}</h4>
                    <p className="text-[10px] text-stone-400 mt-0.5">{cat.sample}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-base text-[#F5821F] block">{cat.count}</span>
                    <span className="text-[9px] text-stone-400 uppercase tracking-wider">Units</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Operations Widget */}
          <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-900 dark:text-white text-sm pb-2 border-b border-stone-200 dark:border-stone-800">
              Hyderabad Showroom Status
            </h3>

            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#F5821F]" />
                  <span>Showroom Hub</span>
                </span>
                <span className="font-bold text-stone-900 dark:text-white">Pillar 103, Tadbun</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Store Warranty</span>
                </span>
                <span className="text-emerald-500 font-bold">1-Year Certified</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp Concierge</span>
                </span>
                <span className="font-mono font-bold">+91 90322 85420</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>Showroom Staff</span>
                </span>
                <span className="text-stone-500">Mohd Idrees &amp; Team</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-400">
              Connected to local Supabase database instance with active RLS policies.
            </div>
          </div>
        </div>
      )}

      {/* Customer GST Tax Invoice Modal */}
      {selectedInvoice && (
        <CustomerInvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
