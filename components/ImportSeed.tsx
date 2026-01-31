"use client";
import { useState } from "react";
import * as bip39 from "bip39";
import { motion, AnimatePresence } from "framer-motion";
import { encryptAndSave } from "@/lib/encryption";
import { ShieldCheck, KeyRound, AlertCircle, ArrowRight, ArrowLeft, Lock, ShieldAlert } from "lucide-react";

export default function ImportWallet({ onImportSuccess }: { onImportSuccess: () => void }) {
  const [mnemonicInput, setMnemonicInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const handleValidateAndNext = () => {
    const cleanMnemonic = mnemonicInput.trim().toLowerCase().replace(/\s+/g, ' ');
    if (bip39.validateMnemonic(cleanMnemonic)) {
      setMnemonicInput(cleanMnemonic);
      setError("");
      setStep(2);
    } else {
      setError("Invalid seed phrase. Please check the words and order.");
    }
  };

  const handleFinalImport = () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    try {
      encryptAndSave(mnemonicInput, password);
      localStorage.setItem("account_count", "1");
      onImportSuccess();
    } catch (e) {
      setError("Failed to secure vault.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020203] text-white overflow-hidden selection:bg-indigo-500/30">
      {/* Dynamic Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.15),transparent)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2"
      >
        
        {/* LEFT PANEL: Immersive Branding (Full height on Desktop) */}
        <div className="relative hidden lg:flex flex-col justify-between p-16 xl:p-24 bg-[#050507] border-r border-white/5 overflow-hidden">
          {/* Decorative Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4 text-indigo-500">
              <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <ShieldCheck size={38} />
              </div>
              <span className="font-black tracking-tighter text-3xl uppercase italic">Vault-S</span>
            </div>
            
            <h1 className="text-6xl xl:text-8xl font-black leading-[0.9] tracking-tighter">
              RESTORE <br /> 
              <span className="text-indigo-600">ACCESS.</span>
            </h1>
            <p className="text-slate-500 text-xl leading-relaxed max-w-md font-medium">
              Re-enter your recovery phrase to decrypt your local vault and regain control of your digital identity.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-indigo-400 font-black text-xs uppercase tracking-widest">Security</p>
              <p className="text-slate-500 text-sm italic">Local-only AES-256 Encryption</p>
            </div>
            <div className="space-y-2">
              <p className="text-indigo-400 font-black text-xs uppercase tracking-widest">Privacy</p>
              <p className="text-slate-500 text-sm italic">Zero-Knowledge Architecture</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: The Form Interface (Full screen on Mobile) */}
        <div className="flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 relative bg-[#020203]">
          
          {/* Mobile Navigation/Branding */}
          <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
             <KeyRound size={24} className="text-indigo-500" />
             <span className="font-black tracking-tighter text-lg uppercase">Vault-S</span>
          </div>

          <div className="w-full max-w-xl space-y-12">
            {/* Immersive Step Indicator */}
            <div className="flex items-center justify-between group">
              <div className="space-y-1">
                <p className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em]">Step 0{step}</p>
                <h3 className="text-xl font-bold text-slate-400">{step === 1 ? "Authentication" : "Secure Vault"}</h3>
              </div>
              <div className="flex gap-2">
                <div className={`h-1 w-8 md:w-16 rounded-full transition-all duration-700 ${step >= 1 ? 'bg-indigo-500' : 'bg-white/10'}`} />
                <div className={`h-1 w-8 md:w-16 rounded-full transition-all duration-700 ${step === 2 ? 'bg-indigo-500' : 'bg-white/10'}`} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-25 transition duration-1000"></div>
                      <textarea
                        autoFocus
                        className="relative w-full h-64 md:h-80 p-8 bg-[#0a0a0c] border border-white/10 rounded-[2.5rem] focus:border-indigo-500 outline-none transition-all font-mono text-lg md:text-xl leading-relaxed text-indigo-100 placeholder:text-slate-700 resize-none"
                        placeholder="Enter your secret words here..."
                        value={mnemonicInput}
                        onChange={(e) => setMnemonicInput(e.target.value)}
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-3 text-red-400 text-xs font-black bg-red-400/5 p-5 rounded-2xl border border-red-400/10 uppercase tracking-wider">
                        <AlertCircle size={18} /> {error}
                      </div>
                    )}

                    <button
                      onClick={handleValidateAndNext}
                      className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 active:scale-[0.99] shadow-2xl"
                    >
                      VALIDATE PHRASE <ArrowRight size={24} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="space-y-10"
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Vault Password</label>
                      <input
                        autoFocus
                        type="password"
                        placeholder="••••••••••••"
                        className="w-full p-8 bg-[#0a0a0c] border border-white/10 rounded-[2.5rem] outline-none focus:border-indigo-500 transition-all text-3xl tracking-[0.5em] text-center"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className="space-y-4 pt-4">
                      <button
                        onClick={handleFinalImport}
                        className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-4 active:scale-[0.99]"
                      >
                        <ShieldCheck size={24} /> ACCESS VAULT
                      </button>
                      
                      <button 
                        onClick={() => setStep(1)} 
                        className="w-full text-slate-600 text-xs font-black uppercase tracking-[0.3em] hover:text-white transition-colors py-4"
                      >
                        Go back to phrase entry
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <footer className="absolute bottom-8 text-slate-800 text-[10px] font-black uppercase tracking-[0.5em]">
            Military Grade Client-Side Encryption
          </footer>
        </div>
      </motion.div>
    </div>
  );
}