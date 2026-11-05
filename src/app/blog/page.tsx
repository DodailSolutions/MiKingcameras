'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  Sparkles,
  Camera,
  Layers,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { BlogPost, INITIAL_BLOG_POSTS } from '@/data/blog';

const BLOG_STORAGE_KEY = 'mikings_cms_blog_posts';

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(BLOG_STORAGE_KEY);
      if (stored) {
        setPosts(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const categories = ['All', 'Buying Guide', 'Gear Review', 'Photography Tips', 'Cinema & Video', 'Hyderabad Stories'];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch && post.isPublished;
  });

  const featuredPost = posts.find((p) => p.featured && p.isPublished) || posts[0];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0c0b09] text-stone-900 dark:text-stone-100 transition-colors py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <Link href="/" className="hover:text-[#F5821F] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-stone-900 dark:text-white">Photography Journal &amp; Guides</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5821F]/15 text-[#F5821F] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mi King&apos;s Camera Chronicles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
            Photography Guides &amp; Tech Insights
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            Direct advice from Hyderabad’s trusted camera specialists. Learn how to inspect pre-owned bodies, pick the perfect wedding lenses, and dial in cinema rigs.
          </p>
        </div>

        {/* Featured Story Banner */}
        {featuredPost && (
          <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] shadow-xl group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:hidden" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black bg-[#F5821F] text-black shadow-md">
                  Featured Story
                </span>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-bold text-[#F5821F] uppercase">{featuredPost.category}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`}>
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white group-hover:text-[#F5821F] transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200 dark:border-[#24211d] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#F5821F]/20 text-[#F5821F] font-black flex items-center justify-center text-xs">
                      MI
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-stone-900 dark:text-white">{featuredPost.author}</p>
                      <p className="text-[10px] text-stone-500">{featuredPost.authorRole}</p>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-black bg-[#F5821F] hover:bg-[#E0741A] px-4 py-2 rounded-xl transition-all shadow-md shadow-[#F5821F]/20"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls & Search */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full md:w-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#F5821F] text-black shadow-md shadow-[#F5821F]/20'
                      : 'bg-white dark:bg-[#181613] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-[#2a2621] hover:border-[#F5821F]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search guides, cameras, lenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-xl pl-9 pr-4 py-2 text-xs text-stone-900 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:border-[#F5821F]"
              />
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#F5821F]/50 transition-all duration-300 shadow-sm group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-black/75 backdrop-blur-md text-white border border-white/20">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#F5821F]" />
                      {post.publishedAt}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#F5821F]" />
                      {post.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-black text-stone-900 dark:text-white text-base group-hover:text-[#F5821F] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-stone-100 dark:border-[#201d19] bg-stone-50/50 dark:bg-[#181613] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <User className="w-3.5 h-3.5 text-[#F5821F]" />
                  <span className="font-semibold">{post.author}</span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-bold text-[#F5821F] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Free Consultation CTA */}
        <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-black to-stone-900 border border-stone-800 p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              Need personalized gear recommendations?
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
              Talk directly with Mohd Idrees or visit our store at Pillar 103, Mir Alam Tank, Hyderabad for hands-on lens testing and live camera autofocus trials.
            </p>
          </div>

          <a
            href="https://wa.me/919032285420?text=Hi%20Mi%20Kings%20Cameras%2C%20I%20read%20your%20blog%20and%20need%20camera%20advice"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat with Camera Tech on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
