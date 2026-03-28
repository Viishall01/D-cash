import React from "react";
import { SeedWord } from "@/components/atoms";
import { Text } from "@/components/atoms";
import { colors } from "@/lib/colors";
import { Copy, CheckCheck } from "lucide-react";

interface SeedPhraseGridProps {
  mnemonic: string;
  onCopy?: () => void;
  copied?: boolean;
  showHeader?: boolean;
}

export const SeedPhraseGrid: React.FC<SeedPhraseGridProps> = ({
  mnemonic,
  onCopy,
  copied = false,
  showHeader = true,
}) => {
  const words = mnemonic.split(" ");

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex justify-between items-end px-2">
          <Text variant="label" color="subtle">
            Secret Keys
          </Text>
          {onCopy && (
            <button
              onClick={onCopy}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors"
              style={{
                color: copied ? colors.status.success : colors.text.indigo,
              }}
            >
              {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
              {copied ? "Copied to Clipboard" : "Copy All"}
            </button>
          )}
        </div>
      )}

      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 p-3 md:p-4 rounded-[2rem]"
        style={{
          backgroundColor: colors.bg.cardSubtle,
          border: `1px solid ${colors.border.primary}`,
        }}
      >
        {words.map((word, i) => (
          <SeedWord key={i} word={word} index={i} />
        ))}
      </div>
    </div>
  );
};
