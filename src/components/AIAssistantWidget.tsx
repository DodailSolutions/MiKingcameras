'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  HelpCircle,
  Clock,
  ArrowRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import Link from 'next/link';
import { RAGResponse } from '@/lib/rag-engine';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  data?: RAGResponse;
}

const QUICK_PROMPTS = [
  '📦 Track order MIK-982104',
  '📸 Best cameras under ₹50,000',
  '🛡️ What does 1-Year Warranty cover?',
  '📍 Showroom location & timings',
  '📄 How to get 18% GST Invoice?',
];

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "👋 **Hello! I'm your Mi King's AI Concierge.**\n\nAsk me anything about:\n• **Order status & courier tracking** (e.g. *MIK-982104*)\n• **DSLR & mirrorless camera recommendations**\n• **1-Year Store Warranty & 25-Point testing**\n• **Hyderabad showroom visit & timings**",
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        body: JSON.stringify({ prompt: textToSend }),
      });

      const ragResult: RAGResponse = await res.json();

      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: ragResult.answer || "I'm here to help with cameras, orders, and warranty inquiries.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: ragResult,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          text: "I couldn't reach the store knowledge base. Please reach out directly to Mohd Idrees on WhatsApp at **+91 90322 85420**.",
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Pill - Left side to complement right WhatsApp button */}
      <div className="fixed bottom-20 md:bottom-8 left-5 z-40">
        <motion.button
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative bg-gradient-to-r from-stone-900 via-stone-800 to-black hover:from-black text-white p-3 md:px-4 md:py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all cursor-pointer border border-[#F5821F]/40 shadow-[#F5821F]/10 group"
          aria-label="Mi King's AI Concierge Assistant"
        >
          <div className="relative w-7 h-7 rounded-full bg-[#F5821F]/20 flex items-center justify-center text-[#F5821F] border border-[#F5821F]/40 group-hover:bg-[#F5821F] group-hover:text-black transition-colors">
            <Bot className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </div>

          <div className="hidden md:flex flex-col text-left leading-tight">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#F5821F] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#F5821F]" />
              AI Store Concierge
            </span>
            <span className="text-xs font-bold text-stone-200">Instant Order & Gear Help</span>
          </div>

          <span className="bg-[#F5821F] text-black text-[10px] font-black px-2 py-0.5 rounded-full hidden sm:inline-block">
            AI Bot
          </span>
        </motion.button>
      </div>

      {/* Floating AI Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 md:bottom-24 left-4 sm:left-6 z-50 w-[92vw] sm:w-[440px] h-[600px] max-h-[82vh] flex flex-col bg-white dark:bg-[#151311] border border-stone-200 dark:border-[#2a2621] rounded-3xl shadow-2xl overflow-hidden text-stone-900 dark:text-stone-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white p-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#F5821F] text-black flex items-center justify-center font-black shadow-md shadow-[#F5821F]/20">
                  <Bot className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white leading-tight">
                      Mi King&apos;s AI Chatbot
                    </h3>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Order Status • Gear Specs • Hyderabad Store
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Topic Prompts Bar */}
            <div className="bg-stone-50 dark:bg-[#1a1714] border-b border-stone-200 dark:border-stone-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
              {QUICK_PROMPTS.map((prompt, idx) => (
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#F5821F] text-black font-semibold rounded-br-xs shadow-sm'
                        : 'bg-stone-100 dark:bg-[#1e1b17] text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Matched Product Cards */}
                    {msg.data?.matchedProducts && msg.data.matchedProducts.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700/60 space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                          Recommended Store Inventory:
                        </span>
                        <div className="space-y-1.5">
                          {msg.data.matchedProducts.map((p) => (
                            <Link
                              key={p.id}
                              href={`/products/${p.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#25221d] border border-stone-200 dark:border-stone-700 hover:border-[#F5821F] transition-all group"
                            >
                              <div className="truncate mr-2">
                                <p className="font-bold text-stone-900 dark:text-white truncate group-hover:text-[#F5821F]">
                                  {p.name}
                                </p>
                                <span className="text-[10px] text-stone-500 font-medium">
                                  {p.condition}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-xs font-black text-[#F5821F]">
                                  ₹{p.price.toLocaleString('en-IN')}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#F5821F] group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Action Button */}
                    {msg.data?.suggestedAction && (
                      <div className="mt-3">
                        {msg.data.suggestedAction.type === 'whatsapp' ? (
                          <a
                            href={msg.data.suggestedAction.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[11px] px-3 py-1.5 rounded-xl shadow transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {msg.data.suggestedAction.label}
                          </a>
                        ) : (
                          <Link
                            href={msg.data.suggestedAction.href}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1.5 bg-stone-900 dark:bg-stone-100 hover:bg-[#F5821F] text-white dark:text-black font-bold text-[11px] px-3 py-1.5 rounded-xl shadow transition-colors"
                          >
                            <Package className="w-3.5 h-3.5" />
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
                  <div className="w-4 h-4 border-2 border-[#F5821F] border-t-transparent rounded-full animate-spin" />
                  <span className="italic">Searching store catalog &amp; logistics...</span>
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
                  placeholder="Ask about orders, Canon 80D, warranty..."
                  className="flex-1 bg-stone-100 dark:bg-[#1f1c18] border border-stone-200 dark:border-stone-700 rounded-2xl px-3.5 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#F5821F]"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="w-9 h-9 rounded-2xl bg-[#F5821F] hover:bg-[#e07416] disabled:opacity-40 text-black flex items-center justify-center font-bold transition-colors cursor-pointer shrink-0 shadow-md shadow-[#F5821F]/20"
                  aria-label="Send inquiry"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-stone-400 mt-2 px-1">
                <span>⚡ Powered by Mi King&apos;s Store Assistant</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ● Verified 2026 Catalog
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
