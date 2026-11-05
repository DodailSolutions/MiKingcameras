'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/data/catalog';
import { formatINR } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import {
  ShieldCheck,
  Star,
  Truck,
  RotateCcw,
  ShoppingBag,
  Heart,
  PhoneCall,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  AlertCircle,
  MessageCircle,
  Home,
  Check,
  Share2,
} from 'lucide-react';

export function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const wishlisted = isInWishlist(product.id);

  // Use verified distinct images list
  const images = React.useMemo(() => {
    const list = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
    return Array.from(new Set(list)).filter(Boolean);
  }, [product.images, product.imageUrl]);

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [activeImgSrc, setActiveImgSrc] = useState(images[0] || product.imageUrl);

  React.useEffect(() => {
    setActiveImgSrc(images[selectedImgIndex] || product.imageUrl);
  }, [selectedImgIndex, images, product.imageUrl]);

  const handleImageError = () => {
    if (activeImgSrc !== product.imageUrl) {
      setActiveImgSrc(product.imageUrl);
      setSelectedImgIndex(0);
    }
  };

  const discountPercent = Math.round(
    ((product.regularPrice - product.salePrice) / product.regularPrice) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 sm:pt-6 pb-24 md:pb-12 space-y-6 sm:space-y-10">
      {/* High-Visibility Breadcrumb Card */}
      <nav aria-label="Breadcrumb" className="bg-stone-50/90 dark:bg-[#181613]/90 backdrop-blur-md border border-stone-200/90 dark:border-[#2e2a25] rounded-2xl px-4 py-2.5 shadow-xs flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 flex-wrap transition-colors">
        <Link href="/" className="hover:text-[#F5821F] flex items-center gap-1.5 font-medium transition-colors">
          <Home className="w-3.5 h-3.5 text-stone-500" />
          <span>Home</span>
        </Link>
        <span className="text-stone-300 dark:text-stone-600">/</span>
        <Link href="/catalog" className="hover:text-[#F5821F] font-medium transition-colors">
          Catalog
        </Link>
        <span className="text-stone-300 dark:text-stone-600">/</span>
        <Link href={`/catalog?cat=${product.category}`} className="hover:text-[#F5821F] capitalize font-medium transition-colors">
          {product.category}
        </Link>
        <span className="text-stone-300 dark:text-stone-600">/</span>
        <span className="text-stone-900 dark:text-white font-bold truncate max-w-[200px] sm:max-w-md">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Visual Showcase & Multi-Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-white dark:bg-white border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-center p-6">
            <Image
              src={activeImgSrc}
              alt={`${product.name} - Angle ${selectedImgIndex + 1}`}
              fill
              priority
              onError={handleImageError}
              className="object-contain p-6 mix-blend-multiply contrast-[1.32] brightness-[1.20] saturate-[1.08] [mask-image:radial-gradient(ellipse_at_center,black_74%,transparent_100%)] transition-all duration-300"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#F5821F] text-black font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                {product.badge}
              </span>
            )}
            <span className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-[#2e2a25] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {product.condition}
            </span>

            {/* Navigation Arrows on Main Image */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedImgIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-black/80 text-stone-800 dark:text-white hover:bg-[#F5821F] hover:text-black shadow-md flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Previous angle"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedImgIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-black/80 text-stone-800 dark:text-white hover:bg-[#F5821F] hover:text-black shadow-md flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Next angle"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Multiple Image Thumbnails - Fixed vertical clipping with generous py padding */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-3 px-1.5 -mx-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden bg-white dark:bg-white p-1 shrink-0 transition-all duration-200 cursor-pointer ${
                    selectedImgIndex === idx
                      ? 'ring-3 ring-[#F5821F] shadow-lg shadow-[#F5821F]/25 scale-105'
                      : 'border-2 border-stone-200 dark:border-stone-700 opacity-70 hover:opacity-100 hover:border-stone-400'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-contain p-1 mix-blend-multiply contrast-[1.32] brightness-[1.20] saturate-[1.08] [mask-image:radial-gradient(ellipse_at_center,black_74%,transparent_100%)]"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Verification Bar */}
          <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] p-4 rounded-2xl grid grid-cols-3 gap-2 text-center text-xs shadow-sm transition-colors">
            <div className="space-y-1">
              <ShieldCheck className="w-5 h-5 text-[#F5821F] mx-auto" />
              <div className="font-bold text-stone-900 dark:text-white">Authentic Gear</div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400">100% Original</div>
            </div>
            <div className="space-y-1 border-x border-stone-200 dark:border-[#2a2621]">
              <RotateCcw className="w-5 h-5 text-[#F5821F] mx-auto" />
              <div className="font-bold text-stone-900 dark:text-white">30-Day Returns</div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400">Store Guarantee</div>
            </div>
            <div className="space-y-1">
              <Truck className="w-5 h-5 text-[#F5821F] mx-auto" />
              <div className="font-bold text-stone-900 dark:text-white">Free Transit</div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400">Insured Delivery</div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Purchase */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span className="font-bold uppercase tracking-widest text-[#F5821F]">{product.brand}</span>
              <div className="flex items-center gap-1.5 text-amber-500">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-stone-900 dark:text-white text-xs">{product.rating}</span>
                <span className="text-stone-500 text-[11px]">({product.reviewCount} verified reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white leading-snug">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pt-1">
              {product.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] p-5 sm:p-6 rounded-3xl space-y-4 shadow-sm transition-colors">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-[#F5821F]">
                {formatINR(product.salePrice)}
              </span>
              {discountPercent > 0 && (
                <>
                  <span className="text-base text-stone-400 dark:text-stone-500 line-through">
                    {formatINR(product.regularPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            <div className="text-xs text-stone-600 dark:text-stone-400 space-y-2 border-t border-stone-100 dark:border-[#2a2621] pt-3">
              <div className="flex justify-between">
                <span>Inclusive of all taxes:</span>
                <span className="text-stone-900 dark:text-white font-bold">18% GST Included with Invoice</span>
              </div>
              <div className="flex justify-between">
                <span>Warranty Coverage:</span>
                <span className="text-stone-900 dark:text-white font-bold">{product.warranty}</span>
              </div>
              <div className="flex justify-between">
                <span>Availability:</span>
                {product.inStock ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    In Stock at Hyderabad Hub (Dispatches in 24h)
                  </span>
                ) : (
                  <span className="text-rose-500 font-bold">
                    Currently Out of Stock (Request Pre-Order)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            <div className="flex gap-3">
              {product.inStock ? (
                <button
                  type="button"
                  onClick={() => addToCart(product, 1)}
                  className="flex-1 bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#F5821F]/20 text-sm cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                  Add to Cart
                </button>
              ) : (
                <a
                  href={`https://wa.me/916305875376?text=${encodeURIComponent(
                    `Hi Mi King's Cameras, I want to request/pre-order: ${product.name} (SKU: ${product.id}). Please notify me as soon as it is available in Hyderabad!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 text-sm cursor-pointer text-center"
                >
                  <MessageCircle className="w-5 h-5" />
                  Request / Pre-Order This Item
                </a>
              )}

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center ${
                  wishlisted
                    ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/40 ring-2 ring-rose-400/50'
                    : 'bg-white dark:bg-[#181613] border-stone-200 dark:border-[#2a2621] text-stone-600 dark:text-stone-400 hover:text-rose-500 hover:border-rose-300'
                }`}
                aria-label="Wishlist toggle"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-white text-white' : ''}`} />
              </button>
            </div>

            {!product.inStock && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Direct purchase is restricted while out of stock. Tap above to reserve with priority from our Hyderabad store.
                </span>
              </div>
            )}

            {/* Direct WhatsApp Consultation */}
            <a
              href={`https://wa.me/916305875376?text=${encodeURIComponent(
                `Hi MiKing's Cameras, I want to reserve or check availability of ${product.name} (Price: ${formatINR(
                  product.salePrice
                )}). Is it currently available at your Hyderabad store?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-stone-50 hover:bg-stone-100 dark:bg-[#181613] dark:hover:bg-[#201d19] border border-stone-200 dark:border-[#2a2621] hover:border-[#25D366]/50 text-stone-800 dark:text-stone-200 py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm"
            >
              <PhoneCall className="w-4 h-4 text-[#25D366]" />
              Inquire / Reserve via WhatsApp (+91 63058 75376)
            </a>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 space-y-3 shadow-sm transition-colors">
            <h3 className="text-xs font-black text-stone-900 dark:text-white uppercase tracking-wider">
              Technical Specifications &amp; Verification
            </h3>
            <div className="divide-y divide-stone-100 dark:divide-[#2a2621] text-xs">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="py-2.5 flex justify-between gap-4">
                  <span className="text-stone-500">{key}</span>
                  <span className="text-stone-900 dark:text-stone-200 font-bold text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Ratings Break-down Section */}
      <section className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 dark:border-[#2a2621] pb-6">
          <div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white">
              Customer Reviews &amp; Ratings
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Verified feedback from Hyderabad buyers and photographers across India.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-black text-stone-900 dark:text-white">{product.rating}</div>
            <div>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-[11px] text-stone-500">Based on {product.reviewCount} ratings</span>
            </div>
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#201d19] border border-stone-200/80 dark:border-[#2e2a25] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#F5821F] text-black font-black flex items-center justify-center text-xs">
                  AK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white">Arun Kumar</h4>
                  <span className="text-[10px] text-stone-500">Hyderabad (Verified Buyer)</span>
                </div>
              </div>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed italic">
              &ldquo;Tested the camera in-person at the Bahadurpura store. Sensor is spotless, shutter count matches the description, and got genuine invoice with warranty.&rdquo;
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#201d19] border border-stone-200/80 dark:border-[#2e2a25] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-stone-300 dark:bg-stone-700 text-stone-900 dark:text-white font-black flex items-center justify-center text-xs">
                  MS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white">Mohd Salman</h4>
                  <span className="text-[10px] text-stone-500">Bangalore (Shipped Order)</span>
                </div>
              </div>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed italic">
              &ldquo;Delivery was fast and packed in shock-proof bubble wrapping. Product looks practically brand new. Excellent service from Mi King&apos;s team!&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Native App-Style Mobile Bottom Purchase Dock */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 dark:bg-[#110f0d]/95 backdrop-blur-xl border-t border-stone-200 dark:border-[#2e2a25] px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Store Price</span>
          <span className="text-lg font-black text-[#F5821F] leading-tight">
            {formatINR(product.salePrice)}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-[240px] justify-end">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              wishlisted
                ? 'bg-rose-600 border-rose-500 text-white'
                : 'bg-stone-100 dark:bg-[#1c1916] border-stone-200 dark:border-[#2e2a25] text-stone-600 dark:text-stone-400'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
          </button>
          {product.inStock ? (
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              className="flex-1 bg-[#F5821F] text-black font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-md shadow-[#F5821F]/25 cursor-pointer active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
              <span>Add to Cart</span>
            </button>
          ) : (
            <a
              href={`https://wa.me/916305875376?text=${encodeURIComponent(
                `Hi Mi King's Cameras, I want to reserve: ${product.name} (SKU: ${product.id}).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-emerald-600 text-white font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-md shadow-emerald-600/25 text-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pre-Order</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
