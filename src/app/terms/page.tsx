'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-8">
      <div>
        <span className="text-xs font-bold text-[#F5821F] uppercase tracking-wider">Legal &amp; Store Terms</span>
        <h1 className="text-3xl font-black text-stone-900 dark:text-white mt-1">Terms &amp; Conditions</h1>
        <p className="text-xs text-stone-500 mt-1">Last Updated: November 2026 &bull; Mi King&apos;s DSLR Camera Shop, Hyderabad</p>
      </div>

      <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 sm:p-8 space-y-6 text-xs text-stone-700 dark:text-stone-300 leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="font-bold text-sm text-stone-900 dark:text-white">1. Authenticity &amp; Equipment Certification</h2>
          <p className="text-stone-600 dark:text-stone-400">
            All cameras, lenses, drones, and accessories sold by Mi King&apos;s Cameras are guaranteed 100% genuine. Pre-owned items undergo our mandatory 25-point technical inspection for sensor clarity, mechanical shutter actuation count, and optical glass elements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-sm text-stone-900 dark:text-white">2. Pricing, Invoicing &amp; GST</h2>
          <p className="text-stone-600 dark:text-stone-400">
            Prices displayed on the store are in Indian Rupees (INR) and include applicable taxes. Orders receive an official Tax Invoice (with 18% CGST/SGST, Telangana State Code 36) or Retail Bill of Supply as per government tax regulations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-sm text-stone-900 dark:text-white">3. Warranty &amp; Return Rights</h2>
          <p className="text-stone-600 dark:text-stone-400">
            Every pre-owned camera and lens is backed by our written 1-Year Store Warranty and 30-Day Money Back Guarantee. Manufacturer warranties on brand-new equipment are serviceable at authorized service centers across India.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-sm text-stone-900 dark:text-white">4. Jurisdiction</h2>
          <p className="text-stone-600 dark:text-stone-400">
            Any dispute arising out of transactions through this store shall be subject to the exclusive jurisdiction of the competent courts in Hyderabad, Telangana.
          </p>
        </section>
      </div>
    </div>
  );
}
