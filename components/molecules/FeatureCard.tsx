"use client";
import React from "react";
import { motion } from "framer-motion";
import { Text, IconBox } from "@/components/atoms";
import { colors } from "@/lib/colors";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        y: -12,
        backgroundColor: colors.bg.cardHover,
      }}
      className="p-10 rounded-4xl backdrop-blur-sm transition-all duration-300"
      style={{
        backgroundColor: colors.bg.card,
        border: `1px solid ${colors.border.subtle}`,
      }}
    >
      <IconBox size="lg" variant="brand" className="mb-8">
        {icon}
      </IconBox>
      <Text variant="h4" className="text-2xl mb-4">
        {title}
      </Text>
      <Text variant="body-sm" color="muted" className="leading-relaxed">
        {description}
      </Text>
    </motion.div>
  );
};
