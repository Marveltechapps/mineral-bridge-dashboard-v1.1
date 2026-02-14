import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { FlowNavigation } from "../../../financial/FlowNavigation";
import { FlowStepContext } from "../../../financial/FlowStepContext";
import { useDashboardStore } from "../../../../store/dashboardStore";
import { issueLc } from "../../../../lib/financialApi";
import type { FinancialFlowStep } from "../../../../lib/financialApi";
import { FileText } from "lucide-react";
import { toast } from "sonner";

export interface LcIssuedPageProps {
  transactionId: string;
  onNavigateToStep: (step: FinancialFlowStep) => void;
  onBackToTransactions: () => void;
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
  onOpenLogisticsDetail?: (orderId: string) => void;
}

export function LcIssuedPage({ transactionId, onNavigateToStep, onBackToTransactions, onOpenOrderDetail, onOpenLogisticsDetail }: LcIssuedPageProps) {
  const { state, dispatch } = useDashboardStore();
  const tx = state.transactions.find((t) => t.id === transactionId);
  const allOrders = [...state.buyOrders, ...state.sellOrders];
  const order = tx ? allOrders.find((o) => o.id === tx.orderId) : undefined;
  const [lcNumber, setLcNumber] = useState(order?.lcNumber ?? "LC-MB-");
  const [loading, setLoading] = useState(false);

  if (!tx) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Transaction not found.</p>
        <Button variant="outline" className="mt-2" onClick={onBackToTransactions}>Back to Transactions</Button>
      </div>
    );
  }

  const handleIssue = async () => {
    setLoading(true);
    try {
      const res = await issueLc({
        transactionId,
        orderId: tx.orderId,
        orderType: tx.orderType,
        lcNumber,
        dispatch,
      });
      if (res.success) toast.success("LC issued; SWIFT validated");
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <FlowNavigation
        currentStep="lc-issued"
        transactionId={transactionId}
        onNavigateToStep={onNavigateToStep}
        onBackToTransactions={onBackToTransactions}
      />

      <FlowStepContext transactionId={transactionId} onOpenOrderDetail={onOpenOrderDetail} onOpenLogisticsDetail={onOpenLogisticsDetail} />

      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#A855F7]">
            <FileText className="h-5 w-5" />
            Step 5: LC Issued
          </CardTitle>
          <p className="text-sm text-muted-foreground">Bank LC generation. SWIFT validation. Links to Release.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">LC number</label>
            <Input className="mt-1 max-w-xs font-mono" value={lcNumber} onChange={(e) => setLcNumber(e.target.value)} placeholder="LC-MB-xxxx" />
          </div>
          <Button onClick={handleIssue} disabled={loading} className="bg-[#A855F7] hover:bg-purple-600 text-white">
            {loading ? "Issuing…" : "Issue LC (PDF + SWIFT)"}
          </Button>
          <div className="pt-4 flex justify-end">
            <Button onClick={() => onNavigateToStep("release")} className="bg-[#A855F7] hover:bg-purple-600 text-white">
              Continue to Step 6: Release Payment →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
