import { ShieldAlert } from "lucide-react";
import { Button } from "../ui/button";

interface AccessDeniedProps {
  title?: string;
  message?: string;
  onBack?: () => void;
}

export function AccessDenied({
  title = "Access denied",
  message = "You don't have permission to view this section.",
  onBack,
}: AccessDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8 text-amber-600 dark:text-amber-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{title}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mb-6">{message}</p>
      {onBack && (
        <Button variant="outline" onClick={onBack} className="rounded-xl">
          Go back
        </Button>
      )}
    </div>
  );
}
