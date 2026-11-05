'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { Product } from '@/data/catalog';
import { formatINR } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const wishlisted = isInWishlist(product.id);

  // Deduplicated image list with verified URLs
  const imageList = React.useMemo(() => {
    const list = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
    return Array.from(new Set(list)).filter(Boolean);
  }, [product.images, product.imageUrl]);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [currentImgSrc, setCurrentImgSrc] = useState(imageList[0] || product.imageUrl);

  // Sync image source when currentImgIndex changes or product changes
  React.useEffect(() => {
    setCurrentImgSrc(imageList[currentImgIndex] || product.imageUrl);
  }, [currentImgIndex, imageList, product.imageUrl]);

  const discountPercent = Math.round(
    ((product.regularPrice - product.salePrice) / product.regularPrice) * 100
  );

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % imageList.length);
  };

  const selectImage = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex(idx);
  };

  const handleImageError = () => {
    // Graceful fallback to verified primary image if secondary angle 404s
    if (currentImgSrc !== product.imageUrl) {
      setCurrentImgSrc(product.imageUrl);
      setCurrentImgIndex(0);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative bg-white dark:bg-[#181613] border border-stone-200/90 dark:border-[#2a2621] hover:border-[#F5821F] dark:hover:border-[#F5821F] rounded-2xl overflow-hidden flex flex-col justify-between h-full min-h-[385px] w-full transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#F5821F]/10"
    >
      {/* Top Badges & Wishlist Trigger */}
      <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center pointer-events-none">
        <div className="flex flex-col gap-1">
          {!product.inStock ? (
            <span className="font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-900 text-stone-300 border border-stone-700 shadow-sm">
              Out of Stock
            </span>
          ) : product.badge ? (
            <span
              className={`font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-sm ${
                product.badge.toLowerCase().includes('best')
                  ? 'bg-[#F5821F] text-black'
                  : product.badge.toLowerCase().includes('new')
                  ? 'bg-emerald-500 text-black'
                  : product.badge.toLowerCase().includes('popular')
                  ? 'bg-amber-500 text-black'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {product.badge}
            </span>
          ) : null}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`pointer-events-auto p-2 rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer active:scale-90 ${
            wishlisted
              ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/40 scale-105 ring-2 ring-rose-400/50'
              : 'bg-white/95 dark:bg-black/60 border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400 hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50/50 shadow-sm'
          }`}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-white text-white' : ''}`} />
        </button>
      </div>

      {/* Product Image on Pure Studio White Container (Eliminates All Image Backgrounds & Preserves Razor-Sharp Quality) */}
      <div className="relative h-[200px] sm:h-[210px] w-full overflow-hidden bg-white dark:bg-white border-b border-stone-200 dark:border-stone-800 shrink-0 flex items-center justify-center">
        <Link
          href={`/product/${product.slug}`}
          className="block w-full h-full relative p-3 flex items-center justify-center cursor-pointer"
        >
          <Image
            src={currentImgSrc}
            alt={`${product.name} - Angle ${currentImgIndex + 1}`}
            fill
            onError={handleImageError}
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply contrast-[1.32] brightness-[1.20] saturate-[1.08] [mask-image:radial-gradient(ellipse_at_center,black_72%,transparent_100%)]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>

        {/* Carousel Navigation Arrows (visible on hover if multiple images exist) */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 dark:bg-black/80 hover:bg-[#F5821F] dark:hover:bg-[#F5821F] text-stone-800 dark:text-white hover:text-black shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 dark:bg-black/80 hover:bg-[#F5821F] dark:hover:bg-[#F5821F] text-stone-800 dark:text-white hover:text-black shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Airbnb-style Pagination Dots at Bottom */}
            <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-auto">
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => selectImage(e, idx)}
                  aria-label={`View photo ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === currentImgIndex
                      ? 'w-4 h-1.5 bg-[#F5821F]'
                      : 'w-1.5 h-1.5 bg-stone-400/50 dark:bg-stone-600/70 hover:bg-stone-400'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Body with Standardized Height for Equal Card Sizing */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white dark:bg-[#181613]">
        <div className="space-y-1">
          <Link href={`/product/${product.slug}`} className="block group-hover:text-[#F5821F] transition-colors">
            <h3 className="text-xs font-bold text-stone-900 dark:text-white line-clamp-2 leading-snug h-[2.5rem] flex items-start">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-amber-500 pt-0.5">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-800 dark:text-stone-200 text-xs">{product.rating}</span>
            </div>
            <span className="text-[11px] text-stone-500">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-2 border-t border-stone-100 dark:border-[#2a2621] flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-black text-stone-900 dark:text-white">
              {formatINR(product.salePrice)}
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-stone-400 dark:text-stone-500 line-through">
                {formatINR(product.regularPrice)}
              </span>
              {discountPercent > 0 && (
                <span className="text-[#F5821F] font-bold">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {product.inStock ? (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => addToCart(product, 1)}
              className="w-9 h-9 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-bold flex items-center justify-center transition-all shrink-0 shadow-md shadow-[#F5821F]/20 cursor-pointer"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            </motion.button>
          ) : (
            <a
              href={`https://wa.me/916305875376?text=${encodeURIComponent(
                `Hi Mi King's Cameras, I want to request/pre-order: ${product.name} (SKU: ${product.id}). Please notify me when available in Hyderabad!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="h-9 px-2.5 rounded-xl bg-stone-100 hover:bg-emerald-500 hover:text-white dark:bg-stone-800 dark:hover:bg-emerald-600 text-stone-700 dark:text-stone-300 text-[10px] font-extrabold flex items-center gap-1 transition-all shrink-0 cursor-pointer border border-stone-200 dark:border-stone-700 shadow-sm"
              title="Request this item via WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500 hover:text-white shrink-0" />
              <span>Request</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
