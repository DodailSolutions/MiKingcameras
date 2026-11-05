'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/data/catalog';
import { formatINR } from '@/lib/utils';
import { CustomerInvoiceModal, InvoiceData } from '@/components/invoice/CustomerInvoiceModal';

interface CustomerOrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  customerType: 'Repeat Customer (Reordered)' | 'First-Time Buyer';
  totalOrdersByCustomer: number;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    category: string;
    imageUrl?: string;
  }>;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending';
  status: 'Processing' | 'Verified' | 'Dispatched' | 'Delivered';
  courierPartner: string;
  trackingAwb: string;
  reorderNotes?: string;
}

const LIVE_ORDERS_AND_REORDERS: CustomerOrderRecord[] = [
  {
    id: 'ord-104',
    orderNumber: 'MIK-982107',
    customerName: 'Kishore Varma',
    customerEmail: 'kishore.varma90@gmail.com',
    customerPhone: '+91 98490 12345',
    address: 'Flat 402, Aditya Elite, Jubilee Hills Road 36, Hyderabad 500033',
    customerType: 'Repeat Customer (Reordered)',
    totalOrdersByCustomer: 2,
    date: '05 Nov 2026, 04:30 PM',
    items: [
      {
        name: 'Canon RF 50mm f/1.8 STM Prime Lens',
        quantity: 1,
        price: 18999,
        category: 'Lenses',
        imageUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'SanDisk Extreme Pro 128GB UHS-I SD Card',
        quantity: 2,
        price: 2499,
        category: 'Accessories',
        imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=300&q=80',
      },
    ],
    totalAmount: 23997,
    paymentMethod: 'UPI (PhonePe)',
    paymentStatus: 'Paid',
    status: 'Processing',
    courierPartner: 'Delhivery Surface Pro',
    trackingAwb: 'DEL-HYD-982107',
    reorderNotes: 'Reordered accessories after purchasing Canon EOS R6 Mark II yesterday!',
  },
  {
    id: 'ord-101',
    orderNumber: 'MIK-982104',
    customerName: 'Kishore Varma',
    customerEmail: 'kishore.varma90@gmail.com',
    customerPhone: '+91 98490 12345',
    address: 'Flat 402, Aditya Elite, Jubilee Hills Road 36, Hyderabad 500033',
    customerType: 'First-Time Buyer',
    totalOrdersByCustomer: 2,
    date: '04 Nov 2026, 11:15 AM',
    items: [
      {
        name: 'Canon EOS R6 Mark II Mirrorless Body',
        quantity: 1,
        price: 185000,
        category: 'Mirrorless',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'Canon RF 24-70mm f/2.8L IS USM Lens',
        quantity: 1,
        price: 165000,
        category: 'Lenses',
        imageUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=300&q=80',
      },
    ],
    totalAmount: 350000,
    paymentMethod: 'UPI (PhonePe)',
    paymentStatus: 'Paid',
    status: 'Dispatched',
    courierPartner: 'Delhivery Surface Pro',
    trackingAwb: 'DEL-HYD-90321',
  },
  {
    id: 'ord-102',
    orderNumber: 'MIK-982105',
    customerName: 'Mohammed Rafeeq (Cinemas)',
    customerEmail: 'rafeeq.cinemas@gmail.com',
    customerPhone: '+91 97000 54321',
    address: 'House 12-2-417, Mehdipatnam Main Road, Hyderabad 500028',
    customerType: 'Repeat Customer (Reordered)',
    totalOrdersByCustomer: 3,
    date: '03 Nov 2026, 02:40 PM',
    items: [
      {
        name: 'Sony FX3 Cinema Line Full-Frame Camera',
        quantity: 1,
        price: 340000,
        category: 'Mirrorless',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80',
      },
    ],
    totalAmount: 340000,
    paymentMethod: 'Direct Bank Transfer (NEFT)',
    paymentStatus: 'Paid',
    status: 'Delivered',
    courierPartner: 'Shiprocket Bluedart',
    trackingAwb: 'SR-EXP-77291',
    reorderNotes: 'Frequent commercial studio client. 3rd flagship cinema camera order.',
  },
  {
    id: 'ord-103',
    orderNumber: 'MIK-982106',
    customerName: 'Anil Reddy Photography',
    customerEmail: 'anil.creatives@yahoo.com',
    customerPhone: '+91 99890 87654',
    address: 'Plot 89, Kakatiya Hills, Madhapur, Hyderabad 500081',
    customerType: 'First-Time Buyer',
    totalOrdersByCustomer: 1,
    date: '02 Nov 2026, 05:20 PM',
    items: [
      {
        name: 'Sigma 24-70mm f/2.8 DG DN Art Lens for Sony E',
        quantity: 1,
        price: 89000,
        category: 'Lenses',
        imageUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=300&q=80',
      },
    ],
    totalAmount: 89000,
    paymentMethod: 'UPI (Google Pay)',
    paymentStatus: 'Pending',
    status: 'Processing',
    courierPartner: 'DTDC Priority Express',
    trackingAwb: 'DTDC-HYD-55120',
  },
];

