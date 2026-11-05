'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { supabase } from '@/lib/supabase-service';

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
}

const SAMPLE_ORDERS: Order[] = [
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
    orderStatus: 'verified',
    trackingAwb: 'DEL-HYD-90321',
    courierPartner: 'Delhivery Surface Pro',
    createdAt: '2026-11-05T09:45:00Z',
  },
  {
    id: 'ord-102',
    orderNumber: 'MIK-982105',
    customerName: 'Mohammed Rafeeq',
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
    orderStatus: 'dispatched',
    trackingAwb: 'SR-EXP-77291',
    courierPartner: 'Shiprocket Bluedart',
    createdAt: '2026-11-04T16:20:00Z',
  },
  {
    id: 'ord-103',
    orderNumber: 'MIK-982106',
    customerName: 'Anil Reddy',
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
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [includeGst, setIncludeGst] = useState<boolean>(true);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F5821F]/10 text-[#F5821F]">
              <ShoppingCart className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white">
              Order Fulfillment &amp; GST Invoicing
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Manage incoming store reservations, dispatch statuses, and generate official 18% GST tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-stone-500 block">Total Orders</span>
            <span className="text-sm font-black text-stone-900 dark:text-white">
              {orders.length} orders (₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString('en-IN')})
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search order #, customer name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 dark:bg-[#1b1916] border border-stone-300 dark:border-stone-700 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400" />
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-50 dark:bg-[#1b1916] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
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

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-[#24211d] bg-stone-50 dark:bg-[#1b1916] text-stone-600 dark:text-stone-400 font-bold">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer &amp; Address</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Amount &amp; Pay</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-[#24211d]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/50 dark:hover:bg-[#1a1815] transition-colors">
                  <td className="py-3.5 px-4 align-top">
                    <span className="font-black text-stone-900 dark:text-white block">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 align-top max-w-xs">
                    <span className="font-bold text-stone-900 dark:text-white block">
                      {order.customerName}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-500 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <MessageSquare className="w-3 h-3" />
                        {order.customerPhone}
                      </a>
                    </div>
                    <span className="text-[10px] text-stone-400 block mt-1 line-clamp-2">
                      {order.shippingAddress}, {order.city} - {order.pincode}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 align-top">
                    <div className="space-y-1">
                      {order.items.map((it) => (
                        <div key={it.id} className="text-stone-800 dark:text-stone-200 font-medium">
                          <span className="font-bold text-[#F5821F] mr-1">{it.quantity}x</span>
                          {it.name}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 align-top">
                    <span className="font-black text-stone-900 dark:text-white block">
                      {formatINR(order.totalAmount)}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                      <span className="text-[10px] text-stone-500">{order.paymentMethod}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 align-top">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                      className={`text-xs font-bold rounded-xl px-2.5 py-1 border focus:outline-none cursor-pointer ${
                        order.orderStatus === 'verified'
                          ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                          : order.orderStatus === 'dispatched'
                          ? 'bg-purple-500/10 text-purple-500 border-purple-500/30'
                          : order.orderStatus === 'delivered'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                          : 'bg-stone-500/10 text-stone-400 border-stone-500/30'
                      }`}
                    >
                      <option value="processing">Processing</option>
                      <option value="verified">Verified</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    {order.trackingAwb && (
                      <span className="text-[10px] text-stone-400 block mt-1">
                        AWB: {order.trackingAwb}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 align-top text-right space-y-1.5">
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 text-white dark:bg-white dark:text-stone-900 hover:bg-[#F5821F] dark:hover:bg-[#F5821F] dark:hover:text-black font-extrabold text-[11px] inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>GST Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GST INVOICE MODAL (PRINT READY) */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-stone-900 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 my-8 print:p-0 print:m-0 print:shadow-none print:max-w-none print:w-full">
            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 print:hidden">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#F5821F]" />
                  <h3 className="font-black text-sm uppercase tracking-wider">
                    {includeGst ? 'Tax Invoice (18% GST)' : 'Bill of Supply (No GST)'} — {selectedInvoiceOrder.orderNumber}
                  </h3>
                </div>

                {/* GST Toggle Pill */}
                <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIncludeGst(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      includeGst
                        ? 'bg-[#F5821F] text-black shadow-sm'
                        : 'text-stone-600 hover:text-black'
                    }`}
                  >
                    Standard 18% GST
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncludeGst(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !includeGst
                        ? 'bg-stone-900 text-white shadow-sm'
                        : 'text-stone-600 hover:text-black'
                    }`}
                  >
                    No GST / Bill of Supply
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#F5821F] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:bg-[#E0741A] cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save as PDF
                </button>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="px-3 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Invoice Container */}
            <div className="space-y-6 text-xs text-stone-800">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-black">
                    MI KING&apos;S DSLR CAMERA SHOP
                  </h2>
                  <p className="text-[11px] text-stone-600 max-w-sm mt-0.5">
                    Pillar No. 103, Bank Colony, Near Tadbun, Mir Alam Tank, Bahadurpura, Hyderabad, Telangana 500064
                  </p>
                  <p className="text-[11px] text-stone-600 mt-1">
                    <span className="font-bold">Phone:</span> +91 90322 85420 | <span className="font-bold">Email:</span> mikingsdslrshop@gmail.com
                  </p>
                  <p className="text-[11px] text-stone-600">
                    <span className="font-bold">GSTIN:</span> 36AAACM1920K1ZX | <span className="font-bold">State Code:</span> 36 (Telangana)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-stone-900 block uppercase tracking-wider">
                    {includeGst ? 'TAX INVOICE' : 'RETAIL INVOICE / BILL OF SUPPLY'}
                  </span>
                  {!includeGst && (
                    <span className="text-[9px] font-bold text-amber-700 block uppercase">
                      (Exempt / Composite / Non-GST Supply)
                    </span>
                  )}
                  <span className="font-bold text-stone-700 block mt-1">
                    Invoice #: {selectedInvoiceOrder.orderNumber}
                  </span>
                  <span className="text-stone-500 block text-[11px]">
                    Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-stone-500 block text-[11px]">
                    Payment Mode: {selectedInvoiceOrder.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Billed To / Shipped To */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider block">
                    Billed &amp; Shipped To:
                  </span>
                  <p className="font-bold text-stone-900 mt-1">{selectedInvoiceOrder.customerName}</p>
                  <p className="text-stone-600">{selectedInvoiceOrder.shippingAddress}</p>
                  <p className="text-stone-600">
                    {selectedInvoiceOrder.city}, {selectedInvoiceOrder.state} - {selectedInvoiceOrder.pincode}
                  </p>
                  <p className="text-stone-600">Phone: {selectedInvoiceOrder.customerPhone}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider block">
                    Dispatch &amp; Warranty:
                  </span>
                  <p className="text-stone-600 mt-1">
                    <span className="font-semibold">Courier:</span> {selectedInvoiceOrder.courierPartner || 'Delhivery Express'}
                  </p>
                  <p className="text-stone-600">
                    <span className="font-semibold">AWB Tracking:</span> {selectedInvoiceOrder.trackingAwb || 'In Transit'}
                  </p>
                  <p className="text-emerald-700 font-bold mt-1">
                    Official 1 Year Store Warranty Included
                  </p>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-y border-stone-300 bg-stone-100 font-bold text-stone-700">
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2">Description of Goods</th>
                    <th className="py-2 px-2">HSN / SAC</th>
                    <th className="py-2 px-2 text-center">Qty</th>
                    <th className="py-2 px-2 text-right">Taxable Value</th>
                    <th className="py-2 px-2 text-right">GST Rate</th>
                    <th className="py-2 px-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {selectedInvoiceOrder.items.map((item, idx) => {
                    const taxableValue = includeGst ? Math.round(item.price / 1.18) : item.price;
                    return (
                      <tr key={item.id}>
                        <td className="py-2 px-2 font-medium">{idx + 1}</td>
                        <td className="py-2 px-2 font-bold text-stone-900">{item.name}</td>
                        <td className="py-2 px-2 text-stone-600">{item.hsn}</td>
                        <td className="py-2 px-2 text-center">{item.quantity}</td>
                        <td className="py-2 px-2 text-right">
                          ₹{taxableValue.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {includeGst ? '18%' : '0% (Exempt)'}
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-stone-900">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Totals & Tax Calculation Breakdown */}
              <div className="flex justify-end pt-2">
                <div className="w-72 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Taxable Amount:</span>
                    <span>
                      ₹{includeGst
                        ? Math.round(selectedInvoiceOrder.totalAmount / 1.18).toLocaleString('en-IN')
                        : selectedInvoiceOrder.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {includeGst ? (
                    <>
                      <div className="flex justify-between text-stone-600">
                        <span>CGST (9%):</span>
                        <span>
                          ₹{Math.round((selectedInvoiceOrder.totalAmount / 1.18) * 0.09).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>SGST (9%):</span>
                        <span>
                          ₹{Math.round((selectedInvoiceOrder.totalAmount / 1.18) * 0.09).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-stone-600">
                      <span>GST (CGST + SGST):</span>
                      <span className="font-semibold text-stone-800">₹0 (Non-GST Sale)</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>Insured Shipping:</span>
                    <span className="text-emerald-600 font-bold">FREE (₹0)</span>
                  </div>
                  <div className="border-t border-stone-300 pt-2 flex justify-between font-black text-sm text-black">
                    <span>Total Invoice Value:</span>
                    <span>₹{selectedInvoiceOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Terms & Signature */}
              <div className="border-t border-stone-200 pt-4 flex justify-between items-end text-[10px] text-stone-500">
                <div className="space-y-1 max-w-sm">
                  <span className="font-bold text-stone-700 block">Terms &amp; Conditions:</span>
                  <p>1. Certified genuine equipment with 30-day return policy and full warranty.</p>
                  <p>2. Serial numbers recorded in physical store ledger at Pillar 103, Hyderabad.</p>
                  {!includeGst && (
                    <p className="text-amber-800 font-medium">
                      3. Bill of supply / second-hand goods margin scheme without input tax credit.
                    </p>
                  )}
                </div>
                <div className="text-center">
                  <div className="w-32 border-b border-stone-400 pb-8 text-[11px] font-bold text-stone-900">
                    Mohd Idrees
                  </div>
                  <span className="text-[10px] text-stone-500 block mt-1">Authorized Signatory</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
