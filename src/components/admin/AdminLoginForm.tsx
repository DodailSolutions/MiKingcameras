'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Store,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { OFFICIAL_LOGO_BASE64 } from '@/data/logo';

export function AdminLoginForm() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (failedAttempts >= 5) {
      setError('Too many failed attempts. Security lock engaged. Please contact Mohd Idrees.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (!res.success) {
      setFailedAttempts((prev) => prev + 1);
      setError(res.error || 'Authentication failed. Invalid staff credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0c0b09] flex flex-col justify-between items-center py-10 px-4 transition-colors">
      <div className="w-full max-w-[390px] space-y-5 my-auto">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" aria-label="Return to Storefront">
            <img
              src={OFFICIAL_LOGO_BASE64}
              alt="MI King's Cameras"
              className="h-10 sm:h-11 w-auto object-contain mx-auto"
            />
          </Link>
        </div>

        {/* Modest Admin Box */}
        <div className="bg-white dark:bg-[#151311] border border-stone-200/90 dark:border-stone-800 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4 transition-colors">
          <div>
            <h1 className="text-2xl font-normal text-stone-900 dark:text-white tracking-tight">
              Staff Sign in
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Management portal for authorized showroom staff &amp; administrators.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                Staff Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="username"
                placeholder="staff@mikcameras.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-[#F5821F] focus:ring-1 focus:ring-[#F5821F] transition-all font-medium"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 pr-10 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-[#F5821F] focus:ring-1 focus:ring-[#F5821F] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-[#F5821F] hover:bg-[#E0741A] active:bg-[#c9630c] text-black font-semibold text-xs tracking-wide shadow-xs transition-colors cursor-pointer disabled:opacity-50 mt-1"
            >
              {isSubmitting ? 'Verifying Credentials...' : 'Sign in to Console'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-[#E0741A] dark:text-[#F5821F] font-semibold hover:underline"
            >
              &larr; Return to public store
            </Link>
          </div>
        </div>

        {/* Security Footer */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800/80 text-center space-y-2 text-[11px] text-stone-500 dark:text-stone-400">
          <div className="flex items-center justify-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role-Based Access Protected &bull; TLS 1.3</span>
          </div>
          <p className="text-stone-400 dark:text-stone-500">
            &copy; 2012&ndash;2026, Mi King&apos;s DSLR Camera Shop
          </p>
        </div>
      </div>
    </div>
  );
}
