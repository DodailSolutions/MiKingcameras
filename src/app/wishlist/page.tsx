'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { INITIAL_PRODUCTS } from '@/data/catalog';
import { formatINR } from '@/lib/utils';
import { Heart, ShoppingBag, Trash2, ArrowRight, Star } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  const wishlistedProducts = INITIAL_PRODUCTS.filter((p) => wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 rounded-3xl flex items-center justify-center mx-auto text-rose-500 shadow-lg">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Your Wishlist is Empty
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            Save camera bodies, lenses, and gear you love by tapping the heart icon on any product.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs shadow-lg shadow-[#F5821F]/20 transition-all cursor-pointer"
          >
            Explore Catalog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      <div>
        <span className="text-xs font-bold text-[#F5821F] uppercase tracking-wider">
          Saved Equipment
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1">
          My Wishlist ({wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {wishlistedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
