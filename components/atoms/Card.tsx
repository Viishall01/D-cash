import React from "react";
import { colors } from "@/lib/colors";

type CardVariant = "default" | "elevated" | "outlined" | "glass";

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: "md" | "lg" | "xl" | "2xl" | "3xl";
  onClick?: () => void;
  style?: React.CSSProperties;
}

const paddingStyles: Record<string, string> = {
  none: "",
  sm: "p-4",
  md: "p-6 md:p-8",
  lg: "p-8 md:p-12",
};

const roundedStyles: Record<string, string> = {
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-[2.5rem]",
  "2xl": "rounded-[2.5rem] md:rounded-[3rem]",
  "3xl": "rounded-[3rem]",
};

const variantConfig: Record<
  CardVariant,
  { bg: string; border: string; shadow?: string; backdrop?: string }
> = {
  default: {
    bg: colors.bg.secondary,
    border: colors.border.primary,
  },
  elevated: {
    bg: colors.bg.secondary,
    border: colors.border.primary,
    shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.50)",
  },
  outlined: {
    bg: colors.bg.card,
    border: colors.border.subtle,
  },
  glass: {
    bg: "rgba(13, 13, 15, 0.8)",
    border: colors.border.primary,
    backdrop: "blur(16px)",
  },
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  className = "",
  padding = "md",
  rounded = "xl",
  onClick,
  style = {},
}) => {
  const vc = variantConfig[variant];

  return (
    <div
      className={`${paddingStyles[padding]} ${roundedStyles[rounded]} ${
        onClick ? "cursor-pointer" : ""
      } overflow-hidden ${className}`}
      style={{
        backgroundColor: vc.bg,
        border: `1px solid ${vc.border}`,
        boxShadow: vc.shadow,
        backdropFilter: vc.backdrop,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
