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
    <div className="min-h-screen bg-stone-100 dark:bg-[#0c0b09] flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Card Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center p-3 px-4 rounded-3xl bg-white border border-stone-200/90 shadow-sm">
            <img
              src={OFFICIAL_LOGO_BASE64}
              alt="MI King's Cameras"
              className="h-10 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white">
              Staff Admin Portal
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Restricted management gateway for authorized showroom personnel &amp; store managers.
            </p>
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 transition-colors">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="Enter authorized staff email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-[#1f1c18] border border-stone-200 dark:border-[#2e2a25] text-stone-900 dark:text-white text-xs placeholder-stone-400 focus:outline-none focus:border-[#F5821F] transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  Security Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-50 dark:bg-[#1f1c18] border border-stone-200 dark:border-[#2e2a25] text-stone-900 dark:text-white text-xs placeholder-stone-400 focus:outline-none focus:border-[#F5821F] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#F5821F]/25 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 stroke-[2.2]" />
                  <span>Authenticate &amp; Access Console</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security & Back Links */}
        <div className="flex items-center justify-between text-xs text-stone-500 px-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-[#F5821F]" />
            <span>Return to Public Store</span>
          </Link>

          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
