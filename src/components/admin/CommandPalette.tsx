'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CornerDownLeft, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CommandItem {
  id: string;
  label: string;
  group: string;
  href: string;
  icon: LucideIcon;
  keywords?: string;
  external?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
}

export function CommandPalette({ open, ...rest }: Props) {
  // Mounting only while open gives every opening a fresh query and selection.
  return open ? <PaletteBody {...rest} /> : null;
}

function PaletteBody({ onClose, items }: Omit<Props, 'open'>) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => `${i.label} ${i.group} ${i.keywords ?? ''}`.toLowerCase().includes(q));
  }, [items, query]);

  const run = (item: CommandItem) => {
    onClose();
    if (item.external) window.open(item.href, '_blank');
    else router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      run(results[active]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[12vh] px-4" role="dialog" aria-modal="true" aria-label="Command palette">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#2a2622] rounded-2xl shadow-2xl overflow-hidden animate-[popIn_.15s_ease-out]">
        <div className="flex items-center gap-2 px-4 border-b border-stone-200 dark:border-[#24211d]">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Jump to a page or action…"
            aria-label="Search commands"
            className="flex-1 bg-transparent py-3.5 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none"
          />
          <kbd className="text-[10px] font-bold text-stone-400 border border-stone-200 dark:border-stone-700 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        <ul className="max-h-[50vh] overflow-y-auto py-2" role="listbox">
          {results.length === 0 && <li className="px-4 py-6 text-center text-xs text-stone-400">No matches for “{query}”</li>}
          {results.map((item, idx) => {
            const Icon = item.icon;
            const header = item.group !== results[idx - 1]?.group ? item.group : null;
            return (
              <React.Fragment key={item.id}>
                {header && <li className="px-4 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-stone-400">{header}</li>}
                <li role="option" aria-selected={idx === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => run(item)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2 text-left text-xs font-semibold cursor-pointer',
                      idx === active ? 'bg-[#2271b1] text-white' : 'text-stone-700 dark:text-stone-200'
                    )}
                  >
                    <Icon className={cn('w-4 h-4', idx === active ? 'text-white' : 'text-stone-400')} />
                    <span className="flex-1">{item.label}</span>
                    {idx === active && <CornerDownLeft className="w-3.5 h-3.5 opacity-70" />}
                  </button>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
        <div className="px-4 py-2 border-t border-stone-200 dark:border-[#24211d] text-[10px] text-stone-400 flex gap-3">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>⌘K / Ctrl K toggle</span>
        </div>
      </div>
    </div>
  );
}
