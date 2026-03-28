import React from "react";
import { colors } from "@/lib/colors";

type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "body-sm"
  | "caption"
  | "label"
  | "overline"
  | "mono"
  | "gradient";

type TextColor =
  | "primary"
  | "secondary"
  | "muted"
  | "subtle"
  | "disabled"
  | "dark"
  | "indigo"
  | "success"
  | "warning"
  | "error"
  | "inherit";

interface TextProps {
  variant?: TextVariant;
  color?: TextColor;
  as?: keyof React.JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const variantStyles: Record<TextVariant, string> = {
  h1: "text-6xl md:text-[100px] font-black tracking-tight leading-[0.85]",
  h2: "text-4xl md:text-5xl font-black tracking-tighter",
  h3: "text-2xl md:text-3xl font-black tracking-tighter",
  h4: "text-xl font-bold",
  body: "text-base md:text-lg font-medium leading-relaxed",
  "body-sm": "text-sm font-medium leading-relaxed",
  caption: "text-xs font-medium",
  label: "text-[10px] font-black uppercase tracking-widest",
  overline: "text-xs font-bold tracking-widest uppercase",
  mono: "text-xs font-mono",
  gradient:
    "text-6xl md:text-[100px] font-black tracking-tight leading-[0.85] text-transparent bg-clip-text",
};

const colorMap: Record<TextColor, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  muted: colors.text.muted,
  subtle: colors.text.subtle,
  disabled: colors.text.disabled,
  dark: colors.text.dark,
  indigo: colors.text.indigo,
  success: colors.status.success,
  warning: colors.status.warningStrong,
  error: colors.status.errorText,
  inherit: "inherit",
};

const defaultElements: Record<TextVariant, keyof React.JSX.IntrinsicElements> =
  {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    body: "p",
    "body-sm": "p",
    caption: "p",
    label: "label",
    overline: "span",
    mono: "span",
    gradient: "span",
  };

export const Text: React.FC<TextProps> = ({
  variant = "body",
  color = "primary",
  as,
  children,
  className = "",
  style = {},
}) => {
  const Element = as || defaultElements[variant];

  const combinedStyle: React.CSSProperties = {
    color: color !== "inherit" ? colorMap[color] : undefined,
    ...(variant === "gradient"
      ? { backgroundImage: colors.gradient.brandText }
      : {}),
    ...style,
  };

  return React.createElement(
    Element,
    {
      className: `${variantStyles[variant]} ${className}`.trim(),
      style: combinedStyle,
    },
    children,
  );
};
