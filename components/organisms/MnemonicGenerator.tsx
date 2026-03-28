"use client";
import * as bip39 from "bip39";
import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Lock, ArrowRight } from "lucide-react";
import { encryptAndSave } from "@/lib/encryption";
import { useRouter } from "next/navigation";
import { colors } from "@/lib/colors";
import {
  Text,
  Button,
  Card,
  IconBox,
  GlowBackground,
} from "@/components/atoms";
import {
  SeedPhraseGrid,
  PasswordModal,
  WarningBanner,
} from "@/components/molecules";

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
    alert("Vault Secured Successfully!");
    router.push("wallet");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30"
      style={{ backgroundColor: colors.bg.primary, color: colors.text.primary }}
    >
      {/* Background Glow */}
      <GlowBackground position="center" size={600} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        {/* Header Section */}
        <div className="text-center mb-10 space-y-3">
          <IconBox size="lg" variant="ghost" className="mx-auto mb-4">
            <Lock size={28} style={{ color: colors.text.indigo }} />
          </IconBox>
          <Text variant="h2">Secure Your Vault</Text>
          <Text variant="body-sm" color="subtle" className="max-w-sm mx-auto">
            Generate your unique recovery phrase. This is the master key to your
            digital assets.
          </Text>
        </div>

        {/* Main Card */}
        <Card variant="elevated" rounded="xl" padding="none">
          <div className="p-8 space-y-8">
            {/* Mnemonic Display */}
            <div className="relative group">
              {!mnemonic && (
                <div
                  className="min-h-[220px] flex flex-col items-center justify-center text-center border-dashed rounded-[2rem]"
                  style={{
                    backgroundColor: colors.bg.cardSubtle,
                    border: `1px dashed ${colors.border.subtle}`,
                  }}
                >
                  <Text
                    variant="body-sm"
                    color="disabled"
                    className="font-medium tracking-wide"
                  >
                    No phrase generated yet
                  </Text>
                  <Text
                    variant="label"
                    color="disabled"
                    className="mt-2 text-[10px] tracking-[0.2em]"
                  >
                    BIP-39 Standard Ready
                  </Text>
                </div>
              )}

              {mnemonic && (
                <SeedPhraseGrid
                  mnemonic={mnemonic}
                  onCopy={copyToClipboard}
                  copied={copied}
                />
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button
                variant="primary"
                fullWidth
                size="xl"
                onClick={generateMnemonic}
                icon={
                  <RefreshCw
                    size={20}
                    className={mnemonic ? "animate-spin-once" : ""}
                  />
                }
                iconPosition="left"
              >
                {mnemonic ? "Generate New Secret" : "Generate Recovery Phrase"}
              </Button>

              <Button
                variant="secondary"
                fullWidth
                size="xl"
                disabled={!mnemonic}
                onClick={() => setShowPasswordBox(true)}
                icon={<ArrowRight size={18} />}
              >
                Continue to Secure Storage
              </Button>
            </div>

            {/* Warning */}
            <WarningBanner variant="critical">
              <strong>Critical:</strong> Write these words on paper and hide
              them. Digital copies (screenshots, notes) are vulnerable to
              hackers.
            </WarningBanner>
          </div>
        </Card>
      </motion.div>

      {/* Password Modal */}
      <PasswordModal
        isOpen={showPasswordBox}
        onClose={() => setShowPasswordBox(false)}
        onSubmit={handleSaveToLocalStorage}
        password={password}
        onPasswordChange={setPassword}
      />

      <footer className="mt-12">
        <Text variant="label" color="disabled" className="tracking-[0.3em]">
          Standard BIP-39 Entropy • 2026 Vault Security
        </Text>
      </footer>
    </div>
  );
}
