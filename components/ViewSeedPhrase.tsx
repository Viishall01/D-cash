"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadAndDecrypt } from "@/lib/encryption";
import { ShieldCheck, Lock, Copy, CheckCircle2, AlertTriangle, Eye, ArrowLeft, X } from "lucide-react";
import Link from "next/link";

const ViewSeedPhrase = () => {
  const [password, setPassword] = useState("");
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReveal = () => {
    setError("");
    const result = loadAndDecrypt(password);
    if (!result) {
      setError("Authorization failed. Incorrect password.");
      setMnemonic(null);
      setShow(false);
    } else {
      setMnemonic(result);
      setShow(true);
    }
  };

  const copyToClipboard = async () => {
    if (!mnemonic) return;
    await navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white flex flex-col items-center justify-center p-4 md:p-6 selection:bg-indigo-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.08),transparent)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full relative"
      >
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8 px-2">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
            <ArrowLeft size={14} /> Back to Vault
          </Link>
          <div className="h-px flex-1 bg-white/5 mx-4" />
          <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Security Protocol</div>
        </div>

        <div className="bg-[#0a0a0c] rounded-[2.5rem] md:rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden p-1">
          <div className="bg-gradient-to-b from-white/[0.03] to-transparent p-6 md:p-12">
            
            <AnimatePresence mode="wait">
              {!show ? (
                <motion.div 
                  key="auth"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-500/10 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 shadow-lg">
                      <Lock size={32} className="text-indigo-400" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter mb-2">Identify Yourself</h1>
                    <p className="text-slate-500 text-xs md:text-sm">Decryption key required to view recovery phrase.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative group">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xl tracking-widest text-center"
                        placeholder="••••••••"
                      />
                    </div>

                    {error && (
                      <p className="text-red-400 text-[11px] font-bold text-center bg-red-400/5 p-3 rounded-xl border border-red-400/10">
                        {error}
                      </p>
                    )}

                    <button
                      onClick={handleReveal}
                      className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                    >
                      <Eye size={20} /> Reveal Phrase
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="reveal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Words Grid - Now Responsive (2 columns mobile, 3 columns desktop) */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end px-2">
                      <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">Secret Keys</h2>
                      <button
                        onClick={copyToClipboard}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${copied ? 'text-green-400' : 'text-indigo-400 hover:text-white'}`}
                      >
                        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        {copied ? "Copied to Clipboard" : "Copy All"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 p-3 md:p-4 bg-white/[0.02] border border-white/10 rounded-[2rem]">
                      {mnemonic?.split(" ").map((word, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-[10px] font-mono text-indigo-500/40 font-black">{String(i + 1).padStart(2, '0')}</span>
                          <span className="text-sm font-bold text-slate-200 tracking-wide">{word}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Warning Box */}
                  <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-4">
                    <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.15em]">Security Protocol</p>
                      <p className="text-[11px] text-amber-200/50 leading-relaxed font-medium">
                        Ensure no one is looking at your screen. These words bypass all security measures.
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setShow(false); setPassword(""); }}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                  >
                    <X size={14} /> Lock and Hide Phrase
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewSeedPhrase;