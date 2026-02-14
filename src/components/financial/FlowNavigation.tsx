import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import type { FinancialFlowStep } from "../../lib/financialApi";
import { FLOW_STEPS } from "../../lib/financialApi";

export interface FlowNavigationProps {
  currentStep: FinancialFlowStep;
  transactionId: string;
  onNavigateToStep: (step: FinancialFlowStep) => void;
  onBackToTransactions: () => void;
  /** Optional: which steps are completed (e.g. from order/transaction state). */
  completedSteps?: Set<FinancialFlowStep>;
  className?: string;
}

export function FlowNavigation({
  currentStep,
  transactionId,
  onNavigateToStep,
  onBackToTransactions,
  completedSteps = new Set(),
  className,
}: FlowNavigationProps) {
  const currentIndex = FLOW_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-1 text-sm">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-[#A855F7]"
          onClick={onBackToTransactions}
        >
          Transactions
        </Button>
        {FLOW_STEPS.map((step, i) => {
          const isActive = step.id === currentStep;
          const completed = completedSteps.has(step.id) || i < currentIndex;
          return (
            <span key={step.id} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
              <Button
                variant="ghost"
                size="sm"
                className={
                  isActive
                    ? "text-[#A855F7] font-semibold"
                    : completed
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground hover:text-slate-700 dark:hover:text-slate-300"
                }
                onClick={() => onNavigateToStep(step.id)}
              >
                {completed && !isActive ? "✓ " : ""}
                {step.label}
              </Button>
            </span>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Transaction: <span className="font-mono text-[#A855F7]">{transactionId}</span>
      </p>
    </div>
  );
}
