'use client';

import React, { useState, useEffect } from 'react';
import {
  Palette,
  Save,
  RotateCcw,
  Layout,
  Type,
  Eye,
  CheckCircle2,
  Sliders,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Truck,
  MessageSquare,
  ShieldCheck,
  Camera,
  Layers,
} from 'lucide-react';

interface ThemeConfig {
  // 1. Branding & Logo
  brandName: string;
  brandTag: string;
  tagline: string;
  accentColor: string;

  // 2. Header
  announcementText: string;
  phone: string;
  email: string;
  location: string;
  showAnnouncement: boolean;

  // 3. Main Sections Visibility & Titles
  showValueStrip: boolean;
  showPromoBanners: boolean;
  showBrandLogos: boolean;
  showBodiesSection: boolean;
  showLensesSection: boolean;
  heroHeadline: string;
  heroHighlight: string;
  heroDescription: string;

  // 4. Footer & WhatsApp Hotlines
  footerAbout: string;
  whatsappNumber: string;
  whatsappIdrees: string;
  whatsappShoeb: string;
  whatsappZameer: string;
  whatsappSupport: string;
  copyrightText: string;
}

const DEFAULT_THEME: ThemeConfig = {
  brandName: "MI King's",
  brandTag: "Camera's",
  tagline: 'Hyderabad Premium DSLR, Mirrorless & Drone Equipment Hub',
  accentColor: '#F5821F',

  announcementText: 'Free Shipping on Orders Above ₹5,000',
  phone: '+91 90322 85420',
  email: 'mikingsdslrshop@gmail.com',
  location: 'Hyderabad, India',
  showAnnouncement: true,

  showValueStrip: true,
  showPromoBanners: true,
  showBrandLogos: true,
  showBodiesSection: true,
  showLensesSection: true,
  heroHeadline: 'Upgrade Your',
  heroHighlight: 'Photography Gear',
  heroDescription:
    'New and certified pre-owned Canon, Nikon and Sony cameras, tested in our Hyderabad store and backed by up to 2 years of warranty.',

  footerAbout:
    'Your trusted destination for cameras, lenses, drones, and professional photography gear in Hyderabad and across India.',
  whatsappNumber: '+91 90322 85420',
  whatsappIdrees: '+91 63058 75376',
  whatsappShoeb: '+91 90322 85420',
  whatsappZameer: '+91 90322 85420',
  whatsappSupport: '+91 63058 75376',
  copyrightText: "© 2026 Mi King's Cameras. All Rights Reserved.",
};

const ACCENT_PRESETS = [
  { name: 'MI Signature Orange', value: '#F5821F' },
  { name: 'Crimson Red', value: '#E53E3E' },
  { name: 'Cinema Gold', value: '#D97706' },
  { name: 'Sony Electric Blue', value: '#2563EB' },
  { name: 'Fuji Emerald', value: '#059669' },
];

