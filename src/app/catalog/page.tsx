'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { INITIAL_PRODUCTS } from '@/data/catalog';
import { ProductCard } from '@/components/ProductCard';
import { Filter, Search, X } from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'all';
  const queryParam = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Update searchQuery state if URL param changes
  React.useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((p) => {
      // 1. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      // 3. Brand Filter
      if (selectedBrand !== 'all' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;

      // 4. Condition Filter
      if (selectedCondition !== 'all') {
        if (selectedCondition === 'new' && p.condition !== 'Brand New') return false;
        if (selectedCondition === 'used' && p.condition === 'Brand New') return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.salePrice - b.salePrice;
      if (sortBy === 'price-desc') return b.salePrice - a.salePrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedBrand, selectedCondition, sortBy]);

  return (
    <div className="space-y-8">
      {/* Active Search Badge */}
      {searchQuery && (
        <div className="flex items-center gap-2 p-3 bg-[#F5821F]/10 border border-[#F5821F]/30 rounded-2xl text-xs text-stone-900 dark:text-white">
          <Search className="w-4 h-4 text-[#F5821F]" />
          <span>
            Showing results for: <strong className="text-[#F5821F]">&quot;{searchQuery}&quot;</strong> ({filteredProducts.length} items found)
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="ml-auto text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="bg-white dark:bg-[#1b1916] border border-stone-200 dark:border-[#2e2a25] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs shadow-sm transition-colors">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-stone-600 dark:text-stone-400 font-semibold flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-[#F5821F]" />
            Category:
          </span>
          {['all', 'dslr', 'mirrorless', 'lenses', 'drones', 'gimbals'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider text-[11px] transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#F5821F] text-black shadow-md'
                  : 'bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-[#2e2a25] text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:border-stone-300'
              }`}
            >
              {cat === 'all' ? 'All Gear' : cat}
            </button>
          ))}
        </div>

        {/* Brand & Condition Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-[#2e2a25] text-stone-800 dark:text-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#F5821F]"
          >
            <option value="all">All Brands</option>
            <option value="canon">Canon</option>
            <option value="sony">Sony</option>
            <option value="nikon">Nikon</option>
            <option value="dji">DJI</option>
          </select>

          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-[#2e2a25] text-stone-800 dark:text-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#F5821F]"
          >
            <option value="all">All Conditions</option>
            <option value="new">Brand New</option>
            <option value="used">Certified Pre-Owned</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-[#2e2a25] text-stone-800 dark:text-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#F5821F]"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-[#1b1916] border border-stone-200 dark:border-[#2e2a25] rounded-3xl space-y-3 shadow-sm">
          <p className="text-stone-600 dark:text-stone-400 font-medium">No equipment found matching current filter selections.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedBrand('all');
              setSelectedCondition('all');
            }}
            className="text-xs font-bold text-[#F5821F] hover:underline cursor-pointer"
          >
            Clear all filters &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Title & Breadcrumb */}
      <div>
        <span className="text-xs font-bold text-[#F5821F] tracking-widest uppercase">Inventory Showcase</span>
        <h1 className="text-3xl font-black text-stone-900 dark:text-white mt-1">Cameras, Lenses, Drones &amp; Rigs</h1>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">Explore verified equipment available for instant shipping or Hyderabad store pickup.</p>
      </div>

      <Suspense fallback={<div className="text-stone-500 text-sm py-12 text-center">Loading live catalog...</div>}>
        <CatalogContent />
      </Suspense>
    </div>
  );
}
