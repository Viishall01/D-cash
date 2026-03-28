"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { Plus, Wallet, Send, Eye, EyeOff, Shield } from "lucide-react";
import { loadAndDecrypt } from "@/lib/encryption";
import { colors } from "@/lib/colors";
import { Text, Button, Input, Card, IconBox } from "@/components/atoms";

interface Account {
  address: string;
  publicKey: string;
  privateKey: string;
  index: number;
}

export default function EthereumAccount() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showPrivate, setShowPrivate] = useState<number | null>(null);

  const deriveAccounts = (mnemonicPhrase: string, count: number) => {
    const derived: Account[] = [];
    const mnemonic = ethers.Mnemonic.fromPhrase(mnemonicPhrase);

    for (let i = 0; i < count; i++) {
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

  if (!isUnlocked) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-6"
        style={{ backgroundColor: colors.bg.primary }}
      >
        <Card
          variant="elevated"
          padding="lg"
          className="w-full max-w-sm space-y-4"
        >
          <IconBox size="xl" variant="brand" className="mx-auto mb-2">
            <Shield size={48} style={{ color: colors.text.indigo }} />
          </IconBox>
          <Text variant="h4" className="text-center">
            Unlock Your Vault
          </Text>
          <Input
            variant="password"
            inputSize="lg"
            placeholder="Enter Vault Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <Button variant="brand" fullWidth size="lg" onClick={handleUnlock}>
            Unlock Wallet
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="max-w-6xl mx-auto p-8"
      style={{ color: colors.text.primary, backgroundColor: colors.bg.primary }}
    >
      <header className="flex justify-between items-center mb-8">
        <div>
          <Text variant="h3">Vault Dashboard</Text>
          <Text variant="body-sm" color="subtle">
            Manage your derived Ethereum accounts
          </Text>
        </div>
        <Button
          variant="brand"
          size="md"
          icon={<Plus size={20} />}
          iconPosition="left"
          onClick={createNewAccount}
        >
          New Account
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Accounts List */}
        <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {accounts.map((acc) => (
            <Card
              key={acc.index}
              variant={
                selectedAccount?.address === acc.address
                  ? "elevated"
                  : "outlined"
              }
              padding="sm"
              rounded="lg"
              onClick={() => setSelectedAccount(acc)}
              className="cursor-pointer transition-all"
              style={
                selectedAccount?.address === acc.address
                  ? {
                      borderColor: colors.brand.indigo,
                      backgroundColor: colors.brand.indigoMuted,
                    }
                  : {}
              }
            >
              <div className="flex items-center gap-3">
                <IconBox size="sm" variant="ghost">
                  <Wallet size={18} style={{ color: colors.brand.indigo }} />
                </IconBox>
                <Text variant="body-sm" className="font-bold">
                  Account #{acc.index + 1}
                </Text>
              </div>
              <Text
                variant="mono"
                color="subtle"
                className="mt-2 text-[11px] truncate"
              >
                {acc.address}
              </Text>
            </Card>
          ))}
        </div>

        {/* Right: Selected Account Details & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAccount ? (
            <Card
              variant="elevated"
              padding="lg"
              rounded="xl"
              className="space-y-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <Text variant="h3" className="text-2xl">
                    Account #{selectedAccount.index + 1}
                  </Text>
                  <Text
                    variant="mono"
                    color="subtle"
                    className="break-all mt-1 text-sm"
                  >
                    {selectedAccount.address}
                  </Text>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: colors.status.successMuted,
                    color: colors.status.success,
                  }}
                >
                  Active
                </span>
              </div>

              <div
                className="p-4 rounded-2xl space-y-3"
                style={{ backgroundColor: colors.bg.card }}
              >
                <Text
                  variant="label"
                  color="subtle"
                  className="tracking-widest"
                >
                  Secure Private Key
                </Text>
                <div className="flex items-center justify-between">
                  <Text variant="mono" color="subtle" className="break-all">
                    {showPrivate === selectedAccount.index
                      ? selectedAccount.privateKey
                      : "••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                  </Text>
                  <button
                    onClick={() =>
                      setShowPrivate(
                        showPrivate === selectedAccount.index
                          ? null
                          : selectedAccount.index,
                      )
                    }
                    className="p-2 rounded-lg transition"
                    style={{ color: colors.text.subtle }}
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
              <div
                className="pt-4 space-y-4"
                style={{ borderTop: `1px solid ${colors.border.subtle}` }}
              >
                <div className="flex items-center gap-2 font-bold">
                  <Send size={18} style={{ color: colors.brand.indigo }} />
                  <Text variant="body-sm">Transfer Funds</Text>
                </div>
                <div className="grid gap-4">
                  <Input placeholder="Recipient Address" inputSize="md" />
                  <Input
                    type="number"
                    placeholder="Amount (ETH)"
                    inputSize="md"
                  />
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    style={{
                      backgroundColor: colors.bg.primary,
                      color: colors.text.primary,
                    }}
                  >
                    Send Transaction
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div
              className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-3xl"
              style={{
                borderColor: colors.border.subtle,
                backgroundColor: colors.bg.card,
              }}
            >
              <Wallet
                size={48}
                className="mb-2 opacity-20"
                style={{ color: colors.text.subtle }}
              />
              <Text variant="body-sm" color="subtle">
                Select an account to view details
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
