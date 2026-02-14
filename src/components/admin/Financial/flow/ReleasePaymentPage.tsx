import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { FlowNavigation } from "../../../financial/FlowNavigation";
import { FlowStepContext } from "../../../financial/FlowStepContext";
import { useDashboardStore } from "../../../../store/dashboardStore";
import { releasePayment } from "../../../../lib/financialApi";
import type { FinancialFlowStep } from "../../../../lib/financialApi";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

export interface ReleasePaymentPageProps {
  transactionId: string;
  onNavigateToStep: (step: FinancialFlowStep) => void;
  onBackToTransactions: () => void;
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
  onOpenLogisticsDetail?: (orderId: string) => void;
}

export function ReleasePaymentPage({ transactionId, onNavigateToStep, onBackToTransactions, onOpenOrderDetail, onOpenLogisticsDetail }: ReleasePaymentPageProps) {
  const { state, dispatch } = useDashboardStore();
  const tx = state.transactions.find((t) => t.id === transactionId);
  const [loading, setLoading] = useState(false);

  if (!tx) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Transaction not found.</p>
        <Button variant="outline" className="mt-2" onClick={onBackToTransactions}>Back to Transactions</Button>
      </div>
    );
  }

  const handleRelease = async () => {
    setLoading(true);
    try {
      await releasePayment({ transactionId, orderId: tx.orderId, dispatch });
      dispatch({
        type: "UPDATE_TRANSACTION",
        payload: { ...tx, status: "Completed" as const },
      });
      toast.success("Payment released; transaction complete");
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <FlowNavigation
        currentStep="release"
        transactionId={transactionId}
        onNavigateToStep={onNavigateToStep}
        onBackToTransactions={onBackToTransactions}
      />

      <FlowStepContext transactionId={transactionId} onOpenOrderDetail={onOpenOrderDetail} onOpenLogisticsDetail={onOpenLogisticsDetail} />

      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#A855F7]">
            <CheckCircle className="h-5 w-5" />
            Step 6: Release Payment
          </CardTitle>
          <p className="text-sm text-muted-foreground">Stripe payout. Marks transaction complete. Back to Transactions.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Final amount: <span className="font-semibold">{tx.finalAmount} {tx.currency}</span>
          </p>
          <Button onClick={handleRelease} disabled={loading} className="bg-[#A855F7] hover:bg-purple-600 text-white">
            {loading ? "Releasing…" : "Release payment"}
          </Button>
          <div className="pt-4 flex justify-end">
            <Button onClick={onBackToTransactions} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Back to Transactions ✓
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
