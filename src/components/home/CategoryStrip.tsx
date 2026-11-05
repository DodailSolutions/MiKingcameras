'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CameraEquipmentIcon,
  LensIcon,
  DroneIcon,
  LightingIcon,
  GimbalIcon,
  CameraBagIcon,
  MemoryCardIcon,
  StudioGearIcon,
  AudioMicIcon,
} from '@/components/icons/CategoryIcons';
import { TripodIcon } from '@/components/icons/TripodIcon';
import { CATEGORIES } from '@/data/catalog';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Camera: CameraEquipmentIcon,
  Cameras: CameraEquipmentIcon,
  Aperture: LensIcon,
  Lens: LensIcon,
  Lenses: LensIcon,
  Compass: DroneIcon,
  Drone: DroneIcon,
  Drones: DroneIcon,
  Sun: LightingIcon,
  Lighting: LightingIcon,
  Video: GimbalIcon,
  Gimbal: GimbalIcon,
  Gimbals: GimbalIcon,
  Maximize2: TripodIcon,
  Tripod: TripodIcon,
  Tripods: TripodIcon,
  Briefcase: CameraBagIcon,
  Bag: CameraBagIcon,
  Bags: CameraBagIcon,
  HardDrive: MemoryCardIcon,
  Storage: MemoryCardIcon,
  Zap: StudioGearIcon,
  Studio: StudioGearIcon,
  Headphones: AudioMicIcon,
  Audio: AudioMicIcon,
};

export function CategoryStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 8);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section aria-labelledby="shop-by-category" className="max-w-7xl mx-auto px-4 w-full">
      <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm transition-colors">
        {/* Header with Title and Scroll Controls */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h2 id="shop-by-category" className="text-sm sm:text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
              <span>Explore Categories</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5821F]/15 text-[#F5821F]">
                Hyderabad Hub
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/catalog"
              className="text-xs font-bold text-[#F5821F] hover:underline hidden sm:inline-block mr-1"
            >
              All Gear &rarr;
            </Link>

            {/* Left & Right Arrow Buttons (Always visible on mobile & tablet) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  canScrollLeft
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white hover:bg-[#F5821F] hover:text-black shadow-sm active:scale-95'
                    : 'bg-stone-100/50 dark:bg-stone-900/50 text-stone-300 dark:text-stone-700 opacity-40 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  canScrollRight
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white hover:bg-[#F5821F] hover:text-black shadow-sm active:scale-95'
                    : 'bg-stone-100/50 dark:bg-stone-900/50 text-stone-300 dark:text-stone-700 opacity-40 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Container with Smooth Native Touch & Drag Support */}
        <div className="relative w-full">
          {/* Left Gradient Indicator */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-white dark:from-[#181613] to-transparent pointer-events-none z-10" />
          )}

          {/* Right Gradient Indicator */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-white dark:from-[#181613] to-transparent pointer-events-none z-10" />
          )}

          <div
            ref={scrollRef}
            className="flex items-stretch gap-2.5 sm:gap-3.5 overflow-x-auto scroll-smooth py-1 px-1 touch-pan-x select-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {CATEGORIES.map((cat) => {
              const Icon = ICONS[cat.icon] ?? ICONS[cat.name] ?? CameraEquipmentIcon;
              return (
                <Link
                  key={cat.slug}
                  href={`/catalog?cat=${cat.slug}`}
                  className="group shrink-0 w-[96px] sm:w-[110px] lg:w-[120px] flex flex-col items-center text-center justify-between p-2.5 sm:p-3 rounded-2xl bg-stone-50 dark:bg-[#14120f] border border-stone-200/80 dark:border-[#27231e] hover:bg-white dark:hover:bg-[#1d1a16] hover:border-[#F5821F]/60 transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-[#1e1b17] border border-stone-200 dark:border-[#2c2822] text-stone-700 dark:text-stone-300 flex items-center justify-center group-hover:bg-[#F5821F] group-hover:text-black group-hover:border-[#F5821F] transition-all duration-200 shadow-xs mb-2">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-200 group-hover:scale-110" />
                  </span>

                  <span className="text-xs font-black text-stone-900 dark:text-white leading-tight line-clamp-1 w-full group-hover:text-[#F5821F] transition-colors">
                    {cat.name}
                  </span>

                  <span className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold mt-1">
                    {cat.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
