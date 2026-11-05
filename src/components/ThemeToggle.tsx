'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-8 h-8 rounded-lg bg-stone-800/40 border border-stone-700/50 ${className}`} />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 cursor-pointer ${
        isDark
          ? 'bg-[#1b1916] hover:bg-[#25221d] text-amber-400 border border-[#2e2a25] shadow-inner'
          : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 shadow-sm'
      } ${className}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex items-center gap-1.5"
      >
        {isDark ? (
          <>
            <Sun className="w-4 h-4 text-amber-400 stroke-[2.2]" />
            <span className="text-[11px] font-bold text-stone-300 hidden sm:inline">Light</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-stone-700 stroke-[2.2]" />
            <span className="text-[11px] font-bold text-stone-700 hidden sm:inline">Dark</span>
          </>
        )}
      </motion.div>
    </button>
  );
}
