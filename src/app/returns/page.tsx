'use client';

import React from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  CheckCircle2,
  Truck,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-10">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-[#F5821F]/10 text-[#F5821F] flex items-center justify-center mx-auto mb-2 shadow-md">
          <RotateCcw className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold text-[#F5821F] uppercase tracking-wider">
          Risk-Free Purchase
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
          Returns &amp; 30-Day Refund Policy
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          We want every photographer and filmmaker to be 100% satisfied with their equipment. Here is our straightforward return policy.
        </p>
      </div>

      {/* 3 Step Process */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 space-y-2.5 shadow-sm text-xs">
          <span className="w-7 h-7 rounded-xl bg-[#F5821F] text-black font-black flex items-center justify-center">1</span>
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">Notify Store Support</h3>
          <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
            Message or call our Hyderabad team within 30 days of receiving your camera or lens with your invoice number.
          </p>
        </div>

        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 space-y-2.5 shadow-sm text-xs">
          <span className="w-7 h-7 rounded-xl bg-[#F5821F] text-black font-black flex items-center justify-center">2</span>
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">Insured Reverse Pickup</h3>
          <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
            Our courier partner (Delhivery/Shiprocket) picks up the package safely from your doorstep with transit insurance.
          </p>
        </div>

        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 space-y-2.5 shadow-sm text-xs">
          <span className="w-7 h-7 rounded-xl bg-[#F5821F] text-black font-black flex items-center justify-center">3</span>
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">100% Fast Refund</h3>
          <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
            Once inspected at our Hyderabad showroom, your full refund is credited back to your UPI or Bank within 24 hours.
          </p>
        </div>
      </div>

      {/* Details Box */}
      <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
        <h3 className="font-black text-sm text-stone-900 dark:text-white uppercase tracking-wider">
          Return Eligibility Terms:
        </h3>
        <ul className="space-y-2 list-disc pl-5 text-stone-600 dark:text-stone-400">
          <li>Item must be returned in the original condition received with serial numbers matching store records.</li>
          <li>All original included accessories (battery, charger, caps, strap) must be included.</li>
          <li>Transit damage claims must be reported within 48 hours of courier delivery with unboxing video/photo.</li>
          <li>In-store exchange for any other camera or lens model is available at Pillar 103, Hyderabad.</li>
        </ul>
      </div>

      <div className="text-center pt-2">
        <a
          href="https://wa.me/916305875376"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#25D366] hover:bg-[#1ebd59] text-white font-extrabold text-xs shadow-md"
        >
          <MessageSquare className="w-4 h-4" />
          Request a Return via WhatsApp
        </a>
      </div>
    </div>
  );
}
