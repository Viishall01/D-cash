import React from "react";
import { colors } from "@/lib/colors";

interface SeedWordProps {
  word: string;
  index: number;
  className?: string;
}

export const SeedWord: React.FC<SeedWordProps> = ({
  word,
  index,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl ${className}`}
      style={{
        backgroundColor: colors.bg.input,
        border: `1px solid ${colors.border.subtle}`,
      }}
    >
      <span
        className="text-[10px] font-mono font-black"
        style={{ color: colors.text.indigoMuted }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className="text-sm font-bold tracking-wide"
        style={{ color: colors.text.secondary }}
      >
        {word}
      </span>
    </div>
  );
};
