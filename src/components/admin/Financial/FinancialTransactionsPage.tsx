import { useMemo, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Checkbox } from "../../ui/checkbox";
import { useDashboardStore, getLogisticsDetailsForOrder } from "../../../store/dashboardStore";
import { getRegistryUserName } from "../../../store/dashboardStore";
import type { Transaction } from "../../../store/dashboardStore";
import { FLOW_STEPS, type FinancialFlowStep } from "../../../lib/financialApi";
import { StatusSyncBadge } from "../../financial/StatusSync";
import { InterconnectLinks, type FinancialTabId } from "../../financial/InterconnectLinks";
import { QrCode, Phone, Wallet, FlaskConical, FileText, CheckCircle, Download } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

function getTransactionUserName(
  tx: Transaction,
  buyOrders: { id: string; userId?: string }[],
  sellOrders: { id: string; userId?: string }[],
  registryUsers: { id: string; name: string }[]
): string {
  const orders = [...buyOrders, ...sellOrders];
  const order = orders.find((o) => o.id === tx.orderId);
  return order ? getRegistryUserName(registryUsers, order.userId) : "—";
}

export interface FinancialTransactionsPageProps {
  onBackToDashboard: () => void;
  onNavigateToTab: (tab: FinancialTabId) => void;
  onNavigateToEnquiries?: () => void;
  onOpenFlowStep: (transactionId: string, step: FinancialFlowStep) => void;
  /** Optional: show Enquiry link with count; if not passed, computed from store. */
  openEnquiriesCount?: number;
}

