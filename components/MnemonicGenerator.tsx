"use client";
import * as bip39 from "bip39";
import { useState } from "react";
import { Copy, RefreshCw, ShieldAlert, CheckCheck } from "lucide-react";
import { encryptAndSave } from "@/lib/encryption";

export default function MnemonicGenerator() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showPasswordBox, setShowPasswordBox] = useState<boolean>(false);
  const [password, setPassword] = useState("");

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
      alert("Please use a stronger password (min 8 chars)");
      return;
    }
    encryptAndSave(mnemonic, password);
    alert("Vault encrypted and saved to browser storage.");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-xl font-bold text-slate-800">
            Seed Phrase Generator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate a secure 12-word recovery phrase.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Mnemonic Display */}
          <div className="relative group">
            <div
              className={`min-h-30 p-4 rounded-xl border-2 border-dashed transition-all 
              ${mnemonic ? "bg-indigo-50/30 border-indigo-200" : "bg-slate-50 border-slate-200"}`}
            >
              {mnemonic ? (
                <div className="grid grid-cols-3 gap-2">
                  {mnemonic.split(" ").map((word, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 w-4">
                        {i + 1}.
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                        {word}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
                  Click generate to begin...
                </div>
              )}
            </div>

            {mnemonic && (
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckCheck size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-slate-600" />
                )}
              </button>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={generateMnemonic}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-indigo-200"
          >
            <RefreshCw
              size={18}
              className={!mnemonic ? "" : "animate-spin-once"}
            />
            {mnemonic ? "Regenerate Phrase" : "Generate Seed Phrase"}
          </button>

          <button
            onClick={() => setShowPasswordBox(true)}
            className="border-2 w-full text-white font-semibold bg-black rounded-xl py-3"
          >
            Save seed and create wallet
          </button>

          {/* Security Warning */}
          <div className="flex gap-3 p-4 rounded-lg bg-amber-50 border border-amber-100">
            <ShieldAlert className="text-amber-600 shrink-0" size={20} />
            <p className="text-[12px] text-amber-800 leading-relaxed">
              <strong>Security Warning:</strong> Never share your recovery
              phrase with anyone. Store it offline. Anyone with these words can
              access your entire wallet.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-slate-400 text-xs">
        Powered by BIP-39 Standard • 128-bit Entropy
      </p>

      {showPasswordBox ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowPasswordBox(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-8 min-w-75 min-h-30 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Protect your phrase with a password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-3"
              placeholder="Enter a strong password"
            />
            <button
              onClick={handleSaveToLocalStorage}
              className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900"
            >
              Encrypt & Save to Browser
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
