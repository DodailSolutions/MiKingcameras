'use client';

import React, { useMemo, useState } from 'react';
import { Search, ArrowUpDown, MessageCircle, ChevronRight, Users } from 'lucide-react';
import type { CRMCustomer, Segment } from '@/lib/admin/crm';
import { SEGMENTS, daysSince, phoneDigits } from '@/lib/admin/crm';
import { formatINR, cn } from '@/lib/utils';
import { Avatar, SegmentBadge, EmptyState, cardClass } from './ui';

type SortKey = 'lifetimeValue' | 'orderCount' | 'lastOrderAt' | 'name';

const SORT_LABELS: Record<SortKey, string> = {
  lifetimeValue: 'Lifetime value',
  orderCount: 'Orders',
  lastOrderAt: 'Last order',
  name: 'Name',
};

interface Props {
  customers: CRMCustomer[];
  onOpen: (key: string) => void;
}

export function CustomersTable({ customers, onOpen }: Props) {
  const [query, setQuery] = useState('');
  const [segment, setSegment] = useState<Segment | 'All'>('All');
  const [sortKey, setSortKey] = useState<SortKey>('lifetimeValue');

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: customers.length };
    customers.forEach((cu) => (c[cu.segment] = (c[cu.segment] ?? 0) + 1));
    return c;
  }, [customers]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers
      .filter((c) => segment === 'All' || c.segment === segment)
      .filter(
        (c) =>
          !q ||
          [c.name, c.email, c.phone, c.address, ...c.tags].some((v) => v.toLowerCase().includes(q))
      )
      .sort((a, b) => {
        if (sortKey === 'name') return a.name.localeCompare(b.name);
        if (sortKey === 'lastOrderAt') return b.lastOrderAt.getTime() - a.lastOrderAt.getTime();
        return b[sortKey] - a[sortKey];
      });
  }, [customers, query, segment, sortKey]);

  return (
    <div className={cardClass}>
      {/* Toolbar */}
      <div className="p-3 flex flex-col lg:flex-row gap-3 lg:items-center justify-between border-b border-stone-200 dark:border-[#24211d]">
        <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Filter by segment">
          {(['All', ...SEGMENTS] as const).map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={segment === s}
              onClick={() => setSegment(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[11px] font-extrabold whitespace-nowrap transition-colors cursor-pointer',
                segment === s
                  ? 'bg-[#2271b1] text-white'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#1f1c18]'
              )}
            >
              {s} <span className="opacity-70">({counts[s] ?? 0})</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 lg:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, phone, tag…"
              aria-label="Search customers"
              className="w-full bg-stone-50 dark:bg-[#0f0e0c] border border-stone-200 dark:border-[#2a2622] rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-[#F5821F]"
            />
          </div>
          <label className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              aria-label="Sort customers"
              className="appearance-none bg-stone-50 dark:bg-[#0f0e0c] border border-stone-200 dark:border-[#2a2622] rounded-lg pl-8 pr-3 py-2 text-xs font-bold focus:outline-none focus:border-[#F5821F] cursor-pointer"
            >
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <option key={k} value={k}>{SORT_LABELS[k]}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={Users} title="No customers match" hint="Try a different segment or search term." />
      ) : (
        <>
          {/* Desktop table */}
          <table className="w-full text-xs hidden md:table">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-stone-500 border-b border-stone-200 dark:border-[#24211d]">
                <th className="px-4 py-2.5 font-bold">Customer</th>
                <th className="px-4 py-2.5 font-bold">Segment</th>
                <th className="px-4 py-2.5 font-bold text-right">Orders</th>
                <th className="px-4 py-2.5 font-bold text-right">Lifetime value</th>
                <th className="px-4 py-2.5 font-bold">Last order</th>
                <th className="px-4 py-2.5 font-bold">Tags</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-[#24211d]">
              {rows.map((c) => {
                const days = daysSince(c.lastOrderAt);
                return (
                  <tr key={c.key} onClick={() => onOpen(c.key)} className="hover:bg-[#2271b1]/5 cursor-pointer group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={c.name} />
                        <div className="min-w-0">
                          <p className="font-black text-stone-900 dark:text-white truncate group-hover:text-[#2271b1]">{c.name}</p>
                          <p className="text-[11px] text-stone-500 truncate">{c.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><SegmentBadge segment={c.segment} /></td>
                    <td className="px-4 py-3 text-right font-bold">{c.orderCount}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-black text-stone-900 dark:text-white">{formatINR(c.lifetimeValue)}</span>
                      {c.pendingAmount > 0 && <p className="text-[10px] text-rose-600 font-bold">{formatINR(c.pendingAmount)} due</p>}
                    </td>
                    <td className="px-4 py-3 text-stone-600 dark:text-stone-400">{days === 0 ? 'Today' : `${days} days ago`}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {c.tags.slice(0, 2).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-[#1f1c18] text-[10px] font-bold text-stone-600 dark:text-stone-300">{t}</span>
                        ))}
                        {c.tags.length > 2 && <span className="text-[10px] text-stone-400">+{c.tags.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`https://wa.me/${phoneDigits(c.phone)}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-500/10"
                          aria-label={`WhatsApp ${c.name}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-[#2271b1]" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="md:hidden divide-y divide-stone-100 dark:divide-[#24211d]">
            {rows.map((c) => (
              <li key={c.key}>
                <button type="button" onClick={() => onOpen(c.key)} className="w-full p-3 flex items-center gap-3 text-left cursor-pointer">
                  <Avatar name={c.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-stone-900 dark:text-white truncate">{c.name}</p>
                    <p className="text-[11px] text-stone-500">{c.orderCount} orders · {formatINR(c.lifetimeValue)}</p>
                  </div>
                  <SegmentBadge segment={c.segment} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