export function FinancialTransactionsPage({
  onBackToDashboard,
  onNavigateToTab,
  onNavigateToEnquiries,
  onOpenFlowStep,
  openEnquiriesCount: openEnquiriesCountProp,
}: FinancialTransactionsPageProps) {
  const { state, dispatch } = useDashboardStore();
  const { transactions, buyOrders, sellOrders, registryUsers, enquiries } = state;
  const openEnquiriesCount = openEnquiriesCountProp ?? enquiries.filter((e) => e.status !== "Resolved").length;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatusValue, setBulkStatusValue] = useState<string>("");

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const rows = useMemo(
    () =>
      transactions.map((tx) => {
        const userName = getTransactionUserName(tx, buyOrders, sellOrders, registryUsers);
        const logistics = getLogisticsDetailsForOrder(state, tx.orderId);
        return {
          ...tx,
          userName,
          logisticsAmount: logistics?.shippingAmount ? `${logistics.shippingAmount} ${logistics.shippingCurrency ?? "USD"}` : null,
        };
      }),
    [transactions, buyOrders, sellOrders, registryUsers, state.logisticsDetails]
  );

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === rows.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(rows.map((r) => r.id)));
  }, [rows.length, selectedIds.size, rows]);

  const handleBulkExport = useCallback(() => {
    if (selectedIds.size === 0) {
      toast.info("Select at least one transaction to export.");
      return;
    }
    const selected = rows.filter((r) => selectedIds.has(r.id));
    const headers = ["id", "orderId", "userName", "mineral", "finalAmount", "currency", "status", "date", "time"];
    const csvRows = [
      headers.join(","),
      ...selected.map((r) =>
        headers.map((h) => {
          const v = (r as Record<string, unknown>)[h];
          const s = String(v ?? "");
          return s.includes(",") ? `"${s.replace(/"/g, '""')}"` : s;
        }).join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-bulk-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    const count = selectedIds.size;
    dispatch({
      type: "ADD_APP_ACTIVITY",
      payload: {
        id: `act-${Date.now()}`,
        userId: "1",
        type: "bulk_export",
        description: `Bulk export: ${count} transaction(s) as CSV`,
        at: new Date().toISOString(),
        metadata: { count: String(count) },
      },
    });
    setSelectedIds(new Set());
    toast.success("Bulk export downloaded", { description: `${count} transaction(s) exported as CSV.` });
  }, [selectedIds, rows, dispatch]);

  const handleBulkStatusUpdate = useCallback(() => {
    if (selectedIds.size === 0 || !bulkStatusValue) {
      toast.info("Select transactions and choose a status.");
      return;
    }
    const status = bulkStatusValue as "Pending" | "Completed" | "Failed";
    const count = selectedIds.size;
    rows.filter((r) => selectedIds.has(r.id)).forEach((tx) => {
      dispatch({ type: "UPDATE_TRANSACTION", payload: { ...tx, status } });
    });
    dispatch({
      type: "ADD_APP_ACTIVITY",
      payload: {
        id: `act-${Date.now()}`,
        userId: "1",
        type: "other",
        description: `Bulk status update: ${count} transaction(s) set to ${status}`,
        at: new Date().toISOString(),
        metadata: { count: String(count), status },
      },
    });
    setSelectedIds(new Set());
    setBulkStatusValue("");
    toast.success("Status updated", { description: `${count} transaction(s) set to ${status}.` });
  }, [selectedIds, bulkStatusValue, rows, dispatch]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Master hub: open any transaction to run the 6-step flow (Send QR → Call Buyer → Reserve → Testing → LC → Release).
          </p>
        </div>
        <Button variant="outline" onClick={onBackToDashboard} className="text-[#A855F7] border-[#A855F7] hover:bg-purple-50 dark:hover:bg-purple-950/30">
          ← Financial Dashboard
        </Button>
      </div>

      <InterconnectLinks
        activeTab="transactions"
        onNavigateToTab={onNavigateToTab}
        onNavigateToEnquiries={onNavigateToEnquiries}
        openEnquiriesCount={openEnquiriesCount}
      />

      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base">All transactions</CardTitle>
          <p className="text-sm text-muted-foreground">Click a row or step to open that flow page. Select rows for bulk export or status update.</p>
          {selectedIds.size > 0 && (
            <div className="flex flex-wrap items-center gap-3 mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedIds.size} selected</span>
              <Button variant="outline" size="sm" onClick={handleBulkExport} className="text-[#A855F7] border-[#A855F7] hover:bg-purple-50 dark:hover:bg-purple-950/30">
                <Download className="h-4 w-4 mr-2" />
                Bulk export (CSV)
              </Button>
              <Select value={bulkStatusValue} onValueChange={setBulkStatusValue}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Set status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleBulkStatusUpdate} disabled={!bulkStatusValue}>
                Apply status
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>Clear selection</Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={rows.length > 0 && selectedIds.size === rows.length}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="font-semibold">TX-ID</TableHead>
                  <TableHead className="font-semibold">User (linked)</TableHead>
                  <TableHead className="font-semibold">Order</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Logistics amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/30"
                  >
                    <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(row.id)}
                        onCheckedChange={() => toggleSelect(row.id)}
                        aria-label={`Select ${row.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono font-medium text-[#A855F7]">{row.id}</TableCell>
                    <TableCell>{row.userName}</TableCell>
                    <TableCell className="font-mono text-sm">{row.orderId}</TableCell>
                    <TableCell className="font-medium">{row.finalAmount} {row.currency}</TableCell>
                    <TableCell className="text-sm text-emerald-600 dark:text-emerald-400">{row.logisticsAmount ?? "—"}</TableCell>
                    <TableCell>
                      <StatusSyncBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {FLOW_STEPS.map((step, i) => (
                          <Button
                            key={step.id}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-[#A855F7] hover:bg-purple-50 dark:hover:bg-purple-950/30"
                            onClick={() => onOpenFlowStep(row.id, step.id)}
                            title={`Step ${i + 1}: ${step.label}`}
                          >
                            {i === 0 && <QrCode className="h-3 w-3 mr-0.5" />}
                            {i === 1 && <Phone className="h-3 w-3 mr-0.5" />}
                            {i === 2 && <Wallet className="h-3 w-3 mr-0.5" />}
                            {i === 3 && <FlaskConical className="h-3 w-3 mr-0.5" />}
                            {i === 4 && <FileText className="h-3 w-3 mr-0.5" />}
                            {i === 5 && <CheckCircle className="h-3 w-3 mr-0.5" />}
                            {step.label}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
