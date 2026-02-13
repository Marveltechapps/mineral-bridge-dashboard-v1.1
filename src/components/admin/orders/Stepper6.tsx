import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

const SIX_STEPS = [
  "1. Send QR 📱",
  "2. Call Buyer 📞",
  "3. Reserve $ 💰",
  "4. Testing 🔬",
  "5. LC Issued 🏦",
  "6. Release ✅",
];

export interface Stepper6Props {
  activeStep: number;
  onStepChange?: (step: number) => void;
}

export function Stepper6({ activeStep, onStepChange }: Stepper6Props) {
  return (
    <Card className="border-2 border-[#A855F7]/30 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-[#A855F7] flex items-center gap-2">
          📊 Transaction Pipeline (Step {Math.min(activeStep, 6)}/6)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {SIX_STEPS.map((label, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === activeStep;
            const isCompleted = stepNum < activeStep;
            return (
              <div
                key={stepNum}
                className="flex flex-col items-center min-w-[100px] flex-shrink-0"
              >
                <button
                  type="button"
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#A855F7] to-purple-500 text-white shadow-[#A855F7]/50 scale-110"
                      : isCompleted
                        ? "bg-emerald-500 text-white shadow-emerald-500/50"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer"
                  }`}
                  onClick={() => stepNum <= activeStep && onStepChange?.(stepNum)}
                >
                  {isCompleted ? "✓" : stepNum}
                </button>
                <div className="text-xs font-medium mt-2 text-center px-0.5 leading-tight">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
