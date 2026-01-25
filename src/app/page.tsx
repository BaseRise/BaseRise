"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Loader2, CheckCircle2, AlertCircle, Github, Linkedin, Send } from "lucide-react";

export default function LandingPage() {
  // 1. States
  const [newsEmail, setNewsEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Naya state message show karne ke liye (Success ya Error)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 2. Handler
  const handleNewsletterSubmit = async () => {
    if (!newsEmail) return;
    
    setSubmitting(true);
    setMessage(null); // Purana message clear karein

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        // Success Message Set Karein
        setMessage({ text: "You are successfully subscribed!", type: 'success' });
        setNewsEmail("");
      } else {
        // Error Message Set Karein
        setMessage({ text: data.error || "Subscription failed.", type: 'error' });
      }
    } catch (e) {
      setMessage({ text: "Network error. Please try again.", type: 'error' });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      
      {/* ==========================================
          BACKGROUND
      ========================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(45deg, #1e3a8a 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        ></div>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]"></div>
      </div>

      {/* ==========================================
          NAVBAR
      ========================================== */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">B</div>
            <span className="text-xl font-semibold tracking-tight">BaseRise</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-blue-400 transition-colors">Products</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Ecosystem</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Developers</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/waitlist">
              <button className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-full text-sm hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                Join Waitlist
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <main className="relative z-10 pt-48 pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-8 text-white"
          >
            The Next <span className="text-blue-600">Evolution</span><br />
            of On-Chain Finance.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed font-light"
          >
            Baserise delivers the premier yield & reward protocol on Base. 
            Secure, scalable, and built for the next 10,000 innovators.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-24"
          >
            <Link href="/waitlist">
              <button className="px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                 Join Waitlist <ArrowRight size={22} />
              </button>
            </Link>
            
            <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              View Documentation
            </button>
          </motion.div>
        </div>
      </main>

      {/* ==========================================
          FOOTER
      ========================================== */}
      <footer className="relative z-10 px-6 pb-6 w-full max-w-7xl mx-auto mt-auto">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-hidden relative shadow-2xl">
            
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px]"></div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
                
                {/* Brand Column */}
                <div className="md:col-span-5 space-y-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">B</div>
                        <span className="text-2xl font-semibold tracking-tight">BaseRise</span>
                    </div>
                    <p className="text-gray-400 leading-relaxed max-w-sm">
                        Baserise is the first decentralized yield-layer on Base. We help users maximize their on-chain potential through secure, automated protocols.
                    </p>
                    
                    <div className="flex gap-4">
                        {/* X/Twitter */}
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group hover:bg-black hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            <svg viewBox="0 0 24 24" width="18" height="18" className="text-gray-400 group-hover:text-white transition-colors duration-300 fill-current">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                        {/* LinkedIn */}
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:shadow-[0_0_20px_rgba(10,102,194,0.5)]">
                            <Linkedin size={18} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                        </a>
                        {/* GitHub */}
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group hover:bg-[#333] hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            <Github size={18} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                        </a>
                        {/* Telegram */}
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group hover:bg-[#0088cc] hover:border-[#0088cc] hover:shadow-[0_0_20px_rgba(0,136,204,0.5)]">
                            <Send size={18} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                        </a>
                    </div>
                </div>

                {/* Resources */}
                <div className="md:col-span-3 space-y-6 text-center md:text-left">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Resources</h4>
                    <ul className="space-y-4 text-gray-300">
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Media Kit</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Smart Contracts</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Whitepaper</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Security Audit</a></li>
                    </ul>
                </div>

                {/* Newsletter Column */}
                <div className="md:col-span-4 space-y-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Stay Updated</h4>
                    <p className="text-gray-400 text-sm">Join our newsletter to receive the latest protocol updates.</p>
                    
                    <div>
                        <div className="flex gap-2">
                            <input 
                                type="email" 
                                placeholder="Enter your email"
                                value={newsEmail}
                                onChange={(e) => setNewsEmail(e.target.value)}
                                disabled={submitting}
                                className="bg-white/5 border border-white/10 rounded-full px-5 py-3 w-full text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors shadow-inner disabled:opacity-50"
                            />
                            <button 
                                onClick={handleNewsletterSubmit}
                                disabled={submitting}
                                className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full transition-colors flex-shrink-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <ArrowRight size={20} />
                                )}
                            </button>
                        </div>

                        {/* SUCCESS / ERROR MESSAGE (Subtle Text below input) */}
                        <AnimatePresence>
                            {message && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 4, ease: 'easeOut' }}
                                    className={`mt-3 text-xs flex items-center gap-2 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
                                >
                                    {message.type === 'success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                    <span>{message.text}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                <p>© BASERISE 2026 | All Rights Reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>

        </div>
      </footer>

    </div>
  );
}