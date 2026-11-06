'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageSquare,
} from 'lucide-react';

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-[#F5821F]/10 border border-[#F5821F]/30 rounded-3xl flex items-center justify-center mx-auto text-[#F5821F] shadow-lg">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Your Cart is Empty
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            Explore certified pre-owned DSLR cameras, mirrorless bodies, cinema lenses, and creator drones with 1-2 years warranty.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs shadow-lg shadow-[#F5821F]/20 transition-all cursor-pointer"
          >
            Browse Camera Catalog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-[#24211d] pb-6">
        <div>
          <span className="text-xs font-bold text-[#F5821F] uppercase tracking-wider">
            Shopping Cart
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1">
            Review Your Equipment ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-stone-500 hover:text-rose-500 transition-colors self-start sm:self-auto cursor-pointer"
        >
          Clear Entire Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl p-4 sm:p-5 flex gap-4 items-center justify-between shadow-sm transition-colors"
            >
              {/* Product Thumbnail */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-transparent border border-stone-200/80 dark:border-stone-800 shrink-0 flex items-center justify-center">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-1.5"
                />
              </div>

              {/* Title & Specs */}
              <div className="flex-1 min-w-0 pr-2">
                <Link
                  href={`/product/${product.slug}`}
                  className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white hover:text-[#F5821F] transition-colors truncate block"
                >
                  {product.name}
                </Link>
                <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                  <span className="uppercase font-bold text-[#F5821F]">{product.brand}</span>
                  <span>&bull;</span>
                  <span>{product.condition}</span>
                </div>
                <div className="text-xs font-black text-stone-900 dark:text-white mt-1.5">
                  {formatINR(product.salePrice)}
                </div>
              </div>

              {/* Quantity Controls & Delete */}
              <div className="flex flex-col items-end gap-2.5 shrink-0">
                <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-[#13110f] p-1">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-6 h-6 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-stone-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary & Checkout CTA */}
        <div className="lg:col-span-5 bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm transition-colors sticky top-24">
          <h2 className="text-sm font-black uppercase tracking-wider text-stone-900 dark:text-white">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs text-stone-600 dark:text-stone-400">
            <div className="flex justify-between">
              <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} units):</span>
              <span className="font-bold text-stone-900 dark:text-white">{formatINR(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes:</span>
              <span className="text-stone-900 dark:text-white font-medium">₹0 (No GST / Retail Store Bill)</span>
            </div>
            <div className="flex justify-between">
              <span>All-India Insured Courier:</span>
              <span className={cartTotal >= 25000 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-stone-900 dark:text-white font-bold"}>
                {cartTotal >= 25000 ? "FREE Delivery (Above ₹25,000)" : "₹450 (Free over ₹25,000)"}
              </span>
            </div>
            <div className="pt-3 border-t border-stone-200 dark:border-[#24211d] flex justify-between items-baseline">
              <span className="text-sm font-bold text-stone-900 dark:text-white">Total Amount:</span>
              <span className="text-xl sm:text-2xl font-black text-[#F5821F]">
                {formatINR(cartTotal + (cartTotal >= 25000 ? 0 : 450))}
              </span>
            </div>
          </div>

          {/* Live Video Call Verification Advisory Clause */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs space-y-1.5">
            <span className="font-black flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              📹 Verify on Live Video Call First
            </span>
            <p className="text-[11px] leading-relaxed">
              Don&apos;t buy directly without seeing! Call us on WhatsApp Video Call (+91 63058 75376) to inspect the camera, lens optics, and sensor live before transferring payment.
            </p>
            <a
              href={`https://wa.me/916305875376?text=${encodeURIComponent(
                "Hi Mi King's Cameras! I want to do a WhatsApp Video Call to inspect the equipment in my cart before making payment."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
            >
              Start WhatsApp Video Inspection &rarr;
            </a>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#F5821F]/20 text-xs sm:text-sm cursor-pointer"
          >
            Proceed to Secure Checkout
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#13110f] border border-stone-200 dark:border-stone-800 space-y-2 text-[11px] text-stone-500">
            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#F5821F]" />
              <span>Mi King&apos;s Store Assured Protection</span>
            </div>
            <p>2 Years Store Warranty &bull; 25-Point Verification &bull; All-India Insured Transit</p>
          </div>
        </div>
      </div>
    </div>
  );
}
