"use client";
import * as bip39 from "bip39";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  RefreshCw,
  ShieldAlert,
  CheckCheck,
  Lock,
  ArrowRight,
  X,
} from "lucide-react";
import { encryptAndSave } from "@/lib/encryption";
import { useRouter } from "next/navigation";

export default function MnemonicGenerator() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showPasswordBox, setShowPasswordBox] = useState<boolean>(false);
  const [password, setPassword] = useState("");

  const router = useRouter();

  const generateMnemonic = () => {
    const seedPhrase = bip39.generateMnemonic(128);
    setMnemonic(seedPhrase);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (!mnemonic) return;
    await navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToLocalStorage = () => {
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    encryptAndSave(mnemonic, password);
    // You could redirect here
    alert("Vault Secured Successfully!");
    router.push("wallet");
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30">
      {/* Background Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        {/* Header Section */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex p-3 bg-white/5 border border-white/10 rounded-2xl mb-4 text-indigo-400">
            <Lock size={28} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">
            Secure Your Vault
          </h1>
          <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
            Generate your unique recovery phrase. This is the master key to your
            digital assets.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#0a0a0c] rounded-[2.5rem] border border-white/10 p-2 shadow-2xl overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Mnemonic Display */}
            <div className="relative group">
              {!mnemonic && (
                <div className="min-h-[220px] flex flex-col items-center justify-center text-center bg-white/[0.01] border border-white/5 border-dashed rounded-[2rem]">
                  <p className="text-slate-600 font-medium tracking-wide">
                    No phrase generated yet
                  </p>
                  <p className="text-[10px] text-slate-700 uppercase tracking-[0.2em] mt-2">
                    BIP-39 Standard Ready
                  </p>
                </div>
              )}

              {mnemonic && (
                <div className="space-y-4">
                  {/* Header + Copy */}
                  <div className="flex justify-between items-end px-2">
                    <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                      Secret Keys
                    </h2>
                    <button
                      onClick={copyToClipboard}
                      className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                        copied
                          ? "text-green-400"
                          : "text-indigo-400 hover:text-white"
                      }`}
                    >
                      {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                      {copied ? "Copied to Clipboard" : "Copy All"}
                    </button>
                  </div>

                  {/* Seed Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 p-3 md:p-4 bg-white/[0.02] border border-white/10 rounded-[2rem]">
                    {mnemonic.split(" ").map((word, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
                      >
                        <span className="text-[10px] font-mono text-indigo-500/40 font-black">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-bold text-slate-200 tracking-wide">
                          {word}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={generateMnemonic}
                className="w-full flex items-center justify-center gap-3 bg-white text-black font-black py-5 rounded-2xl hover:bg-indigo-50 transition-all active:scale-[0.98]"
              >
                <RefreshCw
                  size={20}
                  className={mnemonic ? "animate-spin-once" : ""}
                />
                {mnemonic ? "Generate New Secret" : "Generate Recovery Phrase"}
              </button>

              <button
                disabled={!mnemonic}
                onClick={() => setShowPasswordBox(true)}
                className="w-full flex items-center justify-center gap-2 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-slate-300 hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              >
                Continue to Secure Storage <ArrowRight size={18} />
              </button>
            </div>

            {/* Warning */}
            <div className="flex gap-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <ShieldAlert className="text-amber-500 shrink-0 mt-1" size={20} />
              <p className="text-[11px] text-amber-200/60 leading-relaxed uppercase tracking-wider font-medium">
                <strong>Critical:</strong> Write these words on paper and hide
                them. Digital copies (screenshots, notes) are vulnerable to
                hackers.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modern Glass Modal */}
      <AnimatePresence>
        {showPasswordBox && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowPasswordBox(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#0d0d0f] rounded-[2.5rem] border border-white/10 p-10 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPasswordBox(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                  <Lock size={30} className="text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Set Vault Password</h3>
                <p className="text-xs text-slate-500 px-4">
                  This password encrypts your seed phrase inside your browser.
                </p>
              </div>

              <input
                autoFocus
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-indigo-500 text-center tracking-widest"
                placeholder="••••••••"
              />
              <button
                onClick={handleSaveToLocalStorage}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
              >
                Secure & Create Wallet
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="mt-12 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
        Standard BIP-39 Entropy • 2026 Vault Security
      </footer>
    </div>
  );
}
