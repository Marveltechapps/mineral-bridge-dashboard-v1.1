import { useEffect, useRef } from "react";

/**
 * StatusSync: optional real-time sync placeholder.
 * In production, wire to Socket.io or polling to sync transaction/order status across tabs.
 */
export function useStatusSync(
  transactionId: string | undefined,
  onStatusChange?: (payload: { transactionId: string; status: string }) => void
) {
  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;

  useEffect(() => {
    if (!transactionId) return;
    // Placeholder: in production subscribe to socket or poll GET /api/transactions/:id
    // e.g. socket.on('transaction:updated', (data) => { if (data.id === transactionId) onStatusChangeRef.current?.(data); });
    return () => {};
  }, [transactionId]);
}

export function StatusSyncBadge({ status }: { status: string }) {
  const color =
    status === "Completed"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : status === "Failed"
        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${color}`}
    >
      {status}
    </span>
  );
}
