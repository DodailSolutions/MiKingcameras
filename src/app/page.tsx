'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Award,
  Truck,
  CreditCard,
  Headphones,
  MapPin,
  MessageCircle,
  Star,
  ArrowRight,
  Camera,
  Aperture,
} from 'lucide-react';
import { INITIAL_PRODUCTS, BLOG_POSTS } from '@/data/catalog';
import { ProductCard } from '@/components/ProductCard';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryStrip } from '@/components/home/CategoryStrip';
import { BrandLogos } from '@/components/BrandLogos';
import { ProductCarousel } from '@/components/home/ProductCarousel';

export default function HomePage() {
  // 1. Featured Top Picks (12 products)
  const featured = INITIAL_PRODUCTS.slice(0, 12);
  
  // 2. Strictly Camera Bodies & Kits (DSLR & Mirrorless only, no lenses)
  const cameraBodies = INITIAL_PRODUCTS.filter(
    (p) => p.category === 'dslr' || p.category === 'mirrorless'
  ).slice(0, 18);

  // 3. Strictly Standalone Lenses & Optics (Lenses category only, no camera bodies)
  const premiumLenses = INITIAL_PRODUCTS.filter(
    (p) => p.category === 'lenses'
  ).slice(0, 18);

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-12 overflow-x-hidden w-full max-w-full">
      <HeroSection />

      <CategoryStrip />

      {/* 2. Value Proposition Strip - Single Line Scrollable */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#24211d] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-sm transition-colors overflow-hidden">
          <div className="flex items-center justify-between gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x py-1">
            <div className="flex items-center gap-2.5 shrink-0 snap-start">
              <div className="w-8 h-8 rounded-lg bg-[#F5821F]/10 flex items-center justify-center text-[#F5821F]">
                <Truck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-stone-900 dark:text-white block leading-tight">Fast Shipping</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">Across India</span>
              </div>
            </div>
            <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 shrink-0" />
            <div className="flex items-center gap-2.5 shrink-0 snap-start">
              <div className="w-8 h-8 rounded-lg bg-[#F5821F]/10 flex items-center justify-center text-[#F5821F]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-stone-900 dark:text-white block leading-tight">100% Genuine</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">Authorized Source</span>
              </div>
            </div>
            <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 shrink-0" />
            <div className="flex items-center gap-2.5 shrink-0 snap-start">
              <div className="w-8 h-8 rounded-lg bg-[#F5821F]/10 flex items-center justify-center text-[#F5821F]">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-stone-900 dark:text-white block leading-tight">Store Warranty</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">2 Years Store Warranty</span>
              </div>
            </div>
            <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 shrink-0" />
            <div className="flex items-center gap-2.5 shrink-0 snap-start">
              <div className="w-8 h-8 rounded-lg bg-[#F5821F]/10 flex items-center justify-center text-[#F5821F]">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-stone-900 dark:text-white block leading-tight">Secure Payments</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">UPI, Cards, EMI</span>
              </div>
            </div>
            <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 shrink-0" />
            <div className="flex items-center gap-2.5 shrink-0 snap-start">
              <div className="w-8 h-8 rounded-lg bg-[#F5821F]/10 flex items-center justify-center text-[#F5821F]">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-stone-900 dark:text-white block leading-tight">Expert Support</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">Dedicated Help</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Featured Category Highlight Banners (No text overflow / Clean responsive grid) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Banner 1: Cameras */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-950 to-black border border-stone-800/80 p-5 sm:p-6 flex items-center justify-between gap-3 sm:gap-4 group shadow-md min-h-[190px]">
            <div className="space-y-1.5 max-w-[62%] sm:max-w-[65%] z-10">
              <span className="text-[10px] font-black tracking-wider uppercase text-[#F5821F]">LATEST CAMERAS</span>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                DSLR &amp; Mirrorless Bodies
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2">Tested sensors and certified condition.</p>
              <div className="pt-2">
                <Link
                  href="/catalog?cat=cameras"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F5821F] text-black text-xs font-extrabold hover:bg-[#E0741A] transition-all cursor-pointer shadow-md"
                >
                  Shop Cameras &rarr;
                </Link>
              </div>
            </div>
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80"
                alt="Cameras"
                fill
                sizes="(min-width: 1024px) 140px, 110px"
                className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xl"
              />
            </div>
          </div>

          {/* Banner 2: Lenses */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-950 to-black border border-stone-800/80 p-5 sm:p-6 flex items-center justify-between gap-3 sm:gap-4 group shadow-md min-h-[190px]">
            <div className="space-y-1.5 max-w-[62%] sm:max-w-[65%] z-10">
              <span className="text-[10px] font-black tracking-wider uppercase text-[#F5821F]">PREMIUM LENSES</span>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                Prime &amp; Zoom Optics
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2">Wide, telephoto, and portrait glass.</p>
              <div className="pt-2">
                <Link
                  href="/catalog?cat=lenses"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F5821F] text-black text-xs font-extrabold hover:bg-[#E0741A] transition-all cursor-pointer shadow-md"
                >
                  Shop Lenses &rarr;
                </Link>
              </div>
            </div>
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=400&q=80"
                alt="Lenses"
                fill
                sizes="(min-width: 1024px) 140px, 110px"
                className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xl"
              />
            </div>
          </div>

          {/* Banner 3: Drones (spans 2 cols on tablet for spacious luxury presentation) */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-950 to-black border border-stone-800/80 p-5 sm:p-6 flex items-center justify-between gap-3 sm:gap-4 group shadow-md min-h-[190px] md:col-span-2 lg:col-span-1">
            <div className="space-y-1.5 max-w-[62%] sm:max-w-[65%] z-10">
              <span className="text-[10px] font-black tracking-wider uppercase text-[#F5821F]">DRONES FOR CREATORS</span>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                Cinematic Aerial Views
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2">Fly More combos and 4K stabilizers.</p>
              <div className="pt-2">
                <Link
                  href="/catalog?cat=drones"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F5821F] text-black text-xs font-extrabold hover:bg-[#E0741A] transition-all cursor-pointer shadow-md"
                >
                  Shop Drones &rarr;
                </Link>
              </div>
            </div>
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=400&q=80"
                alt="Drones"
                fill
                sizes="(min-width: 1024px) 140px, 110px"
                className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Products Carousel (Staggered Auto-Scroll) */}
      <ProductCarousel
        title="Featured"
        highlightText="Products"
        subtitle="Top Rated Selections"
        products={featured}
        viewAllHref="/catalog"
        viewAllLabel="View All"
        autoScrollInterval={4800}
        startDelay={1200}
      />

      {/* 5. Official Brand Logos Vector Strip (Canon, Sony, Nikon, Fujifilm, DJI, GoPro, Sigma, Manfrotto) */}
      <section className="max-w-7xl mx-auto px-4">
        <BrandLogos />
      </section>

      {/* 6. Dedicated Section: DSLR & Mirrorless Camera Bodies & Kits (Scrollable, Bodies Only, Staggered Delay) */}
      <ProductCarousel
        title="Camera Bodies & Kits"
        subtitle="Authentic Bodies"
        icon={Camera}
        products={cameraBodies}
        viewAllHref="/catalog?cat=cameras"
        viewAllLabel="Browse All Cameras"
        autoScrollInterval={6400}
        startDelay={3600}
      />

      {/* 7. Dedicated Section: Premium Lenses & Optics (Scrollable, Lenses Only, Staggered Delay) */}
      <ProductCarousel
        title="Premium Lenses & Optics"
        subtitle="Sharp Glass"
        icon={Aperture}
        products={premiumLenses}
        viewAllHref="/catalog?cat=lenses"
        viewAllLabel="Browse All Lenses"
        autoScrollInterval={5600}
        startDelay={5400}
      />

      {/* 8. Authentic Family Legacy & Leadership Story (Copied from About Us) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-[#181613] to-black border border-stone-800 p-8 sm:p-12 shadow-xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5821F]/20 text-[#F5821F] text-xs font-bold tracking-wider uppercase border border-[#F5821F]/30">
                <Camera className="w-3.5 h-3.5" />
                Our Story &amp; Heritage
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Built on Father&apos;s Blessings. <br />
                <span className="text-[#F5821F]">Driven by Three Brothers.</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
                MI KINGS ENTERPRISES is a family-owned photography haven in Hyderabad. Founded by Mohd Idrees and steered by his three sons — Mohd Waseem, Mohd Allauddin, and Mohd Jafar — on the timeless values of honesty, hard work, and putting the customer first. Every camera is tested with 25-point verification and protected with our 2-Year Store Warranty.
              </p>
              <div className="space-y-2 pt-2 text-xs sm:text-sm text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5821F]" />
                  <span>Honesty First — Zero hidden flaws or inflated shutter counts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5821F]" />
                  <span>2-Year Comprehensive Store Warranty &amp; 25-Point Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5821F]" />
                  <span>Expert Consultation from Mohd Allauddin (MBA &amp; Photography Expert)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href="/about"
                className="px-6 py-3.5 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <MapPin className="w-4 h-4" />
                Read Full Story &amp; Leadership
              </Link>
              <a
                href="https://wa.me/916305875376"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl border border-white/20 hover:border-[#25D366] hover:bg-[#25D366]/10 text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                Ask an Expert on WhatsApp
              </a>
            </div>
          </div>

          {/* Leadership Quick Preview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-800/80">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-700 shrink-0">
                <Image src="/about/father_mohd_idrees.jpg" alt="Mohd Idrees" fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Mohd Idrees</h4>
                <p className="text-[10px] text-stone-400">Pillar &amp; Guiding Force</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-700 shrink-0">
                <Image src="/about/mohd_waseem.png" alt="Mohd Waseem" fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Mohd Waseem</h4>
                <p className="text-[10px] text-stone-400">Founder &amp; Strategy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-700 shrink-0">
                <Image src="/about/mohd_allauddin.png" alt="Mohd Allauddin" fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Mohd Allauddin</h4>
                <p className="text-[10px] text-stone-400">Photography Expert (MBA)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-700 shrink-0">
                <Image src="/about/mohd_jafar.png" alt="Mohd Jafar" fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Mohd Jafar</h4>
                <p className="text-[10px] text-stone-400">Operations Head</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Blog & Customer Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* From Our Blog */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-stone-900 dark:text-white">
                From <span className="text-[#F5821F]">Our Blog</span>
              </h3>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-full px-3 py-1">
                Coming Soon
              </span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {BLOG_POSTS.map((post) => (
                <li
                  key={post.id}
                  className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2e2a25] rounded-2xl overflow-hidden flex flex-col shadow-sm transition-colors"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-stone-100 dark:bg-black">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover opacity-90"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white line-clamp-2">{post.title}</h4>
                    <p className="text-[11px] text-stone-500 pt-1">{post.readTime}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* What Our Customers Say */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <h3 className="text-xl font-black text-stone-900 dark:text-white">
              What Our <span className="text-[#F5821F]">Customers Say</span>
            </h3>

            <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2e2a25] rounded-2xl p-6 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed italic">
                &ldquo;Great experience! Genuine products, competitive prices and very supportive team. Highly recommend Mi King&apos;s Cameras for all photography and cinema equipment needs in Hyderabad.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-[#F5821F] text-black font-black flex items-center justify-center text-xs">
                  RS
                </div>
                <div>
                  <h5 className="text-xs font-bold text-stone-900 dark:text-white">Rohit Sharma</h5>
                  <p className="text-[11px] text-stone-500">Professional Photographer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Stay in Focus Newsletter Bar */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-stone-900 to-[#181613] border border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-black text-white">
              Stay in <span className="text-[#F5821F]">Focus</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-300">
              Get new arrivals, exclusive deals and gear tips on WhatsApp. Reply STOP anytime to opt out.
            </p>
          </div>

          <a
            href={`https://wa.me/916305875376?text=${encodeURIComponent(
              "Hi MiKing's Cameras! Please add me to your WhatsApp list for new arrivals and deals."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto shrink-0 px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-sm rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            Get Deals on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
