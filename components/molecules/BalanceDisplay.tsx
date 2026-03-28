import React from "react";
import { Text } from "@/components/atoms";
import { colors } from "@/lib/colors";
import { Wallet } from "lucide-react";

interface BalanceDisplayProps {
  balance: number;
  symbol?: string;
  accountIndex?: number;
  address?: string;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  balance,
  symbol = "Sol",
  accountIndex,
  address,
}) => {
  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div className="space-y-4">
        {accountIndex !== undefined && (
          <div className="flex items-center gap-2">
            <Wallet size={18} style={{ color: colors.text.indigo }} />
            <Text
              variant="label"
              className="tracking-widest"
              style={{ color: colors.text.indigo }}
            >
              Account #{accountIndex + 1}
            </Text>
          </div>
        )}
        {address && (
          <Text variant="mono" color="subtle" className="break-all">
            {address}
          </Text>
        )}
      </div>
      <div className="text-left md:text-right">
        <Text variant="label" color="subtle" className="tracking-[0.3em] mb-1">
          Available Balance
        </Text>
        <div className="flex items-baseline gap-2">
          <span
            className="text-6xl font-black tracking-tighter"
            style={{ color: colors.text.primary }}
          >
            {balance.toFixed(4)}
          </span>
          <span
            className="text-xl font-bold uppercase"
            style={{ color: colors.text.indigo }}
          >
            {symbol}
          </span>
        </div>
      </div>
    </section>
  );
};
