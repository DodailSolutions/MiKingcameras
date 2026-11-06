'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { ShieldCheck, ArrowRight, CheckCircle2, Loader2, Download, FileText, Printer } from 'lucide-react';
import { createSupabaseOrder } from '@/lib/supabase-service';
import { CustomerInvoiceModal, InvoiceData } from '@/components/invoice/CustomerInvoiceModal';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [savedOrderDetails, setSavedOrderDetails] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500064',
    paymentMethod: 'upi',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const orderNumber = `MIK-${Date.now().toString().slice(-6)}`;
    setConfirmedOrderNumber(orderNumber);

    const orderPayload = {
      id: 'ord-' + Date.now().toString().slice(-6),
      orderNumber,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: cart.map((c) => ({
        name: c.product.name,
        price: c.product.salePrice,
        quantity: c.quantity,
        hsn: c.product.category === 'lenses' ? '900211' : '900659',
      })),
      total: cartTotal,
      status: 'Processing' as const,
      trackingId: `HYD-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      courierPartner: 'Delhivery Surface / Hyderabad Hub',
      paymentMethod: formData.paymentMethod.toUpperCase(),
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
    };

    setSavedOrderDetails(orderPayload);

    // Save to customer account history
    try {
      const existing = localStorage.getItem('mikings_customer_orders');
      const parsed = existing ? JSON.parse(existing) : [];
      localStorage.setItem('mikings_customer_orders', JSON.stringify([orderPayload, ...parsed]));
    } catch {
      // ignore
    }

    try {
      await createSupabaseOrder({
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        totalAmount: cartTotal,
        paymentMethod: formData.paymentMethod,
        items: cart.map((c) => ({
          slug: c.product.slug,
          name: c.product.name,
          price: c.product.salePrice,
          quantity: c.quantity,
          imageUrl: c.product.imageUrl,
        })),
      });
    } catch (err) {
      console.warn('Saved order locally (Supabase tables pending):', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      clearCart();
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-[#F5821F]/10 border border-[#F5821F]/30 rounded-full flex items-center justify-center mx-auto text-[#F5821F]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-[#F5821F] bg-[#F5821F]/10 px-3 py-1 rounded-full">
            Order ID: {confirmedOrderNumber}
          </span>
          <h1 className="text-3xl font-black text-stone-900 dark:text-white pt-2">
            Order Placed &amp; Reserved!
          </h1>
        </div>
        <p className="text-stone-600 dark:text-stone-400 text-sm max-w-md mx-auto leading-relaxed">
          Thank you, <span className="text-stone-900 dark:text-white font-semibold">{formData.fullName}</span>. Your equipment reservation request has been dispatched to Mi King&apos;s DSLR Camera Shop showroom at Mir Alam Tank, Hyderabad.
        </p>

        {/* Instant Action Bar: Download Official GST Invoice + Account */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          {savedOrderDetails && (
            <button
              type="button"
              onClick={() => setShowInvoiceModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs shadow-md shadow-[#F5821F]/20 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download Official GST Tax Invoice (PDF)</span>
            </button>
          )}

          <Link
            href="/account"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#1a1815] dark:hover:bg-[#24211d] text-stone-800 dark:text-stone-200 font-bold text-xs border border-stone-200 dark:border-[#2e2a25] transition-all"
          >
            <span>View Orders &amp; Warranties</span>
          </Link>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="text-xs text-stone-500 hover:text-[#F5821F] font-bold inline-flex items-center gap-1 transition-colors"
          >
            <span>Continue Shopping in Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Invoice Modal */}
        {showInvoiceModal && savedOrderDetails && (
          <CustomerInvoiceModal
            invoice={{
              orderNumber: savedOrderDetails.orderNumber,
              customerName: savedOrderDetails.customerName,
              customerEmail: savedOrderDetails.customerEmail,
              customerPhone: savedOrderDetails.customerPhone,
              shippingAddress: savedOrderDetails.shippingAddress,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              items: savedOrderDetails.items,
              totalAmount: savedOrderDetails.total,
              paymentMethod: savedOrderDetails.paymentMethod,
              date: savedOrderDetails.date,
              trackingId: savedOrderDetails.trackingId,
              courierPartner: savedOrderDetails.courierPartner,
            }}
            onClose={() => setShowInvoiceModal(false)}
          />
        )}
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Your Cart is Empty</h1>
        <p className="text-stone-600 dark:text-stone-400 text-xs">Add products from our catalog before checking out.</p>
        <Link
          href="/catalog"
          className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-[#F5821F] text-black text-xs font-bold"
        >
          Browse Cameras &amp; Lenses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-[#F5821F] tracking-widest uppercase">Safe &amp; Insured</span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1">Checkout &amp; Delivery Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white dark:bg-[#1b1916] border border-stone-200 dark:border-[#2e2a25] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
            1. Shipping &amp; Recipient Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-stone-600 dark:text-stone-400 font-semibold">Full Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-[#2e2a25] rounded-xl px-4 py-3 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#F5821F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-600 dark:text-stone-400 font-semibold">Phone (WhatsApp enabled) *</label>
              <input
                required
                type="tel"
                placeholder="10-digit mobile"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-[#2e2a25] rounded-xl px-4 py-3 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#F5821F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-600 dark:text-stone-400 font-semibold">Email Address *</label>
              <input
                required
                type="email"
                placeholder="ramesh@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-[#2e2a25] rounded-xl px-4 py-3 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#F5821F]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-stone-600 dark:text-stone-400 font-semibold">Delivery Address Line *</label>
              <input
                required
                type="text"
                placeholder="House / Flat No, Street, Landmark"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-[#2e2a25] rounded-xl px-4 py-3 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#F5821F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-600 dark:text-stone-400 font-semibold">City</label>
              <input
                required
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-[#2e2a25] rounded-xl px-4 py-3 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#F5821F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-600 dark:text-stone-400 font-semibold">Pincode *</label>
              <input
                required
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-[#2e2a25] rounded-xl px-4 py-3 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#F5821F]"
              />
            </div>
          </div>

          <h2 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider pt-4 border-t border-stone-200 dark:border-[#2e2a25]">
            2. Payment Method
          </h2>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-[#2e2a25] rounded-xl cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={formData.paymentMethod === 'upi'}
                onChange={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                className="accent-[#F5821F]"
              />
              <div>
                <span className="font-bold text-stone-900 dark:text-white block">UPI / Razorpay / Net Banking</span>
                <span className="text-stone-500 text-[11px]">Instant settlement via Google Pay, PhonePe, Cards</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-[#2e2a25] rounded-xl cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={formData.paymentMethod === 'store'}
                onChange={() => setFormData({ ...formData, paymentMethod: 'store' })}
                className="accent-[#F5821F]"
              />
              <div>
                <span className="font-bold text-stone-900 dark:text-white block">Reserve &amp; Pay at Hyderabad Store</span>
                <span className="text-stone-500 text-[11px]">Inspect hands-on at Tadbun Mir Alam Tank branch</span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#F5821F]/20 text-sm disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <span>Confirm &amp; Place Order ({formatINR(cartTotal)})</span>
            )}
          </button>
        </form>

        {/* Order Summary Column */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1b1916] border border-stone-200 dark:border-[#2e2a25] rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
          <h2 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
            Order Summary ({cart.length} items)
          </h2>

          <div className="divide-y divide-stone-100 dark:divide-[#2e2a25] max-h-72 overflow-y-auto pr-1">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="py-3 flex gap-3 items-center">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-transparent shrink-0 border border-stone-200/80 dark:border-[#2e2a25] flex items-center justify-center p-0.5">
                  <Image src={product.imageUrl} alt={product.name} fill className="object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-stone-900 dark:text-white truncate">{product.name}</h4>
                  <p className="text-[10px] text-stone-500">Qty: {quantity} &bull; {product.condition}</p>
                </div>
                <span className="text-xs font-bold text-[#F5821F]">
                  {formatINR(product.salePrice * quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs pt-4 border-t border-stone-200 dark:border-[#2e2a25]">
            <div className="flex justify-between text-stone-600 dark:text-stone-400">
              <span>Item Subtotal</span>
              <span className="text-stone-900 dark:text-white font-medium">{formatINR(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600 dark:text-stone-400">
              <span>Insured Courier Shipping</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Free</span>
            </div>
            <div className="flex justify-between text-stone-600 dark:text-stone-400">
              <span>GST Compliance Invoice</span>
              <span className="text-stone-900 dark:text-white font-medium">Included</span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 dark:text-white pt-2 border-t border-stone-200 dark:border-[#2e2a25]">
              <span>Final Total</span>
              <span className="text-[#F5821F]">{formatINR(cartTotal)}</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-[#110f0d] rounded-xl border border-stone-200 dark:border-[#2e2a25] text-[11px] text-stone-600 dark:text-stone-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F5821F] shrink-0" />
            <span>Backed by 30-day returns and store warranty support.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
