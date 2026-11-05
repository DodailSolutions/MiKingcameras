'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  Wand2,
  Layers,
  Image as ImageIcon,
  RotateCcw,
  Sliders,
  Eye,
  Check,
} from 'lucide-react';

interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl: string | null;
  name: string;
  size: number;
  status: 'idle' | 'processing' | 'completed' | 'error';
  tolerance: number; // 10 to 60
}

export default function MediaStudioPage() {
  const [images, setImages] = useState<ProcessedImage[]>([
    {
      id: 'demo-1',
      originalUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
      processedUrl: null,
      name: 'canon-camera-sample.jpg',
      size: 450000,
      status: 'idle',
      tolerance: 35,
    },
    {
      id: 'demo-2',
      originalUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=600&q=80',
      processedUrl: null,
      name: 'sigma-lens-sample.jpg',
      size: 380000,
      status: 'idle',
      tolerance: 35,
    },
  ]);

  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [globalTolerance, setGlobalTolerance] = useState(35);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ProcessedImage[] = Array.from(files).map((file) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      originalUrl: URL.createObjectURL(file),
      processedUrl: null,
      name: file.name,
      size: file.size,
      status: 'idle',
      tolerance: globalTolerance,
    }));

    setImages((prev) => [...newImages, ...prev]);
  };

  /**
   * HTML5 Canvas Background Removal Algorithm
   * Detects corners & border pixel colors (white, off-white, light gray, dark studio)
   * and creates a transparent mask with smooth edge alpha-feathering.
   */
  const removeBackground = (imgItem: ProcessedImage): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = imgItem.originalUrl;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Sample background color from the 4 corners
        const cornerSamples = [
          [0, 0], // Top-Left
          [canvas.width - 1, 0], // Top-Right
          [0, canvas.height - 1], // Bottom-Left
          [canvas.width - 1, canvas.height - 1], // Bottom-Right
        ];

        let avgR = 0,
          avgG = 0,
          avgB = 0;
        cornerSamples.forEach(([x, y]) => {
          const idx = (y * canvas.width + x) * 4;
          avgR += data[idx];
          avgG += data[idx + 1];
          avgB += data[idx + 2];
        });
        avgR = Math.round(avgR / 4);
        avgG = Math.round(avgG / 4);
        avgB = Math.round(avgB / 4);

        const tol = (imgItem.tolerance || globalTolerance) * 2.5;

        // Process all pixels
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Euclidean color distance from background
          const dist = Math.sqrt(
            Math.pow(r - avgR, 2) + Math.pow(g - avgG, 2) + Math.pow(b - avgB, 2)
          );

          // Also check for standard light gray / pure white studio background
          const isStudioLight = r > 215 && g > 215 && b > 215 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15;

          if (dist < tol || (isStudioLight && dist < tol * 1.5)) {
            // Feather edge
            if (dist > tol * 0.7) {
              const alphaFactor = (dist - tol * 0.7) / (tol * 0.3);
              data[i + 3] = Math.round(255 * alphaFactor);
            } else {
              data[i + 3] = 0; // 100% transparent
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = (err) => reject(err);
    });
  };

  // Process a single image
  const processImage = async (id: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, status: 'processing' } : img))
    );

    const target = images.find((i) => i.id === id);
    if (!target) return;

    try {
      const pngUrl = await removeBackground(target);
      setImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, processedUrl: pngUrl, status: 'completed' } : img
        )
      );
    } catch (e) {
      console.error('Error removing background:', e);
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, status: 'error' } : img))
      );
    }
  };

  // Process all images in 1-Click
  const processAll = async () => {
    setIsProcessingAll(true);
    for (const img of images) {
      if (img.status !== 'completed') {
        try {
          const pngUrl = await removeBackground(img);
          setImages((prev) =>
            prev.map((i) =>
              i.id === img.id ? { ...i, processedUrl: pngUrl, status: 'completed' } : i
            )
          );
        } catch (e) {
          console.error(e);
        }
      }
    }
    setIsProcessingAll(false);
  };

  // Download transparent PNG
  const downloadImage = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name.replace(/\.[^/.]+$/, '') + '-transparent.png';
    a.click();
  };

  // Remove from list
  const deleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F5821F]/10 text-[#F5821F]">
              <Wand2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white">
              AI 1-Click Background Remover
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Instantly remove solid, gray, or studio backdrops from product photos into transparent PNGs with a single click.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-[#1a1815] text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#F5821F]" />
            Upload Photos
          </button>

          <button
            onClick={processAll}
            disabled={isProcessingAll || images.length === 0}
            className="px-5 py-2 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black text-xs font-black flex items-center gap-2 shadow-lg shadow-[#F5821F]/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessingAll ? 'Removing Backgrounds...' : '1-Click Remove All'}</span>
          </button>
        </div>
      </div>

      {/* Global Sensitivity Toolbar */}
      <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Sliders className="w-4 h-4 text-[#F5821F]" />
          <span className="font-bold text-stone-900 dark:text-white">Background Sensitivity:</span>
          <input
            type="range"
            min="15"
            max="65"
            value={globalTolerance}
            onChange={(e) => setGlobalTolerance(Number(e.target.value))}
            className="accent-[#F5821F] w-36 cursor-pointer"
          />
          <span className="font-bold text-stone-500">{globalTolerance}%</span>
        </div>

        <div className="flex items-center gap-2 text-stone-500 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Supports JPEG, PNG, WEBP &bull; Output is transparent 32-bit PNG</span>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
          >
            {/* Header info */}
            <div className="p-3.5 border-b border-stone-200 dark:border-[#24211d] flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <h4 className="font-bold text-xs text-stone-900 dark:text-white truncate">
                  {item.name}
                </h4>
                <span className="text-[10px] text-stone-400">
                  {(item.size / 1024).toFixed(0)} KB
                </span>
              </div>

              <div className="flex items-center gap-2">
                {item.status === 'completed' ? (
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Check className="w-3 h-3" /> Transparent Ready
                  </span>
                ) : item.status === 'processing' ? (
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md animate-pulse">
                    Processing...
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-stone-400">Original</span>
                )}

                <button
                  onClick={() => deleteImage(item.id)}
                  className="p-1 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  aria-label="Remove photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Visual Canvas (Side-by-side or Checkerboard preview) */}
            <div className="p-4 grid grid-cols-2 gap-3 items-center justify-center">
              {/* Original Preview */}
              <div className="space-y-1.5 text-center">
                <span className="text-[10px] font-bold text-stone-500 uppercase">Original</span>
                <div className="relative h-44 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
                  <Image
                    src={item.originalUrl}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>

              {/* Transparent Output Preview with Transparent Checkerboard */}
              <div className="space-y-1.5 text-center">
                <span className="text-[10px] font-bold text-[#F5821F] uppercase">Transparent PNG</span>
                <div
                  className="relative h-44 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 flex items-center justify-center"
                  style={{
                    backgroundImage:
                      'linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  {item.processedUrl ? (
                    <Image
                      src={item.processedUrl}
                      alt={`${item.name} transparent`}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="text-center p-4 text-stone-400 text-xs">
                      <Sparkles className="w-5 h-5 mx-auto mb-1 text-stone-300" />
                      <span>Click Remove to generate</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-3 border-t border-stone-200 dark:border-[#24211d] bg-stone-50 dark:bg-[#181613] flex items-center justify-between">
              <button
                onClick={() => processImage(item.id)}
                disabled={item.status === 'processing'}
                className="px-3.5 py-1.5 rounded-xl bg-stone-900 text-white dark:bg-white dark:text-stone-900 hover:bg-[#F5821F] dark:hover:bg-[#F5821F] dark:hover:text-black font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{item.processedUrl ? 'Re-Process' : 'Remove Background'}</span>
              </button>

              {item.processedUrl && (
                <button
                  onClick={() => downloadImage(item.processedUrl!, item.name)}
                  className="px-3 py-1.5 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
