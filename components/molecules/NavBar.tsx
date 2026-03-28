"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Text, IconBox } from "@/components/atoms";
import { colors } from "@/lib/colors";

export const NavBar: React.FC = () => {
  return (
    <nav
      className="fixed top-0 w-full z-50 backdrop-blur-2xl"
      style={{
        borderBottom: `1px solid ${colors.border.subtle}`,
        backgroundColor: "rgba(0, 0, 0, 0.40)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(to bottom right, ${colors.brand.indigo}, ${colors.brand.purple})`,
              boxShadow: `0 10px 25px ${colors.brand.indigoShadow}`,
            }}
          >
            <Shield size={24} style={{ color: colors.text.primary }} />
          </div>
          <Text
            variant="h4"
            className="text-xl font-black tracking-tighter italic uppercase"
          >
            Vault
          </Text>
        </motion.div>
      </div>
    </nav>
  );
};
