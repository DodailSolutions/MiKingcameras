'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, Phone, Trash2, IndianRupee, Inbox } from 'lucide-react';
import type { Lead, LeadStage } from '@/lib/admin/crm';
import { LEAD_STAGES, daysSince, phoneDigits } from '@/lib/admin/crm';
import { formatINR, cn } from '@/lib/utils';
import { Avatar } from './ui';

const STAGE_ACCENT: Record<LeadStage, string> = {
  New: 'bg-sky-500',
  Contacted: 'bg-indigo-500',
  Quoted: 'bg-[#F5821F]',
  Won: 'bg-emerald-500',
  Lost: 'bg-stone-400',
};

interface Props {
  leads: Lead[];
  onMove: (id: string, stage: LeadStage) => void;
  onDelete: (id: string) => void;
}

export function LeadsPipeline({ leads, onMove, onDelete }: Props) {
  const [dragOver, setDragOver] = useState<LeadStage | null>(null);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
      {LEAD_STAGES.map((stage, stageIdx) => {
        const stageLeads = leads.filter((l) => l.stage === stage);
        const total = stageLeads.reduce((s, l) => s + l.budget, 0);
        return (
          <section
            key={stage}
            aria-label={`${stage} leads`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(stage);
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData('text/plain');
              if (id) onMove(id, stage);
              setDragOver(null);
            }}
            className={cn(
              'snap-start shrink-0 w-[260px] rounded-2xl border bg-stone-100/70 dark:bg-[#12100e] flex flex-col max-h-[640px] transition-colors',
              dragOver === stage
                ? 'border-[#F5821F] bg-[#F5821F]/5'
                : 'border-stone-200 dark:border-[#24211d]'
            )}
          >
            <header className="px-3 py-2.5 border-b border-stone-200 dark:border-[#24211d]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-black text-stone-800 dark:text-stone-100">
                  <span className={cn('w-2 h-2 rounded-full', STAGE_ACCENT[stage])} />
                  {stage}
                  <span className="text-[10px] font-bold text-stone-500 bg-white dark:bg-[#1f1c18] px-1.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </span>
                <span className="text-[10px] font-bold text-stone-500">{formatINR(total)}</span>
              </div>
            </header>

            <div className="p-2 space-y-2 overflow-y-auto flex-1">
              {stageLeads.length === 0 && (
                <div className="py-8 flex flex-col items-center text-[11px] text-stone-400 gap-1 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl">
                  <Inbox className="w-4 h-4" />
                  Drop leads here
                </div>
              )}
              {stageLeads.map((lead) => {
                const age = daysSince(new Date(lead.createdAt));
                return (
                  <article
                    key={lead.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', lead.id)}
                    className="group bg-white dark:bg-[#1a1815] border border-stone-200 dark:border-[#2a2622] rounded-xl p-3 shadow-xs hover:shadow-md hover:border-[#F5821F]/50 cursor-grab active:cursor-grabbing transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <Avatar name={lead.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-stone-900 dark:text-white truncate">{lead.name}</p>
                        <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2 leading-snug">{lead.interest}</p>
                      </div>
                    </div>
                    {lead.note && (
                      <p className="mt-2 text-[10px] text-stone-500 italic line-clamp-2">“{lead.note}”</p>
                    )}
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-0.5 font-black text-stone-800 dark:text-stone-200">
                        <IndianRupee className="w-3 h-3" />
                        {lead.budget.toLocaleString('en-IN')}
                      </span>
                      <span className="text-stone-500">
                        {lead.source} · {age === 0 ? 'today' : `${age}d`}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-stone-100 dark:border-[#2a2622] flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <a href={`https://wa.me/${phoneDigits(lead.phone)}`} target="_blank" rel="noreferrer" className="p-1 rounded-md text-emerald-600 hover:bg-emerald-500/10" aria-label={`WhatsApp ${lead.name}`}>
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <a href={`tel:+${phoneDigits(lead.phone)}`} className="p-1 rounded-md text-[#2271b1] hover:bg-[#2271b1]/10" aria-label={`Call ${lead.name}`}>
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button type="button" onClick={() => onDelete(lead.id)} className="p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer" aria-label={`Delete ${lead.name}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {/* Keyboard / touch friendly stage moves */}
                      <div className="flex items-center gap-0.5">
                        <button type="button" disabled={stageIdx === 0} onClick={() => onMove(lead.id, LEAD_STAGES[stageIdx - 1])} className="p-1 rounded-md text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-25 cursor-pointer" aria-label="Move to previous stage">
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" disabled={stageIdx === LEAD_STAGES.length - 1} onClick={() => onMove(lead.id, LEAD_STAGES[stageIdx + 1])} className="p-1 rounded-md text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-25 cursor-pointer" aria-label="Move to next stage">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
