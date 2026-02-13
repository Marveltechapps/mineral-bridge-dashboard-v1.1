import { useMemo, useState } from "react";
import { useDashboardStore } from "../../../store/dashboardStore";
import { MetricCard } from "./MetricCard";
import { TimelineStepper } from "../../ui/TimelineStepper";
import {
  TransactionsTable,
  buildTransactionRows,
  type TransactionRow,
} from "./TransactionsTable";
import { TransactionDetailTabs } from "./TransactionDetailTabs";

export function TransactionsDashboard({
  onOpenOrderDetail,
}: {
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
}) {
  const { state, dispatch } = useDashboardStore();
  const [selectedRow, setSelectedRow] = useState<TransactionRow | null>(null);

  const rows = useMemo(
    () =>
      buildTransactionRows(
        state.buyOrders,
        state.sellOrders,
        state.registryUsers,
        state.logisticsDetails
      ),
    [state.buyOrders, state.sellOrders, state.registryUsers, state.logisticsDetails]
  );

  const activeCount = useMemo(
    () =>
      rows.filter(
        (r) =>
          r.status !== "Order Completed" &&
          r.status !== "Completed" &&
          r.status !== "Cancelled"
      ).length,
    [rows]
  );
  const testingCount = useMemo(
    () => rows.filter((r) => r.testing === "Pending" || r.status.toLowerCase().includes("test")).length,
    [rows]
  );
  const lcIssuedCount = useMemo(
    () => rows.filter((r) => r.lc !== "—").length,
    [rows]
  );
  const lcValue = useMemo(() => {
    const withLc = rows.filter((r) => r.lc !== "—");
    const sum = withLc.reduce((s, r) => {
      const n = parseFloat(String(r.value).replace(/[^0-9.-]/g, ""));
      return s + (Number.isNaN(n) ? 0 : n);
    }, 0);
    return sum >= 1e6 ? `$${(sum / 1e6).toFixed(1)}M` : `$${sum.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }, [rows]);

  const pipelineSteps = useMemo(() => {
    const order = rows.filter((r) => r.status === "Order Submitted" || r.status === "Submitted").length;
    const contact = rows.filter((r) => r.status === "Awaiting Team Contact").length;
    const price = rows.filter((r) => r.status === "Price Confirmed").length;
    const payment = rows.filter((r) => r.status === "Payment Initiated").length;
    const completed = rows.filter((r) => r.status === "Order Completed" || r.status === "Completed").length;
    return [
      { label: "Order", count: order, status: order > 0 ? ("current" as const) : ("pending" as const) },
      { label: "Contact", count: contact, status: contact > 0 ? ("current" as const) : order > 0 ? ("pending" as const) : ("pending" as const) },
      { label: "Price", count: price, status: price > 0 ? ("current" as const) : ("pending" as const) },
      { label: "Payment", count: payment, status: payment > 0 ? ("current" as const) : ("pending" as const) },
      { label: "Done", count: completed, status: completed > 0 ? ("completed" as const) : ("pending" as const) },
    ];
  }, [rows]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Transactions Dashboard
        </h1>
        <p className="text-muted-foreground">
          End-to-end BUY/SELL flows, QR notifications, testing, LC & logistics.
        </p>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard title="Active" value={activeCount} badge="+12" color="purple" />
        <MetricCard title="Testing" value={testingCount} badge="🔄" color="yellow" />
        <MetricCard title="LC Issued" value={lcIssuedCount} subValue={lcValue} color="green" />
        <MetricCard title="Buy Orders" value={state.buyOrders.length} color="blue" />
        <MetricCard title="Sell Orders" value={state.sellOrders.length} color="blue" />
        <MetricCard title="Settlements" value={state.transactions.length} subValue="All time" color="purple" />
      </div>

      {/* Pipeline stepper */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900">
        <p className="text-sm font-medium text-muted-foreground mb-3">Pipeline</p>
        <TimelineStepper steps={pipelineSteps} />
      </div>

      {/* Main table */}
      <TransactionsTable
        rows={rows}
        onRowClick={setSelectedRow}
        onViewFlow={(row) => {
          setSelectedRow(row);
          onOpenOrderDetail?.(row.id, row.type === "Buy" ? "buy" : "sell");
        }}
        onQRClick={(row) => setSelectedRow(row)}
      />

      {/* Detail tabs when a row is selected */}
      {selectedRow && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h2 className="text-lg font-semibold mb-4">Transaction detail</h2>
          <TransactionDetailTabs
            row={selectedRow}
            state={state}
            dispatch={dispatch}
          />
        </div>
      )}
    </div>
  );
}
