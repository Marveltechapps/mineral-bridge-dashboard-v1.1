import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { FlowNavigation } from "../../../financial/FlowNavigation";
import { FlowStepContext } from "../../../financial/FlowStepContext";
import { useDashboardStore } from "../../../../store/dashboardStore";
import { submitTesting } from "../../../../lib/financialApi";
import type { FinancialFlowStep } from "../../../../lib/financialApi";
import { FlaskConical } from "lucide-react";
import { toast } from "sonner";

export interface TestingPageProps {
  transactionId: string;
  onNavigateToStep: (step: FinancialFlowStep) => void;
  onBackToTransactions: () => void;
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
  onOpenLogisticsDetail?: (orderId: string) => void;
}

export function TestingPage({ transactionId, onNavigateToStep, onBackToTransactions, onOpenOrderDetail, onOpenLogisticsDetail }: TestingPageProps) {
  const { state, dispatch } = useDashboardStore();
  const tx = state.transactions.find((t) => t.id === transactionId);
  const [lab, setLab] = useState("SGS");
  const [resultSummary, setResultSummary] = useState("");
  const [loading, setLoading] = useState(false);

  if (!tx) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Transaction not found.</p>
        <Button variant="outline" className="mt-2" onClick={onBackToTransactions}>Back to Transactions</Button>
      </div>
    );
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await submitTesting({
        transactionId,
        orderId: tx.orderId,
        orderType: tx.orderType,
        lab,
        resultSummary: resultSummary || undefined,
        dispatch,
      });
      if (res.success) toast.success("Testing assigned; compliance updated");
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <FlowNavigation
        currentStep="testing"
        transactionId={transactionId}
        onNavigateToStep={onNavigateToStep}
        onBackToTransactions={onBackToTransactions}
      />

      <FlowStepContext transactionId={transactionId} onOpenOrderDetail={onOpenOrderDetail} onOpenLogisticsDetail={onOpenLogisticsDetail} />

      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#A855F7]">
            <FlaskConical className="h-5 w-5" />
            Step 4: Testing
          </CardTitle>
          <p className="text-sm text-muted-foreground">SGS lab assignment. Updates Compliance. Links to LC Issued.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Lab</label>
            <Input className="mt-1 max-w-xs" value={lab} onChange={(e) => setLab(e.target.value)} placeholder="SGS" />
          </div>
          <div>
            <label className="text-sm font-medium">Result summary (optional)</label>
            <Input className="mt-1" value={resultSummary} onChange={(e) => setResultSummary(e.target.value)} placeholder="e.g. Pass" />
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="bg-[#A855F7] hover:bg-purple-600 text-white">
            {loading ? "Submitting…" : "Assign testing"}
          </Button>
          <div className="pt-4 flex justify-end">
            <Button onClick={() => onNavigateToStep("lc-issued")} className="bg-[#A855F7] hover:bg-purple-600 text-white">
              Continue to Step 5: LC Issued →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
