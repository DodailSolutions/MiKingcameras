'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  MessageCircle,
  ShieldCheck,
  MapPin,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { BlogPost, INITIAL_BLOG_POSTS } from '@/data/blog';

const BLOG_STORAGE_KEY = 'mikings_cms_blog_posts';

export default function SingleBlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      let posts = INITIAL_BLOG_POSTS;
      const stored = localStorage.getItem(BLOG_STORAGE_KEY);
      if (stored) {
        posts = JSON.parse(stored);
      }
      const matched = posts.find((p) => p.slug === slug);
      if (matched) {
        setPost(matched);
      } else {
        // Fallback to first post if slug not matched directly
        setPost(posts[0]);
      }
    } catch (e) {
      console.error(e);
      setPost(INITIAL_BLOG_POSTS[0]);
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-stone-50 dark:bg-[#0c0b09] text-stone-900 dark:text-white">
        <p className="text-sm font-bold">Loading article...</p>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <article className="min-h-screen bg-stone-50 dark:bg-[#0c0b09] text-stone-900 dark:text-stone-100 transition-colors py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <Link href="/" className="hover:text-[#F5821F] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-[#F5821F] transition-colors">Blog</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-bold text-stone-900 dark:text-white truncate max-w-xs">{post.category}</span>
          </nav>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-[#F5821F] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Articles</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#F5821F] text-black">
              {post.category}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#F5821F]" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 dark:text-white leading-tight tracking-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
            {post.excerpt}
          </p>

          {/* Author & Share Bar */}
          <div className="py-4 border-y border-stone-200 dark:border-[#24211d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5821F] text-black font-black flex items-center justify-center text-sm shadow-md">
                MI
              </div>
              <div>
                <p className="text-xs font-black text-stone-900 dark:text-white flex items-center gap-1.5">
                  <span>{post.author}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline" />
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {post.authorRole} &bull; Published {post.publishedAt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#2a2621] hover:bg-stone-100 dark:hover:bg-[#1a1815] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#F5821F]" />
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>

              <a
                href={`https://wa.me/919032285420?text=Hello%20Mi%20Kings%20Cameras%2C%20I%20have%20a%20question%20regarding%20the%20article%3A%20${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-black text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>
        </header>

        {/* Hero Cover Image */}
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200 dark:border-[#24211d] shadow-lg max-h-[460px] bg-stone-100 dark:bg-stone-900">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="prose prose-stone dark:prose-invert max-w-none text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed space-y-4">
            {post.content.split('\n\n').map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (trimmed.startsWith('# ')) {
                return (
                  <h2 key={idx} className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white pt-4 pb-1 border-b border-stone-200 dark:border-[#24211d]">
                    {trimmed.replace('# ', '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={idx} className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white pt-3 pb-1">
                    {trimmed.replace('## ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={idx} className="text-base sm:text-lg font-bold text-[#F5821F] pt-2">
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

          {/* Tags */}
          <div className="pt-8 mt-8 border-t border-stone-200 dark:border-[#24211d] flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-stone-400">Related Tags:</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Store Trust & Visit Box */}
        <div className="rounded-2xl bg-stone-100 dark:bg-[#181613] border border-stone-200 dark:border-[#24211d] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-3 rounded-xl bg-[#F5821F]/15 text-[#F5821F] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-stone-900 dark:text-white">
                Tested &amp; Certified at Pillar 103, Hyderabad
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                All pre-owned cameras mentioned in our guides include a 1-year store warranty and 25-point inspection.
              </p>
            </div>
          </div>

          <Link
            href="/catalog"
            className="px-5 py-2.5 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black text-xs font-black whitespace-nowrap transition-all shadow-md shadow-[#F5821F]/20 shrink-0"
          >
            Explore Catalog Gear
          </Link>
        </div>
      </div>
    </article>
  );
}
