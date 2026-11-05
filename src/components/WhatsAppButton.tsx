'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Camera,
  Aperture,
  Video,
  FileText,
  Clock,
  MapPin,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Send,
  ShieldCheck,
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  department: 'cameras' | 'lenses' | 'video' | 'billing';
  phone: string;
  displayPhone: string;
  status: string;
  replyTime: string;
  avatarBg: string;
  icon: React.ElementType;
  specialties: string[];
  defaultMessage: string;
}

const AGENTS: Agent[] = [
  {
    id: 'idrees',
    name: 'Mohd Idrees',
    role: 'Founder & Camera Specialist',
    department: 'cameras',
    phone: '916305875376',
    displayPhone: '+91 63058 75376',
    status: 'Online',
    replyTime: '~2 mins',
    avatarBg: 'bg-gradient-to-tr from-[#F5821F] to-amber-500',
    icon: Camera,
    specialties: ['DSLR & Mirrorless Bodies', 'Pro Kits', 'Equipment Trade-ins'],
    defaultMessage: 'Hello Mohd Idrees! I am looking for advice on camera bodies and flagship kits from Mi King’s Cameras.',
  },
  {
    id: 'shoeb',
    name: 'Mohd Shoeb',
    role: 'Master Optics & Lens Technician',
    department: 'lenses',
    phone: '919032285420',
    displayPhone: '+91 90322 85420',
    status: 'Online',
    replyTime: '~5 mins',
    avatarBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500',
    icon: Aperture,
    specialties: ['Prime & Telephoto Lenses', 'Mount Compatibility', '25-Point Element Check'],
    defaultMessage: 'Hi Mohd Shoeb! I need technical guidance on camera lenses, glass sharpness, and mount compatibility.',
  },
  {
    id: 'zameer',
    name: 'Mohd Zameer',
    role: 'Commercial Video, Gimbals & Drones',
    department: 'video',
    phone: '919032285420',
    displayPhone: '+91 90322 85420',
    status: 'Available',
    replyTime: '~10 mins',
    avatarBg: 'bg-gradient-to-tr from-blue-600 to-indigo-500',
    icon: Video,
    specialties: ['DJI Drones', 'Ronin Stabilizers', 'Wireless Mic Systems', 'Studio Lighting'],
    defaultMessage: 'Hi Mohd Zameer! I would like to inquire about drones, gimbals, or commercial video accessories.',
  },
  {
    id: 'support',
    name: 'Orders & GST Invoicing Desk',
    role: 'Store Logistics & Customer Care',
    department: 'billing',
    phone: '916305875376',
    displayPhone: '+91 63058 75376',
    status: 'Open (10 AM - 9:30 PM)',
    replyTime: 'Instant',
    avatarBg: 'bg-gradient-to-tr from-violet-600 to-purple-500',
    icon: FileText,
    specialties: ['Live AWB Tracking', '18% GST Tax Invoices', '1-Year Warranty Claims'],
    defaultMessage: 'Hello Mi King’s Support Desk! I am checking on my order status, courier AWB, or GST invoice.',
  },
];

