import { cn } from "./utils";

/** Consistent status badge styles across the dashboard. */
type StatusVariant = "success" | "pending" | "error" | "info" | "neutral" | "inProgress";

const variantClasses: Record<StatusVariant, string> = {
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
  error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200/50 dark:border-red-800/50",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50",
  inProgress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50",
  neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/50",
};

const statusToVariant: Record<string, StatusVariant> = {
  Verified: "success",
  Resolved: "success",
  Approved: "success",
  Success: "success",
  Sold: "success",
  Settled: "success",
  Completed: "success",
  "Order Completed": "success",
  Open: "success",
  Reconciled: "success",
  Pending: "pending",
  "In Review": "pending",
  "Under Review": "pending",
  Submitted: "info",
  "In Progress": "inProgress",
  "Order Submitted": "info",
  "Awaiting Team Contact": "pending",
  "Price Confirmed": "info",
  "Payment Initiated": "inProgress",
  testing: "pending",
  "price-confirmed": "info",
  Failed: "error",
  Rejected: "error",
  Suspended: "error",
  Escalated: "error",
};

export function StatusBadge({
  status,
  variant,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { status?: string; variant?: StatusVariant }) {
  const resolvedVariant = variant ?? (status ? statusToVariant[status] ?? "neutral" : "neutral");
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        variantClasses[resolvedVariant],
        className
      )}
      {...props}
    >
      {children ?? status ?? ""}
    </span>
  );
}
