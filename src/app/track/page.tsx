'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Search,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Phone,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

export default function TrackOrderPage() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const sampleTracking = {
    orderNumber: query.toUpperCase().startsWith('MIK') ? query.toUpperCase() : 'MIK-982104',
    item: 'Canon EOS R6 Mark II Mirrorless Body',
    carrier: 'Delhivery Surface Express',
    awb: 'DEL-HYD-90321482',
    destination: 'Hyderabad, Telangana',
    status: 'In Transit',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    steps: [
      { title: 'Order Verified & Reserved', date: '04 Nov, 10:30 AM', done: true, desc: 'Verified by Mohd Idrees at Hyderabad store' },
      { title: '25-Point Sensor & Shutter Inspection Passed', date: '04 Nov, 02:15 PM', done: true, desc: 'Optical sensor cleaned, shutter count certified' },
      { title: 'Packed & Dispatched with Insured Courier', date: '04 Nov, 06:45 PM', done: true, desc: 'Picked up from Bahadurpura, Pillar 103 Hub' },
      { title: 'In Transit to Regional Sorting Facility', date: '05 Nov, 08:30 AM', done: true, desc: 'Package scanned at Hyderabad Air Hub' },
      { title: 'Out for Secure Delivery', date: 'Pending', done: false, desc: 'OTP verification required at delivery' },
      { title: 'Delivered', date: 'Pending', done: false, desc: 'Includes official 1-year store warranty card' },
    ],
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearched(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-8">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-[#F5821F]/10 text-[#F5821F] flex items-center justify-center mx-auto mb-3 shadow-md">
          <Truck className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold text-[#F5821F] uppercase tracking-wider">
          All-India Insured Dispatch
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
          Track Your Camera Equipment
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Enter your Order Number (e.g. MIK-982104) or Delhivery/Shiprocket AWB number to check real-time transit status.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            required
            placeholder="Enter Order # or AWB Tracking Number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#181613] border border-stone-300 dark:border-stone-700 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#F5821F] shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer shrink-0"
        >
          Track Now
        </button>
      </form>

      {/* Tracking Result */}
      {searched && (
        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 sm:p-8 space-y-6 shadow-md transition-colors animate-in fade-in duration-300">
          {/* Summary Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-[#2a2621]">
            <div>
              <span className="text-xs text-stone-500 font-semibold block">Order Reference</span>
              <h2 className="text-lg font-black text-stone-900 dark:text-white">
                {sampleTracking.orderNumber} &bull; <span className="text-[#F5821F]">{sampleTracking.item}</span>
              </h2>
              <span className="text-xs text-stone-400 mt-0.5 block">
                Carrier: {sampleTracking.carrier} &bull; AWB: {sampleTracking.awb}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg inline-block">
                {sampleTracking.status}
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400 block mt-1">
                Estimated Delivery: <strong className="text-stone-900 dark:text-white">{sampleTracking.estimatedDelivery}</strong>
              </span>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="space-y-6 pl-2 sm:pl-4">
            {sampleTracking.steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 relative">
                {idx !== sampleTracking.steps.length - 1 && (
                  <div
                    className={`absolute left-3.5 top-7 w-0.5 h-10 ${
                      step.done ? 'bg-emerald-500' : 'bg-stone-200 dark:bg-stone-800'
                    }`}
                  />
                )}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    step.done
                      ? 'bg-emerald-500 text-black'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">
                      {step.title}
                    </h4>
                    <span className="text-[10px] text-stone-400">&bull; {step.date}</span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Store Support Hotline */}
          <div className="pt-6 border-t border-stone-200 dark:border-[#2a2621] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="text-stone-500">Need help with your delivery or address change?</span>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/916305875376"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-500 font-bold hover:underline flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp Store Support
              </a>
              <span className="text-stone-300">|</span>
              <a href="tel:+919032285420" className="text-stone-700 dark:text-stone-300 font-bold hover:text-[#F5821F] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#F5821F]" />
                Call +91 90322 85420
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
