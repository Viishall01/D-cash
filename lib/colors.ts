/**
 * Centralized Color Configuration for Vault App
 * All colors used across the app are defined here.
 * Components should import from this file instead of hardcoding color values.
 */

export const colors = {
  // ─── Core Backgrounds ─────────────────────────────────────
  bg: {
    primary: "#020203",
    secondary: "#0a0a0c",
    tertiary: "#050507",
    overlay: "rgba(0, 0, 0, 0.80)",
    card: "rgba(255, 255, 255, 0.02)",
    cardHover: "rgba(255, 255, 255, 0.05)",
    cardSubtle: "rgba(255, 255, 255, 0.01)",
    input: "rgba(255, 255, 255, 0.05)",
  },

  // ─── Brand / Accent ────────────────────────────────────────
  brand: {
    indigo: "#4f46e5",
    indigoLight: "#818cf8",
    indigoMuted: "rgba(79, 70, 229, 0.10)",
    indigoBorder: "rgba(79, 70, 229, 0.20)",
    indigoGlow: "rgba(79, 70, 229, 0.15)",
    indigoShadow: "rgba(99, 102, 241, 0.20)",
    purple: "#9333ea",
    purpleLight: "#c084fc",
    pink: "#ec4899",
    pinkLight: "#f472b6",
  },

  // ─── Text Colors ────────────────────────────────────────────
  text: {
    primary: "#ffffff",
    secondary: "#e2e8f0",
    muted: "#94a3b8",
    subtle: "#64748b",
    disabled: "#334155",
    dark: "#171717",
    indigo: "#818cf8",
    indigoMuted: "rgba(99, 102, 241, 0.40)",
  },

  // ─── Border Colors ─────────────────────────────────────────
  border: {
    primary: "rgba(255, 255, 255, 0.10)",
    subtle: "rgba(255, 255, 255, 0.05)",
    focus: "#4f46e5",
    active: "rgba(99, 102, 241, 0.90)",
  },

  // ─── Status / Feedback ─────────────────────────────────────
  status: {
    success: "#22c55e",
    successMuted: "rgba(34, 197, 94, 0.10)",
    warning: "#f59e0b",
    warningMuted: "rgba(245, 158, 11, 0.05)",
    warningBorder: "rgba(245, 158, 11, 0.20)",
    warningText: "rgba(253, 224, 71, 0.60)",
    warningStrong: "#f59e0b",
    error: "#ef4444",
    errorMuted: "rgba(248, 113, 113, 0.05)",
    errorBorder: "rgba(248, 113, 113, 0.10)",
    errorText: "#f87171",
  },

  // ─── Feature Accent Colors ─────────────────────────────────
  feature: {
    yellow: "#facc15",
    yellowMuted: "rgba(250, 204, 21, 0.40)",
    emerald: "#34d399",
    emeraldMuted: "rgba(52, 211, 153, 0.20)",
    emeraldBorder: "rgba(52, 211, 153, 0.30)",
  },

  // ─── Gradients (as strings for tailwind arbitrary values) ──
  gradient: {
    brand: "linear-gradient(to right, #4f46e5, #9333ea, #ec4899)",
    brandText: "linear-gradient(to right, #818cf8, #c084fc, #f472b6)",
    progressBar: "linear-gradient(to right, #4f46e5, #9333ea, #ec4899)",
    cardGlow: "linear-gradient(to right, #4f46e5, #9333ea)",
    bgFade: "linear-gradient(to bottom, transparent, rgba(49, 46, 129, 0.05))",
  },
} as const;

// ─── CSS Variable Map (injected into :root via globals.css) ──
export const cssVariables = {
  "--vault-bg-primary": colors.bg.primary,
  "--vault-bg-secondary": colors.bg.secondary,
  "--vault-bg-tertiary": colors.bg.tertiary,
  "--vault-bg-overlay": colors.bg.overlay,
  "--vault-bg-card": colors.bg.card,
  "--vault-bg-card-hover": colors.bg.cardHover,
  "--vault-bg-input": colors.bg.input,

  "--vault-brand": colors.brand.indigo,
  "--vault-brand-light": colors.brand.indigoLight,
  "--vault-brand-muted": colors.brand.indigoMuted,
  "--vault-brand-border": colors.brand.indigoBorder,
  "--vault-brand-glow": colors.brand.indigoGlow,
  "--vault-brand-shadow": colors.brand.indigoShadow,
  "--vault-purple": colors.brand.purple,
  "--vault-pink": colors.brand.pink,

  "--vault-text-primary": colors.text.primary,
  "--vault-text-secondary": colors.text.secondary,
  "--vault-text-muted": colors.text.muted,
  "--vault-text-subtle": colors.text.subtle,
  "--vault-text-disabled": colors.text.disabled,
  "--vault-text-dark": colors.text.dark,
  "--vault-text-indigo": colors.text.indigo,

  "--vault-border": colors.border.primary,
  "--vault-border-subtle": colors.border.subtle,
  "--vault-border-focus": colors.border.focus,

  "--vault-success": colors.status.success,
  "--vault-success-muted": colors.status.successMuted,
  "--vault-warning": colors.status.warning,
  "--vault-warning-muted": colors.status.warningMuted,
  "--vault-warning-border": colors.status.warningBorder,
  "--vault-warning-text": colors.status.warningText,
  "--vault-error": colors.status.error,
  "--vault-error-muted": colors.status.errorMuted,
  "--vault-error-text": colors.status.errorText,
} as const;

export type ColorToken = typeof colors;
