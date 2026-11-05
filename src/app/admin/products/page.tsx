'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  X,
  Save,
  CheckCircle2,
  Sparkles,
  Download,
  Upload,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  Layers,
  FolderTree,
  Tag,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { INITIAL_PRODUCTS, Product } from '@/data/catalog';
import { formatINR } from '@/lib/utils';

interface CategoryItem {
  name: string;
  slug: string;
  description: string;
  parent: string;
  count: number;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    name: 'DSLR Camera Bodies & Kits',
    slug: 'dslr',
    description: 'Professional & enthusiast digital single-lens reflex bodies including Canon EOS 80D, 90D, Nikon D7500, D850 with dual optical viewfinders.',
    parent: 'None',
    count: INITIAL_PRODUCTS.filter((p) => p.category === 'dslr').length,
  },
  {
    name: 'Mirrorless Cameras',
    slug: 'mirrorless',
    description: 'Next-gen full-frame and APS-C mirrorless cameras from Sony Alpha (A7 IV, FX3), Canon EOS R series, and Nikon Z with advanced eye autofocus.',
    parent: 'None',
    count: INITIAL_PRODUCTS.filter((p) => p.category === 'mirrorless').length,
  },
  {
    name: 'Lenses & Optical Glass',
    slug: 'lenses',
    description: 'Prime portrait lenses (50mm, 85mm), telephoto zooms (70-200mm), and ultra-wide optics from Canon EF/RF, Sony E-mount, and Sigma Art.',
    parent: 'None',
    count: INITIAL_PRODUCTS.filter((p) => p.category === 'lenses').length,
  },
  {
    name: 'Drones & Aerial Photography',
    slug: 'drones',
    description: 'DJI 4K/8K aerial drones including Mini 4 Pro, Air 3, and Mavic 3 Cine with obstacle avoidance and long flight range.',
    parent: 'None',
    count: INITIAL_PRODUCTS.filter((p) => p.category === 'drones').length,
  },
  {
    name: 'Gimbals, Bags & Accessories',
    slug: 'accessories',
    description: '3-axis camera stabilizers (DJI Ronin RS3), camera backpacks, extra OEM batteries, high-speed SanDisk SD cards, and studio tripods.',
    parent: 'None',
    count: INITIAL_PRODUCTS.filter((p) => p.category === 'accessories').length,
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [activeTab, setActiveTab] = useState<'all' | 'categories'>('all');
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatParent, setNewCatParent] = useState('None');
  const [newCatDesc, setNewCatDesc] = useState('');

  // New product form state
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
    name: '',
    brand: 'Canon',
    category: 'dslr',
    condition: 'Pre-Owned Like New',
    regularPrice: 45000,
    salePrice: 32000,
    warranty: '1 Year Store Warranty',
    inStock: true,
    rating: 4.8,
    reviewCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    description: 'Certified authentic camera equipment from Mi King’s Cameras showroom in Hyderabad.',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Bulk Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'id',
      'name',
      'slug',
      'brand',
      'category',
      'condition',
      'regularPrice',
      'salePrice',
      'rating',
      'reviewCount',
      'inStock',
      'warranty',
      'imageUrl',
      'description',
    ];

    const rows = products.map((p) => [
      `"${p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.slug}"`,
      `"${p.brand}"`,
      `"${p.category}"`,
      `"${p.condition}"`,
      p.regularPrice,
      p.salePrice,
      p.rating,
      p.reviewCount,
      p.inStock,
      `"${p.warranty}"`,
      `"${p.imageUrl}"`,
      `"${(p.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mikings-products-inventory-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Successfully exported ${products.length} products to CSV!`);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatSlug.trim() || newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: CategoryItem = {
      name: newCatName.trim(),
      slug,
      parent: newCatParent,
      description: newCatDesc.trim() || `Official catalog line for ${newCatName}.`,
      count: 0,
    };

    setCategories((prev) => [...prev, newCategory]);
    showToast(`Category "${newCategory.name}" created!`);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
  };

  const toggleStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.inStock;
          showToast(`${p.name} marked as ${next ? 'In Stock' : 'Out of Stock'}`);
          return { ...p, inStock: next };
        }
        return p;
      })
    );
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    );
    showToast(`Saved modifications for ${editingProduct.name}`);
    setEditingProduct(null);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = (newProductForm.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newProd: Product = {
      id: `mik-${Date.now()}`,
      name: newProductForm.name || 'New Camera Equipment',
      slug,
      brand: newProductForm.brand || 'Canon',
      category: (newProductForm.category as any) || 'dslr',
      condition: (newProductForm.condition as any) || 'Pre-Owned Like New',
      regularPrice: Number(newProductForm.regularPrice) || 30000,
      salePrice: Number(newProductForm.salePrice) || 25000,
      rating: 4.8,
      reviewCount: 12,
      imageUrl: newProductForm.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
      images: [newProductForm.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'],
      inStock: newProductForm.inStock ?? true,
      warranty: newProductForm.warranty || '1 Year Store Warranty',
      specs: {
        Condition: newProductForm.condition || 'Pre-Owned Like New',
        'Store Warranty': newProductForm.warranty || '1 Year Store Warranty',
      },
      description: newProductForm.description || 'Certified authentic camera equipment from Mi King’s Cameras showroom in Hyderabad.',
    };

    setProducts((prev) => [newProd, ...prev]);
    showToast(`Added ${newProd.name} to catalog!`);
    setIsAddingNew(false);
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchBrand = selectedBrand === 'All' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'inStock'
        ? p.inStock
        : !p.inStock;
    return matchSearch && matchBrand && matchCat && matchStock;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-12 right-5 z-50 bg-[#F5821F] text-black font-extrabold text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* WordPress WooCommerce Products Header */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-300 dark:border-stone-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <span>Products</span>
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="px-2.5 py-0.5 rounded border border-[#2271b1] text-[#2271b1] hover:bg-[#2271b1] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Add New
            </button>
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Manage your {products.length} live camera equipment, pricing, stock levels, and taxonomy categories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#F5821F]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* View Tabs: All Products vs Categories */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2 text-xs">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`font-semibold pb-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'border-[#F5821F] text-[#F5821F]'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`font-semibold pb-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'categories'
                ? 'border-[#F5821F] text-[#F5821F]'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categories Hierarchy ({categories.length})</span>
          </button>
        </div>

        <span className="text-stone-500 hidden sm:inline">
          {activeTab === 'all' ? `${filtered.length} products listed` : `${categories.length} active categories`}
        </span>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: ALL PRODUCTS VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {/* WordPress Filter and Search Bar */}
          <div className="bg-white dark:bg-[#1c1917] border border-stone-300/80 dark:border-stone-800 rounded-lg p-3.5 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search products by title, brand, SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md py-1.5 pl-9 pr-3 text-stone-900 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:border-[#F5821F]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2" />
            </div>

            {/* Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5 text-stone-900 dark:text-stone-200 focus:outline-none focus:border-[#F5821F] cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="dslr">DSLR Camera Bodies</option>
                <option value="mirrorless">Mirrorless Cameras</option>
                <option value="lenses">Lenses &amp; Optics</option>
                <option value="drones">Drones &amp; Aerial</option>
                <option value="accessories">Gimbals &amp; Accessories</option>
              </select>

              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5 text-stone-900 dark:text-stone-200 focus:outline-none focus:border-[#F5821F] cursor-pointer"
              >
                <option value="All">All Brands</option>
                <option value="Canon">Canon</option>
                <option value="Sony">Sony</option>
                <option value="Nikon">Nikon</option>
                <option value="DJI">DJI</option>
                <option value="Sigma">Sigma</option>
              </select>

              {/* Stock Filter */}
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5 text-stone-900 dark:text-stone-200 focus:outline-none focus:border-[#F5821F] cursor-pointer"
              >
                <option value="all">All Stock Statuses</option>
                <option value="inStock">In Stock (Verified)</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* WordPress WooCommerce Product Table */}
          <div className="bg-white dark:bg-[#1c1917] border border-stone-300/80 dark:border-stone-800 rounded-lg overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-stone-50 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-3 w-16">Image</th>
                    <th className="py-3 px-4">Name, SKU &amp; Actions</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Price (Sale / MRP)</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {filtered.slice(0, 50).map((prod) => (
                    <tr
                      key={prod.id}
                      className="hover:bg-stone-50/70 dark:hover:bg-stone-900/50 transition-colors group"
                    >
                      {/* Thumbnail */}
                      <td className="py-3 px-3 align-top">
                        <div className="w-12 h-12 rounded bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 overflow-hidden relative shrink-0">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                      </td>

                      {/* Name & Quick Links */}
                      <td className="py-3 px-4 align-top max-w-sm">
                        <span className="font-bold text-stone-900 dark:text-white block text-xs">
                          {prod.name}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono block mt-0.5">
                          SKU: {prod.id} &bull; Brand: {prod.brand}
                        </span>

                        {/* WordPress-style hover links */}
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500">
                          <button
                            type="button"
                            onClick={() => setEditingProduct({ ...prod })}
                            className="text-[#2271b1] hover:underline font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <span className="text-stone-300 dark:text-stone-700">|</span>
                          <Link
                            href={`/product/${prod.slug}`}
                            target="_blank"
                            className="text-stone-600 dark:text-stone-400 hover:text-[#F5821F] hover:underline font-medium"
                          >
                            View Live &rarr;
                          </Link>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 align-top">
                        <span className="inline-block bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold uppercase text-[10px] px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                          {prod.category}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => toggleStock(prod.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            prod.inStock
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
                          }`}
                        >
                          {prod.inStock ? '● In Stock' : '✕ Out of Stock'}
                        </button>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        <span className="font-black text-[#F5821F] block text-xs">
                          {formatINR(prod.salePrice)}
                        </span>
                        <span className="text-[10px] text-stone-400 line-through">
                          {formatINR(prod.regularPrice)}
                        </span>
                      </td>

                      {/* Condition & Warranty */}
                      <td className="py-3 px-4 align-top">
                        <span className="block text-[11px] font-semibold text-stone-800 dark:text-stone-200">
                          {prod.condition}
                        </span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          {prod.warranty}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...prod })}
                          className="px-2.5 py-1 rounded border border-stone-300 dark:border-stone-700 hover:bg-[#F5821F] hover:text-black hover:border-[#F5821F] transition-colors font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-900/60 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 flex items-center justify-between">
              <span>Showing top {Math.min(filtered.length, 50)} of {filtered.length} products</span>
              <span>All 153 products synced with WooCommerce</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: CATEGORIES HIERARCHY MANAGEMENT VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column A: Add New Category Form */}
          <div className="bg-white dark:bg-[#1c1917] border border-stone-300/80 dark:border-stone-800 rounded-lg p-5 shadow-2xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                Add New Category
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Organize store camera models, lenses, and accessories.
              </p>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-stone-700 dark:text-stone-300">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cinema Cameras"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
                <p className="text-[10px] text-stone-400">The category title as it appears on your storefront.</p>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700 dark:text-stone-300">
                  Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. cinema-cameras"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
                <p className="text-[10px] text-stone-400">URL-friendly version of the name.</p>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700 dark:text-stone-300">
                  Parent Category
                </label>
                <select
                  value={newCatParent}
                  onChange={(e) => setNewCatParent(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                >
                  <option value="None">None (Top-Level)</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-stone-400">Assign a parent to create hierarchical taxonomy.</p>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700 dark:text-stone-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Description of camera models in this category..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 rounded bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
              >
                Add New Category
              </button>
            </form>
          </div>

          {/* Column B: Category List Table */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1c1917] border border-stone-300/80 dark:border-stone-800 rounded-lg overflow-hidden shadow-2xs">
            <div className="p-3.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 flex items-center justify-between">
              <h3 className="font-bold text-xs text-stone-800 dark:text-stone-200">
                All Active Taxonomy Categories ({categories.length})
              </h3>
              <span className="text-[11px] text-stone-500">100% Synced</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase font-bold text-[10px] bg-stone-50/50 dark:bg-stone-900/30">
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4">Slug</th>
                    <th className="py-2.5 px-4 text-right">Items Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {categories.map((cat) => (
                    <tr key={cat.slug} className="hover:bg-stone-50/60 dark:hover:bg-stone-900/40">
                      <td className="py-3 px-4 align-top">
                        <span className="font-bold text-stone-900 dark:text-white block">
                          {cat.name}
                        </span>
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat.slug);
                              setActiveTab('all');
                            }}
                            className="text-[#2271b1] hover:underline cursor-pointer"
                          >
                            Filter Products ({cat.count})
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 align-top text-stone-600 dark:text-stone-400 text-[11px] max-w-xs">
                        {cat.description}
                      </td>
                      <td className="py-3 px-4 align-top font-mono text-[11px] text-stone-500">
                        {cat.slug}
                      </td>
                      <td className="py-3 px-4 align-top text-right">
                        <span className="font-mono font-black text-[#F5821F] bg-[#F5821F]/10 px-2 py-0.5 rounded text-xs">
                          {cat.count}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* EDIT PRODUCT MODAL */}
      {/* ------------------------------------------------------------- */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#181613] text-stone-900 dark:text-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative space-y-4 my-8 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="font-bold text-sm">
                Edit Product &bull; {editingProduct.name}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Sale Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.salePrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: Number(e.target.value) })}
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Regular MRP Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.regularPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, regularPrice: Number(e.target.value) })}
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Condition
                  </label>
                  <select
                    value={editingProduct.condition}
                    onChange={(e) => setEditingProduct({ ...editingProduct, condition: e.target.value as any })}
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Pre-Owned Like New">Pre-Owned Like New</option>
                    <option value="Pre-Owned Good">Pre-Owned Good</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Warranty
                  </label>
                  <input
                    type="text"
                    value={editingProduct.warranty}
                    onChange={(e) => setEditingProduct({ ...editingProduct, warranty: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inStockEdit"
                  checked={editingProduct.inStock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                  className="rounded text-[#F5821F] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="inStockEdit" className="font-bold text-stone-700 dark:text-stone-300 cursor-pointer">
                  Item is In Stock &amp; Available for Direct Order
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-3 py-1.5 rounded border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#2271b1] hover:bg-[#135e96] text-white font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ADD NEW PRODUCT MODAL */}
      {/* ------------------------------------------------------------- */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#181613] text-stone-900 dark:text-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative space-y-4 my-8 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="font-bold text-sm">
                Add New Equipment to Catalog
              </h3>
              <button
                onClick={() => setIsAddingNew(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Product Name / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony A7 IV Mirrorless Body"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Brand
                  </label>
                  <select
                    value={newProductForm.brand}
                    onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  >
                    <option value="Canon">Canon</option>
                    <option value="Sony">Sony</option>
                    <option value="Nikon">Nikon</option>
                    <option value="DJI">DJI</option>
                    <option value="Sigma">Sigma</option>
                    <option value="Fujifilm">Fujifilm</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as any })}
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  >
                    <option value="dslr">DSLR Camera Body</option>
                    <option value="mirrorless">Mirrorless Camera Body</option>
                    <option value="lenses">Lens / Optics</option>
                    <option value="drones">Drone / Gimbal</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Sale Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProductForm.salePrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, salePrice: Number(e.target.value) })}
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Regular MRP Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProductForm.regularPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, regularPrice: Number(e.target.value) })}
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Product Image URL
                </label>
                <input
                  type="text"
                  value={newProductForm.imageUrl}
                  onChange={(e) => setNewProductForm({ ...newProductForm, imageUrl: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-1.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 rounded border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#2271b1] hover:bg-[#135e96] text-white font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
