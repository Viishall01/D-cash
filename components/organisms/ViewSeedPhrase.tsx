"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadAndDecrypt } from "@/lib/encryption";
import { Lock, Eye, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { colors } from "@/lib/colors";
import { Text, Button, Input, Card, IconBox } from "@/components/atoms";
import { SeedPhraseGrid, WarningBanner } from "@/components/molecules";

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
      setError("Authorization failed. Incorrect password.");
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
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 selection:bg-indigo-500/30"
      style={{ backgroundColor: colors.bg.primary, color: colors.text.primary }}
    >
      {/* Background Ambience */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.08), transparent)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full relative"
      >
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8 px-2">
          <Link
            href="/wallet"
            className="flex items-center gap-2 transition-colors"
            style={{ color: colors.text.subtle }}
          >
            <ArrowLeft size={14} />
            <Text variant="label" color="inherit">
              Back to Vault
            </Text>
          </Link>
          <div
            className="h-px flex-1 mx-4"
            style={{ backgroundColor: colors.border.subtle }}
          />
          <Text variant="label" style={{ color: colors.text.indigo }}>
            Security Protocol
          </Text>
        </div>

        <Card variant="elevated" rounded="2xl" padding="none">
          <div
            className="p-6 md:p-12"
            style={{
              background: `linear-gradient(to bottom, rgba(255,255,255,0.03), transparent)`,
            }}
          >
            <AnimatePresence mode="wait">
              {!show ? (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <IconBox
                      size="xl"
                      variant="brand"
                      className="mx-auto mb-6 shadow-lg"
                    >
                      <Lock size={32} style={{ color: colors.text.indigo }} />
                    </IconBox>
                    <Text variant="h3" className="mb-2">
                      Identify Yourself
                    </Text>
                    <Text variant="caption" color="subtle">
                      Decryption key required to view recovery phrase.
                    </Text>
                  </div>

                  <div className="space-y-4">
                    <Input
                      variant="password"
                      inputSize="lg"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      placeholder="••••••••"
                      className="text-xl"
                    />

                    {error && (
                      <p
                        className="text-[11px] font-bold text-center p-3 rounded-xl"
                        style={{
                          color: colors.status.errorText,
                          backgroundColor: colors.status.errorMuted,
                          border: `1px solid ${colors.status.errorBorder}`,
                        }}
                      >
                        {error}
                      </p>
                    )}

                    <Button
                      variant="primary"
                      fullWidth
                      size="xl"
                      onClick={handleReveal}
                      icon={<Eye size={20} />}
                      iconPosition="left"
                      className="shadow-xl active:scale-95"
                    >
                      Reveal Phrase
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Words Grid */}
                  {mnemonic && (
                    <SeedPhraseGrid
                      mnemonic={mnemonic}
                      onCopy={copyToClipboard}
                      copied={copied}
                    />
                  )}

                  {/* Warning Box */}
                  <WarningBanner title="Security Protocol">
                    Ensure no one is looking at your screen. These words bypass
                    all security measures.
                  </WarningBanner>

                  <button
                    onClick={() => {
                      setShow(false);
                      setPassword("");
                    }}
                    className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: colors.bg.input,
                      color: colors.text.muted,
                    }}
                  >
                    <X size={14} /> Lock and Hide Phrase
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ViewSeedPhrase;
