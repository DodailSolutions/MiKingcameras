'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Printer,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ExternalLink,
  MessageSquare,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  Download,
  RotateCcw,
  Sparkles,
  Package,
  User,
  History,
  Check,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { CustomerInvoiceModal, InvoiceData } from '@/components/invoice/CustomerInvoiceModal';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  hsn: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  orderStatus: 'processing' | 'verified' | 'dispatched' | 'delivered' | 'cancelled';
  trackingAwb?: string;
  courierPartner?: string;
  createdAt: string;
  isReorder?: boolean;
  previousOrderNumber?: string;
  reorderReason?: string;
}

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-104',
    orderNumber: 'MIK-982107',
    customerName: 'Kishore Varma',
    customerEmail: 'kishore.varma90@gmail.com',
    customerPhone: '+91 98490 12345',
    shippingAddress: 'Flat 402, Aditya Elite, Jubilee Hills Road No. 36',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    items: [
      {
        id: '10',
        name: 'Canon RF 50mm f/1.8 STM Prime Lens',
        price: 18999,
        quantity: 1,
        hsn: '900211',
      },
      {
        id: '11',
        name: 'SanDisk Extreme Pro 128GB UHS-I SD Card',
        price: 2499,
        quantity: 2,
        hsn: '852351',
      },
    ],
    totalAmount: 23997,
    paymentMethod: 'UPI (PhonePe)',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    trackingAwb: 'DEL-HYD-982107',
    courierPartner: 'Delhivery Surface Pro',
    createdAt: '2026-11-05T16:30:00Z',
    isReorder: true,
    previousOrderNumber: 'MIK-982104',
    reorderReason: 'Customer reordered prime lens & fast SD cards after purchasing Canon R6 Mark II yesterday.',
  },
  {
    id: 'ord-101',
    orderNumber: 'MIK-982104',
    customerName: 'Kishore Varma',
    customerEmail: 'kishore.varma90@gmail.com',
    customerPhone: '+91 98490 12345',
    shippingAddress: 'Flat 402, Aditya Elite, Jubilee Hills Road No. 36',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    items: [
      {
        id: '1',
        name: 'Canon EOS R6 Mark II Mirrorless Body',
        price: 185000,
        quantity: 1,
        hsn: '900659',
      },
      {
        id: '2',
        name: 'Canon RF 24-70mm f/2.8L IS USM Lens',
        price: 165000,
        quantity: 1,
        hsn: '900211',
      },
    ],
    totalAmount: 350000,
    paymentMethod: 'UPI (PhonePe)',
    paymentStatus: 'paid',
    orderStatus: 'dispatched',
    trackingAwb: 'DEL-HYD-90321',
    courierPartner: 'Delhivery Surface Pro',
    createdAt: '2026-11-04T09:45:00Z',
  },
  {
    id: 'ord-102',
    orderNumber: 'MIK-982105',
    customerName: 'Mohammed Rafeeq (Cinemas)',
    customerEmail: 'rafeeq.cinemas@gmail.com',
    customerPhone: '+91 97000 54321',
    shippingAddress: 'House 12-2-417, Mehdipatnam Main Road',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500028',
    items: [
      {
        id: '3',
        name: 'Sony FX3 Cinema Line Full-Frame Camera',
        price: 340000,
        quantity: 1,
        hsn: '900659',
      },
    ],
    totalAmount: 340000,
    paymentMethod: 'Direct Bank Transfer (NEFT)',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    trackingAwb: 'SR-EXP-77291',
    courierPartner: 'Shiprocket Bluedart',
    createdAt: '2026-11-03T16:20:00Z',
    isReorder: true,
    previousOrderNumber: 'MIK-980012',
    reorderReason: 'Studio expansion: Reordered FX3 body after receiving Sony A7S III last month.',
  },
  {
    id: 'ord-103',
    orderNumber: 'MIK-982106',
    customerName: 'Anil Reddy Photography',
    customerEmail: 'anil.creatives@yahoo.com',
    customerPhone: '+91 99890 87654',
    shippingAddress: 'Plot 89, Kakatiya Hills, Madhapur',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    items: [
      {
        id: '4',
        name: 'Sigma 24-70mm f/2.8 DG DN Art Lens for Sony E',
        price: 89000,
        quantity: 1,
        hsn: '900211',
      },
    ],
    totalAmount: 89000,
    paymentMethod: 'UPI (Google Pay)',
    paymentStatus: 'pending',
    orderStatus: 'processing',
    createdAt: '2026-11-05T11:15:00Z',
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewTab, setViewTab] = useState<'all' | 'reorders'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

  const reordersCount = orders.filter((o) => o.isReorder).length;

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (viewTab === 'reorders' && !o.isReorder) return false;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.items.some((it) => it.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
  };

  const openInvoiceForOrder = (order: Order) => {
    setSelectedInvoice({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      items: order.items.map((it) => ({
        name: it.name,
        quantity: it.quantity,
        price: it.price,
        hsn: it.hsn,
      })),
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      date: new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      trackingId: order.trackingAwb,
      courierPartner: order.courierPartner,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ------------------------------------------------------------- */}
      {/* WordPress WooCommerce Page Header */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-stone-300 dark:border-stone-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <span>Orders &amp; Reorder Management</span>
            <span className="text-xs font-normal text-stone-500 bg-stone-200 dark:bg-stone-800 px-2 py-0.5 rounded">
              WooCommerce Next
            </span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Track customer purchase history, who reordered what, courier dispatch status, and official 18% GST invoicing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-stone-500 block">Total Revenue</span>
            <span className="text-sm font-black text-stone-900 dark:text-white">
              {formatINR(orders.reduce((sum, o) => sum + o.totalAmount, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* View Tabs: All Orders vs Customer Reorders */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2 text-xs">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setViewTab('all')}
            className={`font-semibold pb-2 border-b-2 transition-colors cursor-pointer ${
              viewTab === 'all'
                ? 'border-[#F5821F] text-[#F5821F]'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setViewTab('reorders')}
            className={`font-semibold pb-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              viewTab === 'reorders'
                ? 'border-[#F5821F] text-[#F5821F]'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Customer Reorders ({reordersCount})</span>
            <span className="bg-[#F5821F] text-black text-[10px] font-black px-1.5 rounded-full">
              Key Insight
            </span>
          </button>
        </div>

        <span className="text-stone-500 hidden sm:inline">
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Filter and Search Bar */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white dark:bg-[#1c1917] border border-stone-300/80 dark:border-stone-800 rounded-lg p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search customer, item, phone, order #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400" />
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="processing">Processing</option>
            <option value="verified">Verified</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Orders Table */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white dark:bg-[#1c1917] border border-stone-300/80 dark:border-stone-800 rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 text-stone-600 dark:text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order # &amp; Date</th>
                <th className="py-3 px-4">Customer &amp; Phone</th>
                <th className="py-3 px-4">Who Ordered What (Item Details)</th>
                <th className="py-3 px-4">Total &amp; Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {filteredOrders.map((order) => {
                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-stone-50/70 dark:hover:bg-stone-900/50 transition-colors ${
                      order.isReorder ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''
                    }`}
                  >
                    {/* Order # and Date */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <span className="font-mono font-bold text-stone-900 dark:text-white block">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] text-stone-500 block mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>

                      {order.isReorder && (
                        <div className="mt-1.5">
                          <span className="inline-flex items-center gap-1 bg-[#F5821F]/15 border border-[#F5821F]/30 text-[#E0741A] dark:text-[#F5821F] text-[9px] font-black px-1.5 py-0.5 rounded">
                            <RotateCcw className="w-2.5 h-2.5" />
                            <span>REORDER</span>
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4 align-top max-w-[200px]">
                      <span className="font-bold text-stone-900 dark:text-white block">
                        {order.customerName}
                      </span>
                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 text-[11px] font-semibold mt-0.5"
                      >
                        <MessageSquare className="w-3 h-3" />
                        {order.customerPhone}
                      </a>
                      <span className="text-[10px] text-stone-400 block truncate mt-0.5">
                        {order.customerEmail}
                      </span>
                      <span className="text-[10px] text-stone-500 block line-clamp-2 mt-1">
                        📍 {order.shippingAddress}, {order.city} - {order.pincode}
                      </span>
                    </td>

                    {/* Items Ordered */}
                    <td className="py-3.5 px-4 align-top max-w-[280px]">
                      <div className="space-y-1.5">
                        {order.items.map((it) => (
                          <div
                            key={it.id}
                            className="bg-stone-50 dark:bg-stone-900 p-1.5 rounded border border-stone-200 dark:border-stone-800"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-stone-800 dark:text-stone-200 text-[11px] line-clamp-1">
                                {it.name}
                              </span>
                              <span className="font-black text-[#F5821F] shrink-0 text-[10px]">
                                {it.quantity}x
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-stone-500 mt-0.5">
                              <span>HSN: {it.hsn}</span>
                              <span className="font-medium text-stone-700 dark:text-stone-300">
                                {formatINR(it.price)}
                              </span>
                            </div>
                          </div>
                        ))}

                        {order.reorderReason && (
                          <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-700 dark:text-amber-400 italic">
                            &bull; Reorder note: {order.reorderReason} (Prev: {order.previousOrderNumber})
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Amount & Payment */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <span className="font-black text-stone-900 dark:text-white block text-sm">
                        {formatINR(order.totalAmount)}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                        <span className="text-[10px] text-stone-500">{order.paymentMethod}</span>
                      </div>
                    </td>

                    {/* Order Status & Courier */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                        className={`text-xs font-bold rounded-md px-2 py-1 border focus:outline-none cursor-pointer ${
                          order.orderStatus === 'verified'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                            : order.orderStatus === 'dispatched'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                            : order.orderStatus === 'delivered'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/30'
                        }`}
                      >
                        <option value="processing">Processing</option>
                        <option value="verified">Verified</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {order.trackingAwb && (
                        <span className="text-[10px] text-stone-500 block mt-1">
                          AWB: {order.trackingAwb}
                        </span>
                      )}
                    </td>

                    {/* Actions: GST Invoice */}
                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap space-y-1">
                      <button
                        type="button"
                        onClick={() => openInvoiceForOrder(order)}
                        className="px-2.5 py-1 rounded bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        title="Download or Print GST Tax Invoice"
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
