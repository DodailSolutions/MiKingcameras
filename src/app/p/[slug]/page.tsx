'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, ArrowLeft, Calendar, FileText, ShieldCheck } from 'lucide-react';
import { CustomPage, INITIAL_CUSTOM_PAGES } from '@/data/pages';

const PAGES_STORAGE_KEY = 'mikings_cms_custom_pages';

export default function DynamicCustomPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [page, setPage] = useState<CustomPage | null>(null);

  useEffect(() => {
    try {
      let pages = INITIAL_CUSTOM_PAGES;
      const stored = localStorage.getItem(PAGES_STORAGE_KEY);
      if (stored) {
        pages = JSON.parse(stored);
      }
      const matched = pages.find((p) => p.slug === slug);
      if (matched) {
        setPage(matched);
      } else {
        setPage(pages[0]);
      }
    } catch (e) {
      console.error(e);
      setPage(INITIAL_CUSTOM_PAGES[0]);
    }
  }, [slug]);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-stone-50 dark:bg-[#0c0b09] text-stone-900 dark:text-white">
        <p className="text-sm font-bold">Loading page content...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0c0b09] text-stone-900 dark:text-stone-100 transition-colors py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <Link href="/" className="hover:text-[#F5821F] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-bold text-stone-900 dark:text-white">{page.title}</span>
          </nav>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-[#F5821F] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </Link>
        </div>

        {/* Page Header */}
        <header className="space-y-3 bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5821F]/15 text-[#F5821F] text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>{page.category} Page</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            {page.title}
          </h1>

          {page.metaDescription && (
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {page.metaDescription}
            </p>
          )}

          <div className="pt-2 flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <Calendar className="w-3.5 h-3.5 text-[#F5821F]" />
            <span>Last Updated: {page.lastUpdated}</span>
          </div>
        </header>

        {/* Page Content Body */}
        <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm leading-relaxed text-sm sm:text-base space-y-4 text-stone-800 dark:text-stone-200">
          {page.content.split('\n\n').map((paragraph, idx) => {
            const trimmed = paragraph.trim();
            if (trimmed.startsWith('# ')) {
              return (
                <h2 key={idx} className="text-xl font-black text-stone-900 dark:text-white pt-2 pb-1 border-b border-stone-200 dark:border-[#24211d]">
                  {trimmed.replace('# ', '')}
                </h2>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h3 key={idx} className="text-lg font-bold text-stone-900 dark:text-white pt-3 pb-1">
                  {trimmed.replace('## ', '')}
                </h3>
              );
            }
            if (trimmed.startsWith('### ')) {
              return (
                <h4 key={idx} className="text-base font-bold text-[#F5821F] pt-2">
                  {trimmed.replace('### ', '')}
                </h4>
              );
            }
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              const listItems = trimmed.split('\n').map((item) => item.replace(/^[-*]\s+/, ''));
              return (
                <ul key={idx} className="list-disc pl-5 space-y-1.5 text-stone-700 dark:text-stone-300">
                  {listItems.map((li, lIdx) => (
                    <li key={lIdx}>{li}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} className="text-stone-700 dark:text-stone-300 leading-relaxed">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Footer Support Tagline */}
        <div className="text-center text-xs text-stone-500 py-4">
          <p>For questions or custom billing policies, reach out to <a href="mailto:mikingsdslrshop@gmail.com" className="text-[#F5821F] hover:underline">mikingsdslrshop@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
}
