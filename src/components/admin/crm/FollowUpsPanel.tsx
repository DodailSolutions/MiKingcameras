'use client';

import React from 'react';
import { CheckCircle2, Circle, MessageCircle, Phone, Mail, MapPin, Trash2, CalendarCheck2, type LucideIcon } from 'lucide-react';
import type { FollowUp, FollowUpType } from '@/lib/admin/crm';
import { isoDate, phoneDigits } from '@/lib/admin/crm';
import { cn } from '@/lib/utils';
import { PriorityBadge, EmptyState, cardClass } from './ui';

const TYPE_ICON: Record<FollowUpType, LucideIcon> = {
  Call: Phone,
  WhatsApp: MessageCircle,
  Email: Mail,
  Visit: MapPin,
};

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 } as const;

interface Props {
  followUps: FollowUp[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function FollowUpsPanel({ followUps, onToggle, onDelete }: Props) {
  const today = isoDate(0);
  const sorted = [...followUps].sort(
    (a, b) => a.dueDate.localeCompare(b.dueDate) || PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );
  const open = sorted.filter((f) => !f.done);
  const groups: { title: string; tone: string; items: FollowUp[] }[] = [
    { title: 'Overdue', tone: 'text-rose-600', items: open.filter((f) => f.dueDate < today) },
    { title: 'Due today', tone: 'text-[#F5821F]', items: open.filter((f) => f.dueDate === today) },
    { title: 'Upcoming', tone: 'text-stone-600 dark:text-stone-300', items: open.filter((f) => f.dueDate > today) },
    { title: 'Completed', tone: 'text-emerald-600', items: sorted.filter((f) => f.done) },
  ];

  if (followUps.length === 0) {
    return (
      <div className={cardClass}>
        <EmptyState icon={CalendarCheck2} title="No follow-ups scheduled" hint="Schedule one from a customer profile or with the “New follow-up” button." />
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {groups.map((group) => (
        <section key={group.title} className={cn(cardClass, 'p-4')}>
          <h3 className={cn('text-[11px] font-black uppercase tracking-wider mb-3 flex items-center justify-between', group.tone)}>
            {group.title}
            <span className="text-stone-400 font-bold">{group.items.length}</span>
          </h3>
          {group.items.length === 0 ? (
            <p className="text-[11px] text-stone-400 py-3">Nothing here.</p>
          ) : (
            <ul className="divide-y divide-stone-100 dark:divide-[#24211d]">
              {group.items.map((f) => {
                const Icon = TYPE_ICON[f.type];
                const digits = f.phone ? phoneDigits(f.phone) : '';
                return (
                  <li key={f.id} className="py-2.5 flex items-start gap-3 group">
                    <button type="button" onClick={() => onToggle(f.id)} className="mt-0.5 cursor-pointer" aria-label={f.done ? 'Mark as open' : 'Mark as done'}>
                      {f.done ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-stone-300 hover:text-emerald-500" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={cn('text-xs font-bold text-stone-800 dark:text-stone-100', f.done && 'line-through text-stone-400 dark:text-stone-500')}>
                        {f.title}
                      </p>
                      <p className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <Icon className="w-3 h-3" /> {f.type} · {f.contactName} ·{' '}
                        {new Date(`${f.dueDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        <PriorityBadge priority={f.priority} />
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {digits && f.type === 'WhatsApp' && (
                        <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" className="p-1 rounded-md text-emerald-600 hover:bg-emerald-500/10" aria-label="Open WhatsApp">
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {digits && f.type !== 'WhatsApp' && (
                        <a href={`tel:+${digits}`} className="p-1 rounded-md text-[#2271b1] hover:bg-[#2271b1]/10" aria-label="Call">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button type="button" onClick={() => onDelete(f.id)} className="p-1 rounded-md text-stone-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer" aria-label="Delete follow-up">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
