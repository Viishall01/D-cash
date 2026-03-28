import React from "react";
import { colors } from "@/lib/colors";

type IconBoxSize = "sm" | "md" | "lg" | "xl";
type IconBoxVariant = "brand" | "ghost" | "subtle";

interface IconBoxProps {
  children: React.ReactNode;
  size?: IconBoxSize;
  variant?: IconBoxVariant;
  className?: string;
}

const sizeStyles: Record<IconBoxSize, string> = {
  sm: "w-8 h-8 rounded-lg",
  md: "w-10 h-10 rounded-xl",
  lg: "w-14 h-14 rounded-2xl",
  xl: "w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem]",
};

const variantStyles: Record<IconBoxVariant, { bg: string; border: string }> = {
  brand: {
    bg: colors.brand.indigoMuted,
    border: colors.brand.indigoBorder,
  },
  ghost: {
    bg: colors.bg.input,
    border: colors.border.primary,
  },
  subtle: {
    bg: "transparent",
    border: "transparent",
  },
};

export const IconBox: React.FC<IconBoxProps> = ({
  children,
  size = "md",
  variant = "brand",
  className = "",
}) => {
  const vs = variantStyles[variant];

  return (
    <div
      className={`flex items-center justify-center ${sizeStyles[size]} ${className}`}
      style={{
        backgroundColor: vs.bg,
        border: `1px solid ${vs.border}`,
      }}
    >
      {children}
    </div>
  );
};
