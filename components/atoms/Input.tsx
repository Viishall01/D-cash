import React from "react";
import { colors } from "@/lib/colors";

type InputVariant = "default" | "password" | "textarea" | "search";
type InputSize = "md" | "lg" | "xl";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  variant?: InputVariant;
  inputSize?: InputSize;
  label?: string;
  error?: string;
  suffix?: React.ReactNode;
  fullWidth?: boolean;
  // For textarea variant
  rows?: number;
  textareaValue?: string;
  onTextareaChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const sizeStyles: Record<InputSize, string> = {
  md: "p-3 text-sm rounded-xl",
  lg: "p-5 text-base rounded-2xl",
  xl: "p-8 text-xl rounded-[2.5rem]",
};

export const Input: React.FC<InputProps> = ({
  variant = "default",
  inputSize = "lg",
  label,
  error,
  suffix,
  fullWidth = true,
  className = "",
  rows = 8,
  textareaValue,
  onTextareaChange,
  style = {},
  ...rest
}) => {
  const baseStyle: React.CSSProperties = {
    backgroundColor: colors.bg.input,
    borderColor: error ? colors.status.errorText : colors.border.primary,
    color: colors.text.primary,
    ...style,
  };

  const focusClass = `outline-none focus:ring-2 focus:ring-[${colors.border.focus}] transition-all`;

  if (variant === "textarea") {
    return (
      <div className={`space-y-2 ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            className="text-[10px] font-black uppercase tracking-[0.4em] ml-2"
            style={{ color: colors.text.subtle }}
          >
            {label}
          </label>
        )}
        <div className="relative group">
          <div
            className="absolute -inset-1 rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-25 transition duration-1000"
            style={{ background: colors.gradient.brand }}
          />
          <textarea
            className={`relative ${fullWidth ? "w-full" : ""} ${sizeStyles[inputSize]} border ${focusClass} font-mono leading-relaxed resize-none ${className}`}
            style={{
              ...baseStyle,
              color: colors.text.indigo,
            }}
            rows={rows}
            value={textareaValue}
            onChange={onTextareaChange}
            placeholder={rest.placeholder}
            autoFocus={rest.autoFocus}
          />
        </div>
        {error && (
          <p
            className="text-[11px] font-bold mt-1"
            style={{ color: colors.status.errorText }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          className="text-[10px] font-black uppercase tracking-widest ml-1"
          style={{ color: colors.text.subtle }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`${fullWidth ? "w-full" : ""} border ${sizeStyles[inputSize]} ${focusClass} ${
            variant === "password" ? "text-center tracking-widest" : ""
          } ${className}`}
          style={baseStyle}
          type={variant === "password" ? "password" : rest.type || "text"}
          {...rest}
        />
        {suffix && (
          <span
            className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold"
            style={{ color: colors.text.subtle }}
          >
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p
          className="text-[11px] font-bold mt-1"
          style={{ color: colors.status.errorText }}
        >
          {error}
        </p>
      )}
    </div>
  );
};
