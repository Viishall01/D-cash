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
  Send,
  Eye,
  EyeOff,
  Shield,
  RefreshCw,
  ExternalLink,
  ArrowUpRight,
  Menu,
  ChevronRight,
} from "lucide-react";
import { loadAndDecrypt } from "@/lib/encryption";
import { useRouter } from "next/navigation";
import { colors } from "@/lib/colors";
import { Text, Button, Input, Card, Badge, IconBox } from "@/components/atoms";
import { WalletAccountCard, BalanceDisplay } from "@/components/molecules";

interface Account {
  address: string;
  privateKey: string;
  index: number;
}

export default function SolanaWallet() {
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

  const router = useRouter();

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
    if (!mnemonic) {
      alert("Invalid Password or Decryption Failed");
      return;
    }
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

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [senderKeypair],
      );
      alert(`Sent! ${signature}`);
      setAmount("");
      setRecipient("");
      fetchBalances(accounts);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Transaction failed");
    } finally {
      setIsSending(false);
    }
  };

  const SidebarContent = () => (
    <div
      className="flex flex-col h-full p-6"
      style={{ backgroundColor: colors.bg.tertiary }}
    >
      <div className="flex items-center justify-between mb-8">
        <Text variant="label" color="subtle">
          Wallets
        </Text>
        <button
          onClick={createNewAccount}
          className="p-2 rounded-lg transition-colors"
          style={{ color: colors.text.indigo }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = colors.bg.input)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {accounts.map((acc) => (
          <WalletAccountCard
            key={acc.index}
            index={acc.index}
            address={acc.address}
            balance={balances[acc.address]}
            isSelected={selectedAccount?.address === acc.address}
            onClick={() => {
              setSelectedAccount(acc);
              setIsSidebarOpen(false);
              setAmount("");
              setRecipient("");
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen selection:bg-indigo-500/30"
      style={{ backgroundColor: colors.bg.primary, color: colors.text.primary }}
    >
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="unlock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-screen items-center justify-center p-6"
          >
            <div className="w-full max-w-sm space-y-8 text-center">
              <IconBox
                size="xl"
                variant="brand"
                className="mx-auto rounded-3xl"
              >
                <Shield size={40} style={{ color: colors.text.indigo }} />
              </IconBox>
              <div className="space-y-2">
                <Text variant="h3">Unlock Vault</Text>
                <Text variant="body-sm" color="subtle">
                  Enter password to decrypt your local keys
                </Text>
              </div>
              <Input
                variant="password"
                inputSize="lg"
                placeholder="••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="text-2xl"
              />
              <Button
                variant="primary"
                fullWidth
                size="xl"
                onClick={handleUnlock}
                icon={<ArrowUpRight size={20} />}
              >
                AUTHENTICATE
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="flex h-screen overflow-hidden">
            {/* Desktop Sidebar */}
            <aside
              className="hidden lg:block w-80 shrink-0"
              style={{ borderRight: `1px solid ${colors.border.subtle}` }}
            >
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
                    className="fixed inset-0 backdrop-blur-sm z-40 lg:hidden"
                    style={{ backgroundColor: colors.bg.overlay }}
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
            <main
              className="flex-1 flex flex-col min-w-0 relative"
              style={{ backgroundColor: colors.bg.primary }}
            >
              {/* Header */}
              <header
                className="h-20 flex items-center justify-between px-6 md:px-10 shrink-0 backdrop-blur-md sticky top-0 z-30"
                style={{
                  borderBottom: `1px solid ${colors.border.subtle}`,
                  backgroundColor: `${colors.bg.tertiary}80`,
                }}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-xl"
                    style={{ color: colors.text.primary }}
                  >
                    <Menu size={24} />
                  </button>
                  <Text
                    variant="h4"
                    className="text-xl font-black tracking-tighter hidden md:block"
                  >
                    SOLANA VAULT
                  </Text>
                  <Badge variant="success">Devnet</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="brand"
                    size="sm"
                    icon={<Eye size={16} />}
                    iconPosition="left"
                    onClick={() => router.push("/seed")}
                    className="uppercase tracking-widest font-black text-xs"
                  >
                    View Seed
                  </Button>
                  <button
                    onClick={() => fetchBalances(accounts)}
                    className="p-3 rounded-xl transition-all"
                    style={{
                      backgroundColor: colors.bg.input,
                      border: `1px solid ${colors.border.primary}`,
                    }}
                  >
                    <RefreshCw
                      size={20}
                      className={isLoadingBalance ? "animate-spin" : ""}
                      style={{ color: colors.text.primary }}
                    />
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 custom-scrollbar">
                <AnimatePresence mode="wait">
                  {selectedAccount ? (
                    <motion.div
                      key={selectedAccount.address}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-4xl mx-auto space-y-12"
                    >
                      {/* Hero Balance Section */}
                      <BalanceDisplay
                        balance={balances[selectedAccount.address] || 0}
                        symbol="Sol"
                        accountIndex={selectedAccount.index}
                        address={selectedAccount.address}
                      />

                      {/* Action Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Send Form */}
                        <Card variant="elevated" rounded="xl" padding="md">
                          <div
                            className="absolute top-0 left-0 w-full h-1 opacity-20"
                            style={{ background: colors.gradient.brand }}
                          />
                          <div className="flex items-center gap-3 mb-8">
                            <Send
                              size={20}
                              style={{ color: colors.text.indigo }}
                            />
                            <Text variant="h4">Send Assets</Text>
                          </div>
                          <div className="space-y-6">
                            <Input
                              label="Recipient Address"
                              placeholder="Paste Solana Address"
                              value={recipient}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) => setRecipient(e.target.value)}
                              inputSize="lg"
                            />
                            <Input
                              label="Amount"
                              type="number"
                              placeholder="0.00"
                              value={amount}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) => setAmount(e.target.value)}
                              suffix="SOL"
                              inputSize="lg"
                            />
                            <Button
                              variant="primary"
                              fullWidth
                              size="xl"
                              disabled={isSending}
                              onClick={handleSendSOL}
                              className="uppercase tracking-[0.2em] text-sm"
                            >
                              {isSending ? (
                                <RefreshCw className="animate-spin" size={18} />
                              ) : (
                                "Send Transaction"
                              )}
                            </Button>
                          </div>
                        </Card>

                        {/* Private Key Card */}
                        <div className="space-y-6">
                          <div
                            className="p-8 rounded-[2.5rem] space-y-4"
                            style={{
                              backgroundColor: colors.brand.indigoMuted,
                              border: `1px solid ${colors.brand.indigoBorder}`,
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Shield
                                  size={16}
                                  style={{ color: colors.text.muted }}
                                />
                                <Text variant="overline" color="muted">
                                  Security
                                </Text>
                              </div>
                              <button
                                onClick={() =>
                                  setShowPrivate(
                                    showPrivate === selectedAccount.index
                                      ? null
                                      : selectedAccount.index,
                                  )
                                }
                                className="p-2 rounded-lg transition-colors"
                                style={{ color: colors.text.subtle }}
                              >
                                {showPrivate === selectedAccount.index ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </button>
                            </div>
                            <Text variant="caption" color="subtle">
                              Your private key gives full access to your funds.
                              Never share it.
                            </Text>
                            <div
                              className="p-4 rounded-xl"
                              style={{
                                backgroundColor: "rgba(0,0,0,0.50)",
                                border: `1px solid ${colors.border.subtle}`,
                              }}
                            >
                              <Text
                                variant="mono"
                                className="break-all leading-relaxed"
                                style={{ color: "rgba(129, 140, 248, 0.60)" }}
                              >
                                {showPrivate === selectedAccount.index
                                  ? selectedAccount.privateKey
                                  : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                              </Text>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div
                      className="h-full flex flex-col items-center justify-center space-y-4 border-2 border-dashed rounded-[3rem]"
                      style={{
                        borderColor: colors.border.subtle,
                        color: colors.text.disabled,
                      }}
                    >
                      <div
                        className="p-6 rounded-full"
                        style={{ backgroundColor: colors.bg.input }}
                      >
                        <ChevronRight size={48} className="opacity-20" />
                      </div>
                      <Text variant="overline" color="disabled">
                        Select a wallet to begin
                      </Text>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </main>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.border.subtle};
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
