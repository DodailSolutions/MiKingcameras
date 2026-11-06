'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Package,
  ShieldCheck,
  MapPin,
  ExternalLink,
  RotateCcw,
  MessageSquare,
  Lock,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';
import { RAGResponse, AuthenticatedCustomer } from '@/lib/rag-engine';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  data?: RAGResponse;
}

const PUBLIC_SUGGESTIONS = [
  '📸 Cameras under ₹50,000',
  '🔍 Canon & Sony Lenses',
  '🛡️ 1-Year Warranty Coverage',
  '📍 Showroom Address & Hours',
  '⚙️ 25-Point Inspection Details',
];

/**
 * Clean formatter that converts any residual markdown bold into styled JSX
 */
function FormattedMessageText({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Clean out any lingering asterisks and split by bold sections
        const parts = line.split(/(\*\*[^*]+\*\*)/g);

        return (
          <p key={lineIdx}>
            {parts.map((part, partIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={partIdx} className="font-bold text-stone-900 dark:text-white">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={partIdx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

export function AIAssistantWidget() {
  const pathname = usePathname();
  const isProductPage = pathname?.startsWith('/product');
  const [isOpen, setIsOpen] = useState(false);
  const [customer, setCustomer] = useState<AuthenticatedCustomer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load authenticated customer session for privacy-gated assistance
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mikings_customer_session');
      if (stored) {
        const session = JSON.parse(stored);
        const storedOrders = localStorage.getItem('mikings_customer_orders');
        const orders = storedOrders ? JSON.parse(storedOrders) : [];
        setCustomer({
          id: session.id,
          name: session.name,
          email: session.email,
          phone: session.phone,
          orders,
        });

        setMessages([
          {
            id: 'welcome-auth',
            sender: 'assistant',
            text: `Hello ${session.name}! How can I help you today? You can ask me about our camera collection, check your recent orders, or learn about our store warranty.`,
            timestamp: 'Just now',
          },
        ]);
      } else {
        setMessages([
          {
            id: 'welcome-guest',
            sender: 'assistant',
            text: "Hello! Welcome to Mi King's Cameras.\n\nI can assist you with:\n• Finding cameras, lenses, and gear in our Hyderabad catalog\n• 1-Year Store Warranty & 25-Point inspection details\n• Showroom location at Pillar 103, Mir Alam Tank & store hours",
            timestamp: 'Just now',
          },
        ]);
      }
    } catch {
      // Fallback guest welcome
      setMessages([
        {
          id: 'welcome-default',
          sender: 'assistant',
          text: "Hello! Welcome to Mi King's Cameras. Feel free to ask about our camera catalog, lenses, store warranty, or showroom location.",
          timestamp: 'Just now',
        },
      ]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/rag-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          user: customer,
        }),
      });

      const ragResult: RAGResponse = await res.json();

      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: ragResult.answer || "I'm here to help with camera gear, warranties, and showroom visits.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: ragResult,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          text: "I couldn't reach the store catalog right now. Please reach out to our team on WhatsApp at +91 90322 85420.",
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Sleek Floating Action Button (Always visible on mobile & desktop, elevated above bottom docks) */}
      <div className={`fixed ${isProductPage ? 'bottom-32' : 'bottom-20'} md:bottom-8 left-4 sm:left-5 z-40 group block`}>
        <motion.button
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-13 h-13 sm:w-14 sm:h-14 bg-stone-900 dark:bg-stone-800 hover:bg-black text-white rounded-full shadow-xl flex items-center justify-center transition-all cursor-pointer border border-[#F5821F]/40 shadow-[#F5821F]/10"
          aria-label="AI Store Assistant"
        >
          <Bot className="w-6 h-6 text-[#F5821F]" />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-stone-900 rounded-full flex items-center justify-center">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          </span>
        </motion.button>

        {/* Hover Tooltip (Desktop) */}
        <div className="hidden md:block absolute left-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-stone-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-lg border border-stone-800">
          AI Store Assistant
        </div>
      </div>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`fixed ${isProductPage ? 'bottom-36' : 'bottom-24'} md:bottom-24 left-3 sm:left-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[80vh] flex flex-col bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#2a2621] rounded-3xl shadow-2xl overflow-hidden text-stone-900 dark:text-stone-100`}
          >
            {/* Header (Modest, Clean E-Commerce Style) */}
            <div className="bg-stone-900 text-white p-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#F5821F] text-black flex items-center justify-center font-black shadow-sm">
                  <Bot className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white leading-tight">
                      Store Assistant
                    </h3>
                    <span className="text-[9px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {customer ? `Signed in as ${customer.name}` : 'Mi King’s DSLR Camera Shop'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Topic Chips (Modest Public Queries Only) */}
            <div className="bg-stone-50 dark:bg-[#1a1714] border-b border-stone-200 dark:border-stone-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
              {PUBLIC_SUGGESTIONS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="shrink-0 bg-white dark:bg-[#221f1a] border border-stone-200 dark:border-stone-700 hover:border-[#F5821F] text-stone-700 dark:text-stone-300 px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#F5821F] text-black font-medium rounded-br-xs shadow-sm'
                        : 'bg-stone-100 dark:bg-[#1e1b17] text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-bl-xs'
                    }`}
                  >
                    <FormattedMessageText content={msg.text} />

                    {/* Matched Product Cards (Clean Amazon/Myntra Item Cards) */}
                    {msg.data?.matchedProducts && msg.data.matchedProducts.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700/60 space-y-1.5">
                        <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                          Available in Catalog:
                        </span>
                        <div className="space-y-1.5">
                          {msg.data.matchedProducts.map((p) => (
                            <Link
                              key={p.id}
                              href={`/product/${p.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#25221d] border border-stone-200 dark:border-stone-700 hover:border-[#F5821F] transition-all group"
                            >
                              <div className="truncate mr-2">
                                <p className="font-semibold text-stone-900 dark:text-white truncate group-hover:text-[#F5821F]">
                                  {p.name}
                                </p>
                                <span className="text-[10px] text-stone-500 font-medium">
                                  {p.condition}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-xs font-bold text-[#F5821F]">
                                  ₹{p.price.toLocaleString('en-IN')}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#F5821F] transition-transform" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Action Button (Clean Modest Link) */}
                    {msg.data?.suggestedAction && (
                      <div className="mt-3">
                        {msg.data.suggestedAction.type === 'whatsapp' ? (
                          <a
                            href={msg.data.suggestedAction.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-[11px] px-3 py-1.5 rounded-xl shadow-sm transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {msg.data.suggestedAction.label}
                          </a>
                        ) : (
                          <Link
                            href={msg.data.suggestedAction.href}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1.5 bg-stone-900 dark:bg-stone-100 hover:bg-[#F5821F] text-white dark:text-black font-semibold text-[11px] px-3 py-1.5 rounded-xl shadow-sm transition-colors"
                          >
                            {msg.data.suggestedAction.href === '/account' ? (
                              <Lock className="w-3.5 h-3.5" />
                            ) : (
                              <Package className="w-3.5 h-3.5" />
                            )}
                            {msg.data.suggestedAction.label}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-stone-400 text-xs py-2">
                  <div className="w-3.5 h-3.5 border-2 border-[#F5821F] border-t-transparent rounded-full animate-spin" />
                  <span className="italic">Checking store catalog...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white dark:bg-[#151311] border-t border-stone-200 dark:border-stone-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about cameras, lenses, warranty..."
                  className="flex-1 bg-stone-100 dark:bg-[#1f1c18] border border-stone-200 dark:border-stone-700 rounded-2xl px-3.5 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#F5821F]"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="w-9 h-9 rounded-2xl bg-[#F5821F] hover:bg-[#e07416] disabled:opacity-40 text-black flex items-center justify-center font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
                  aria-label="Send inquiry"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-stone-400 mt-2 px-1">
                <span>Mi King’s Store Assistant</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  ● Verified Hyderabad Hub
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
