'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  Truck,
  User,
  ChevronDown,
  LayoutGrid,
  Phone,
  Mail,
  MapPin,
  X,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Tag,
} from 'lucide-react';
import { INITIAL_PRODUCTS, Product } from '@/data/catalog';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { OFFICIAL_LOGO_BASE64 } from '@/data/logo';

const TRENDING_SEARCHES = [
  'Canon 50mm f/1.8 STM',
  'Nikon D7100 Kit',
  'Sony Mirrorless',
  'Canon 90D Body',
  'DJI Creator Drones',
  'Lenses Under ₹15,000',
];

const POPULAR_DEPARTMENTS = [
  { name: 'DSLR Bodies', slug: 'dslr' },
  { name: 'Mirrorless', slug: 'mirrorless' },
  { name: 'Prime Lenses', slug: 'lenses' },
  { name: 'Drones & Video', slug: 'drones' },
];

export function Header() {
  const router = useRouter();
  const { itemCount, cart, cartTotal, removeFromCart, updateQuantity } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Predictive Matching Products (Instant & Fuzzy across 153 products)
  const matchingProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return INITIAL_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q) ||
        Object.values(p.specs || {}).some((s) => s.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/catalog');
    }
  };

  const handleSuggestionClick = (queryText: string) => {
    setSearchQuery(queryText);
    setIsSearchFocused(false);
    router.push(`/catalog?q=${encodeURIComponent(queryText)}`);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsCategoryDropdownOpen(false);
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Reusable Smart Autocomplete Dropdown Component
  const renderAutocompleteDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.16 }}
      className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl shadow-2xl overflow-hidden z-50 text-xs"
    >
      {!searchQuery.trim() ? (
        /* Empty Query State: Show Popular Searches & Departments */
        <div className="p-4 space-y-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#F5821F] flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Trending In Hyderabad Store
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TRENDING_SEARCHES.map((term, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSuggestionClick(term)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#F5821F]/15 dark:bg-[#201d19] dark:hover:bg-[#F5821F]/20 text-stone-700 dark:text-stone-300 hover:text-[#F5821F] border border-stone-200/80 dark:border-stone-800 transition-colors text-[11px] font-semibold cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-[#24211d]">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-2">
              Popular Categories
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POPULAR_DEPARTMENTS.map((dept, i) => (
                <Link
                  key={i}
                  href={`/catalog?cat=${dept.slug}`}
                  onClick={() => setIsSearchFocused(false)}
                  className="p-2 rounded-xl bg-stone-50 dark:bg-[#13110f] border border-stone-200/60 dark:border-stone-800 hover:border-[#F5821F] text-center font-bold text-stone-800 dark:text-stone-200 hover:text-[#F5821F] transition-colors"
                >
                  {dept.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Active Query: Real-Time Matching Products */
        <div>
          {matchingProducts.length > 0 ? (
            <div className="divide-y divide-stone-100 dark:divide-[#24211d] max-h-80 overflow-y-auto">
              <div className="p-2.5 bg-stone-50/80 dark:bg-[#12110f] text-[11px] font-bold text-stone-500 flex items-center justify-between">
                <span>Matching Products</span>
                <span className="text-[#F5821F] font-black">{matchingProducts.length} Suggestions</span>
              </div>

              {matchingProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  onClick={() => {
                    setIsSearchFocused(false);
                    setSearchQuery('');
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-stone-50 dark:hover:bg-[#201d19] transition-colors group cursor-pointer"
                >
                  <div className="relative w-11 h-11 rounded-xl bg-white border border-stone-200 dark:border-stone-800 overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      className="object-contain p-1 mix-blend-multiply contrast-[1.32] brightness-[1.20] [mask-image:radial-gradient(ellipse_at_center,black_74%,transparent_100%)]"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-900 dark:text-white truncate group-hover:text-[#F5821F] transition-colors text-xs">
                      {p.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-500">
                      <span className="uppercase font-extrabold text-[#F5821F]">{p.brand}</span>
                      <span>&bull;</span>
                      <span className="capitalize">{p.category}</span>
                      <span>&bull;</span>
                      <span>{p.condition}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-black text-stone-900 dark:text-white text-xs">
                      {formatINR(p.salePrice)}
                    </div>
                    {p.inStock ? (
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">In Stock</span>
                    ) : (
                      <span className="text-[9px] font-bold text-stone-400">Pre-Order</span>
                    )}
                  </div>
                </Link>
              ))}

              {/* View all matches footer */}
              <button
                type="button"
                onClick={handleSearch}
                className="w-full p-3 bg-stone-50 dark:bg-[#12110f] hover:bg-[#F5821F]/10 text-center text-xs font-black text-[#F5821F] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View all results for &quot;{searchQuery}&quot; in Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-6 text-center space-y-2">
              <p className="text-stone-500 dark:text-stone-400 font-medium">
                No direct matches for &quot;<strong>{searchQuery}</strong>&quot;
              </p>
              <button
                type="button"
                onClick={handleSearch}
                className="text-xs font-bold text-[#F5821F] hover:underline cursor-pointer"
              >
                Search all gear in catalog &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#110f0d]/95 backdrop-blur-md border-b border-stone-200 dark:border-[#24211d] shadow-sm transition-colors">
      {/* 1. Top Utility Notification Bar (Non-crowded on Mobile & Tablet) */}
      <div className="bg-stone-100 dark:bg-[#0c0b09] border-b border-stone-200 dark:border-[#24211d] text-[11px] text-stone-600 dark:text-stone-400 py-1 px-4 font-medium transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Mobile view (< sm): concise single-line announcement */}
          <div className="flex sm:hidden items-center gap-1.5 text-[#F5821F] font-bold truncate">
            <Truck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Free Shipping Above ₹5,000</span>
          </div>

          {/* Tablet & Desktop view (sm+): full store info */}
          <div className="hidden sm:flex items-center gap-3 lg:gap-4 truncate">
            <span className="flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#F5821F]" />
              <span>Hyderabad Store</span>
            </span>
            <span className="text-stone-300 dark:text-[#2e2a25]">|</span>
            <a href="tel:+919032285420" className="flex items-center gap-1 hover:text-stone-900 dark:hover:text-white transition-colors shrink-0">
              <Phone className="w-3.5 h-3.5 text-[#F5821F]" />
              <span>+91 90322 85420</span>
            </a>
            <span className="hidden lg:inline text-stone-300 dark:text-[#2e2a25]">|</span>
            <a href="mailto:mikingsdslrshop@gmail.com" className="hidden lg:flex items-center gap-1 hover:text-stone-900 dark:hover:text-white transition-colors truncate">
              <Mail className="w-3.5 h-3.5 text-[#F5821F] shrink-0" />
              <span className="truncate">mikingsdslrshop@gmail.com</span>
            </a>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-[#F5821F] font-bold">
              <Truck className="w-3.5 h-3.5" />
              <span>Free Shipping &gt; ₹5,000</span>
            </div>
            <span className="hidden sm:inline text-stone-300 dark:text-[#2e2a25]">|</span>
            <ThemeToggle className="scale-85" />
          </div>
        </div>
      </div>

      {/* 2. Main Brand Header with Search */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-4 sm:gap-8">
          {/* Official Brand Logo */}
          <Link href="/" className="flex items-center shrink-0 group p-1.5 px-3 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
            <img
              src={OFFICIAL_LOGO_BASE64}
              alt="MI King's Cameras"
              className="h-8 sm:h-10 w-auto object-contain group-hover:opacity-95 transition-all"
            />
          </Link>

          {/* Center Search Bar with Orange Icon Button (Desktop/Tablet) */}
          <div className="flex-1 max-w-2xl hidden md:block relative z-40" ref={desktopSearchRef}>
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search for cameras, lenses, drones, accessories..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-full bg-stone-100 dark:bg-[#1b1916] border border-stone-200 dark:border-[#2e2a25] rounded-xl py-2.5 pl-4 pr-14 text-sm text-stone-900 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-[#F5821F] transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 bg-[#F5821F] hover:bg-[#E0741A] text-black font-bold rounded-lg flex items-center justify-center transition-all cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-black stroke-[2.5]" />
              </button>
            </form>

            {/* Desktop Autocomplete Dropdown */}
            <AnimatePresence>
              {isSearchFocused && renderAutocompleteDropdown()}
            </AnimatePresence>
          </div>

          {/* Action Links (Track, Wishlist, Cart, Account) */}
          <div className="flex items-center gap-3 sm:gap-5 text-stone-700 dark:text-stone-300">
            <Link
              href="/track"
              className="hidden lg:flex flex-col items-center hover:text-[#F5821F] transition-colors text-center group"
            >
              <Truck className="w-5 h-5 text-stone-500 dark:text-stone-400 group-hover:text-[#F5821F] transition-colors" />
              <span className="text-[10px] font-medium mt-0.5">Track Order</span>
            </Link>

            <Link
              href="/wishlist"
              className="flex flex-col items-center hover:text-[#F5821F] transition-colors text-center group relative"
            >
              <Heart className="w-5 h-5 text-stone-500 dark:text-stone-400 group-hover:text-[#F5821F] transition-colors" />
              <span className="text-[10px] font-medium mt-0.5">Wishlist</span>
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col items-center hover:text-[#F5821F] transition-colors text-center group relative cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-stone-500 dark:text-stone-400 group-hover:text-[#F5821F] transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#F5821F] text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium mt-0.5">Cart ({itemCount})</span>
            </button>

            <Link
              href="/account"
              className="flex flex-col items-center hover:text-[#F5821F] transition-colors text-center group"
            >
              <User className="w-5 h-5 text-stone-500 dark:text-stone-400 group-hover:text-[#F5821F] transition-colors" />
              <span className="text-[10px] font-medium mt-0.5">Account</span>
            </Link>
          </div>
        </div>

        {/* 2b. Mobile & Tablet Search Bar (< md) with Predictive Autocomplete */}
        <div className="block md:hidden px-4 pb-2.5 pt-0.5 relative z-40" ref={mobileSearchRef}>
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search cameras, lenses, drones..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              className="w-full bg-stone-100 dark:bg-[#1b1916] border border-stone-200 dark:border-[#2e2a25] rounded-xl py-2 pl-4 pr-12 text-xs text-stone-900 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-[#F5821F] transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#F5821F] hover:bg-[#E0741A] text-black font-bold rounded-lg flex items-center justify-center transition-all cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            </button>
          </form>

          {/* Mobile Autocomplete Dropdown */}
          <AnimatePresence>
            {isSearchFocused && renderAutocompleteDropdown()}
          </AnimatePresence>
        </div>

        {/* 3. Secondary Navigation Strip (All Categories + Departments + Deals) */}
        <div className="bg-stone-50 dark:bg-[#171512] border-t border-stone-200 dark:border-[#24211d] px-4 transition-colors relative z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between py-2 text-xs gap-4">
            <div className="flex items-center gap-3 lg:gap-5 min-w-0 flex-1">
              {/* All Categories Dropdown Trigger (Free from clipping) */}
              <div ref={categoryRef} className="relative shrink-0 z-50">
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#F5821F]/15 text-xs whitespace-nowrap"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>All Categories</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isCategoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl shadow-2xl p-2 z-50 text-xs"
                    >
                      {[
                        { name: 'DSLR Cameras', href: '/catalog?cat=dslr' },
                        { name: 'Mirrorless Bodies', href: '/catalog?cat=mirrorless' },
                        { name: 'Lenses & Filters', href: '/catalog?cat=lenses' },
                        { name: 'Drones & Combos', href: '/catalog?cat=drones' },
                        { name: 'Lighting & Softboxes', href: '/catalog?cat=lighting' },
                        { name: 'Tripods & Monopods', href: '/catalog?cat=tripods' },
                        { name: 'Bags & Waterproof Cases', href: '/catalog?cat=bags' },
                        { name: 'Microphones & Audio', href: '/catalog?cat=audio' },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsCategoryDropdownOpen(false)}
                          className="block px-3.5 py-2.5 rounded-xl text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#24211d] transition-colors font-medium"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Department Links Scrollable */}
              <nav className="flex-1 overflow-x-auto scrollbar-none flex items-center gap-4 lg:gap-5 text-stone-600 dark:text-stone-300 font-medium whitespace-nowrap py-0.5">
                <Link href="/catalog?cat=cameras" className="hover:text-[#F5821F] transition-colors">Cameras</Link>
                <Link href="/catalog?cat=lenses" className="hover:text-[#F5821F] transition-colors">Lenses</Link>
                <Link href="/catalog?cat=drones" className="hover:text-[#F5821F] transition-colors">Drones</Link>
                <Link href="/catalog?cat=accessories" className="hover:text-[#F5821F] transition-colors">Accessories</Link>
                <Link href="/catalog?cat=lighting" className="hover:text-[#F5821F] transition-colors">Lighting</Link>
                <Link href="/catalog?cat=tripods" className="hover:text-[#F5821F] transition-colors">Tripods</Link>
                <Link href="/catalog?cat=bags" className="hover:text-[#F5821F] transition-colors">Bags &amp; Cases</Link>
                <Link href="/catalog?cat=audio" className="hover:text-[#F5821F] transition-colors">Audio</Link>
                <Link href="/blog" className="hover:text-[#F5821F] font-bold text-stone-800 dark:text-stone-200 transition-colors">Guides &amp; Blog</Link>
                <Link
                  href="/catalog?deals=true"
                  className="bg-[#F5821F] text-black font-extrabold px-3 py-1 rounded-full hover:bg-[#E0741A] transition-all shadow-sm shrink-0"
                >
                  Deals
                </Link>
              </nav>
            </div>

            {/* Quick links on right - only on wide screens so it never overflows */}
            <div className="hidden xl:flex items-center gap-4 text-stone-500 dark:text-stone-400 font-medium shrink-0 whitespace-nowrap">
              <Link href="/about" className="hover:text-[#F5821F] flex items-center gap-1.5 transition-colors">
                <MapPin className="w-3.5 h-3.5 text-[#F5821F]" />
                <span>Store Locator</span>
              </Link>
              <a href="tel:+919032285420" className="hover:text-[#F5821F] flex items-center gap-1.5 transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#F5821F]" />
                <span>Support</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-over Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-white dark:bg-[#1b1916] border-l border-stone-200 dark:border-[#2e2a25] shadow-2xl flex flex-col"
              >
                <div className="p-5 border-b border-stone-200 dark:border-[#2e2a25] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#F5821F]" />
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">Your Cart ({itemCount})</h3>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-[#2e2a25] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto" />
                      <p className="text-stone-500 dark:text-stone-400 font-medium">Your cart is empty</p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-[#F5821F] text-sm hover:underline cursor-pointer"
                      >
                        Browse equipment catalog &rarr;
                      </button>
                    </div>
                  ) : (
                    cart.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="flex gap-4 p-3 bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-[#2e2a25] rounded-xl"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0 border border-stone-200 dark:border-[#2e2a25]">
                          <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-1 mix-blend-multiply" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-stone-900 dark:text-white truncate">{product.name}</h4>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{product.condition}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-bold text-[#F5821F]">
                              {formatINR(product.salePrice * quantity)}
                            </span>
                            <div className="flex items-center border border-stone-200 dark:border-[#2e2a25] rounded-lg bg-white dark:bg-[#1b1916]">
                              <button
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                className="px-2 py-0.5 text-xs text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-semibold text-stone-900 dark:text-white">{quantity}</span>
                              <button
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                className="px-2 py-0.5 text-xs text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-stone-400 hover:text-rose-500 p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-5 border-t border-stone-200 dark:border-[#2e2a25] bg-stone-50 dark:bg-[#110f0d] space-y-4">
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-stone-600 dark:text-stone-400">
                        <span>Subtotal</span>
                        <span className="text-stone-900 dark:text-white font-medium">{formatINR(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between text-stone-600 dark:text-stone-400">
                        <span>GST</span>
                        <span className="text-stone-900 dark:text-white font-medium">Included</span>
                      </div>
                      <div className="flex justify-between text-stone-600 dark:text-stone-400">
                        <span>Shipping</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free All-India Insured</span>
                      </div>
                      <div className="pt-2 border-t border-stone-200 dark:border-[#2e2a25] flex justify-between text-base font-bold text-stone-900 dark:text-white">
                        <span>Estimated Total</span>
                        <span className="text-[#F5821F]">{formatINR(cartTotal)}</span>
                      </div>
                    </div>

                    <Link
                      href="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className="w-full bg-[#F5821F] hover:bg-[#E0741A] text-black font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#F5821F]/20 text-center"
                    >
                      Proceed to Secure Checkout
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
