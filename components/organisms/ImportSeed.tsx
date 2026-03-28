"use client";
import { useState } from "react";
import * as bip39 from "bip39";
import { motion, AnimatePresence } from "framer-motion";
import { encryptAndSave } from "@/lib/encryption";
import { ShieldCheck, KeyRound, ArrowRight } from "lucide-react";
import { colors } from "@/lib/colors";
import { Text, Button, Input, GlowBackground } from "@/components/atoms";
import { StepIndicator, ErrorAlert } from "@/components/molecules";

export default function ImportSeed({
  onImportSuccess,
}: {
  onImportSuccess: () => void;
}) {
  const [mnemonicInput, setMnemonicInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const handleValidateAndNext = () => {
    const cleanMnemonic = mnemonicInput
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
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
      encryptAndSave(mnemonicInput, password);
      localStorage.setItem("account_count", "1");
      onImportSuccess();
    } catch {
      setError("Failed to secure vault.");
    }
  };

  return (
    <div
      className="min-h-screen w-full overflow-hidden selection:bg-indigo-500/30"
      style={{ backgroundColor: colors.bg.primary, color: colors.text.primary }}
    >
      {/* Dynamic Background Glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${colors.brand.indigoGlow}, transparent)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2"
      >
        {/* LEFT PANEL: Branding */}
        <div
          className="relative hidden lg:flex flex-col justify-between p-16 xl:p-24 overflow-hidden"
          style={{
            backgroundColor: colors.bg.tertiary,
            borderRight: `1px solid ${colors.border.subtle}`,
          }}
        >
          <div className="relative z-10 space-y-8">
            <div
              className="flex items-center gap-4"
              style={{ color: colors.brand.indigo }}
            >
              <div
                className="p-3 rounded-2xl"
                style={{
                  backgroundColor: colors.brand.indigoMuted,
                  border: `1px solid ${colors.brand.indigoBorder}`,
                }}
              >
                <ShieldCheck size={38} />
              </div>
              <span className="font-black tracking-tighter text-3xl uppercase italic">
                Vault-S
              </span>
            </div>

            <Text variant="h1" className="text-6xl xl:text-8xl leading-[0.9]">
              RESTORE <br />
              <span style={{ color: colors.brand.indigo }}>ACCESS.</span>
            </Text>
            <Text variant="body" color="subtle" className="text-xl max-w-md">
              Re-enter your recovery phrase to decrypt your local vault and
              regain control of your digital identity.
            </Text>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <Text variant="label" style={{ color: colors.text.indigo }}>
                Security
              </Text>
              <Text variant="body-sm" color="subtle" className="italic">
                Local-only AES-256 Encryption
              </Text>
            </div>
            <div className="space-y-2">
              <Text variant="label" style={{ color: colors.text.indigo }}>
                Privacy
              </Text>
              <Text variant="body-sm" color="subtle" className="italic">
                Zero-Knowledge Architecture
              </Text>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: The Form */}
        <div
          className="flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 relative"
          style={{ backgroundColor: colors.bg.primary }}
        >
          {/* Mobile Branding */}
          <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
            <KeyRound size={24} style={{ color: colors.brand.indigo }} />
            <span className="font-black tracking-tighter text-lg uppercase">
              Vault-S
            </span>
          </div>

          <div className="w-full max-w-xl space-y-12">
            <StepIndicator
              currentStep={step}
              totalSteps={2}
              labels={["Authentication", "Secure Vault"]}
            />

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <Input
                      variant="textarea"
                      inputSize="xl"
                      placeholder="Enter your secret words here..."
                      textareaValue={mnemonicInput}
                      onTextareaChange={(
                        e: React.ChangeEvent<HTMLTextAreaElement>,
                      ) => setMnemonicInput(e.target.value)}
                      rows={8}
                      autoFocus
                    />

                    {error && <ErrorAlert message={error} />}

                    <Button
                      variant="primary"
                      size="xl"
                      fullWidth
                      onClick={handleValidateAndNext}
                      icon={<ArrowRight size={24} />}
                      className="text-xl shadow-2xl"
                    >
                      VALIDATE PHRASE
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="space-y-10"
                >
                  <div className="space-y-8">
                    <Input
                      variant="password"
                      inputSize="xl"
                      label="Vault Password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      autoFocus
                      className="text-3xl tracking-[0.5em] text-center"
                    />

                    <div className="space-y-4 pt-4">
                      <Button
                        variant="brand"
                        size="xl"
                        fullWidth
                        onClick={handleFinalImport}
                        icon={<ShieldCheck size={24} />}
                        iconPosition="left"
                        className="text-xl shadow-2xl"
                      >
                        ACCESS VAULT
                      </Button>

                      <button
                        onClick={() => setStep(1)}
                        className="w-full text-xs font-black uppercase tracking-[0.3em] transition-colors py-4"
                        style={{ color: colors.text.disabled }}
                      >
                        Go back to phrase entry
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <footer className="absolute bottom-8">
            <Text
              variant="label"
              color="disabled"
              className="tracking-[0.5em] text-[10px]"
            >
              Military Grade Client-Side Encryption
            </Text>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
