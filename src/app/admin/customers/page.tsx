'use client';

import React, { Suspense, useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Contact,
  Users,
  Repeat,
  Wallet,
  Target,
  CalendarClock,
  UserPlus,
  Download,
  CheckCircle2,
  KanbanSquare,
  ListTodo,
} from 'lucide-react';
import { loadAdminOrders, type CustomerOrderRecord } from '@/data/admin-orders';
import {
  STORAGE_KEYS,
  buildCustomers,
  downloadCSV,
  isoDate,
  readStore,
  seedFollowUps,
  seedLeads,
  writeStore,
  type CRMCustomer,
  type CRMNote,
  type CRMProfile,
  type FollowUp,
  type Lead,
  type LeadStage,
} from '@/lib/admin/crm';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { formatINRCompact, cn } from '@/lib/utils';
import { KpiCard, cardClass } from '@/components/admin/crm/ui';
import { CustomersTable } from '@/components/admin/crm/CustomersTable';
import { CustomerDrawer } from '@/components/admin/crm/CustomerDrawer';
import { LeadsPipeline } from '@/components/admin/crm/LeadsPipeline';
import { FollowUpsPanel } from '@/components/admin/crm/FollowUpsPanel';
import { CRMFormModal, type CRMFormState } from '@/components/admin/crm/CRMFormModal';

type Tab = 'customers' | 'leads' | 'followups';
const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'leads', label: 'Leads pipeline', icon: KanbanSquare },
  { id: 'followups', label: 'Follow-ups', icon: ListTodo },
];

function CRMWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { admin } = useAdminAuth();
  const tabParam = searchParams.get('tab') as Tab | null;
  const tab: Tab = TABS.some((t) => t.id === tabParam) ? (tabParam as Tab) : 'customers';

  // Admin pages render only on the client (after auth), so storage can seed state directly.
  const [orders] = useState<CustomerOrderRecord[]>(loadAdminOrders);
  const [profiles, setProfiles] = useState<Record<string, CRMProfile>>(() => readStore(STORAGE_KEYS.profiles, {}));
  const [leads, setLeads] = useState<Lead[]>(() => readStore(STORAGE_KEYS.leads, seedLeads()));
  const [followUps, setFollowUps] = useState<FollowUp[]>(() => readStore(STORAGE_KEYS.followUps, seedFollowUps()));
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [form, setForm] = useState<CRMFormState | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const customers = useMemo(() => buildCustomers(orders, profiles), [orders, profiles]);
  const openCustomer = customers.find((c) => c.key === openKey) ?? null;

  // ---- Persistence wrappers -------------------------------------------------
  const saveProfiles = (next: Record<string, CRMProfile>) => {
    setProfiles(next);
    writeStore(STORAGE_KEYS.profiles, next);
  };
  const saveLeads = (next: Lead[]) => {
    setLeads(next);
    writeStore(STORAGE_KEYS.leads, next);
  };
  const saveFollowUps = (next: FollowUp[]) => {
    setFollowUps(next);
    writeStore(STORAGE_KEYS.followUps, next);
  };

  const profileOf = (key: string): CRMProfile => profiles[key] ?? { tags: [], notes: [] };

  const handleUpdateTags = (key: string, tags: string[]) =>
    saveProfiles({ ...profiles, [key]: { ...profileOf(key), tags } });

  const handleAddNote = (key: string, note: CRMNote) => {
    saveProfiles({ ...profiles, [key]: { ...profileOf(key), notes: [note, ...profileOf(key).notes] } });
    notify('Note saved to customer timeline');
  };

  const handleMoveLead = (id: string, stage: LeadStage) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.stage === stage) return;
    saveLeads(leads.map((l) => (l.id === id ? { ...l, stage } : l)));
    notify(`${lead.name} moved to ${stage}`);
  };

  const setTab = (next: Tab) => router.replace(next === 'customers' ? '/admin/customers' : `/admin/customers?tab=${next}`, { scroll: false });

  const exportCustomers = () => {
    downloadCSV(
      `mikings-customers-${isoDate(0)}.csv`,
      ['Name', 'Phone', 'Email', 'Segment', 'Orders', 'Lifetime Value', 'Pending', 'Last Order', 'Tags'],
      customers.map((c) => [
        c.name, c.phone, c.email, c.segment, c.orderCount, c.lifetimeValue, c.pendingAmount,
        c.lastOrderAt.toLocaleDateString('en-IN'), c.tags.join('; '),
      ])
    );
    notify(`Exported ${customers.length} customers`);
  };

  // ---- KPIs -----------------------------------------------------------------
  const repeatRate = customers.length
    ? Math.round((customers.filter((c) => c.orderCount > 1).length / customers.length) * 100)
    : 0;
  const totalLtv = customers.reduce((s, c) => s + c.lifetimeValue, 0);
  const openLeads = leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost');
  const closed = leads.filter((l) => l.stage === 'Won' || l.stage === 'Lost');
  const winRate = closed.length ? Math.round((leads.filter((l) => l.stage === 'Won').length / closed.length) * 100) : 0;
  const today = isoDate(0);
  const dueCount = followUps.filter((f) => !f.done && f.dueDate <= today).length;

  const tabCounts: Record<Tab, number> = {
    customers: customers.length,
    leads: openLeads.length,
    followups: dueCount,
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className={cn(cardClass, 'p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4')}>
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#2271b1]/15 text-[#2271b1]">
              <Contact className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-stone-900 dark:text-white">Customers &amp; CRM</h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Every buyer, enquiry and promised call-back in one place — segment customers, work the pipeline, never miss a follow-up.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setForm({ kind: 'followUp' })} className="px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <CalendarClock className="w-3.5 h-3.5" /> New follow-up
          </button>
          <button type="button" onClick={exportCustomers} className="px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button type="button" onClick={() => setForm({ kind: 'lead' })} className="px-4 py-2.5 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs flex items-center gap-2 shadow-md shadow-[#F5821F]/20 cursor-pointer">
            <UserPlus className="w-4 h-4" /> Add lead
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <KpiCard label="Customers" value={String(customers.length)} hint={`${customers.filter((c) => c.segment === 'VIP').length} VIP accounts`} icon={Users} accent="bg-[#2271b1]/15 text-[#2271b1]" />
        <KpiCard label="Repeat rate" value={`${repeatRate}%`} hint="bought more than once" icon={Repeat} accent="bg-emerald-500/15 text-emerald-600" />
        <KpiCard label="Lifetime revenue" value={formatINRCompact(totalLtv)} hint={`avg ${formatINRCompact(customers.length ? Math.round(totalLtv / customers.length) : 0)} / customer`} icon={Wallet} accent="bg-amber-500/15 text-amber-600" />
        <KpiCard label="Open pipeline" value={formatINRCompact(openLeads.reduce((s, l) => s + l.budget, 0))} hint={`${openLeads.length} leads · ${winRate}% win rate`} icon={Target} accent="bg-[#F5821F]/15 text-[#F5821F]" />
        <KpiCard label="Follow-ups due" value={String(dueCount)} hint={dueCount ? 'today or overdue' : 'all caught up'} icon={CalendarClock} accent={dueCount ? 'bg-rose-500/15 text-rose-600' : 'bg-stone-500/15 text-stone-500'} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-stone-200/80 dark:bg-[#1a1815] p-1 rounded-xl w-full sm:w-fit overflow-x-auto" role="tablist">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer',
              tab === id ? 'bg-white dark:bg-[#25221d] text-stone-900 dark:text-white shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
            )}
          >
            <Icon className="w-3.5 h-3.5 text-[#F5821F]" />
            {label}
            <span className={cn('text-[10px] px-1.5 rounded-full', id === 'followups' && tabCounts[id] ? 'bg-rose-500 text-white' : 'bg-stone-300/70 dark:bg-stone-700 text-stone-700 dark:text-stone-200')}>
              {tabCounts[id]}
            </span>
          </button>
        ))}
      </div>

      {tab === 'customers' && <CustomersTable customers={customers} onOpen={setOpenKey} />}
      {tab === 'leads' && (
        <LeadsPipeline
          leads={leads}
          onMove={handleMoveLead}
          onDelete={(id) => {
            saveLeads(leads.filter((l) => l.id !== id));
            notify('Lead removed');
          }}
        />
      )}
      {tab === 'followups' && (
        <FollowUpsPanel
          followUps={followUps}
          onToggle={(id) => saveFollowUps(followUps.map((f) => (f.id === id ? { ...f, done: !f.done } : f)))}
          onDelete={(id) => saveFollowUps(followUps.filter((f) => f.id !== id))}
        />
      )}

      <CustomerDrawer
        customer={openCustomer}
        author={admin?.name ?? 'Admin'}
        onClose={() => setOpenKey(null)}
        onUpdateTags={handleUpdateTags}
        onAddNote={handleAddNote}
        onScheduleFollowUp={(c: CRMCustomer) => setForm({ kind: 'followUp', contactName: c.name, phone: c.phone })}
      />

      <CRMFormModal
        state={form}
        onClose={() => setForm(null)}
        onSaveLead={(lead) => {
          saveLeads([lead, ...leads]);
          notify(`Lead “${lead.name}” added to pipeline`);
          setTab('leads');
        }}
        onSaveFollowUp={(fu) => {
          saveFollowUps([...followUps, fu]);
          notify(`Follow-up scheduled for ${fu.contactName}`);
        }}
      />

      {toast && (
        <div role="status" className="fixed bottom-5 right-5 z-[60] px-4 py-3 rounded-xl bg-stone-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-[popIn_.15s_ease-out]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<div className="h-40 rounded-2xl bg-stone-200/60 dark:bg-[#151311] animate-pulse" />}>
      <CRMWorkspace />
    </Suspense>
  );
}
