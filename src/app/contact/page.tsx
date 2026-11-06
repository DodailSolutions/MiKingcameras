'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
} from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    equipment: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#F5821F] uppercase tracking-wider">
          Visit or Inquire
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
          Contact Mi King&apos;s DSLR Camera Shop
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          Visit our showroom in Hyderabad to test cameras and lenses hands-on, or connect directly with our experts via phone and WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Store Details & Map */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm">
            <h2 className="text-base font-black text-stone-900 dark:text-white">
              Hyderabad Flagship Showroom
            </h2>

            <div className="space-y-4 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F5821F]/10 text-[#F5821F] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-white block">Physical Store Address</span>
                  <p className="mt-0.5 leading-relaxed text-stone-500 dark:text-stone-400">
                    Pillar No. 103, Bank Colony, Near Tadbun, Mir Alam Tank, Bahadurpura, Hyderabad, Telangana 500064
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-white block">Call for Inquiries &amp; Stock</span>
                  <a href="tel:+919032285420" className="text-[#F5821F] hover:underline font-extrabold text-sm block mt-0.5">
                    +91 90322 85420
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-white block">Direct WhatsApp Hotline</span>
                  <a
                    href="https://wa.me/916305875376"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#25D366] hover:underline font-extrabold text-sm block mt-0.5"
                  >
                    +91 63058 75376 (Chat with Mohd Idrees)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F5821F]/10 text-[#F5821F] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-white block">Email Support</span>
                  <a href="mailto:mikingsdslrshop@gmail.com" className="text-stone-500 dark:text-stone-400 hover:text-[#F5821F] block mt-0.5">
                    mikingsdslrshop@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-stone-100 dark:border-[#2a2621]">
                <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-white block">Showroom Timings</span>
                  <p className="text-stone-500 dark:text-stone-400 mt-0.5">
                    Monday to Saturday: 10:30 AM &ndash; 9:00 PM &middot; Sunday: 11:00 AM &ndash; 8:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Message Form */}
        <div className="lg:col-span-7 bg-white dark:bg-[#181613] border border-stone-200 dark:border-[#2a2621] rounded-3xl p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-stone-900 dark:text-white">
                Message Sent to Store Team!
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                Thank you, {form.name}. Mohd Idrees and our Hyderabad specialists will review your equipment inquiry and call or WhatsApp you at {form.phone}.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2 rounded-xl bg-[#F5821F] text-black font-extrabold text-xs cursor-pointer hover:bg-[#E0741A] transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-base font-black text-stone-900 dark:text-white">
                Send an Equipment Inquiry
              </h2>
              <p className="text-xs text-stone-500">
                Looking for a specific camera model, checking shutter count, or want to schedule an in-store demo?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-600 dark:text-stone-300">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-2.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-600 dark:text-stone-300">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-2.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-600 dark:text-stone-300">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-2.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-600 dark:text-stone-300">Camera / Lens Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Sony A7 IV or Canon 24-70mm"
                    value={form.equipment}
                    onChange={(e) => setForm({ ...form, equipment: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-2.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-semibold text-stone-600 dark:text-stone-300">Your Message / Query *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you are looking for, trade-in requests, or questions..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#110f0d] border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-2.5 text-stone-900 dark:text-white focus:outline-none focus:border-[#F5821F]"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#F5821F] hover:bg-[#E0741A] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Inquiry to Store Team
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
