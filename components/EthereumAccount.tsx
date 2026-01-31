"use client";
import { useState } from "react";
import { ethers } from "ethers";

import { Plus, Wallet, Send, Eye, EyeOff, Shield } from "lucide-react";
import { loadAndDecrypt } from "@/lib/encryption";

// 1. DEFINE THE INTERFACE TO FIX THE ERROR
interface Account {
  address: string;
  publicKey: string;
  privateKey: string;
  index: number;
}

export default function Dashboard() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showPrivate, setShowPrivate] = useState<number | null>(null);

  // 2. PATH-SAFE DERIVATION LOGIC
  const deriveAccounts = (mnemonicPhrase: string, count: number) => {
    const derived: Account[] = [];

    // Create a Mnemonic object first
    const mnemonic = ethers.Mnemonic.fromPhrase(mnemonicPhrase);

    for (let i = 0; i < count; i++) {
      // Derive directly using the static fromMnemonic method
      // This is the most stable way in Ethers v6
      const childNode = ethers.HDNodeWallet.fromMnemonic(
        mnemonic,
        `m/44'/60'/0'/0/${i}`,
      );

      derived.push({
        address: childNode.address,
        publicKey: childNode.publicKey,
        privateKey: childNode.privateKey,
        index: i,
      });
    }
    return derived;
  };

  const handleUnlock = () => {
    const mnemonic = loadAndDecrypt(password);
    if (mnemonic) {
      const savedCount = parseInt(localStorage.getItem("account_count") || "1");
      const accountsList = deriveAccounts(mnemonic, savedCount);
      setAccounts(accountsList);
      setIsUnlocked(true);
    } else {
      alert("Invalid Password");
    }
  };

  const createNewAccount = () => {
    const mnemonicPhrase = loadAndDecrypt(password);
    if (!mnemonicPhrase) return;

    const nextIndex = accounts.length;
    const mnemonic = ethers.Mnemonic.fromPhrase(mnemonicPhrase);

    // Derive the next specific index
    const childNode = ethers.HDNodeWallet.fromMnemonic(
      mnemonic,
      `m/44'/60'/0'/0/${nextIndex}`,
    );

    const newAcc: Account = {
      address: childNode.address,
      publicKey: childNode.publicKey,
      privateKey: childNode.privateKey,
      index: nextIndex,
    };

    const updatedAccounts = [...accounts, newAcc];
    setAccounts(updatedAccounts);
    localStorage.setItem("account_count", updatedAccounts.length.toString());
  };
  // UI RENDER LOGIC
  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-6">
        {/* ... Unlock UI code from previous step ... */}
        <div className="w-full max-w-sm space-y-4 bg-slate-800 p-8 rounded-2xl border border-slate-700">
          <Shield size={48} className="mx-auto text-indigo-400 mb-2" />
          <h2 className="text-xl font-bold text-center text-white">
            Unlock Your Vault
          </h2>
          <input
            type="password"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-white"
            placeholder="Enter Vault Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleUnlock}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-bold text-white transition"
          >
            Unlock Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 text-slate-900">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Vault Dashboard
          </h1>
          <p className="text-slate-500">
            Manage your derived Ethereum accounts
          </p>
        </div>
        <button
          onClick={createNewAccount}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition font-bold"
        >
          <Plus size={20} /> New Account
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Accounts List */}
        <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {accounts.map((acc) => (
            <div
              key={acc.index}
              onClick={() => setSelectedAccount(acc)}
              className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${
                selectedAccount?.address === acc.address
                  ? "border-indigo-600 bg-indigo-50 shadow-sm"
                  : "border-slate-100 bg-white hover:border-slate-300 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border shadow-sm">
                  <Wallet size={18} className="text-indigo-600" />
                </div>
                <span className="font-bold text-sm text-slate-700">
                  Account #{acc.index + 1}
                </span>
              </div>
              <p className="mt-2 text-[11px] font-mono text-slate-400 truncate">
                {acc.address}
              </p>
            </div>
          ))}
        </div>

        {/* Right: Selected Account Details & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAccount ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">
                    Account #{selectedAccount.index + 1}
                  </h2>
                  <p className="text-sm text-slate-500 font-mono break-all mt-1">
                    {selectedAccount.address}
                  </p>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Active
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Secure Private Key
                </label>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs text-slate-600 break-all">
                    {showPrivate === selectedAccount.index
                      ? selectedAccount.privateKey
                      : "••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                  </p>
                  <button
                    onClick={() =>
                      setShowPrivate(
                        showPrivate === selectedAccount.index
                          ? null
                          : selectedAccount.index,
                      )
                    }
                    className="p-2 hover:bg-slate-200 rounded-lg transition"
                  >
                    {showPrivate === selectedAccount.index ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Transaction Simulation UI */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Send size={18} className="text-indigo-600" /> Transfer Funds
                </h3>
                <div className="grid gap-4">
                  <input
                    type="text"
                    placeholder="Recipient Address"
                    className="p-3 border rounded-xl text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Amount (ETH)"
                    className="p-3 border rounded-xl text-sm"
                  />
                  <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition">
                    Send Transaction
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 bg-slate-50/50">
              <Wallet size={48} className="mb-2 opacity-20" />
              <p className="font-medium text-slate-500">
                Select an account to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
