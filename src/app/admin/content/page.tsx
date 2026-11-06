'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BookOpen,
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Calendar,
  User,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Image as ImageIcon,
  Save,
  X,
  Globe,
  EyeOff,
  Star,
  SearchX,
} from 'lucide-react';
import { BlogPost, INITIAL_BLOG_POSTS } from '@/data/blog';
import { CustomPage, INITIAL_CUSTOM_PAGES } from '@/data/pages';

const BLOG_STORAGE_KEY = 'mikings_cms_blog_posts';
const PAGES_STORAGE_KEY = 'mikings_cms_custom_pages';

const SAMPLE_COVERS = [
  { label: 'Wedding Camera', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cinema Rig', url: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Studio Lighting', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Vintage DSLR', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Drone Flight', url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80' },
];

type StatusFilter = 'all' | 'published' | 'draft';

function ContentWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab: 'blogs' | 'pages' = searchParams.get('tab') === 'pages' ? 'pages' : 'blogs';
  const setActiveTab = (tab: 'blogs' | 'pages') =>
    router.replace(tab === 'pages' ? '/admin/content?tab=pages' : '/admin/content', { scroll: false });
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [customPages, setCustomPages] = useState<CustomPage[]>(INITIAL_CUSTOM_PAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Blog Editor State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    category: 'Buying Guide' as BlogPost['category'],
    excerpt: '',
    content: '',
    author: 'Mohd Idrees',
    authorRole: 'Founder & Senior Camera Specialist',
    coverImage: SAMPLE_COVERS[0].url,
    readTime: '5 min read',
    tags: 'Cameras, Hyderabad, Gear Guide',
    isPublished: true,
  });

  // Page Editor State
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    category: 'Policy' as CustomPage['category'],
    metaDescription: '',
    content: '',
    navSection: 'footer' as CustomPage['navSection'],
    isPublished: true,
  });

  // Load from local storage
  useEffect(() => {
    try {
      const storedBlogs = localStorage.getItem(BLOG_STORAGE_KEY);
      if (storedBlogs) {
        setBlogPosts(JSON.parse(storedBlogs));
      }
      const storedPages = localStorage.getItem(PAGES_STORAGE_KEY);
      if (storedPages) {
        setCustomPages(JSON.parse(storedPages));
      }
    } catch (e) {
      console.error('Error loading CMS data', e);
    }
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Helper to slugify
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');

  // BLOG ACTIONS
  const handleOpenNewBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      slug: '',
      category: 'Buying Guide',
      excerpt: '',
      content: '## Introduction\n\nWrite your camera guide, review, or store announcement here...\n\n### Key Highlights\n- Feature 1\n- Feature 2\n\n### Conclusion\nVisit Mi King\'s Cameras at Pillar 103 for hands-on demos.',
      author: 'Mohd Idrees',
      authorRole: 'Founder & Senior Camera Specialist',
      coverImage: SAMPLE_COVERS[0].url,
      readTime: '5 min read',
      tags: 'Hyderabad, Camera Gear, Guide',
      isPublished: true,
    });
    setIsBlogModalOpen(true);
  };

  const handleEditBlog = (post: BlogPost) => {
    setEditingBlog(post);
    setBlogForm({
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      authorRole: post.authorRole,
      coverImage: post.coverImage,
      readTime: post.readTime,
      tags: post.tags.join(', '),
      isPublished: post.isPublished,
    });
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title.trim()) return;

    const slug = blogForm.slug.trim() || slugify(blogForm.title);
    const tagsArray = blogForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    let updated: BlogPost[];
    if (editingBlog) {
      updated = blogPosts.map((b) =>
        b.id === editingBlog.id
          ? {
              ...b,
              ...blogForm,
              slug,
              tags: tagsArray,
            }
          : b
      );
      showNotification('Blog article updated successfully!');
    } else {
      const newPost: BlogPost = {
        id: `blog-${Date.now()}`,
        ...blogForm,
        slug,
        tags: tagsArray,
        publishedAt: new Date().toISOString().split('T')[0],
      };
      updated = [newPost, ...blogPosts];
      showNotification('New blog article published!');
    }

    setBlogPosts(updated);
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(updated));
    setIsBlogModalOpen(false);
  };

  const handleDeleteBlog = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const updated = blogPosts.filter((b) => b.id !== id);
      setBlogPosts(updated);
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(updated));
      showNotification('Article removed.');
    }
  };

  // PAGE ACTIONS
  const handleOpenNewPage = () => {
    setEditingPage(null);
    setPageForm({
      title: '',
      slug: '',
      category: 'Policy',
      metaDescription: '',
      content: '# Page Title\n\nWrite your policy terms or company information here...',
      navSection: 'footer',
      isPublished: true,
    });
    setIsPageModalOpen(true);
  };

  const handleEditPage = (page: CustomPage) => {
    setEditingPage(page);
    setPageForm({
      title: page.title,
      slug: page.slug,
      category: page.category,
      metaDescription: page.metaDescription,
      content: page.content,
      navSection: page.navSection,
      isPublished: page.isPublished,
    });
    setIsPageModalOpen(true);
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageForm.title.trim()) return;

    const slug = pageForm.slug.trim() || slugify(pageForm.title);
    let updated: CustomPage[];
    if (editingPage) {
      updated = customPages.map((p) =>
        p.id === editingPage.id
          ? {
              ...p,
              ...pageForm,
              slug,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : p
      );
      showNotification('Page updated successfully!');
    } else {
      const newPage: CustomPage = {
        id: `page-${Date.now()}`,
        ...pageForm,
        slug,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      updated = [...customPages, newPage];
      showNotification('New static page created!');
    }

    setCustomPages(updated);
    localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(updated));
    setIsPageModalOpen(false);
  };

  const handleDeletePage = (id: string) => {
    if (confirm('Delete this page? This will remove it from navigation links.')) {
      const updated = customPages.filter((p) => p.id !== id);
      setCustomPages(updated);
      localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(updated));
      showNotification('Page deleted.');
    }
  };

  // Quick publish / unpublish without opening the editor
  const toggleBlogPublished = (id: string) => {
    const updated = blogPosts.map((b) => (b.id === id ? { ...b, isPublished: !b.isPublished } : b));
    setBlogPosts(updated);
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(updated));
    const post = updated.find((b) => b.id === id);
    showNotification(post?.isPublished ? `"${post.title}" is now live.` : `"${post?.title}" moved to drafts.`);
  };

  const togglePagePublished = (id: string) => {
    const updated = customPages.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p));
    setCustomPages(updated);
    localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(updated));
    const page = updated.find((p) => p.id === id);
    showNotification(page?.isPublished ? `/${page.slug} is now live.` : `/${page?.slug} unpublished.`);
  };

  const matchesStatus = (isPublished: boolean) =>
    statusFilter === 'all' || (statusFilter === 'published' ? isPublished : !isPublished);

  // Filtered lists
  const filteredBlogs = blogPosts.filter(
    (b) =>
      matchesStatus(b.isPublished) &&
      (b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const filteredPages = customPages.filter(
    (p) =>
      matchesStatus(p.isPublished) &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeItems = activeTab === 'blogs' ? blogPosts : customPages;
  const statusCounts: Record<StatusFilter, number> = {
    all: activeItems.length,
    published: activeItems.filter((i) => i.isPublished).length,
    draft: activeItems.filter((i) => !i.isPublished).length,
  };
  const contentStats = [
    { label: 'Blog posts', value: blogPosts.length, icon: BookOpen, tone: 'text-[#F5821F] bg-[#F5821F]/15' },
    { label: 'Live articles', value: blogPosts.filter((b) => b.isPublished).length, icon: Globe, tone: 'text-emerald-600 bg-emerald-500/15' },
    { label: 'Drafts', value: blogPosts.filter((b) => !b.isPublished).length, icon: EyeOff, tone: 'text-stone-500 bg-stone-500/15' },
    { label: 'Featured', value: blogPosts.filter((b) => b.featured).length, icon: Star, tone: 'text-amber-600 bg-amber-500/15' },
    { label: 'Live pages', value: customPages.filter((p) => p.isPublished).length, icon: FileText, tone: 'text-[#2271b1] bg-[#2271b1]/15' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F5821F]/15 text-[#F5821F]">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-stone-900 dark:text-white">
              Blogs &amp; Content Management
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Author photography buying guides, camera reviews, and manage store policy pages directly on your site.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === 'blogs' ? (
            <button
              onClick={handleOpenNewBlog}
              className="px-4 py-2.5 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#F5821F]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Blog Post</span>
            </button>
          ) : (
            <button
              onClick={handleOpenNewPage}
              className="px-4 py-2.5 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#F5821F]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Page</span>
            </button>
          )}

          <Link
            href="/blog"
            target="_blank"
            className="px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Blog</span>
          </Link>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Content stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {contentStats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-xl p-3 flex items-center gap-3 shadow-sm">
            <span className={`p-2 rounded-lg ${tone}`}>
              <Icon className="w-4 h-4" />
            </span>
            <div>
              <p className="text-lg font-black text-stone-900 dark:text-white leading-none">{value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-3">
        <div className="flex items-center bg-stone-200/80 dark:bg-[#1a1815] p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('blogs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'blogs'
                ? 'bg-white dark:bg-[#25221d] text-stone-900 dark:text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#F5821F]" />
            <span>Photography Blogs ({blogPosts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'pages'
                ? 'bg-white dark:bg-[#25221d] text-stone-900 dark:text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#F5821F]" />
            <span>Static &amp; Policy Pages ({customPages.length})</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full xl:w-auto">
        <div className="flex items-center gap-1 w-full sm:w-auto" role="group" aria-label="Filter by status">
          {(['all', 'published', 'draft'] as StatusFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              aria-pressed={statusFilter === f}
              className={`px-3 py-2 rounded-lg text-[11px] font-extrabold capitalize transition-colors cursor-pointer ${
                statusFilter === f
                  ? 'bg-[#2271b1] text-white'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/70 dark:hover:bg-[#1f1c18]'
              }`}
            >
              {f === 'draft' ? 'Drafts' : f} ({statusCounts[f]})
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={activeTab === 'blogs' ? 'Search articles or authors...' : 'Search pages...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:border-[#F5821F]"
          />
        </div>
        </div>
      </div>

      {((activeTab === 'blogs' && filteredBlogs.length === 0) || (activeTab === 'pages' && filteredPages.length === 0)) && (
        <div className="bg-white dark:bg-[#151311] border border-dashed border-stone-300 dark:border-[#2a2622] rounded-2xl py-12 flex flex-col items-center gap-2 text-center">
          <SearchX className="w-6 h-6 text-stone-400" />
          <p className="text-sm font-bold text-stone-700 dark:text-stone-200">Nothing matches these filters</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="text-xs font-bold text-[#2271b1] hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* TAB 1: BLOGS */}
      {activeTab === 'blogs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBlogs.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#F5821F]/40 transition-all shadow-sm group"
            >
              <div>
                {/* Image header */}
                <div className="relative h-40 w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-black/70 backdrop-blur-md text-white border border-white/20">
                    {post.category}
                  </span>
                  {post.isPublished ? (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-black">
                      Live
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold bg-stone-500 text-white">
                      Draft
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
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

                  <h3 className="font-black text-stone-900 dark:text-white text-sm line-clamp-2 leading-snug group-hover:text-[#F5821F] transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-[11px] text-stone-500">
                    <User className="w-3 h-3 text-[#F5821F]" />
                    <span className="font-semibold">{post.author}</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-3 border-t border-stone-100 dark:border-[#221f1b] bg-stone-50/50 dark:bg-[#181613] flex items-center justify-between">
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="text-xs font-bold text-[#F5821F] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleBlogPublished(post.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer ${
                      post.isPublished
                        ? 'text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
                        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25'
                    }`}
                    title={post.isPublished ? 'Move to drafts' : 'Publish now'}
                  >
                    {post.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleEditBlog(post)}
                    className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                    title="Edit Post"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(post.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer"
                    title="Delete Post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PAGES */}
      {activeTab === 'pages' && filteredPages.length > 0 && (
        <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-[#1b1916] border-b border-stone-200 dark:border-[#24211d] text-stone-600 dark:text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Page Title</th>
                  <th className="py-3 px-4">Route URL</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Nav Placement</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-[#201d19]">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-stone-50 dark:hover:bg-[#1a1815] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-stone-900 dark:text-white">
                        {page.title}
                      </div>
                      <div className="text-[10px] text-stone-500 truncate max-w-xs">
                        {page.metaDescription}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#F5821F]">
                      /{page.slug}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {page.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 capitalize text-stone-500 dark:text-stone-400">
                      {page.navSection}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => togglePagePublished(page.id)}
                        title={page.isPublished ? 'Click to unpublish' : 'Click to publish'}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          page.isPublished
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300'
                        }`}
                      >
                        {page.isPublished ? 'Live' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-stone-500 dark:text-stone-400">
                      {page.lastUpdated}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/${page.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
                          title="View Live Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleEditPage(page)}
                          className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                          title="Edit Page"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePage(page.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer"
                          title="Delete Page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: BLOG WRITER / EDITOR */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl w-full max-w-3xl my-8 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#2a2621] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#F5821F]" />
                <h2 className="text-base font-black text-stone-900 dark:text-white">
                  {editingBlog ? 'Edit Blog Article' : 'Write New Photography Blog'}
                </h2>
              </div>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Best 85mm Portrait Lenses for Weddings"
                    value={blogForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setBlogForm((prev) => ({
                        ...prev,
                        title,
                        slug: prev.slug || slugify(title),
                      }));
                    }}
                    className="w-full bg-stone-50 dark:bg-[#12110f] border border-stone-200 dark:border-[#2a2621] rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder="best-85mm-portrait-lenses"
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: slugify(e.target.value) })}
                    className="w-full bg-stone-50 dark:bg-[#12110f] border border-stone-200 dark:border-[#2a2621] rounded-xl px-3 py-2 text-stone-900 dark:text-white font-mono focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Category
                  </label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value as any })}
                    className="w-full bg-stone-50 dark:bg-[#12110f] border border-stone-200 dark:border-[#2a2621] rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  >
                    <option value="Buying Guide">Buying Guide</option>
                    <option value="Gear Review">Gear Review</option>
                    <option value="Photography Tips">Photography Tips</option>
                    <option value="Cinema & Video">Cinema &amp; Video</option>
                    <option value="Hyderabad Stories">Hyderabad Stories</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#12110f] border border-stone-200 dark:border-[#2a2621] rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full bg-stone-50 dark:bg-[#12110f] border border-stone-200 dark:border-[#2a2621] rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
              </div>

              {/* Cover Image & Presets */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Cover Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={blogForm.coverImage}
                    onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                    className="flex-1 bg-stone-50 dark:bg-[#12110f] border border-stone-200 dark:border-[#2a2621] rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[10px] text-stone-400 font-bold">Quick Presets:</span>
                  {SAMPLE_COVERS.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setBlogForm({ ...blogForm, coverImage: preset.url })}
                      className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-[#F5821F] hover:text-black text-stone-600 dark:text-stone-300 text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Brief Excerpt / Summary
                </label>
                <textarea
                  rows={2}
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="Short 2-sentence teaser shown on social cards and article cards..."
                  className="w-full bg-stone-50 dark:bg-[#12110f] border border-stone-200 dark:border-[#2a2621] rounded-xl p-3 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
              </div>

              {/* Markdown Content */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Full Article Body (Markdown supported)
                </label>
                <textarea
                  rows={8}
                  required
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#12110f] border border-stone-200 dark:border-[#2a2621] rounded-xl p-3 font-mono text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F] leading-relaxed"
                />
              </div>

              {/* Tags & Publish switch */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex-1">
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={blogForm.tags}
                    onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                    placeholder="Weddings, Sony, Lenses, Hyderabad"
                    className="w-full bg-stone-50 dark:bg-[#12110f] border border-stone-200 dark:border-[#2a2621] rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={blogForm.isPublished}
                      onChange={(e) => setBlogForm({ ...blogForm, isPublished: e.target.checked })}
                      className="rounded text-[#F5821F] focus:ring-[#F5821F] w-4 h-4"
                    />
                    <span className="font-bold text-stone-900 dark:text-white">Publish Immediately</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-[#2a2621]">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-black flex items-center gap-1.5 shadow-md shadow-[#F5821F]/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBlog ? 'Save Changes' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PAGE WRITER / EDITOR */}
      {isPageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-2xl w-full max-w-2xl my-8 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#2a2621] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#F5821F]" />
                <h2 className="text-base font-black text-stone-900 dark:text-white">
                  {editingPage ? 'Edit Static Page' : 'Create New Static / Policy Page'}
                </h2>
              </div>
              <button
                onClick={() => setIsPageModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad Camera Rental Terms"
                    value={pageForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setPageForm((prev) => ({
                        ...prev,
                        title,
                        slug: prev.slug || slugify(title),
                      }));
                    }}
                    className="w-full bg-stone-50 dark:bg-[#12110f] border border-stone-200 dark:border-[#2a2621] rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Route Slug *
                  </label>
                  <div className="flex items-center">
                    <span className="px-2.5 py-2 bg-stone-100 dark:bg-[#1e1b18] border border-r-0 border-stone-200 dark:border-[#2a2621] rounded-l-xl text-stone-500 font-mono">
                      /
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="rental-terms"
                      value={pageForm.slug}
                      onChange={(e) => setPageForm({ ...pageForm, slug: slugify(e.target.value) })}
                      className="w-full bg-stone-50 dark:bg-[#12110f] border border-stone-200 dark:border-[#2a2621] rounded-r-xl px-3 py-2 text-stone-900 dark:text-white font-mono focus:outline-none focus:border-[#F5821F]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Category
                  </label>
                  <select
                    value={pageForm.category}
                    onChange={(e) => setPageForm({ ...pageForm, category: e.target.value as any })}
                    className="w-full bg-stone-50 dark:bg-[#12110f] border border-stone-200 dark:border-[#2a2621] rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  >
                    <option value="Policy">Policy Page</option>
                    <option value="Company">Company / About</option>
                    <option value="Support">Support &amp; Service</option>
                    <option value="Custom">Custom Landing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Footer / Header Placement
                  </label>
                  <select
                    value={pageForm.navSection}
                    onChange={(e) => setPageForm({ ...pageForm, navSection: e.target.value as any })}
                    className="w-full bg-stone-50 dark:bg-[#12110f] border border-stone-200 dark:border-[#2a2621] rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  >
                    <option value="footer">Footer Legal Bar</option>
                    <option value="header">Header Navigation</option>
                    <option value="none">Hidden / Direct URL only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Meta Description (SEO &amp; Search Snippets)
                </label>
                <textarea
                  rows={2}
                  value={pageForm.metaDescription}
                  onChange={(e) => setPageForm({ ...pageForm, metaDescription: e.target.value })}
                  placeholder="Clear description explaining what this page covers for Google search..."
                  className="w-full bg-stone-50 dark:bg-[#12110f] border border-stone-200 dark:border-[#2a2621] rounded-xl p-3 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Page Content (Markdown)
                </label>
                <textarea
                  rows={9}
                  required
                  value={pageForm.content}
                  onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#12110f] border border-stone-200 dark:border-[#2a2621] rounded-xl p-3 font-mono text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F] leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-[#2a2621]">
                <button
                  type="button"
                  onClick={() => setIsPageModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-black flex items-center gap-1.5 shadow-md shadow-[#F5821F]/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPage ? 'Save Changes' : 'Create Page'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminContentPage() {
  return (
    <Suspense fallback={<div className="h-40 rounded-2xl bg-stone-200/60 dark:bg-[#151311] animate-pulse" />}>
      <ContentWorkspace />
    </Suspense>
  );
}
