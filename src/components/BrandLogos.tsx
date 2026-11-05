'use client';

import React from 'react';
import Link from 'next/link';

export function BrandLogos() {
  const brands = [
    {
      name: 'Canon',
      slug: 'canon',
      logo: (
        <svg viewBox="0 0 120 30" className="h-6 w-auto fill-[#CC0000] dark:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="24" fontFamily="'Trebuchet MS', Arial, sans-serif" fontWeight="900" fontSize="28" letterSpacing="-1">Canon</text>
        </svg>
      ),
    },
    {
      name: 'SONY',
      slug: 'sony',
      logo: (
        <svg viewBox="0 0 120 30" className="h-5 w-auto fill-stone-900 dark:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="22" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="26" letterSpacing="4">SONY</text>
        </svg>
      ),
    },
    {
      name: 'Nikon',
      slug: 'nikon',
      logo: (
        <svg viewBox="0 0 120 30" className="h-6 w-auto fill-stone-900 dark:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="24" fontFamily="'Impact', 'Arial Black', sans-serif" fontStyle="italic" fontWeight="900" fontSize="30" letterSpacing="1">Nikon</text>
        </svg>
      ),
    },
    {
      name: 'FUJIFILM',
      slug: 'fujifilm',
      logo: (
        <svg viewBox="0 0 140 30" className="h-5 w-auto fill-stone-900 dark:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="22" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="22" letterSpacing="1.5">FUJIFILM</text>
          <circle cx="88" cy="9" r="3" fill="#E60012" />
        </svg>
      ),
    },
    {
      name: 'DJI',
      slug: 'dji',
      logo: (
        <svg viewBox="0 0 80 30" className="h-6 w-auto fill-stone-900 dark:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 8h24c3 0 5 2 5 5v4c0 3-2 5-5 5H5V8zm7 9h11c1 0 2-1 2-2v-2c0-1-1-2-2-2H12v6zM39 8h8v10c0 3-2 4-5 4s-4-1-4-2l4-2c1 1 2 1 2 0V8zM52 8h8v14h-8V8z"/>
        </svg>
      ),
    },
    {
      name: 'GoPro',
      slug: 'gopro',
      logo: (
        <svg viewBox="0 0 110 30" className="h-5 w-auto transition-colors" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="22" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="23" letterSpacing="0.5" className="fill-stone-900 dark:fill-white">GoPro</text>
        </svg>
      ),
    },
    {
      name: 'SIGMA',
      slug: 'sigma',
      logo: (
        <svg viewBox="0 0 120 30" className="h-5 w-auto fill-stone-900 dark:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="22" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="23" letterSpacing="3">SIGMA</text>
        </svg>
      ),
    },
    {
      name: 'Manfrotto',
      slug: 'manfrotto',
      logo: (
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#E31B23] flex items-center justify-center text-white text-[10px] font-black">
            M
          </div>
          <span className="font-black text-xs sm:text-sm tracking-tight text-stone-900 dark:text-white">
            Manfrotto
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#24211d] rounded-2xl py-5 px-4 sm:px-6 shadow-sm transition-colors">
      <div className="flex items-center justify-between gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x py-1">
        {brands.map((b, i) => (
          <React.Fragment key={b.name}>
            {i > 0 && (
              <div className="h-5 w-px bg-stone-200 dark:bg-stone-800 shrink-0 hidden sm:block" />
            )}
            <Link
              href={`/catalog?brand=${b.slug}`}
              className="shrink-0 snap-start flex items-center justify-center px-3 py-1.5 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-200 cursor-pointer"
              title={`Shop ${b.name} Photography Gear`}
            >
              {b.logo}
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
