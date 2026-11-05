'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  HeartHandshake,
  Camera,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: "Mi King's DSLR Camera Shop",
    alternateName: "MI KINGS ENTERPRISES",
    image: 'https://mikcameras.in/wp-content/uploads/2026/06/mi-kings-logo.png',
    '@id': 'https://mikcameras.in/#store',
    url: 'https://mikcameras.in',
    telephone: '+919032285420',
    priceRange: '₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Pillar No. 103 (Left Side Bank Colony), Near Tadbun, Mir Alam Tank, Bahadurpura',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500064',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.348,
      longitude: 78.449,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:30',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '11:00',
        closes: '20:00',
      },
    ],
    founder: [
      {
        '@type': 'Person',
        name: 'Mohd Idrees',
        jobTitle: 'Father & Guiding Force',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-16 py-8 sm:py-12">
        {/* 1. Hero Section */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 via-[#181613] to-stone-950 text-white p-8 sm:p-14 border border-stone-800 shadow-2xl">
            <div className="max-w-3xl space-y-4 relative z-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5821F]/20 text-[#F5821F] text-xs font-bold tracking-wider uppercase border border-[#F5821F]/30">
                <Camera className="w-3.5 h-3.5" />
                Our Story &amp; Heritage
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Built on Father&apos;s Blessings. <br />
                <span className="text-[#F5821F]">Driven by Three Brothers.</span>
              </h1>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                MI KINGS ENTERPRISES is a family-owned photography haven in Hyderabad. Founded on the timeless principles of honesty, hard work, and placing the customer first, we have grown from a modest local counter into one of India&apos;s most trusted destinations for certified DSLR, mirrorless, and cinematic gear.
              </p>
            </div>
            {/* Subtle brand glow in corner */}
            <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#F5821F]/15 blur-3xl pointer-events-none" />
          </div>
        </section>

        {/* 2. Father's Pillar Section */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 sm:p-10 shadow-sm transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-lg bg-stone-100 dark:bg-stone-900">
                  <Image
                    src="/about/father_mohd_idrees.png"
                    alt="Mohd Idrees - Father and Guiding Pillar of Mi King's"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#F5821F]">
                  The Foundation of Our Business
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white">
                  Mohd Idrees — Our Pillar &amp; Guiding Force
                </h2>
                <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                  &ldquo;Our father is the root of this family and our enterprise. Every camera that leaves our counter carries his values: transparent pricing, absolute integrity, and unconditional care for the customer. With his blessings, we started our first store in Bahadurpura, Hyderabad, and those same teachings continue to steer our expansion across all of India.&rdquo;
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#201d19] border border-stone-200/80 dark:border-[#2e2a25]">
                    <HeartHandshake className="w-5 h-5 text-[#F5821F] mb-1.5" />
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">Honesty First</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Zero hidden flaws or inflated shutter counts.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#201d19] border border-stone-200/80 dark:border-[#2e2a25]">
                    <Award className="w-5 h-5 text-[#F5821F] mb-1.5" />
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">Hard Work</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Rigorous 25-point testing on all equipment.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#201d19] border border-stone-200/80 dark:border-[#2e2a25]">
                    <ShieldCheck className="w-5 h-5 text-[#F5821F] mb-1.5" />
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">Customer Trust</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">30-day return policy and full warranty.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Meet the Three Brothers */}
        <section className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#F5821F]">
              Leadership &amp; Expertise
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white">
              The Three Brothers Behind Mi King&apos;s
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              Combining business strategy, technical photography mastery, and seamless digital operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Brother 1: Founder */}
            <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100 dark:bg-stone-900">
                <Image
                  src="/about/founder_eldest_son.png"
                  alt="Founder and Visionary - Eldest Son"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#F5821F]">
                    Founder &amp; Visionary | Graduate
                  </span>
                  <h3 className="text-lg font-black text-stone-900 dark:text-white">Eldest Brother</h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    The strategic brain behind MI KINGS ENTERPRISES. A graduate by qualification, he transformed our father&apos;s teachings and his love for cameras into a premier retail brand. He oversees vendor relationships, official brand authorizations, and wholesale logistics.
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-100 dark:border-[#2a2621] text-[11px] font-semibold text-stone-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Strategy &amp; Brand Relations
                </div>
              </div>
            </div>

            {/* Brother 2: Photography Expert */}
            <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100 dark:bg-stone-900">
                <Image
                  src="/about/expert_mba_son.png"
                  alt="Photography Expert & Social Media Handler - MBA"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#F5821F]">
                    Expert &amp; Advisor | MBA
                  </span>
                  <h3 className="text-lg font-black text-stone-900 dark:text-white">Middle Brother</h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    The heart and creative soul of our store. An MBA by education and seasoned photographer with years of hands-on shooting with DSLRs, cine lenses, and gimbals. He leads 25-point camera testing and gives unbiased advice to buyers.
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-100 dark:border-[#2a2621] text-[11px] font-semibold text-stone-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Product Testing &amp; Consultation
                </div>
              </div>
            </div>

            {/* Brother 3: Operations Head */}
            <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100 dark:bg-stone-900">
                <Image
                  src="/about/operations_youngest_son.png"
                  alt="Talented Operations Head - Youngest Brother"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#F5821F]">
                    Operations Head | Technology
                  </span>
                  <h3 className="text-lg font-black text-stone-900 dark:text-white">Youngest Brother</h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    The energetic technological engine of the business. Quick, creative, and proactive, he manages digital storefront operations, daily order dispatch, customer support channels, and ensures our deliveries arrive safely and swiftly.
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-100 dark:border-[#2a2621] text-[11px] font-semibold text-stone-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  E-Commerce &amp; Dispatch Ops
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Flagship Store & Visit Us */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 sm:p-10 shadow-sm transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#F5821F]">
                    Physical Verification Hub
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1">
                    Visit Our Hyderabad Flagship Store
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                    We welcome all photographers, cinematographers, and creators to drop by our store to test any camera body, check shutter count, mount prime lenses, and inspect condition in person.
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#F5821F]/10 text-[#F5821F] shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-stone-900 dark:text-white font-bold">Exact Address</strong>
                      <span className="text-xs text-stone-600 dark:text-stone-400">
                        Pillar No. 103 (Left Side Bank Colony), Near Tadbun, Mir Alam Tank, Bahadurpura, Hyderabad, Telangana — 500064
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#F5821F]/10 text-[#F5821F] shrink-0 mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-stone-900 dark:text-white font-bold">Direct Phone</strong>
                      <a href="tel:+919032285420" className="text-xs text-stone-600 dark:text-stone-400 hover:text-[#F5821F]">
                        +91 90322 85420 / +91 63058 75376
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#F5821F]/10 text-[#F5821F] shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-stone-900 dark:text-white font-bold">Opening Hours</strong>
                      <span className="text-xs text-stone-600 dark:text-stone-400">
                        Monday – Saturday: 10:30 AM – 9:00 PM | Sunday: 11:00 AM – 8:00 PM
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="https://maps.google.com/?q=Pillar+No+103+Bank+Colony+Tadbun+Bahadurpura+Hyderabad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    Open in Google Maps
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="https://wa.me/916305875376"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat with Store Expert
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-md">
                  <Image
                    src="/about/store_interior.jpeg"
                    alt="Mi King's Cameras Hyderabad Storefront and Display"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
