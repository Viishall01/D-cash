"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Keypair,
  clusterApiUrl,
} from "@solana/web3.js";
import bs58 from "bs58";
import {
  Plus,
  Wallet,
  Send,
  Eye,
  EyeOff,
  Shield,
  RefreshCw,
  ExternalLink,
  ArrowUpRight,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { loadAndDecrypt } from "@/lib/encryption";

interface Account {
  address: string;
  privateKey: string;
  index: number;
}

export default function SolanaDashboard() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showPrivate, setShowPrivate] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const fetchBalances = useCallback(async (accountList: Account[]) => {
    if (accountList.length === 0) return;
    setIsLoadingBalance(true);
    try {
      const newBalances: Record<string, number> = {};
      await Promise.all(
        accountList.map(async (acc) => {
          const pubkey = new PublicKey(acc.address);
          const balance = await connection.getBalance(pubkey);
          newBalances[acc.address] = balance / LAMPORTS_PER_SOL;
        }),
      );
      setBalances(newBalances);
    } catch (e) {
      console.error("Balance fetch failed", e);
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  const deriveSolanaAccount = (mnemonic: string, index: number): Account => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const path = `m/44'/501'/${index}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const keypair = Keypair.fromSeed(derivedSeed);

    return {
      address: keypair.publicKey.toBase58(),
      privateKey: bs58.encode(keypair.secretKey),
      index: index,
    };
  };

  const handleUnlock = () => {
    const mnemonic = loadAndDecrypt(password);
    if (mnemonic) {
      const savedCount = parseInt(localStorage.getItem("account_count") || "1");
      const accountsList: Account[] = [];
      for (let i = 0; i < savedCount; i++) {
        accountsList.push(deriveSolanaAccount(mnemonic, i));
      }
      setAccounts(accountsList);
      setIsUnlocked(true);
      if (accountsList.length > 0) setSelectedAccount(accountsList[0]);
      fetchBalances(accountsList);
    } else {
      alert("Invalid Password");
    }
  };

  const createNewAccount = () => {
    const mnemonic = loadAndDecrypt(password);
    if (!mnemonic) return;
    const nextIndex = accounts.length;
    const newAcc = deriveSolanaAccount(mnemonic, nextIndex);
    const updatedAccounts = [...accounts, newAcc];
    setAccounts(updatedAccounts);
    localStorage.setItem("account_count", updatedAccounts.length.toString());
    fetchBalances(updatedAccounts);
  };

  const handleSendSOL = async () => {
    if (!selectedAccount || !recipient || !amount) return;
    try {
      setIsSending(true);
      const secretKey = bs58.decode(selectedAccount.privateKey);
      const senderKeypair = Keypair.fromSecretKey(secretKey);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        }),
      );

      const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
      alert(`Sent! ${signature}`);
      setAmount("");
      setRecipient("");
      fetchBalances(accounts);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#050507] p-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Wallets</h3>
        <button onClick={createNewAccount} className="p-2 hover:bg-white/5 rounded-lg text-indigo-400">
          <Plus size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {accounts.map((acc) => (
          <div
            key={acc.index}
            onClick={() => {
              setSelectedAccount(acc);
              setIsSidebarOpen(false);
            }}
            className={`p-4 rounded-2xl cursor-pointer border transition-all ${
              selectedAccount?.address === acc.address
                ? "bg-indigo-600/10 border-indigo-500/50"
                : "bg-white/[0.02] border-white/5 hover:border-white/10"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-400">Acc #{acc.index + 1}</span>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {balances[acc.address]?.toFixed(2) || "0.00"}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-600 truncate">{acc.address}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-indigo-500/30">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div key="unlock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-screen items-center justify-center p-6">
            <div className="w-full max-w-sm space-y-8 text-center">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto border border-indigo-500/20">
                <Shield size={40} className="text-indigo-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight">Unlock Vault</h2>
                <p className="text-slate-500 text-sm">Enter password to decrypt your local keys</p>
              </div>
              <input
                type="password"
                className="w-full bg-[#0a0a0c] border border-white/10 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-indigo-500 text-center text-2xl tracking-widest"
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleUnlock} className="w-full bg-white text-black py-5 rounded-2xl font-black hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                AUTHENTICATE <ArrowUpRight size={20} />
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex h-screen overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-80 border-r border-white/5 shrink-0">
              <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
              {isSidebarOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                  />
                  <motion.aside
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 left-0 w-[80%] max-w-xs z-50 lg:hidden"
                  >
                    <SidebarContent />
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#020203] relative">
              {/* Header */}
              <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 shrink-0 bg-[#050507]/50 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-white/5 rounded-xl">
                    <Menu size={24} />
                  </button>
                  <h1 className="text-xl font-black tracking-tighter hidden md:block">SOLANA VAULT</h1>
                  <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md uppercase tracking-widest">Devnet</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => fetchBalances(accounts)} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                    <RefreshCw size={20} className={isLoadingBalance ? "animate-spin" : ""} />
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 custom-scrollbar">
                <AnimatePresence mode="wait">
                  {selectedAccount ? (
                    <motion.div key={selectedAccount.address} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-12">
                      {/* Hero Balance Section */}
                      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-indigo-400">
                             <Wallet size={18} />
                             <span className="text-xs font-black uppercase tracking-widest">Account #{selectedAccount.index + 1}</span>
                          </div>
                          <div className="flex items-center gap-3 group">
                             <p className="text-xs font-mono text-slate-500 break-all">{selectedAccount.address}</p>
                             <ExternalLink size={14} className="text-slate-700 group-hover:text-white cursor-pointer" />
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Available Balance</p>
                          <div className="flex items-baseline gap-2">
                             <span className="text-6xl font-black tracking-tighter">{balances[selectedAccount.address]?.toFixed(4) || "0.0000"}</span>
                             <span className="text-xl font-bold text-indigo-500 uppercase">Sol</span>
                          </div>
                        </div>
                      </section>

                      {/* Action Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Send Form */}
                        <div className="bg-[#0a0a0c] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20" />
                          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <Send size={20} className="text-indigo-400" /> Send Assets
                          </h3>
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Recipient Address</label>
                              <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm placeholder:text-slate-700"
                                placeholder="Paste Solana Address"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm pr-16"
                                  placeholder="0.00"
                                  value={amount}
                                  onChange={(e) => setAmount(e.target.value)}
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">SOL</span>
                              </div>
                            </div>
                            <button
                              disabled={isSending}
                              onClick={handleSendSOL}
                              className="w-full py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-50 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                              {isSending ? <RefreshCw className="animate-spin" size={18} /> : "Send Transaction"}
                            </button>
                          </div>
                        </div>

                        {/* Private Key Card */}
                        <div className="space-y-6">
                          <div className="bg-indigo-600/5 border border-indigo-500/10 p-8 rounded-[2.5rem] space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Shield size={16} /> Security
                              </h3>
                              <button
                                onClick={() => setShowPrivate(showPrivate === selectedAccount.index ? null : selectedAccount.index)}
                                className="p-2 hover:bg-white/5 rounded-lg text-slate-500 transition-colors"
                              >
                                {showPrivate === selectedAccount.index ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">Your private key gives full access to your funds. Never share it.</p>
                            <div className="p-4 bg-black/50 rounded-xl border border-white/5">
                              <p className="font-mono text-xs text-indigo-300/60 break-all leading-relaxed">
                                {showPrivate === selectedAccount.index ? selectedAccount.privateKey : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 border-2 border-dashed border-white/5 rounded-[3rem]">
                      <div className="p-6 bg-white/5 rounded-full">
                        <ChevronRight size={48} className="opacity-20" />
                      </div>
                      <p className="font-bold tracking-widest uppercase text-sm">Select a wallet to begin</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </main>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 20px; }
      `}</style>
    </div>
  );
}