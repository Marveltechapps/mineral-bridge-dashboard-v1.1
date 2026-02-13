import { cn } from "./utils";
import { Check } from "lucide-react";

export interface TimelineStep {
  label: string;
  count?: number;
  status: "pending" | "current" | "completed";
}

export function TimelineStepper({
  steps,
  className,
}: {
  steps: TimelineStep[];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0 w-full", className)}>
      {steps.map((step, i) => (
        <div key={step.label} className="flex flex-1 items-center">
          <div className="flex flex-col items-center flex-1">
            <div
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-full border-2 text-sm font-medium transition-colors",
                step.status === "completed" &&
                  "bg-[#A855F7] border-[#A855F7] text-white",
                step.status === "current" &&
                  "border-[#A855F7] bg-purple-50 dark:bg-purple-950/30 text-[#A855F7]",
                step.status === "pending" &&
                  "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-muted-foreground"
              )}
            >
              {step.status === "completed" ? (
                <Check className="h-4 w-4" />
              ) : (
                step.count ?? i + 1
              )}
            </div>
            <span
              className={cn(
                "mt-1.5 text-xs font-medium",
                step.status === "current"
                  ? "text-[#A855F7]"
                  : step.status === "completed"
                    ? "text-slate-700 dark:text-slate-300"
                    : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-1 rounded",
                step.status === "completed"
                  ? "bg-[#A855F7]"
                  : "bg-slate-200 dark:bg-slate-700"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