export default function AdminDashboardPage() {
  const [orderFilter, setOrderFilter] = useState<'all' | 'reorders' | 'first-time'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

  const totalProducts = INITIAL_PRODUCTS.length;
  const inStockCount = INITIAL_PRODUCTS.filter((p) => p.inStock).length;
  const totalInventoryValue = INITIAL_PRODUCTS.reduce((acc, p) => acc + p.salePrice, 0);

  // Categories breakdown
  const categoryStats = [
    { name: 'DSLR Cameras', slug: 'dslr', count: INITIAL_PRODUCTS.filter(p => p.category === 'dslr').length, sample: 'Canon 80D, 90D, Nikon D7500' },
    { name: 'Mirrorless Cameras', slug: 'mirrorless', count: INITIAL_PRODUCTS.filter(p => p.category === 'mirrorless').length, sample: 'Sony A7 IV, FX3, Canon R6 II' },
    { name: 'Lenses & Optics', slug: 'lenses', count: INITIAL_PRODUCTS.filter(p => p.category === 'lenses').length, sample: 'Prime, Telephoto & Wide Lenses' },
    { name: 'Drones & Aerial', slug: 'drones', count: INITIAL_PRODUCTS.filter(p => p.category === 'drones').length, sample: 'DJI Mini 4 Pro, Air 3, Mavic' },
    { name: 'Accessories & Gimbals', slug: 'accessories', count: INITIAL_PRODUCTS.filter(p => p.category === 'accessories').length, sample: 'DJI Ronin RS3, Bags, Batteries' },
  ];

  // Filtered orders
  const filteredOrders = LIVE_ORDERS_AND_REORDERS.filter(order => {
    if (orderFilter === 'reorders') return order.customerType.includes('Reordered');
    if (orderFilter === 'first-time') return order.customerType === 'First-Time Buyer';
    return true;
  });

  const totalSalesRevenue = LIVE_ORDERS_AND_REORDERS.reduce((acc, o) => acc + o.totalAmount, 0);
  const reordersCount = LIVE_ORDERS_AND_REORDERS.filter(o => o.customerType.includes('Reordered')).length;

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
      items: order.items.map(it => ({
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ------------------------------------------------------------- */}
      {/* WordPress Page Header */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-300 dark:border-stone-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <span>Dashboard</span>
            <span className="text-xs font-normal text-stone-500 bg-stone-200 dark:bg-stone-800 px-2 py-0.5 rounded">
              WooCommerce Storefront
            </span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Store overview: Hyderabad showroom operations, live customer orders, reorders, and catalog inventory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products?action=new"
            className="px-3 py-1.5 rounded bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="px-3 py-1.5 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#F5821F]" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* WooCommerce KPI Analytics Summary Cards */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Net Sales */}
        <div className="bg-white dark:bg-[#1c1917] border border-stone-300/80 dark:border-stone-800 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-1">
            {formatINR(totalSalesRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            <span>+18.4%</span>
            <span className="text-stone-400">vs last month</span>
          </div>
        </div>

        {/* Customer Reorders */}
        <div className="bg-white dark:bg-[#1c1917] border border-stone-300/80 dark:border-stone-800 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Customer Reorders</span>
            <RotateCcw className="w-4 h-4 text-[#F5821F]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-1">
            {reordersCount} Reorders
          </div>
          <span className="text-[11px] text-[#F5821F] font-semibold mt-1 block">
            50% Repeat customer rate
          </span>
        </div>

        {/* Active Products */}
        <div className="bg-white dark:bg-[#1c1917] border border-stone-300/80 dark:border-stone-800 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Published Products</span>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-1">
            {totalProducts} Items
          </div>
          <Link href="/admin/products" className="text-[11px] text-blue-600 dark:text-blue-400 font-medium hover:underline mt-1 block">
            Across 5 categories &rarr;
          </Link>
        </div>

        {/* Catalog Valuation */}
        <div className="bg-white dark:bg-[#1c1917] border border-stone-300/80 dark:border-stone-800 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Inventory Value</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-1">
            {formatINR(totalInventoryValue)}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            {inStockCount} in stock at showroom
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PRIMARY SECTION: WHO ORDERED & REORDERED WHAT */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white dark:bg-[#1c1917] border border-stone-300/80 dark:border-stone-800 rounded-lg shadow-2xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-[#F5821F]" />
              <span>Who Ordered &amp; Reordered What</span>
              <span className="bg-[#F5821F]/15 text-[#E0741A] dark:text-[#F5821F] text-[11px] font-bold px-2 py-0.5 rounded-full">
                {LIVE_ORDERS_AND_REORDERS.length} Transactions
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Clear breakdown of every customer, repeat purchase history, exact items ordered, delivery address, and status.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-900 p-1 rounded-md text-xs font-semibold">
            <button
              type="button"
              onClick={() => setOrderFilter('all')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                orderFilter === 'all'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              All Orders ({LIVE_ORDERS_AND_REORDERS.length})
            </button>
            <button
              type="button"
              onClick={() => setOrderFilter('reorders')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                orderFilter === 'reorders'
                  ? 'bg-[#F5821F] text-black shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reorders Only ({reordersCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setOrderFilter('first-time')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                orderFilter === 'first-time'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              First-Time Buyers
            </button>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Customer &amp; Phone</th>
                <th className="py-3 px-4">Order / Date</th>
                <th className="py-3 px-4">What They Ordered (Items &amp; Qty)</th>
                <th className="py-3 px-4">Buyer Type / Notes</th>
                <th className="py-3 px-4">Total &amp; Payment</th>
                <th className="py-3 px-4">Status &amp; Courier</th>
                <th className="py-3 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {filteredOrders.map((order) => {
                const isReorder = order.customerType.includes('Reordered');
                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-stone-50/70 dark:hover:bg-stone-900/50 transition-colors ${
                      isReorder ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''
                    }`}
                  >
                    {/* 1. Customer Column */}
                    <td className="py-3.5 px-4 align-top max-w-[200px]">
                      <div className="font-bold text-stone-900 dark:text-white text-xs">
                        {order.customerName}
                      </div>
                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 text-[11px] font-semibold mt-0.5"
                      >
                        <MessageSquare className="w-3 h-3" />
                        {order.customerPhone}
                      </a>
                      <span className="text-[10px] text-stone-400 block truncate mt-0.5" title={order.customerEmail}>
                        {order.customerEmail}
                      </span>
                      <span className="text-[10px] text-stone-500 block truncate mt-1" title={order.address}>
                        📍 {order.address.split(',')[0]}
                      </span>
                    </td>

                    {/* 2. Order # & Date */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <span className="font-mono font-bold text-stone-900 dark:text-white block">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] text-stone-500 block mt-0.5">
                        {order.date}
                      </span>
                    </td>

                    {/* 3. What They Ordered */}
                    <td className="py-3.5 px-4 align-top max-w-[280px]">
                      <div className="space-y-1.5">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-start gap-2 bg-stone-50 dark:bg-stone-900 p-1.5 rounded border border-stone-200 dark:border-stone-800">
                            {it.imageUrl && (
                              <img
                                src={it.imageUrl}
                                alt={it.name}
                                className="w-8 h-8 rounded object-contain bg-white dark:bg-stone-950 shrink-0 border border-stone-200 dark:border-stone-800"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="font-semibold text-stone-800 dark:text-stone-200 block text-[11px] leading-tight line-clamp-1">
                                {it.name}
                              </span>
                              <div className="flex items-center justify-between text-[10px] text-stone-500 mt-0.5">
                                <span className="font-bold text-[#F5821F]">Qty: {it.quantity}</span>
                                <span>{formatINR(it.price)} each</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* 4. Buyer Type & Reorder Notes */}
                    <td className="py-3.5 px-4 align-top max-w-[180px]">
                      {isReorder ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/40 text-[#D97706] dark:text-[#F5821F] text-[10px] font-black px-2 py-0.5 rounded">
                            <RotateCcw className="w-3 h-3" />
                            <span>Repeat Buyer ({order.totalOrdersByCustomer} Orders)</span>
                          </span>
                          {order.reorderNotes && (
                            <p className="text-[10px] text-stone-600 dark:text-stone-400 italic leading-snug">
                              &ldquo;{order.reorderNotes}&rdquo;
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-block bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                          First-Time Buyer
                        </span>
                      )}
                    </td>

                    {/* 5. Total & Payment */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <span className="font-black text-stone-900 dark:text-white block text-sm">
                        {formatINR(order.totalAmount)}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}>
                          {order.paymentStatus}
                        </span>
                        <span className="text-[10px] text-stone-500">{order.paymentMethod.split(' ')[0]}</span>
                      </div>
                    </td>

                    {/* 6. Status & Courier */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : order.status === 'Dispatched'
                          ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                          : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-[10px] text-stone-500 block mt-1">
                        {order.courierPartner.split(' ')[0]} &bull; {order.trackingAwb}
                      </span>
                    </td>

                    {/* 7. Action: GST Invoice */}
                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openInvoiceForOrder(order)}
                        className="px-2.5 py-1 rounded border border-stone-300 dark:border-stone-700 hover:bg-[#F5821F] hover:border-[#F5821F] hover:text-black text-stone-700 dark:text-stone-300 font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        title="Download or Print GST Invoice"
                      >
                        <FileText className="w-3 h-3" />
                        <span>GST Bill</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECONDARY ROW: Categories Overview & WordPress "At A Glance" */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Box A: Detailed Categories Breakdown */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1c1917] border border-stone-300/80 dark:border-stone-800 rounded-lg p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="font-bold text-stone-900 dark:text-white text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#F5821F]" />
                <span>Product Categories &amp; Stock Distribution</span>
              </h3>
              <p className="text-xs text-stone-500">
                Managed camera lines across DSLR, Mirrorless, Lenses, Drones and Gimbals.
              </p>
            </div>
            <Link
              href="/admin/products?tab=categories"
              className="text-xs text-[#2271b1] hover:underline font-semibold"
            >
              Manage Categories &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categoryStats.map((cat) => (
              <div
                key={cat.slug}
                className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 flex items-center justify-between hover:border-[#F5821F]/50 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-xs text-stone-900 dark:text-white">{cat.name}</h4>
                  <p className="text-[10px] text-stone-400 mt-0.5">{cat.sample}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-sm text-[#F5821F] block">{cat.count}</span>
                  <span className="text-[9px] text-stone-500 uppercase tracking-wider">In Stock</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Box B: WordPress "At A Glance" Widget */}
        <div className="bg-white dark:bg-[#1c1917] border border-stone-300/80 dark:border-stone-800 rounded-lg p-5 shadow-2xs space-y-3">
          <h3 className="font-bold text-stone-900 dark:text-white text-sm pb-2 border-b border-stone-200 dark:border-stone-800">
            At a Glance
          </h3>

          <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
            <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800/60">
              <span className="flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-stone-400" />
                <span>153 Products</span>
              </span>
              <span className="text-emerald-500 font-bold">100% In Stock</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800/60">
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-stone-400" />
                <span>5 Categories</span>
              </span>
              <span className="text-stone-500">Active</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800/60">
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-3.5 h-3.5 text-stone-400" />
                <span>3 Pending Orders</span>
              </span>
              <span className="text-[#F5821F] font-bold">Action Needed</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                <span>4 Staff Roles</span>
              </span>
              <span className="text-stone-500">RBAC Secured</span>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500">
            Running on Next.js 16.4 + PostgreSQL database.
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <CustomerInvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
