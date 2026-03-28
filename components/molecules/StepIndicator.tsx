import React from "react";
import { Text } from "@/components/atoms";
import { colors } from "@/lib/colors";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  labels?: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps = 2,
  labels = ["Authentication", "Secure Vault"],
}) => {
  return (
    <div className="flex items-center justify-between group">
      <div className="space-y-1">
        <Text
          variant="label"
          className="tracking-[0.3em]"
          style={{ color: colors.text.indigo }}
        >
          Step 0{currentStep}
        </Text>
        <Text variant="h4" color="muted">
          {labels[currentStep - 1] || ""}
        </Text>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-1 w-8 md:w-16 rounded-full transition-all duration-700"
            style={{
              backgroundColor:
                i < currentStep ? colors.brand.indigo : colors.border.primary,
            }}
          />
        ))}
      </div>
    </div>
  );
};
