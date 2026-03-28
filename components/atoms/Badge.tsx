import React from "react";
import { colors } from "@/lib/colors";

type BadgeVariant = "success" | "brand" | "warning" | "error" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantConfig: Record<
  BadgeVariant,
  { bg: string; text: string; border?: string }
> = {
  success: {
    bg: colors.status.successMuted,
    text: colors.status.success,
  },
  brand: {
    bg: colors.brand.indigoMuted,
    text: colors.text.indigo,
    border: colors.brand.indigoBorder,
  },
  warning: {
    bg: colors.status.warningMuted,
    text: colors.status.warningStrong,
    border: colors.status.warningBorder,
  },
  error: {
    bg: colors.status.errorMuted,
    text: colors.status.errorText,
    border: colors.status.errorBorder,
  },
  neutral: {
    bg: colors.bg.input,
    text: colors.text.muted,
    border: colors.border.primary,
  },
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "brand",
  className = "",
}) => {
  const vc = variantConfig[variant];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${className}`}
      style={{
        backgroundColor: vc.bg,
        color: vc.text,
        border: vc.border ? `1px solid ${vc.border}` : undefined,
      }}
    >
      {children}
    </span>
  );
};
