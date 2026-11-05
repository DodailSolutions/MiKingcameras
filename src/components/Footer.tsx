'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  BookOpen,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  YouTubeIcon,
  InstagramIcon,
  FacebookIcon,
  WhatsAppIcon,
} from '@/components/icons/SocialIcons';
import { OFFICIAL_LOGO_BASE64 } from '@/data/logo';

export function Footer() {
  return (
    <footer className="bg-stone-900 dark:bg-[#0a0908] border-t border-stone-800 dark:border-[#24211d] text-stone-300 dark:text-stone-400 text-xs mt-12 sm:mt-20 pb-20 md:pb-0 transition-colors">
      {/* DESKTOP FOOTER (Visible on md and up) */}
      <div className="hidden md:grid max-w-7xl mx-auto px-4 py-10 sm:py-14 grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Col 1: Brand & Description & Socials */}
        <div className="space-y-4 col-span-2 lg:col-span-2">
          <Link href="/" className="inline-flex items-center group p-2 px-3 rounded-2xl bg-white border border-stone-200/90 shadow-sm w-fit">
            <img
              src={OFFICIAL_LOGO_BASE64}
              alt="MI King's Cameras"
              className="h-9 sm:h-10 w-auto object-contain group-hover:opacity-95 transition-opacity"
            />
          </Link>

          <p className="text-stone-300 dark:text-stone-400 text-xs leading-relaxed max-w-sm">
            Hyderabad&apos;s most trusted destination for new &amp; certified pre-owned cameras, cinema lenses, DJI drones, and studio equipment. Every item inspected with our 25-point testing protocol and backed by 1-year store warranty.
          </p>

          {/* Social Media Channels */}
          <div className="pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2.5">
              Connect With Us
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://www.youtube.com/@mikingscameras"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Channel"
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-[#FF0000] text-stone-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
              >
                <YouTubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/mik_cameras_hyd/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-[#E1306C] text-stone-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/mikingscameras"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Page"
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-[#1877F2] text-stone-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919032285420"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Store Concierge"
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-[#25D366] text-stone-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Col 2: Shop Equipment */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Shop Equipment</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/catalog?cat=cameras" className="hover:text-[#F5821F] transition-colors">Cameras (DSLR &amp; Mirrorless)</Link></li>
            <li><Link href="/catalog?cat=lenses" className="hover:text-[#F5821F] transition-colors">Prime &amp; Zoom Lenses</Link></li>
            <li><Link href="/catalog?cat=drones" className="hover:text-[#F5821F] transition-colors">DJI Drones &amp; Fly More</Link></li>
            <li><Link href="/catalog?cat=gimbals" className="hover:text-[#F5821F] transition-colors">Gimbals &amp; Stabilizers</Link></li>
            <li><Link href="/catalog?cat=lighting" className="hover:text-[#F5821F] transition-colors">Studio Lights &amp; Softboxes</Link></li>
            <li><Link href="/catalog?cat=tripods" className="hover:text-[#F5821F] transition-colors">Tripods &amp; Monopods</Link></li>
            <li><Link href="/catalog?deals=true" className="text-[#F5821F] font-bold hover:underline">Special Offers &amp; Deals</Link></li>
          </ul>
        </div>

        {/* Col 3: Company & Guides */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Company &amp; Guides</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/about" className="hover:text-[#F5821F] font-bold text-white transition-colors flex items-center gap-1.5">
                <span>About Us (Our Story)</span>
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-[#F5821F] transition-colors flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#F5821F]" />
                <span>Photography Blog &amp; Guides</span>
              </Link>
            </li>
            <li><Link href="/contact" className="hover:text-[#F5821F] transition-colors">Visit Hyderabad Store</Link></li>
            <li><Link href="/warranty" className="hover:text-[#F5821F] transition-colors">1-Year Store Warranty</Link></li>
            <li><Link href="/catalog" className="hover:text-[#F5821F] transition-colors">Sell &amp; Exchange Your Gear</Link></li>
            <li><Link href="/admin" className="text-stone-500 hover:text-stone-300 transition-colors">Staff Admin Console</Link></li>
          </ul>
        </div>

        {/* Col 4: Support & Policies */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Customer Support</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/track" className="hover:text-[#F5821F] transition-colors">Track Your Order</Link></li>
            <li><Link href="/returns" className="hover:text-[#F5821F] transition-colors">Return &amp; Refund Policy</Link></li>
            <li><Link href="/shipping" className="hover:text-[#F5821F] transition-colors">Shipping &amp; Delivery Terms</Link></li>
            <li><Link href="/terms" className="hover:text-[#F5821F] transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-[#F5821F] transition-colors">Privacy &amp; Data Security</Link></li>
            <li><Link href="/contact" className="hover:text-[#F5821F] transition-colors">Customer Help Desk</Link></li>
          </ul>
        </div>
      </div>

      {/* MOBILE APP-STYLE COMPACT FOOTER (Visible only on mobile screens < md) */}
      <div className="md:hidden px-4 py-8 space-y-5 text-center">
        {/* Brand Badge */}
        <div className="flex justify-center">
          <Link href="/" className="inline-flex items-center p-2 px-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-sm">
            <img
              src={OFFICIAL_LOGO_BASE64}
              alt="MI King's Cameras"
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        <p className="text-stone-300 text-[11px] leading-relaxed max-w-xs mx-auto">
          Hyderabad&apos;s destination for certified pre-owned &amp; new camera gear. Tested with 25-point inspection protocol.
        </p>

        {/* Mobile Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 max-w-xs mx-auto">
          <a
            href="tel:+919032285420"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-800 text-stone-200 text-xs font-bold hover:bg-stone-700 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#F5821F]" />
            <span>Call Store</span>
          </a>
          <a
            href="https://wa.me/919032285420"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 text-xs font-bold hover:bg-emerald-600/30 transition-colors"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Compact App Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-2 text-[11px] pt-1">
          <Link href="/about" className="px-3 py-1 rounded-full bg-stone-800/80 text-stone-300 hover:text-white">About</Link>
          <Link href="/blog" className="px-3 py-1 rounded-full bg-stone-800/80 text-stone-300 hover:text-white">Blog</Link>
          <Link href="/warranty" className="px-3 py-1 rounded-full bg-stone-800/80 text-stone-300 hover:text-white">Warranty</Link>
          <Link href="/track" className="px-3 py-1 rounded-full bg-stone-800/80 text-stone-300 hover:text-white">Track Order</Link>
          <Link href="/admin" className="px-3 py-1 rounded-full bg-stone-800/80 text-stone-400 hover:text-[#F5821F]">Staff Admin</Link>
        </div>

        {/* Social Icons Row */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <a
            href="https://www.youtube.com/@mikingscameras"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="w-8 h-8 rounded-lg bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center"
          >
            <YouTubeIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/mik_cameras_hyd/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-8 h-8 rounded-lg bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
          <a
            href="https://facebook.com/mikingscameras"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-8 h-8 rounded-lg bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center"
          >
            <FacebookIcon className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/919032285420"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="w-8 h-8 rounded-lg bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center"
          >
            <WhatsAppIcon className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Agency Credit */}
        <div className="pt-3 border-t border-stone-800/80 text-[11px] text-stone-400">
          <p>
            Designed &amp; Developed by{' '}
            <a
              href="https://dodail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F5821F] font-bold hover:underline"
            >
              Dodail Solutions
            </a>
          </p>
          <p className="text-[10px] text-stone-500 mt-1">
            © 2026 Mi King&apos;s DSLR Camera Shop • Hyderabad
          </p>
        </div>
      </div>

      {/* Store Location & Direct Help Strip (Desktop only) */}
      <div className="hidden md:block border-t border-stone-800 dark:border-[#24211d] py-6 bg-stone-950/60">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#F5821F] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Hyderabad Flagship Store</p>
              <p className="text-stone-400 text-[11px] leading-tight mt-0.5">
                Pillar 103, Bank Colony, Near Tadbun, Mir Alam Tank, Hyderabad, Telangana 500064
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-[#F5821F] shrink-0" />
            <div>
              <p className="font-bold text-white">Call / WhatsApp Hotlines</p>
              <p className="text-stone-400 text-[11px] leading-tight mt-0.5">
                <a href="tel:+919032285420" className="hover:text-white font-medium">+91 90322 85420</a> / <a href="tel:+916305875376" className="hover:text-white font-medium">+91 63058 75376</a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-[#F5821F] shrink-0" />
            <div>
              <p className="font-bold text-white">Official Support Email</p>
              <p className="text-stone-400 text-[11px] leading-tight mt-0.5">
                <a href="mailto:mikingsdslrshop@gmail.com" className="hover:text-white font-medium">mikingsdslrshop@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Credit Bar (Desktop) */}
      <div className="hidden md:block border-t border-stone-800 dark:border-[#24211d] py-4 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-stone-400">
          <div>
            <span>© 2026 Mi King&apos;s DSLR Camera Shop. All Rights Reserved. Reg. Mir Alam Tank, Hyderabad.</span>
            <span className="mx-2 text-stone-600">|</span>
            <span>
              Designed &amp; Developed by{' '}
              <a
                href="https://dodail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5821F] font-bold hover:underline inline-flex items-center gap-1 transition-colors"
              >
                Dodail Solutions
                <ExternalLink className="w-3 h-3 text-[#F5821F]/80" />
              </a>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/returns" className="hover:text-white transition-colors">Return Policy</Link>
            <Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link>
            <Link href="/warranty" className="hover:text-white transition-colors">Warranty Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
