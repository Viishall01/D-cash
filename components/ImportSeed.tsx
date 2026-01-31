"use client";
import { useState } from "react";
import * as bip39 from "bip39";
import { encryptAndSave } from "@/lib/encryption"; // Your existing utility
import { ShieldCheck, KeyRound, AlertCircle, ArrowRight } from "lucide-react";

export default function ImportWallet({ onImportSuccess }: { onImportSuccess: () => void }) {
  const [mnemonicInput, setMnemonicInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Paste Phrase, 2: Set Password

  const handleValidateAndNext = () => {
    // Clean the input: remove extra spaces and newlines
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
      // 1. Encrypt and save the phrase
      encryptAndSave(mnemonicInput, password);
      
      // 2. Reset account count (or keep it if you want to scan for balances)
      // For now, we assume we start with 1 account
      localStorage.setItem("account_count", "1");
      
      alert("Wallet imported successfully!");
      onImportSuccess();
    } catch (e) {
      setError("Failed to secure wallet. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-2xl border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
          <KeyRound size={24} />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Import Vault</h2>
      </div>

      {step === 1 ? (
        <div className="space-y-6">
          <p className="text-sm text-slate-500 leading-relaxed">
            Enter your 12 or 24-word secret recovery phrase to restore your accounts.
          </p>
          
          <textarea
            className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-0 outline-none transition font-mono text-sm leading-6"
            placeholder="word1 word2 word3..."
            value={mnemonicInput}
            onChange={(e) => setMnemonicInput(e.target.value)}
          />

          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl text-xs font-bold">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button
            onClick={handleValidateAndNext}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition flex items-center justify-center gap-2"
          >
            Continue <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-slate-500">
            Create a password to encrypt your phrase on this device.
          </p>
          
          <input
            type="password"
            placeholder="Set Vault Password"
            className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="text-red-500 text-xs font-bold">{error}</div>
          )}

          <button
            onClick={handleFinalImport}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <ShieldCheck size={18} /> Secure & Access Wallet
          </button>
          
          <button 
            onClick={() => setStep(1)} 
            className="w-full text-slate-400 text-sm font-medium hover:text-slate-600"
          >
            Back to phrase
          </button>
        </div>
      )}
    </div>
  );
}