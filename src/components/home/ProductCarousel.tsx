'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, LucideIcon, Pause, Play } from 'lucide-react';
import { Product } from '@/data/catalog';
import { ProductCard } from '@/components/ProductCard';

interface ProductCarouselProps {
  title: string;
  highlightText?: string;
  subtitle: string;
  icon?: LucideIcon;
  products: Product[];
  viewAllHref: string;
  viewAllLabel?: string;
  autoScrollInterval?: number; // in milliseconds, default 5000
  startDelay?: number; // in milliseconds before first auto-scroll, default 1000
}

export function ProductCarousel({
  title,
  highlightText,
  subtitle,
  icon: Icon,
  products,
  viewAllHref,
  viewAllLabel = 'View All',
  autoScrollInterval = 5000,
  startDelay = 1000,
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Scroll function (forward or backward)
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.querySelector('div')?.clientWidth || 260;
    const scrollAmount = (cardWidth + 16) * 1.5;

    if (direction === 'right') {
      // Loop back to start if at the end
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 20) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    } else {
      if (container.scrollLeft <= 10) {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Staggered automatic gentle scroll timer (pauses on hover or touch)
  useEffect(() => {
    if (isPaused) return;

    let intervalTimer: NodeJS.Timeout;
    const initialDelay = setTimeout(() => {
      // First scroll after initial start delay
      scroll('right');
      intervalTimer = setInterval(() => {
        scroll('right');
      }, autoScrollInterval);
    }, startDelay);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(intervalTimer);
    };
  }, [isPaused, autoScrollInterval, startDelay]);

  return (
    <section
      className="max-w-7xl mx-auto px-4 space-y-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
    >
      {/* Header with Title and Scroll Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-[#F5821F]/10 text-[#F5821F] flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <span className="text-xs font-bold text-[#F5821F] uppercase tracking-wider block">
              {subtitle}
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-stone-900 dark:text-white leading-tight">
              {title} {highlightText && <span className="text-[#F5821F]">{highlightText}</span>}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Link
            href={viewAllHref}
            className="text-xs font-extrabold text-[#F5821F] hover:underline mr-1"
          >
            {viewAllLabel} ({products.length}) &rarr;
          </Link>

          {/* Carousel Next/Prev Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="w-8 h-8 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#181613] hover:border-[#F5821F] hover:text-[#F5821F] text-stone-700 dark:text-stone-300 flex items-center justify-center transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="w-8 h-8 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#181613] hover:border-[#F5821F] hover:text-[#F5821F] text-stone-700 dark:text-stone-300 flex items-center justify-center transition-all shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Product Track (Fixed Standardized Dimensions per Card) */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="snap-start shrink-0 w-[190px] sm:w-[220px] md:w-[240px] lg:w-[250px] flex flex-col h-full"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
