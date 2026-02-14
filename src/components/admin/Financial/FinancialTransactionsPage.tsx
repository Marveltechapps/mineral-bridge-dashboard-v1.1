import { useMemo } from "react";
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
import { useDashboardStore, getLogisticsDetailsForOrder } from "../../../store/dashboardStore";
import { getRegistryUserName } from "../../../store/dashboardStore";
import type { Transaction } from "../../../store/dashboardStore";
import { FLOW_STEPS, type FinancialFlowStep } from "../../../lib/financialApi";
import { StatusSyncBadge } from "../../financial/StatusSync";
import { InterconnectLinks, type FinancialTabId } from "../../financial/InterconnectLinks";
import { QrCode, Phone, Wallet, FlaskConical, FileText, CheckCircle } from "lucide-react";

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
  const { state } = useDashboardStore();
  const { transactions, buyOrders, sellOrders, registryUsers, enquiries } = state;
  const openEnquiriesCount = openEnquiriesCountProp ?? enquiries.filter((e) => e.status !== "Resolved").length;

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
          <p className="text-sm text-muted-foreground">Click a row or step to open that flow page.</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900/50">
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
