'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-8">
      <div>
        <span className="text-xs font-bold text-[#F5821F] uppercase tracking-wider">Privacy &amp; Data Protection</span>
        <h1 className="text-3xl font-black text-stone-900 dark:text-white mt-1">Privacy Policy</h1>
        <p className="text-xs text-stone-500 mt-1">Last Updated: November 2026 &bull; Mi King&apos;s DSLR Camera Shop, Hyderabad</p>
      </div>

      <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 sm:p-8 space-y-6 text-xs text-stone-700 dark:text-stone-300 leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="font-bold text-sm text-stone-900 dark:text-white">1. Information We Collect</h2>
          <p className="text-stone-600 dark:text-stone-400">
            We only collect information necessary to fulfill your equipment orders and provide warranty support, including your name, contact phone/WhatsApp number, delivery address, and email for tax invoicing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-sm text-stone-900 dark:text-white">2. Payment Security</h2>
          <p className="text-stone-600 dark:text-stone-400">
            We do not store your credit card, debit card, or UPI PIN numbers. All payment transactions are encrypted and processed through RBI-authorized payment gateways (Razorpay, Cashfree, UPI, Netbanking).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-sm text-stone-900 dark:text-white">3. Courier &amp; AWB Sharing</h2>
          <p className="text-stone-600 dark:text-stone-400">
            Your shipping address and mobile number are securely transmitted strictly to insured courier partners (Delhivery, Shiprocket, BlueDart) to facilitate door delivery and SMS/WhatsApp dispatch alerts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-sm text-stone-900 dark:text-white">4. Contacting Data Officer</h2>
          <p className="text-stone-600 dark:text-stone-400">
            If you wish to update or delete your contact details from our store records, contact Mohd Idrees directly at <a href="mailto:mikingsdslrshop@gmail.com" className="text-[#F5821F] underline">mikingsdslrshop@gmail.com</a> or Call +91 90322 85420.
          </p>
        </section>
      </div>
    </div>
  );
}
