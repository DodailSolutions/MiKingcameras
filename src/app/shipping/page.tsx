'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-10">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-[#F5821F]/10 text-[#F5821F] flex items-center justify-center mx-auto mb-2 shadow-md">
          <Truck className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold text-[#F5821F] uppercase tracking-wider">
          All-India Dispatch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Fast, fully insured courier dispatch across all states and union territories in India.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 space-y-2 shadow-sm">
          <Clock className="w-5 h-5 text-[#F5821F]" />
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">24-Hour Dispatch</h3>
          <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
            All orders confirmed before 3:00 PM are inspected, sealed, and dispatched on the same business day from Hyderabad.
          </p>
        </div>

        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 space-y-2 shadow-sm">
          <Truck className="w-5 h-5 text-[#F5821F]" />
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">Free Insured Shipping</h3>
          <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
            Complimentary shipping on all camera and lens orders above ₹5,000 via Delhivery, BlueDart, and Shiprocket air express.
          </p>
        </div>

        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 space-y-2 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-[#F5821F]" />
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">100% In-Transit Insurance</h3>
          <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
            Every camera body and glass element is insured against loss or transit impact until delivered safely into your hands.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-stone-700 dark:text-stone-300">
        <h3 className="font-black text-sm text-stone-900 dark:text-white uppercase tracking-wider">
          Estimated Delivery Timelines:
        </h3>
        <ul className="space-y-2 list-disc pl-5 text-stone-600 dark:text-stone-400">
          <li><strong>Hyderabad &amp; Secunderabad:</strong> Same day delivery or store pickup available at Pillar 103, Bahadurpura.</li>
          <li><strong>Telangana, Andhra Pradesh, Karnataka, Tamil Nadu, Maharashtra:</strong> 1 &ndash; 2 business days.</li>
          <li><strong>Rest of India (North, East, West):</strong> 2 &ndash; 4 business days via express air courier.</li>
          <li><strong>Live Tracking:</strong> Real-time AWB tracking links are sent instantly via SMS &amp; WhatsApp upon courier scan.</li>
        </ul>
      </div>
    </div>
  );
}
