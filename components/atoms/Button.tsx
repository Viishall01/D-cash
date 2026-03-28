import React from "react";
import { colors } from "@/lib/colors";

type ButtonVariant = "primary" | "secondary" | "ghost" | "brand" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs rounded-lg",
  md: "px-5 py-3 text-sm rounded-xl",
  lg: "px-8 py-4 text-base rounded-2xl",
  xl: "px-10 py-5 text-base rounded-2xl",
};

const variantBaseStyles: Record<ButtonVariant, string> = {
  primary:
    "font-black hover:-translate-y-0.5 active:scale-[0.98] transition-all",
  secondary: "font-bold hover:-translate-y-0.5 transition-all",
  ghost: "font-bold transition-all",
  brand:
    "font-black hover:opacity-90 active:scale-[0.98] transition-all shadow-lg",
  danger: "font-bold active:scale-[0.98] transition-all",
};

const variantColors: Record<
  ButtonVariant,
  { bg: string; text: string; border?: string; hoverBg?: string }
> = {
  primary: {
    bg: colors.text.primary,
    text: colors.text.dark,
    hoverBg: "#eef2ff", // indigo-50
  },
  secondary: {
    bg: colors.bg.input,
    text: colors.text.secondary,
    border: colors.border.primary,
    hoverBg: colors.bg.cardHover,
  },
  ghost: {
    bg: "transparent",
    text: colors.text.muted,
    hoverBg: colors.bg.input,
  },
  brand: {
    bg: colors.brand.indigo,
    text: colors.text.primary,
    hoverBg: "#6366f1", // indigo-500 lighter
  },
  danger: {
    bg: colors.status.errorMuted,
    text: colors.status.errorText,
    border: colors.status.errorBorder,
  },
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  icon,
  iconPosition = "right",
  children,
  className = "",
  disabled,
  style = {},
  ...rest
}) => {
  const vc = variantColors[variant];

  const combinedStyle: React.CSSProperties = {
    backgroundColor: vc.bg,
    color: vc.text,
    border: vc.border ? `1px solid ${vc.border}` : undefined,
    boxShadow:
      variant === "brand"
        ? `0 10px 25px ${colors.brand.indigoShadow}`
        : undefined,
    width: fullWidth ? "100%" : undefined,
    ...style,
  };

  return (
    <button
      className={`
        flex items-center justify-center gap-2
        ${sizeStyles[size]}
        ${variantBaseStyles[variant]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-20 cursor-not-allowed" : ""}
        ${className}
      `.trim()}
      style={combinedStyle}
      disabled={disabled}
      {...rest}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
};
