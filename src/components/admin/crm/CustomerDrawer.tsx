'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Tag,
  Plus,
  StickyNote,
  ShoppingBag,
  CalendarClock,
  Send,
} from 'lucide-react';
import type { CRMCustomer, CRMNote } from '@/lib/admin/crm';
import { daysSince, phoneDigits } from '@/lib/admin/crm';
import { formatINR } from '@/lib/utils';
import { Avatar, SegmentBadge, inputClass } from './ui';

const SUGGESTED_TAGS = ['Wedding Pro', 'Studio', 'Vlogger', 'Trade-in', 'EMI', 'Wholesale', 'Beginner'];

const STATUS_COLORS: Record<string, string> = {
  Processing: 'text-amber-600 dark:text-amber-400',
  Verified: 'text-sky-600 dark:text-sky-400',
  Dispatched: 'text-indigo-600 dark:text-indigo-400',
  Delivered: 'text-emerald-600 dark:text-emerald-400',
  Cancelled: 'text-rose-600 dark:text-rose-400',
};

interface Props {
  customer: CRMCustomer | null;
  author: string;
  onClose: () => void;
  onUpdateTags: (key: string, tags: string[]) => void;
  onAddNote: (key: string, note: CRMNote) => void;
  onScheduleFollowUp: (customer: CRMCustomer) => void;
}

