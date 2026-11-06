'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Star } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { INITIAL_PRODUCTS } from '@/data/catalog';
import { formatINR } from '@/lib/utils';

interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  cta: { label: string; href: string };
  image: string;
  imageAlt: string;
  productSlug: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: 'cameras',
    eyebrow: 'Mirrorless & DSLR Bodies',
    title: 'Upgrade Your',
    highlight: 'Photography Gear',
    description:
      'New and certified pre-owned Canon, Nikon and Sony cameras, tested in our Hyderabad store and backed by up to 2 years of warranty.',
    cta: { label: 'Shop Cameras', href: '/catalog?cat=cameras' },
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1920&q=80',
    imageAlt: 'Mirrorless camera body with prime lenses on a dark surface',
    productSlug: 'canon-eos-r6-mark-ii',
  },
  {
    id: 'lenses',
    eyebrow: 'Prime, Zoom & Cine Glass',
    title: 'Sharper Shots Start',
    highlight: 'With Better Lenses',
    description:
      'From fast primes to pro zooms by Sigma, Canon, Sony and Nikon. Try any lens on your own body in-store before you buy.',
    cta: { label: 'Shop Lenses', href: '/catalog?cat=lenses' },
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=1920&q=80',
    imageAlt: 'Sigma zoom lens standing on a wooden desk',
    productSlug: 'sigma-24-70mm-f28-dg-dn-art',
  },
  {
    id: 'drones',
    eyebrow: 'DJI Drones for Creators',
    title: 'Take Your Story',
    highlight: 'To New Heights',
    description:
      'Cinematic aerial footage with the latest DJI drones and Fly More combos, plus expert setup help from our team.',
    cta: { label: 'Shop Drones', href: '/catalog?cat=drones' },
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1920&q=80',
    imageAlt: 'Camera drone hovering above a pine forest',
    productSlug: 'dji-mini-4-pro-fly-more-combo',
  },
];

const AUTOPLAY_MS = 6000;

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const slide = SLIDES[index];
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slide.productSlug);

  const goTo = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, paused, reduceMotion, goTo]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative overflow-hidden bg-[#110f0d] border-b border-[#24211d]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Background photography */}
      <div className="absolute inset-0 lg:left-auto lg:w-[64%]">
        {/* All slides stay mounted so their photos are loaded before they're shown */}
        {SLIDES.map((s, i) => (
          <motion.div
            key={s.id}
            initial={false}
            animate={{ opacity: i === index ? 1 : 0, scale: i === index || reduceMotion ? 1 : 1.04 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0"
            aria-hidden={i !== index}
          >
            <Image
              src={s.image}
              alt={i === index ? s.imageAlt : ''}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 64vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        ))}
        {/* Blend the photo into the page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#110f0d]/40 via-[#110f0d]/75 to-[#110f0d]/90 lg:bg-gradient-to-r lg:from-[#110f0d] lg:via-[#110f0d]/40 lg:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#110f0d] to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 min-h-[360px] sm:min-h-[460px] lg:min-h-[540px] flex flex-col justify-center pt-6 pb-6 sm:py-10 lg:py-16">
        <div className="max-w-xl space-y-3.5 sm:space-y-6" aria-live={paused ? 'polite' : 'off'}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="space-y-2.5 sm:space-y-4"
            >
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#F5821F]/10 border border-[#F5821F]/30 text-[#F5821F] text-[11px] sm:text-xs font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5821F]" />
                {slide.eyebrow}
              </span>

              <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                {slide.title}
                <br />
                <span className="text-[#F5821F]">{slide.highlight}</span>
              </h1>

              <p className="text-stone-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-none">
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
            <Link
              href={slide.cta.href}
              className="px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs sm:text-sm inline-flex items-center gap-1.5 sm:gap-2 transition-colors shadow-lg shadow-[#F5821F]/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5821F]"
            >
              {slide.cta.label}
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
            <Link
              href="/about"
              className="px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 sm:gap-2 backdrop-blur-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5821F]" />
              Visit Our Store
            </Link>
          </div>

          {/* Slider controls */}
          <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-5">
            <div className="flex items-center gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show ${s.eyebrow}`}
                  aria-current={i === index}
                  className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                    i === index ? 'w-10 bg-white/20' : 'w-4 bg-white/30 hover:bg-white/50'
                  }`}
                >
                  {i === index && (
                    <motion.span
                      key={`${s.id}-${paused}`}
                      className="absolute inset-y-0 left-0 bg-[#F5821F]"
                      initial={{ width: paused || reduceMotion ? '100%' : '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: paused || reduceMotion ? 0 : AUTOPLAY_MS / 1000, ease: 'linear' }}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Previous slide"
                className="w-9 h-9 rounded-full border border-white/15 bg-black/30 hover:border-[#F5821F] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label="Next slide"
                className="w-9 h-9 rounded-full border border-white/15 bg-black/30 hover:border-[#F5821F] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured product for the active slide */}
        {product && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="hidden lg:block absolute right-4 xl:right-0 bottom-16 w-80"
            >
              <Link
                href={`/product/${product.slug}`}
                className="group flex items-center gap-4 p-3 pr-4 rounded-2xl bg-[#110f0d]/80 backdrop-blur-md border border-white/10 hover:border-[#F5821F]/60 shadow-2xl transition-colors"
              >
                <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-transparent flex items-center justify-center p-1">
                  <Image src={product.imageUrl} alt="" fill sizes="80px" className="object-contain" />
                </div>
                <div className="min-w-0 space-y-1">
                  <span className="text-[11px] font-bold text-[#F5821F] uppercase tracking-wider">
                    {product.badge ?? 'Featured'}
                  </span>
                  <p className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-[#F5821F] transition-colors">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-black text-white">{formatINR(product.salePrice)}</span>
                    <span className="text-stone-500 line-through">{formatINR(product.regularPrice)}</span>
                    <span className="ml-auto flex items-center gap-0.5 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {product.rating}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
