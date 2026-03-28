"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock } from "lucide-react";
import { Text, Button, Input, IconBox, Card } from "@/components/atoms";
import { colors } from "@/lib/colors";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  password: string;
  onPasswordChange: (val: string) => void;
  title?: string;
  description?: string;
  submitLabel?: string;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  password,
  onPasswordChange,
  title = "Set Vault Password",
  description = "This password encrypts your seed phrase inside your browser.",
  submitLabel = "Secure & Create Wallet",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-md"
            style={{ backgroundColor: colors.bg.overlay }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card
              variant="elevated"
              rounded="xl"
              padding="lg"
              className="relative max-w-sm w-full"
              style={{ backgroundColor: colors.bg.tertiary }}
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 transition-colors"
                style={{ color: colors.text.subtle }}
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <IconBox size="lg" variant="brand" className="mx-auto mb-4">
                  <Lock size={30} style={{ color: colors.text.indigo }} />
                </IconBox>
                <Text variant="h4" className="mb-2">
                  {title}
                </Text>
                <Text variant="caption" color="subtle" className="px-4">
                  {description}
                </Text>
              </div>

              <Input
                variant="password"
                inputSize="lg"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onPasswordChange(e.target.value)
                }
                placeholder="••••••••"
                autoFocus
                className="mb-6"
              />

              <Button variant="brand" fullWidth size="lg" onClick={onSubmit}>
                {submitLabel}
              </Button>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
