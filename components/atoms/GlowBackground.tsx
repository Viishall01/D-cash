import React from "react";
import { colors } from "@/lib/colors";

interface GlowBackgroundProps {
  /** Position of the glow: center, top-left, top-right, bottom-right */
  position?: "center" | "top-left" | "top-right" | "bottom-right";
  /** Size in px */
  size?: number;
  /** Color override */
  color?: string;
  className?: string;
}

const positionStyles: Record<string, string> = {
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  "top-left": "top-[-10%] left-[-10%]",
  "top-right": "top-[-10%] right-[-5%]",
  "bottom-right": "bottom-[10%] right-[-5%]",
};

export const GlowBackground: React.FC<GlowBackgroundProps> = ({
  position = "center",
  size = 500,
  color,
  className = "",
}) => {
  const glowColor = color || colors.brand.indigoGlow;

  return (
    <div
      className={`absolute rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none ${positionStyles[position]} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: glowColor,
      }}
    />
  );
};