export function CustomerDrawer({ customer, author, onClose, onUpdateTags, onAddNote, onScheduleFollowUp }: Props) {
  const [noteText, setNoteText] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (!customer) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [customer, onClose]);

  if (!customer) return null;

  const addTag = (tag: string) => {
    const clean = tag.trim();
    if (!clean || customer.tags.includes(clean)) return;
    onUpdateTags(customer.key, [...customer.tags, clean]);
    setTagInput('');
  };

  const submitNote = () => {
    if (!noteText.trim()) return;
    onAddNote(customer.key, {
      id: `note-${Date.now()}`,
      text: noteText.trim(),
      author,
      createdAt: new Date().toISOString(),
    });
    setNoteText('');
  };

  const digits = phoneDigits(customer.phone);
  const lastSeen = daysSince(customer.lastOrderAt);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`${customer.name} profile`}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <aside className="relative w-full max-w-md h-full bg-[#f6f7f7] dark:bg-[#0f0e0c] shadow-2xl flex flex-col animate-[slideIn_.2s_ease-out]">
        {/* Header */}
        <div className="bg-white dark:bg-[#151311] border-b border-stone-200 dark:border-[#24211d] p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={customer.name} size="lg" />
              <div className="min-w-0">
                <h2 className="font-black text-base text-stone-900 dark:text-white truncate">{customer.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <SegmentBadge segment={customer.segment} />
                  <span className="text-[10px] text-stone-500">
                    Customer since {customer.firstOrderAt.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500" aria-label="Close panel">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <a href={`tel:+${digits}`} className="flex flex-col items-center gap-1 py-2 rounded-xl border border-stone-200 dark:border-[#2a2622] hover:border-[#2271b1] hover:text-[#2271b1] text-[10px] font-bold text-stone-600 dark:text-stone-300 transition-colors">
              <Phone className="w-4 h-4" /> Call
            </a>
            <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 py-2 rounded-xl border border-stone-200 dark:border-[#2a2622] hover:border-emerald-500 hover:text-emerald-600 text-[10px] font-bold text-stone-600 dark:text-stone-300 transition-colors">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <a href={`mailto:${customer.email}`} className="flex flex-col items-center gap-1 py-2 rounded-xl border border-stone-200 dark:border-[#2a2622] hover:border-[#F5821F] hover:text-[#F5821F] text-[10px] font-bold text-stone-600 dark:text-stone-300 transition-colors">
              <Mail className="w-4 h-4" /> Email
            </a>
            <button type="button" onClick={() => onScheduleFollowUp(customer)} className="flex flex-col items-center gap-1 py-2 rounded-xl border border-stone-200 dark:border-[#2a2622] hover:border-purple-500 hover:text-purple-600 text-[10px] font-bold text-stone-600 dark:text-stone-300 transition-colors cursor-pointer">
              <CalendarClock className="w-4 h-4" /> Follow-up
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              ['Lifetime value', formatINR(customer.lifetimeValue)],
              ['Orders', String(customer.orderCount)],
              ['Last order', lastSeen === 0 ? 'Today' : `${lastSeen}d ago`],
              ['Avg. order', formatINR(customer.avgOrderValue)],
              ['Favourite', customer.favouriteCategory],
              ['Pending dues', customer.pendingAmount ? formatINR(customer.pendingAmount) : '—'],
            ].map(([label, value]) => (
              <div key={label} className="bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-xl p-2.5">
                <p className="text-[9px] uppercase tracking-wider font-bold text-stone-500">{label}</p>
                <p className={`text-xs font-black truncate ${label === 'Pending dues' && customer.pendingAmount ? 'text-rose-600' : 'text-stone-900 dark:text-white'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <section className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-stone-400" /> {customer.phone}</p>
            <p className="flex items-center gap-2 break-all"><Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" /> {customer.email}</p>
            <p className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" /> {customer.address}</p>
          </section>

          {/* Tags */}
          <section>
            <h3 className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-stone-500 mb-2">
              <Tag className="w-3.5 h-3.5" /> Tags
            </h3>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {customer.tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full bg-[#2271b1]/10 text-[#2271b1] dark:text-sky-400 text-[10px] font-bold">
                  {t}
                  <button type="button" aria-label={`Remove ${t}`} onClick={() => onUpdateTags(customer.key, customer.tags.filter((x) => x !== t))} className="hover:text-rose-600 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {customer.tags.length === 0 && <span className="text-[11px] text-stone-400">No tags yet</span>}
            </div>
            <div className="flex gap-1.5">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTag(tagInput)} placeholder="Add a tag…" className={inputClass} />
              <button type="button" onClick={() => addTag(tagInput)} className="px-2.5 rounded-lg bg-stone-900 dark:bg-stone-700 text-white cursor-pointer" aria-label="Add tag">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {SUGGESTED_TAGS.filter((t) => !customer.tags.includes(t)).map((t) => (
                <button key={t} type="button" onClick={() => addTag(t)} className="px-2 py-0.5 rounded-full border border-dashed border-stone-300 dark:border-stone-700 text-[10px] text-stone-500 hover:border-[#F5821F] hover:text-[#F5821F] cursor-pointer">
                  + {t}
                </button>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section>
            <h3 className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-stone-500 mb-2">
              <StickyNote className="w-3.5 h-3.5" /> Notes &amp; activity
            </h3>
            <div className="flex gap-1.5 mb-3">
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={2} placeholder="Log a call, preference or promise…" className={`${inputClass} resize-none`} />
              <button type="button" onClick={submitNote} disabled={!noteText.trim()} className="px-3 rounded-lg bg-[#F5821F] disabled:opacity-40 text-black cursor-pointer" aria-label="Save note">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <ol className="relative border-l border-stone-200 dark:border-[#2a2622] ml-1.5 space-y-3">
              {customer.notes.map((n) => (
                <li key={n.id} className="pl-4 relative">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#F5821F]" />
                  <p className="text-xs text-stone-800 dark:text-stone-200 whitespace-pre-wrap">{n.text}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    {n.author} · {new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </li>
              ))}
              {customer.orders.map((o) => (
                <li key={o.id} className="pl-4 relative">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#2271b1]" />
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      <ShoppingBag className="w-3 h-3 text-stone-400" /> {o.orderNumber}
                    </p>
                    <span className="text-xs font-black text-stone-900 dark:text-white">{formatINR(o.totalAmount)}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1">{o.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    {o.date} · <span className={`font-bold ${STATUS_COLORS[o.status] ?? ''}`}>{o.status}</span> · {o.paymentStatus}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </aside>
    </div>
  );
}
