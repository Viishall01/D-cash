import React from "react";
import { Text } from "@/components/atoms";
import { colors } from "@/lib/colors";
import { Wallet } from "lucide-react";

interface WalletAccountCardProps {
  index: number;
  address: string;
  balance?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export const WalletAccountCard: React.FC<WalletAccountCardProps> = ({
  index,
  address,
  balance,
  isSelected = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-2xl cursor-pointer transition-all"
      style={{
        backgroundColor: isSelected
          ? "rgba(79, 70, 229, 0.40)"
          : colors.bg.card,
        border: `1px solid ${
          isSelected ? colors.border.active : colors.border.subtle
        }`,
      }}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <Wallet size={14} style={{ color: colors.text.indigo }} />
          <Text variant="caption" color="primary" className="font-bold">
            Acc #{index + 1}
          </Text>
        </div>
        <Text variant="mono" color="primary" className="font-bold">
          {balance?.toFixed(2) || "0.00"}
        </Text>
      </div>
      <Text
        variant="mono"
        color="subtle"
        className="text-[10px] truncate block"
      >
        {address}
      </Text>
    </div>
  );
};
