'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  RotateCcw,
  Camera,
  Aperture,
  Wrench,
  HelpCircle,
  Phone,
  MessageSquare,
} from 'lucide-react';

export default function WarrantyPage() {
  const inspectionPoints = [
    'Sensor CMOS/CCD surface clarity and dead pixel audit',
    'Mechanical shutter actuation count verification',
    'Autofocus motor tracking speed and accuracy calibration',
    'Lens optical elements check: zero fungus, haze, or scratches',
    'Aperture blade responsiveness across all f-stops',
    'Electronic viewfinder (EVF) and LCD screen touch response',
    'Dual SD/CFexpress card slot reading & writing integrity',
    'Battery compartment contacts and power efficiency',
    'In-Body Image Stabilization (IBIS) 5-axis calibration',
    'Hot-shoe flash synchronization and audio port checks',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-[#F5821F]/10 text-[#F5821F] flex items-center justify-center mx-auto mb-2 shadow-md">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <span className="text-xs font-bold text-[#F5821F] uppercase tracking-wider">
          Mi King&apos;s Store Protection
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
          Warranty &amp; 25-Point Inspection Policy
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          Every camera body and lens that enters our Hyderabad store undergoes rigorous optical and mechanical certification before being made available to creators across India.
        </p>
      </div>

      {/* 3 Protection Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">
            1-Year Store Warranty
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            All certified pre-owned DSLRs, mirrorless bodies, and lenses are backed by our written 1-year in-store warranty card covering shutter and motherboard reliability.
          </p>
        </div>

        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#F5821F]/10 text-[#F5821F] flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">
            30-Day Money Back Guarantee
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            Take your camera into the field. If any technical defect or sensor flaw is identified within 30 days, we replace it or issue a 100% full refund with zero deductions.
          </p>
        </div>

        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">
            Official Brand Warranty
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            All brand new equipment (Canon, Sony, Nikon, DJI, Sigma) comes with official manufacturer warranty registrations valid at any authorized service center nationwide.
          </p>
        </div>
      </div>

      {/* 25-Point Checklist */}
      <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#F5821F]/10 text-[#F5821F] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-black text-stone-900 dark:text-white">
              The 25-Point Technical Diagnostics Protocol
            </h2>
            <p className="text-xs text-stone-500">
              Conducted personally by Mohd Idrees and certified technical staff before dispatch.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {inspectionPoints.map((pt, i) => (
            <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-[#110f0d] border border-stone-100 dark:border-stone-800">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px] flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-stone-700 dark:text-stone-300 font-medium">{pt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Claim / Support Contact */}
      <div className="text-center p-8 bg-stone-100 dark:bg-[#151311] rounded-3xl border border-stone-200 dark:border-[#24211d] space-y-4">
        <h3 className="font-black text-base text-stone-900 dark:text-white">
          Need to File a Warranty Claim or Have a Technical Question?
        </h3>
        <p className="text-xs text-stone-500 max-w-lg mx-auto">
          Visit us at Pillar 103 Bahadurpura with your invoice, or reach out to Mohd Idrees directly on WhatsApp.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a
            href="https://wa.me/916305875376"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebd59] text-white font-extrabold text-xs inline-flex items-center gap-2 shadow-md"
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp Warranty Desk
          </a>
          <Link
            href="/contact"
            className="px-6 py-2.5 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs inline-flex items-center gap-2 shadow-md"
          >
            Visit Showroom &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