export default function ThemeCustomizerPage() {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [activeTab, setActiveTab] = useState<'branding' | 'whatsapp' | 'header' | 'sections' | 'footer'>('branding');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mik_theme_config');
    if (saved) {
      try {
        setTheme({ ...DEFAULT_THEME, ...JSON.parse(saved) });
      } catch (e) {
        console.error('Error loading saved theme:', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('mik_theme_config', JSON.stringify(theme));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('mik_whatsapp_updated'));
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to restore the default theme settings?')) {
      setTheme(DEFAULT_THEME);
      localStorage.removeItem('mik_theme_config');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F5821F]/10 text-[#F5821F]">
              <Palette className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white">
              Theme &amp; Layout Customizer
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Customize header, branding logo, homepage sections, and footer settings with instant live preview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-[#F5821F]/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Theme modifications successfully saved and synchronized!
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-[#24211d] pb-2 overflow-x-auto">
        {[
          { id: 'branding', label: 'Branding & Logo', icon: Type },
          { id: 'whatsapp', label: 'WhatsApp Numbers', icon: MessageSquare },
          { id: 'header', label: 'Header & Contact', icon: Layout },
          { id: 'sections', label: 'Main Sections & Hero', icon: Layers },
          { id: 'footer', label: 'Footer & Store Info', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#1a1815]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Settings & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Form Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* TAB 1: BRANDING & LOGO */}
          {activeTab === 'branding' && (
            <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">Store Logo &amp; Identity</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                    Store Main Name
                  </label>
                  <input
                    type="text"
                    value={theme.brandName}
                    onChange={(e) => setTheme({ ...theme, brandName: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#1b1916] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                    Badge / Tag Label
                  </label>
                  <input
                    type="text"
                    value={theme.brandTag}
                    onChange={(e) => setTheme({ ...theme, brandTag: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#1b1916] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={theme.tagline}
                  onChange={(e) => setTheme({ ...theme, tagline: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#1b1916] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-2">
                  Accent Color Preset
                </label>
                <div className="flex flex-wrap gap-2">
                  {ACCENT_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setTheme({ ...theme, accentColor: p.value })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        theme.accentColor === p.value
                          ? 'border-[#F5821F] bg-[#F5821F]/10 text-stone-900 dark:text-white'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.value }} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: WHATSAPP CHAT NUMBERS */}
          {activeTab === 'whatsapp' && (
            <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-5 space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366]">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    WhatsApp Chat Numbers &amp; Multi-Agent Routing
                  </h3>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Configure direct WhatsApp mobile numbers for customers chatting with store specialists. Changes update the live storefront button and multi-agent drawer immediately.
                </p>
              </div>

              {/* Master Hotline */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#1b1916] border border-stone-200 dark:border-stone-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-white block">
                      Main Showroom Hotline
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Primary store contact shown on header bar, footer, and default fallback
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/${(theme.whatsappNumber || '').replace(/\D/g, '')}?text=Test%20from%20Mi%20Kings%20Admin`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#25D366] hover:underline flex items-center gap-1"
                  >
                    Test WhatsApp &rarr;
                  </a>
                </div>
                <input
                  type="text"
                  value={theme.whatsappNumber}
                  onChange={(e) => setTheme({ ...theme, whatsappNumber: e.target.value })}
                  placeholder="+91 90322 85420"
                  className="w-full bg-white dark:bg-[#141210] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#25D366]"
                />
              </div>

              {/* Department Specialists */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-900 dark:text-white block">
                  Department Specialist Direct WhatsApp Numbers
                </span>

                {/* Agent 1: Mohd Idrees */}
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1b1916] border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-900 dark:text-white block">
                        Mohd Idrees (Founder &amp; Camera Specialist)
                      </span>
                      <span className="text-[10px] text-stone-500">
                        DSLR &amp; Mirrorless Bodies • Pro Kits • Equipment Trade-ins
                      </span>
                    </div>
                    <a
                      href={`https://wa.me/${(theme.whatsappIdrees || theme.phone || '').replace(/\D/g, '')}?text=Test%20Mohd%20Idrees%20WhatsApp`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-[#25D366] hover:underline"
                    >
                      Test Link
                    </a>
                  </div>
                  <input
                    type="text"
                    value={theme.whatsappIdrees}
                    onChange={(e) => setTheme({ ...theme, whatsappIdrees: e.target.value })}
                    placeholder="+91 63058 75376"
                    className="w-full bg-white dark:bg-[#141210] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#25D366]"
                  />
                </div>

                {/* Agent 2: Mohd Shoeb */}
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1b1916] border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-900 dark:text-white block">
                        Mohd Shoeb (Master Optics &amp; Lens Technician)
                      </span>
                      <span className="text-[10px] text-stone-500">
                        Prime &amp; Telephoto Lenses • Mount Compatibility • Optical Testing
                      </span>
                    </div>
                    <a
                      href={`https://wa.me/${(theme.whatsappShoeb || '').replace(/\D/g, '')}?text=Test%20Mohd%20Shoeb%20WhatsApp`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-[#25D366] hover:underline"
                    >
                      Test Link
                    </a>
                  </div>
                  <input
                    type="text"
                    value={theme.whatsappShoeb}
                    onChange={(e) => setTheme({ ...theme, whatsappShoeb: e.target.value })}
                    placeholder="+91 90322 85420"
                    className="w-full bg-white dark:bg-[#141210] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#25D366]"
                  />
                </div>

                {/* Agent 3: Mohd Zameer */}
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1b1916] border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-900 dark:text-white block">
                        Mohd Zameer (Commercial Video, Drones &amp; Gimbals)
                      </span>
                      <span className="text-[10px] text-stone-500">
                        DJI Drones • Ronin Stabilizers • Wireless Mics • Studio Lighting
                      </span>
                    </div>
                    <a
                      href={`https://wa.me/${(theme.whatsappZameer || '').replace(/\D/g, '')}?text=Test%20Mohd%20Zameer%20WhatsApp`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-[#25D366] hover:underline"
                    >
                      Test Link
                    </a>
                  </div>
                  <input
                    type="text"
                    value={theme.whatsappZameer}
                    onChange={(e) => setTheme({ ...theme, whatsappZameer: e.target.value })}
                    placeholder="+91 90322 85420"
                    className="w-full bg-white dark:bg-[#141210] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#25D366]"
                  />
                </div>

                {/* Agent 4: Orders & GST Support */}
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1b1916] border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-900 dark:text-white block">
                        Orders &amp; GST Invoicing Desk
                      </span>
                      <span className="text-[10px] text-stone-500">
                        Live AWB Tracking • 18% GST Tax Invoices • 1-Year Warranty Claims
                      </span>
                    </div>
                    <a
                      href={`https://wa.me/${(theme.whatsappSupport || '').replace(/\D/g, '')}?text=Test%20Orders%20Desk%20WhatsApp`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-[#25D366] hover:underline"
                    >
                      Test Link
                    </a>
                  </div>
                  <input
                    type="text"
                    value={theme.whatsappSupport}
                    onChange={(e) => setTheme({ ...theme, whatsappSupport: e.target.value })}
                    placeholder="+91 63058 75376"
                    className="w-full bg-white dark:bg-[#141210] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#25D366]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HEADER */}
          {activeTab === 'header' && (
            <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-[#24211d]">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">Top Utility Bar &amp; Contact</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={theme.showAnnouncement}
                    onChange={(e) => setTheme({ ...theme, showAnnouncement: e.target.checked })}
                    className="rounded text-[#F5821F] focus:ring-0"
                  />
                  <span className="text-xs font-medium text-stone-700 dark:text-stone-300">Enable Bar</span>
                </label>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                  Announcement / Shipping Promotion Text
                </label>
                <input
                  type="text"
                  value={theme.announcementText}
                  onChange={(e) => setTheme({ ...theme, announcementText: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#1b1916] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                    Store Phone Number
                  </label>
                  <input
                    type="text"
                    value={theme.phone}
                    onChange={(e) => setTheme({ ...theme, phone: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#1b1916] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                    Support Email
                  </label>
                  <input
                    type="text"
                    value={theme.email}
                    onChange={(e) => setTheme({ ...theme, email: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#1b1916] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                  Location Badge
                </label>
                <input
                  type="text"
                  value={theme.location}
                  onChange={(e) => setTheme({ ...theme, location: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#1b1916] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SECTIONS & HERO */}
          {activeTab === 'sections' && (
            <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">Hero Carousel &amp; Section Toggles</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={theme.heroHeadline}
                    onChange={(e) => setTheme({ ...theme, heroHeadline: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#1b1916] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                    Hero Highlight Text
                  </label>
                  <input
                    type="text"
                    value={theme.heroHighlight}
                    onChange={(e) => setTheme({ ...theme, heroHighlight: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#1b1916] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={theme.heroDescription}
                    onChange={(e) => setTheme({ ...theme, heroDescription: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#1b1916] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-[#24211d] space-y-2.5">
                <span className="text-xs font-bold text-stone-900 dark:text-white block">
                  Homepage Section Visibility
                </span>
                {[
                  { key: 'showValueStrip', label: 'Value Propositions Strip (Fast Shipping, Genuine...)' },
                  { key: 'showPromoBanners', label: '3 Featured Category Banners (Cameras, Lenses, Drones)' },
                  { key: 'showBrandLogos', label: 'Official Brand Logos (Canon, Sony, Nikon, DJI, etc.)' },
                  { key: 'showBodiesSection', label: 'Dedicated Camera Bodies & Kits Section' },
                  { key: 'showLensesSection', label: 'Dedicated Premium Lenses & Optics Section' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-[#1b1916] border border-stone-200 dark:border-stone-800 text-xs cursor-pointer">
                    <span className="font-medium text-stone-700 dark:text-stone-300">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={(theme as any)[item.key]}
                      onChange={(e) => setTheme({ ...theme, [item.key]: e.target.checked })}
                      className="rounded text-[#F5821F] focus:ring-0"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FOOTER */}
          {activeTab === 'footer' && (
            <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">Footer &amp; Support Contact</h3>

              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                  Footer About Store Summary
                </label>
                <textarea
                  rows={3}
                  value={theme.footerAbout}
                  onChange={(e) => setTheme({ ...theme, footerAbout: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#1b1916] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                    WhatsApp Support Number
                  </label>
                  <input
                    type="text"
                    value={theme.whatsappNumber}
                    onChange={(e) => setTheme({ ...theme, whatsappNumber: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#1b1916] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                    Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={theme.copyrightText}
                    onChange={(e) => setTheme({ ...theme, copyrightText: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#1b1916] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Interactive Live Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-400">
            <Eye className="w-4 h-4 text-[#F5821F]" />
            <span>Real-time Live Preview</span>
          </div>

          {/* Header Preview */}
          <div className="rounded-2xl border border-stone-200 dark:border-[#24211d] bg-white dark:bg-[#110f0d] p-4 space-y-3 shadow-md overflow-hidden">
            <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider">Header Component</span>
            {theme.showAnnouncement && (
              <div className="p-2 rounded-lg bg-stone-100 dark:bg-[#0c0b09] text-[10px] text-stone-500 dark:text-stone-400 flex items-center justify-between border-b border-stone-200 dark:border-[#24211d]">
                <span className="flex items-center gap-1 font-bold text-[#F5821F]">
                  <Truck className="w-3 h-3" />
                  {theme.announcementText}
                </span>
                <span className="text-stone-400">{theme.location}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-black text-xs shadow"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  MI
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-stone-900 dark:text-white leading-tight">
                    {theme.brandName}
                  </span>
                  <span
                    className="text-[8px] font-black uppercase tracking-wider px-1 rounded w-fit text-black"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    {theme.brandTag}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-stone-500">
                <span>{theme.phone}</span>
              </div>
            </div>
          </div>

          {/* Hero Banner Preview */}
          <div className="rounded-2xl border border-stone-200 dark:border-[#24211d] bg-[#110f0d] p-4 space-y-2 shadow-md text-white">
            <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider">Hero Section</span>
            <div className="space-y-1">
              <h4 className="text-base font-black leading-tight">
                {theme.heroHeadline}{' '}
                <span style={{ color: theme.accentColor }}>{theme.heroHighlight}</span>
              </h4>
              <p className="text-[11px] text-stone-400 line-clamp-2">{theme.heroDescription}</p>
            </div>
            <button
              type="button"
              className="mt-2 px-3 py-1.5 rounded-lg text-black font-extrabold text-[11px] shadow"
              style={{ backgroundColor: theme.accentColor }}
            >
              Shop Cameras &rarr;
            </button>
          </div>

          {/* Footer Preview */}
          <div className="rounded-2xl border border-stone-200 dark:border-[#24211d] bg-[#0a0908] p-4 space-y-2 text-stone-400 text-[10px]">
            <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider">Footer Component</span>
            <p className="text-stone-300 leading-relaxed">{theme.footerAbout}</p>
            <div className="pt-2 border-t border-[#24211d] flex items-center justify-between">
              <span>{theme.copyrightText}</span>
              <span className="text-emerald-400 font-bold">{theme.whatsappNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
