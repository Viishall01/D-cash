"use client";
import { useState, useCallback } from "react";
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

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Initialize connection (Devnet for testing)
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // 1. Fetch Balances Logic
  const fetchBalances = useCallback(async (accountList: Account[]) => {
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
      console.error("Failed to fetch balances", e);
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  // 2. Solana Derivation
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
      fetchBalances(accountsList); // Fetch balances immediately
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
    fetchBalances(updatedAccounts); // Refresh with new account
  };

  const handleSendSOL = async () => {
    if (!selectedAccount || !recipient || !amount) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setIsSending(true);

      const secretKey = bs58.decode(selectedAccount.privateKey);
      const senderKeypair = Keypair.fromSecretKey(secretKey);
      const toPubkey = new PublicKey(recipient);

      // 1. Get current balance in Lamports
      const currentBalance = await connection.getBalance(
        senderKeypair.publicKey,
      );
      const amountInLamports = Math.floor(
        parseFloat(amount) * LAMPORTS_PER_SOL,
      );
      const fee = 5000; // Standard SOL transfer fee is 5000 lamports

      // 2. Check if the user is trying to send more than they have + fee
      if (amountInLamports + fee > currentBalance) {
        alert(
          `Insufficient funds. You need ${amount} SOL + 0.000005 SOL for fees.`,
        );
        setIsSending(false);
        return;
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: toPubkey,
          lamports: amountInLamports,
        }),
      );

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [senderKeypair],
      );

      alert(`Success! Sig: ${signature}`);
      setAmount("");
      setRecipient("");
      fetchBalances(accounts);
    } catch (error: any) {
      // Professional error logging as suggested by the console
      if (error.logs) {
        console.log("Full Transaction Logs:", error.logs);
      }
      alert(`Transaction failed: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 text-slate-900 font-sans">
      {/* Unlock UI (Same as before) */}
      {!isUnlocked ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-sm space-y-4 bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl text-white">
            <Shield size={48} className="mx-auto text-indigo-400 mb-2" />
            <h2 className="text-xl font-bold text-center">
              Unlock Solana Vault
            </h2>
            <input
              type="password"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Vault Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleUnlock}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-bold transition"
            >
              Unlock Wallet
            </button>
          </div>
        </div>
      ) : (
        <>
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                Solana Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                  Devnet Connected
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fetchBalances(accounts)}
                disabled={isLoadingBalance}
                className="p-3 border rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
              >
                <RefreshCw
                  size={20}
                  className={isLoadingBalance ? "animate-spin" : ""}
                />
              </button>
              <button
                onClick={createNewAccount}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-200"
              >
                <Plus size={20} /> New Account
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar: Accounts */}
            <div className="lg:col-span-1 space-y-4">
              {accounts.map((acc) => (
                <div
                  key={acc.index}
                  onClick={() => setSelectedAccount(acc)}
                  className={`p-5 rounded-2xl cursor-pointer border-2 transition-all ${
                    selectedAccount?.address === acc.address
                      ? "border-indigo-600 bg-white shadow-xl translate-x-1"
                      : "border-transparent bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                      <Wallet size={20} />
                    </div>
                    <span className="text-lg font-bold text-slate-800">
                      {balances[acc.address] !== undefined
                        ? `${balances[acc.address].toFixed(4)} SOL`
                        : "---"}
                    </span>
                  </div>
                  <p className="font-bold text-sm text-slate-700">
                    Account #{acc.index + 1}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 truncate mt-1">
                    {acc.address}
                  </p>
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {selectedAccount ? (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-extrabold tracking-tight">
                        Account #{selectedAccount.index + 1}
                      </h2>
                      <p className="text-sm text-slate-400 font-mono mt-2 break-all">
                        {selectedAccount.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        Balance
                      </p>
                      <p className="text-3xl font-black text-indigo-600">
                        {balances[selectedAccount.address]?.toFixed(4) ||
                          "0.00"}{" "}
                        SOL
                      </p>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-900 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Private Key (Secret)
                      </label>
                      <button
                        onClick={() =>
                          setShowPrivate(
                            showPrivate === selectedAccount.index
                              ? null
                              : selectedAccount.index,
                          )
                        }
                        className="text-slate-400 hover:text-white transition"
                      >
                        {showPrivate === selectedAccount.index ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    <p className="font-mono text-xs text-indigo-300 break-all leading-relaxed">
                      {showPrivate === selectedAccount.index
                        ? selectedAccount.privateKey
                        : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-slate-800">
                      <Send size={22} className="text-indigo-600" /> Quick
                      Transfer
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Recipient Address"
                        className="p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        // ADD THESE TWO LINES:
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Amount (SOL)"
                        className="p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        // ADD THESE TWO LINES:
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <button
                        disabled={isSending}
                        onClick={handleSendSOL}
                        className="md:col-span-2 w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                      >
                        {isSending ? (
                          <RefreshCw className="animate-spin" />
                        ) : (
                          "Confirm & Send SOL"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-125 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/30">
                  <div className="p-6 bg-white rounded-full shadow-sm mb-4">
                    <Wallet size={40} className="text-slate-300" />
                  </div>
                  <p className="font-bold text-slate-400">
                    Select an account to view activity
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
