'use client';

import React from 'react';
import { Crown, Heart, Sparkles, AlertTriangle, type LucideIcon } from 'lucide-react';
import type { Segment, Priority } from '@/lib/admin/crm';
import { cn } from '@/lib/utils';

export const cardClass =
  'bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl shadow-sm';

export const inputClass =
  'w-full bg-white dark:bg-[#0f0e0c] border border-stone-200 dark:border-[#2a2622] rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#F5821F] focus:ring-2 focus:ring-[#F5821F]/20';

const SEGMENT_STYLES: Record<Segment, { cls: string; icon: LucideIcon }> = {
  VIP: { cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30', icon: Crown },
  Loyal: { cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30', icon: Heart },
  New: { cls: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30', icon: Sparkles },
  'At Risk': { cls: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30', icon: AlertTriangle },
};

export function SegmentBadge({ segment }: { segment: Segment }) {
  const { cls, icon: Icon } = SEGMENT_STYLES[segment];
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold', cls)}>
      <Icon className="w-3 h-3" />
      {segment}
    </span>
  );
}

const PRIORITY_STYLES: Record<Priority, string> = {
  High: 'bg-rose-500/15 text-rose-700 dark:text-rose-400',
  Medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Low: 'bg-stone-500/15 text-stone-600 dark:text-stone-400',
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wide', PRIORITY_STYLES[priority])}>
      {priority}
    </span>
  );
}

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  const hue = Array.from(name).reduce((h, c) => h + c.charCodeAt(0), 0) % 360;
  const dims = { sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs', lg: 'w-14 h-14 text-lg' }[size];
  return (
    <span
      className={cn('rounded-full flex items-center justify-center font-black text-white shrink-0', dims)}
      style={{ background: `hsl(${hue} 55% 42%)` }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <div className={cn(cardClass, 'p-4 flex items-start gap-3')}>
      <span className={cn('p-2 rounded-xl shrink-0', accent)}>
        <Icon className="w-4 h-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">{label}</p>
        <p className="text-lg font-black text-stone-900 dark:text-white leading-tight truncate">{value}</p>
        {hint && <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">{hint}</p>}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint }: { icon: LucideIcon; title: string; hint?: string }) {
  return (
    <div className="py-12 flex flex-col items-center text-center gap-2">
      <span className="p-3 rounded-2xl bg-stone-100 dark:bg-[#1f1c18] text-stone-400">
        <Icon className="w-6 h-6" />
      </span>
      <p className="text-sm font-bold text-stone-700 dark:text-stone-200">{title}</p>
      {hint && <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs">{hint}</p>}
    </div>
  );
}
