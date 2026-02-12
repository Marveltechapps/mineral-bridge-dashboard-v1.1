import { Check, Circle } from "lucide-react";
import { ENQUIRY_STAGES, EnquiryStage } from "./EnquiriesManagement";
import { cn } from "../ui/utils";

interface EnquiryStageTrackerProps {
  currentStage: EnquiryStage;
  compact?: boolean;
}

export function EnquiryStageTracker({ currentStage, compact = false }: EnquiryStageTrackerProps) {
  const currentIndex = ENQUIRY_STAGES.indexOf(currentStage);

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {ENQUIRY_STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div
              key={stage}
              className={cn(
                "h-2 flex-1 rounded-full transition-all",
                isCompleted && "bg-emerald-500",
                isCurrent && "bg-blue-500",
                isPending && "bg-muted"
              )}
              title={stage}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {ENQUIRY_STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={stage} className="flex flex-col items-center flex-1">
              {/* Stage Circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all mb-2",
                  isCompleted &&
                    "bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-500",
                  isCurrent &&
                    "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500",
                  isPending && "bg-muted border-2 border-muted-foreground/20"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle
                    className={cn(
                      "h-5 w-5",
                      isCurrent && "text-blue-600 dark:text-blue-400 fill-current",
                      isPending && "text-muted-foreground"
                    )}
                  />
                )}
              </div>

              {/* Stage Label */}
              <p
                className={cn(
                  "text-xs text-center transition-all",
                  (isCompleted || isCurrent) && "font-medium",
                  isCompleted && "text-emerald-600 dark:text-emerald-400",
                  isCurrent && "text-blue-600 dark:text-blue-400",
                  isPending && "text-muted-foreground"
                )}
              >
                {stage}
              </p>

              {/* Connector Line */}
              {index < ENQUIRY_STAGES.length - 1 && (
                <div className="absolute h-0.5 w-full left-1/2 top-5 -z-10">
                  <div
                    className={cn(
                      "h-full transition-all",
                      index < currentIndex && "bg-emerald-500",
                      index >= currentIndex && "bg-muted"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
