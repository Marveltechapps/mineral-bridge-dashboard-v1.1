import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { FlowNavigation } from "../../../financial/FlowNavigation";
import { FlowStepContext } from "../../../financial/FlowStepContext";
import { useDashboardStore } from "../../../../store/dashboardStore";
import { reserveEscrow } from "../../../../lib/financialApi";
import type { FinancialFlowStep } from "../../../../lib/financialApi";
import { Wallet } from "lucide-react";
import { toast } from "sonner";

export interface ReserveEscrowPageProps {
  transactionId: string;
  onNavigateToStep: (step: FinancialFlowStep) => void;
  onBackToTransactions: () => void;
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
  onOpenLogisticsDetail?: (orderId: string) => void;
}

export function ReserveEscrowPage({ transactionId, onNavigateToStep, onBackToTransactions, onOpenOrderDetail, onOpenLogisticsDetail }: ReserveEscrowPageProps) {
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

  const amount = parseFloat(tx.finalAmount.replace(/[^0-9.-]/g, "")) || 0;

  const handleReserve = async () => {
    setLoading(true);
    try {
      const res = await reserveEscrow({
        transactionId,
        orderId: tx.orderId,
        amount,
        currency: tx.currency,
        dispatch,
      });
      if (res.success) toast.success("Escrow reserved (Stripe)");
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <FlowNavigation
        currentStep="reserve-escrow"
        transactionId={transactionId}
        onNavigateToStep={onNavigateToStep}
        onBackToTransactions={onBackToTransactions}
      />

      <FlowStepContext transactionId={transactionId} onOpenOrderDetail={onOpenOrderDetail} onOpenLogisticsDetail={onOpenLogisticsDetail} />

      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#A855F7]">
            <Wallet className="h-5 w-5" />
            Step 3: Reserve Escrow
          </CardTitle>
          <p className="text-sm text-muted-foreground">Stripe escrow. Updates Transactions balance. Links to Testing.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Amount: <span className="font-semibold">{tx.finalAmount} {tx.currency}</span>
          </p>
          <Button onClick={handleReserve} disabled={loading} className="bg-[#A855F7] hover:bg-purple-600 text-white">
            {loading ? "Reserving…" : "Reserve escrow"}
          </Button>
          <div className="pt-4 flex justify-end">
            <Button onClick={() => onNavigateToStep("testing")} className="bg-[#A855F7] hover:bg-purple-600 text-white">
              Continue to Step 4: Testing →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
