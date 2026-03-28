import React from "react";
import { colors } from "@/lib/colors";

interface DividerProps {
  className?: string;
  vertical?: boolean;
}

export const Divider: React.FC<DividerProps> = ({
  className = "",
  vertical = false,
}) => {
  return (
    <div
      className={`${vertical ? "w-px h-full" : "h-px w-full"} ${className}`}
      style={{ backgroundColor: colors.border.subtle }}
    />
  );
};
