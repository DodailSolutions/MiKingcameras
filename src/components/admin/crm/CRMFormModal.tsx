'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { FollowUp, FollowUpType, Lead, LeadSource, Priority } from '@/lib/admin/crm';
import { LEAD_SOURCES, isoDate, uid } from '@/lib/admin/crm';
import { inputClass } from './ui';

export type CRMFormState =
  | { kind: 'lead' }
  | { kind: 'followUp'; contactName?: string; phone?: string };

interface Props {
  state: CRMFormState | null;
  onClose: () => void;
  onSaveLead: (lead: Lead) => void;
  onSaveFollowUp: (followUp: FollowUp) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">{label}</span>
      {children}
    </label>
  );
}

export function CRMFormModal({ state, onClose, onSaveLead, onSaveFollowUp }: Props) {
  if (!state) return null;
  // Remount per open so fields reset cleanly.
  return <FormBody key={JSON.stringify(state)} state={state} onClose={onClose} onSaveLead={onSaveLead} onSaveFollowUp={onSaveFollowUp} />;
}

function FormBody({ state, onClose, onSaveLead, onSaveFollowUp }: Props & { state: CRMFormState }) {
  const isLead = state.kind === 'lead';
  const [name, setName] = useState(state.kind === 'followUp' ? state.contactName ?? '' : '');
  const [phone, setPhone] = useState(state.kind === 'followUp' ? state.phone ?? '' : '');
  const [interest, setInterest] = useState('');
  const [budget, setBudget] = useState('');
  const [source, setSource] = useState<LeadSource>('WhatsApp');
  const [note, setNote] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<FollowUpType>('WhatsApp');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState(isoDate(1));
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Name is required.');
    if (phone && phone.replace(/\D/g, '').length < 10) return setError('Enter a valid 10-digit phone number.');

    if (isLead) {
      if (!interest.trim()) return setError('Tell us what the lead is interested in.');
      onSaveLead({
        id: uid('lead'),
        name: name.trim(),
        phone: phone.trim(),
        interest: interest.trim(),
        budget: Math.max(0, Number(budget) || 0),
        source,
        stage: 'New',
        createdAt: isoDate(0),
        note: note.trim() || undefined,
      });
    } else {
      if (!title.trim()) return setError('Add a short task title.');
      onSaveFollowUp({
        id: uid('fu'),
        title: title.trim(),
        contactName: name.trim(),
        phone: phone.trim() || undefined,
        type,
        priority,
        dueDate,
        done: false,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <form onSubmit={submit} className="relative w-full max-w-md bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#24211d] rounded-2xl shadow-2xl animate-[popIn_.15s_ease-out]">
        <header className="flex items-center justify-between px-5 py-4 border-b border-stone-200 dark:border-[#24211d]">
          <h2 className="text-sm font-black text-stone-900 dark:text-white">{isLead ? 'Add new lead' : 'Schedule follow-up'}</h2>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500" aria-label="Close dialog">
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="p-5 space-y-3">
          {!isLead && (
            <Field label="Task">
              <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Share EMI plans for Sony A7 IV" className={inputClass} />
            </Field>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label={isLead ? 'Name' : 'Contact'}>
              <input autoFocus={isLead} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={inputClass} />
            </Field>
            <Field label="Phone">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98xxx xxxxx" inputMode="tel" className={inputClass} />
            </Field>
          </div>

          {isLead ? (
            <>
              <Field label="Interested in">
                <input value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="e.g. Canon R50 with 18-45mm kit" className={inputClass} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Budget (₹)">
                  <input value={budget} onChange={(e) => setBudget(e.target.value)} inputMode="numeric" placeholder="75000" className={inputClass} />
                </Field>
                <Field label="Source">
                  <select value={source} onChange={(e) => setSource(e.target.value as LeadSource)} className={inputClass}>
                    {LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Note">
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Optional context" className={`${inputClass} resize-none`} />
              </Field>
            </>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <Field label="Channel">
                <select value={type} onChange={(e) => setType(e.target.value as FollowUpType)} className={inputClass}>
                  {(['WhatsApp', 'Call', 'Email', 'Visit'] as FollowUpType[]).map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Priority">
                <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={inputClass}>
                  {(['High', 'Medium', 'Low'] as Priority[]).map((p) => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Due">
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
              </Field>
            </div>
          )}

          {error && <p className="text-[11px] font-bold text-rose-600" role="alert">{error}</p>}
        </div>

        <footer className="flex justify-end gap-2 px-5 py-3 border-t border-stone-200 dark:border-[#24211d] bg-stone-50 dark:bg-[#12100e] rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-3.5 py-2 rounded-lg text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 cursor-pointer">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-[#F5821F] hover:bg-[#E0741A] text-black text-xs font-extrabold cursor-pointer">
            {isLead ? 'Add lead' : 'Schedule'}
          </button>
        </footer>
      </form>
    </div>
  );
}
