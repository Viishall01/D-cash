import React from "react";
import { Text } from "@/components/atoms";
import { colors } from "@/lib/colors";
import { ShieldAlert, AlertTriangle } from "lucide-react";

type WarningVariant = "warning" | "critical";

interface WarningBannerProps {
  children: React.ReactNode;
  variant?: WarningVariant;
  title?: string;
  className?: string;
}

export const WarningBanner: React.FC<WarningBannerProps> = ({
  children,
  variant = "warning",
  title,
  className = "",
}) => {
  const Icon = variant === "critical" ? ShieldAlert : AlertTriangle;

  return (
    <div
      className={`flex gap-4 p-5 rounded-2xl ${className}`}
      style={{
        backgroundColor: colors.status.warningMuted,
        border: `1px solid ${
          variant === "critical"
            ? colors.status.warningBorder
            : colors.status.warningBorder
        }`,
      }}
    >
      <Icon
        className="shrink-0 mt-1"
        size={20}
        style={{ color: colors.status.warningStrong }}
      />
      <div className="space-y-1">
        {title && (
          <Text
            variant="label"
            className="tracking-[0.15em]"
            style={{ color: colors.status.warningStrong }}
          >
            {title}
          </Text>
        )}
        <p
          className="text-[11px] leading-relaxed uppercase tracking-wider font-medium"
          style={{ color: colors.status.warningText }}
        >
          {children}
        </p>
      </div>
    </div>
  );
};
