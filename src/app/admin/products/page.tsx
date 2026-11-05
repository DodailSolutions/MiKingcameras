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
} from 'lucide-react';
import { INITIAL_PRODUCTS, Product } from '@/data/catalog';
import { formatINR } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // 1. Bulk Export to CSV
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

  // 2. Download Sample Template
  const handleDownloadTemplate = () => {
    const sampleHeaders = 'id,name,slug,brand,category,condition,regularPrice,salePrice,rating,reviewCount,inStock,warranty,imageUrl,description';
    const sampleRow = 'mik-sample-1,"Canon EOS R5 Mirrorless Camera",canon-eos-r5,Canon,mirrorless,Brand New,320000,285000,4.9,25,true,"2 Year Store Warranty","https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80","Flagship 45MP full-frame mirrorless camera with 8K RAW video recording."';
    const blob = new Blob([sampleHeaders + '\n' + sampleRow], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'mikings-products-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Bulk Upload State & Parser
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [parsedUploadProducts, setParsedUploadProducts] = useState<Product[]>([]);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const json = JSON.parse(text);
          if (Array.isArray(json)) {
            setParsedUploadProducts(json);
          } else {
            setUploadError('Invalid JSON format: expected an array of products.');
          }
        } else {
          // Parse CSV
          const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
          if (lines.length < 2) {
            setUploadError('CSV file has no data rows.');
            return;
          }
          const newItems: Product[] = [];

          for (let i = 1; i < lines.length; i++) {
            const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
            const matches: string[] = [];
            let match;
            while ((match = regex.exec(lines[i])) !== null) {
              if (match.index === regex.lastIndex) regex.lastIndex++;
              let val = match[1] || '';
              if (val.startsWith('"') && val.endsWith('"')) {
                val = val.substring(1, val.length - 1).replace(/""/g, '"');
              }
              matches.push(val.trim());
            }

            if (matches.length >= 7) {
              const name = matches[1] || `Product ${Date.now()}`;
              const slug = matches[2] || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              newItems.push({
                id: matches[0] || `mik-bulk-${Date.now()}-${i}`,
                name: name,
                slug: slug,
                brand: matches[3] || 'Canon',
                category: (matches[4] as any) || 'dslr',
                condition: (matches[5] as any) || 'Pre-Owned Like New',
                regularPrice: Number(matches[6]) || 35000,
                salePrice: Number(matches[7]) || 25000,
                rating: Number(matches[8]) || 4.7,
                reviewCount: Number(matches[9]) || 10,
                inStock: matches[10] === 'true' || matches[10] === '1',
                warranty: matches[11] || '1 Year Store Warranty',
                imageUrl: matches[12] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
                specs: {},
                description: matches[13] || 'Genuine equipment certified by Mi King’s Cameras Hyderabad.',
              });
            }
          }

          if (newItems.length === 0) {
            setUploadError('Could not parse any valid product rows from CSV.');
          } else {
            setParsedUploadProducts(newItems);
          }
        }
      } catch (err: any) {
        setUploadError(`Failed to parse file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const confirmBulkImport = () => {
    if (parsedUploadProducts.length === 0) return;
    setProducts((prev) => {
      const existingSlugs = new Set(parsedUploadProducts.map((p) => p.slug));
      const remaining = prev.filter((p) => !existingSlugs.has(p.slug));
      return [...parsedUploadProducts, ...remaining];
    });
    showToast(`Successfully imported ${parsedUploadProducts.length} products into inventory!`);
    setIsBulkUploadOpen(false);
    setParsedUploadProducts([]);
    setUploadFileName('');
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchBrand = selectedBrand === 'All' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchSearch && matchBrand && matchCat;
  });

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
        'Condition': newProductForm.condition || 'Pre-Owned Like New',
        'Store Warranty': newProductForm.warranty || '1 Year Store Warranty',
      },
      description: newProductForm.description || 'Certified authentic camera equipment from Mi King’s Cameras showroom in Hyderabad.',
    };

    setProducts((prev) => [newProd, ...prev]);
    showToast(`Added ${newProd.name} to catalog!`);
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#F5821F] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#F5821F] uppercase tracking-wider">
            Catalog &amp; Content Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Product Inventory CMS
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Browse, edit, and toggle stock across all {products.length} live products with verified Hyderabad pricing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Bulk Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#1e1b18] dark:hover:bg-[#282420] border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-[#F5821F]" />
            Export CSV
          </button>

          {/* Bulk Upload CSV */}
          <button
            onClick={() => setIsBulkUploadOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#1e1b18] dark:hover:bg-[#282420] border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            <Upload className="w-4 h-4 text-emerald-500" />
            Bulk Upload
          </button>

          {/* Add New Product */}
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2.5 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black text-xs font-black flex items-center gap-2 shadow-lg shadow-[#F5821F]/20 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by title, brand, or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-100 dark:bg-[#1e1b18] border border-stone-200 dark:border-[#2e2a25] rounded-xl py-2 pl-9 pr-3 text-xs text-stone-900 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:border-[#F5821F]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['All', 'Canon', 'Nikon', 'Sony', 'DJI', 'Sigma'].map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedBrand.toLowerCase() === brand.toLowerCase()
                    ? 'bg-[#F5821F] text-black shadow-sm'
                    : 'bg-stone-100 dark:bg-[#1e1b18] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-stone-100 dark:bg-[#1e1b18] border border-stone-200 dark:border-[#2e2a25] rounded-xl px-3 py-1.5 text-xs text-stone-900 dark:text-stone-200 focus:outline-none focus:border-[#F5821F] cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="dslr">DSLR Bodies</option>
            <option value="mirrorless">Mirrorless Bodies</option>
            <option value="lenses">Lenses</option>
            <option value="drones">Drones</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-[#1b1916] border-b border-stone-200 dark:border-[#24211d] text-stone-500 uppercase tracking-wider font-extrabold">
              <tr>
                <th className="py-3 px-4">Item &amp; Photos</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Price (Sale / Reg)</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-[#24211d]">
              {filtered.slice(0, 40).map((prod) => (
                <tr key={prod.id} className="hover:bg-stone-50/50 dark:hover:bg-[#1c1916]/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-white border border-stone-200 dark:border-stone-700 overflow-hidden relative shrink-0">
                        <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-contain p-1 mix-blend-multiply contrast-[1.28] brightness-[1.14] saturate-[1.04]" />
                      </div>
                      <div className="min-w-0 max-w-sm">
                        <span className="font-bold text-stone-900 dark:text-white block truncate">
                          {prod.name}
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          Brand: {prod.brand} &bull; {prod.images ? `${prod.images.length} photos` : '1 photo'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold uppercase text-[10px] text-[#F5821F]">
                    {prod.category}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                      {prod.condition}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-black text-stone-900 dark:text-white block">
                      {formatINR(prod.salePrice)}
                    </span>
                    <span className="text-[10px] text-stone-400 line-through">
                      {formatINR(prod.regularPrice)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleStock(prod.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        prod.inStock
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
                      }`}
                    >
                      {prod.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => setEditingProduct({ ...prod })}
                      className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 transition-all font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3 h-3 text-[#F5821F]" />
                      Edit
                    </button>
                    <Link
                      href={`/product/${prod.slug}`}
                      target="_blank"
                      className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-[#F5821F] hover:text-black hover:border-[#F5821F] transition-all font-bold text-xs inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#181613] text-stone-900 dark:text-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 my-8 border border-stone-200 dark:border-[#2a2621]">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#2a2621] pb-4">
              <h3 className="font-black text-sm uppercase tracking-wider">
                Edit Product — {editingProduct.name}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Sale Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.salePrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: Number(e.target.value) })}
                    className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Regular MRP Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.regularPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, regularPrice: Number(e.target.value) })}
                    className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Condition
                  </label>
                  <select
                    value={editingProduct.condition}
                    onChange={(e) => setEditingProduct({ ...editingProduct, condition: e.target.value as any })}
                    className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Pre-Owned Like New">Pre-Owned Like New</option>
                    <option value="Pre-Owned Good">Pre-Owned Good</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Warranty
                  </label>
                  <input
                    type="text"
                    value={editingProduct.warranty}
                    onChange={(e) => setEditingProduct({ ...editingProduct, warranty: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
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

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200 dark:border-[#2a2621]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 font-bold hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW PRODUCT MODAL */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#181613] text-stone-900 dark:text-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 my-8 border border-stone-200 dark:border-[#2a2621]">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#2a2621] pb-4">
              <h3 className="font-black text-sm uppercase tracking-wider">
                Add New Equipment to Catalog
              </h3>
              <button
                onClick={() => setIsAddingNew(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                  Product Name / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony A7 IV Mirrorless Body"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Brand
                  </label>
                  <select
                    value={newProductForm.brand}
                    onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
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
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Category
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as any })}
                    className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  >
                    <option value="dslr">DSLR Camera Body</option>
                    <option value="mirrorless">Mirrorless Camera Body</option>
                    <option value="lenses">Lens / Optics</option>
                    <option value="drones">Drone / Gimbal</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Sale Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProductForm.salePrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, salePrice: Number(e.target.value) })}
                    className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Regular MRP Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProductForm.regularPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, regularPrice: Number(e.target.value) })}
                    className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                  Product Image URL (Transparent PNG / WebP)
                </label>
                <input
                  type="text"
                  value={newProductForm.imageUrl}
                  onChange={(e) => setNewProductForm({ ...newProductForm, imageUrl: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200 dark:border-[#2a2621]">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 font-bold hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Bulk Upload Modal */}
      {isBulkUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-[#2a2621]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 dark:text-white">
                    Bulk Import Products (CSV / JSON)
                  </h3>
                  <p className="text-xs text-stone-500">Add or update multiple camera bodies, lenses, and accessories at once.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsBulkUploadOpen(false);
                  setParsedUploadProducts([]);
                  setUploadFileName('');
                  setUploadError(null);
                }}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Help & Download */}
            <div className="bg-stone-50 dark:bg-[#110f0d] border border-stone-200 dark:border-[#24211d] rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-[#F5821F] shrink-0" />
                <div>
                  <span className="font-bold text-stone-900 dark:text-white block">Need the standard column format?</span>
                  <span className="text-stone-500 text-[11px]">Download our pre-formatted CSV template with sample data.</span>
                </div>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="px-3 py-1.5 rounded-lg bg-[#F5821F]/10 hover:bg-[#F5821F]/20 text-[#F5821F] font-bold text-xs shrink-0 cursor-pointer transition-colors"
              >
                Download Template
              </button>
            </div>

            {/* Upload Dropzone */}
            <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-[#F5821F] rounded-2xl p-6 text-center space-y-3 transition-colors bg-stone-50/50 dark:bg-stone-900/30">
              <Upload className="w-8 h-8 text-stone-400 mx-auto" />
              <div>
                <label className="text-xs font-bold text-[#F5821F] hover:underline cursor-pointer">
                  <span>Click to choose file</span>
                  <input
                    type="file"
                    accept=".csv,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-stone-500"> or drag and drop</span>
              </div>
              <p className="text-[11px] text-stone-400">Supported formats: .CSV or .JSON (up to 5MB)</p>
            </div>

            {/* File & Error Feedback */}
            {uploadFileName && (
              <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#F5821F]" />
                <span>Selected: <strong>{uploadFileName}</strong></span>
              </div>
            )}

            {uploadError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Parsed Preview */}
            {parsedUploadProducts.length > 0 && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                  ✓ Successfully parsed {parsedUploadProducts.length} products ready to import!
                </span>
                <p className="text-stone-600 dark:text-stone-400 text-[11px]">
                  Sample: &quot;{parsedUploadProducts[0].name}&quot; &bull; {parsedUploadProducts[0].brand} &bull; {formatINR(parsedUploadProducts[0].salePrice)}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-[#2a2621]">
              <button
                type="button"
                onClick={() => {
                  setIsBulkUploadOpen(false);
                  setParsedUploadProducts([]);
                  setUploadFileName('');
                }}
                className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={parsedUploadProducts.length === 0}
                onClick={confirmBulkImport}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                <Upload className="w-4 h-4" />
                Import {parsedUploadProducts.length > 0 ? `${parsedUploadProducts.length} Items` : 'Products'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