const QUICK_PROMPTS = [
  { label: '📸 Camera Body Inquiry', agentId: 'idrees', text: 'Hi Mohd Idrees, what camera bodies are currently available in stock?' },
  { label: '🔍 Lens Compatibility', agentId: 'shoeb', text: 'Hi Mohd Shoeb, will this lens mount fit my camera?' },
  { label: '🚚 Track My Courier AWB', agentId: 'support', text: 'Hi Support, could you please give me the live dispatch status of my order?' },
  { label: '📄 18% GST Tax Invoice', agentId: 'support', text: 'Hi Support Desk, I need a GST invoice copy for my recent equipment purchase.' },
  { label: '🤝 Sell / Exchange Used Gear', agentId: 'idrees', text: 'Hi Mohd Idrees, I want to sell or exchange my pre-owned camera equipment for an upgrade.' },
];

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<'all' | 'cameras' | 'lenses' | 'video' | 'billing'>('all');
  const [customQuery, setCustomQuery] = useState('');

  const filteredAgents = AGENTS.filter(
    (agent) => selectedDept === 'all' || agent.department === selectedDept
  );

  const openWhatsApp = (phone: string, text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const handlePromptClick = (prompt: (typeof QUICK_PROMPTS)[0]) => {
    const targetAgent = AGENTS.find((a) => a.id === prompt.agentId) || AGENTS[0];
    openWhatsApp(targetAgent.phone, prompt.text);
  };

  return (
    <>
      {/* Floating Launcher Pill / Button */}
      <div className="fixed bottom-20 md:bottom-8 right-5 z-40">
        <motion.button
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 md:px-4 md:py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all cursor-pointer border-2 border-white/20"
          aria-label="Multi-Agent WhatsApp Support"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6 fill-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center">
              <span className="w-2 h-2 bg-emerald-700 rounded-full animate-ping" />
            </span>
          </div>

          <div className="hidden md:flex flex-col text-left leading-tight">
            <span className="text-[11px] font-black uppercase tracking-wider text-black/80 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-200" />
              Multi-Agent Live Support
            </span>
            <span className="text-xs font-bold text-white">Chat with Store Specialists</span>
          </div>

          <span className="bg-black/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full ml-1">
            4 Online
          </span>
        </motion.button>
      </div>

      {/* Multi-Agent Concierge Modal Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 md:bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[85vh] flex flex-col bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl shadow-2xl overflow-hidden text-stone-900 dark:text-stone-100"
          >
            {/* WhatsApp Branded Header */}
            <div className="bg-[#075E54] dark:bg-[#0b3d36] text-white p-4 sm:p-5 relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-200">
                      Hyderabad Showroom Desk
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-0.5">
                    Mi King&apos;s Multi-Agent Concierge
                  </h3>
                  <p className="text-xs text-white/80 mt-0.5 leading-snug">
                    Connect directly with specialized founders and department leads on WhatsApp.
                  </p>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Close concierge"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Department Filter Pills */}
              <div className="flex items-center gap-1.5 mt-3 overflow-x-auto scrollbar-none pb-1">
                {[
                  { id: 'all', label: 'All 4 Agents' },
                  { id: 'cameras', label: 'Cameras' },
                  { id: 'lenses', label: 'Lenses' },
                  { id: 'video', label: 'Drones & Video' },
                  { id: 'billing', label: 'Orders & GST' },
                ].map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDept(dept.id as any)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                      selectedDept === dept.id
                        ? 'bg-white text-[#075E54] shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white/90'
                    }`}
                  >
                    {dept.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Agent List */}
            <div className="p-3 sm:p-4 space-y-3 overflow-y-auto max-h-[380px] scrollbar-thin">
              {filteredAgents.map((agent) => {
                const IconComponent = agent.icon;
                return (
                  <div
                    key={agent.id}
                    className="p-3.5 rounded-2xl border border-stone-200/80 dark:border-[#2a2621] bg-stone-50/70 dark:bg-[#12110f] hover:border-[#25D366] dark:hover:border-[#25D366] transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar Icon */}
                      <div
                        className={`w-11 h-11 rounded-2xl ${agent.avatarBg} text-white flex items-center justify-center shrink-0 shadow-sm`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-black text-xs sm:text-sm text-stone-900 dark:text-white truncate">
                            {agent.name}
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {agent.status}
                          </span>
                        </div>

                        <p className="text-[11px] font-bold text-[#F5821F] mt-0.5">{agent.role}</p>

                        {/* Specialties Tags */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {agent.specialties.map((spec, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-semibold bg-white dark:bg-[#1e1b18] border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 px-1.5 py-0.5 rounded"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>

                        {/* Direct Action */}
                        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-[#24211d]">
                          <span className="text-[10px] text-stone-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-400" />
                            Avg response {agent.replyTime}
                          </span>

                          <button
                            onClick={() => openWhatsApp(agent.phone, agent.defaultMessage)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs transition-transform active:scale-95 cursor-pointer shadow-sm"
                          >
                            <span>Chat</span>
                            <Send className="w-3 h-3 fill-black" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Quick Topic Chips */}
              <div className="pt-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block mb-1.5">
                  ⚡ Quick Department Inquiries:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(prompt)}
                      className="text-[11px] font-medium text-left bg-stone-100 hover:bg-[#F5821F]/15 hover:text-[#F5821F] dark:bg-[#1f1c18] dark:hover:bg-[#F5821F]/20 text-stone-700 dark:text-stone-300 px-2.5 py-1 rounded-lg border border-stone-200/60 dark:border-stone-800 transition-colors cursor-pointer"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer / Store Address Notice */}
            <div className="bg-stone-50 dark:bg-[#110f0d] border-t border-stone-200 dark:border-[#24211d] p-3 text-[11px] text-stone-500 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F5821F] shrink-0" />
                <span className="truncate">Pillar 103, Bank Colony, Hyderabad</span>
              </div>
              <span className="font-bold text-stone-700 dark:text-stone-300 shrink-0">Open 7 Days</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
