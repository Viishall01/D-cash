import React from "react";
import { colors } from "@/lib/colors";
import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  className = "",
}) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-3 text-xs font-black p-5 rounded-2xl uppercase tracking-wider ${className}`}
      style={{
        color: colors.status.errorText,
        backgroundColor: colors.status.errorMuted,
        border: `1px solid ${colors.status.errorBorder}`,
      }}
    >
      <AlertCircle size={18} /> {message}
    </div>
  );
};
