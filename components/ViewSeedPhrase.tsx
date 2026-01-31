"use client";
import React, { useState } from "react";
import { loadAndDecrypt } from "@/lib/encryption";

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
      setError("Invalid password or no vault found.");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">
          Your Seed Phrase
        </h1>
        <p className="text-slate-500 text-center mb-6">
          Enter your password to reveal your recovery phrase.
        </p>
        <div className="flex flex-col gap-4 items-center">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter your password"
          />
          <button
            onClick={handleReveal}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-indigo-200"
          >
            Reveal Seed Phrase
          </button>
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {show && mnemonic && (
          <div className="mt-8 p-6 bg-indigo-50/50 rounded-xl border border-indigo-200">
            <h2 className="text-lg font-semibold text-indigo-700 mb-4 text-center">
              Your 12-word Recovery Phrase
            </h2>
            <div className="relative">
              <div className="grid grid-cols-3 gap-3">
                {mnemonic.split(" ").map((word, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 w-4">
                      {i + 1}.
                    </span>
                    <span className="text-base font-medium text-slate-700">
                      {word}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={copyToClipboard}
                className="absolute top-0 right-0 p-2 rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors mt-2 mr-2"
                title="Copy seed phrase"
              >
                {copied ? (
                  <span className="text-green-600 font-semibold">Copied!</span>
                ) : (
                  <span className="text-slate-600 font-semibold">Copy</span>
                )}
              </button>
            </div>
            <p className="mt-6 text-amber-700 text-xs bg-amber-100 rounded p-3 text-center">
              <strong>Warning:</strong> Never share your recovery phrase. Anyone
              with these words can access your wallet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSeedPhrase;
