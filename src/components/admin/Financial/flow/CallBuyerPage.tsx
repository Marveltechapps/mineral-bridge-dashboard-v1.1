import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { FlowNavigation } from "../../../financial/FlowNavigation";
import { FlowStepContext } from "../../../financial/FlowStepContext";
import { useDashboardStore } from "../../../../store/dashboardStore";
import { callBuyer } from "../../../../lib/financialApi";
import type { FinancialFlowStep } from "../../../../lib/financialApi";
import { Phone, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export interface CallBuyerPageProps {
  transactionId: string;
  onNavigateToStep: (step: FinancialFlowStep) => void;
  onBackToTransactions: () => void;
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
  onOpenLogisticsDetail?: (orderId: string) => void;
}

export function CallBuyerPage({ transactionId, onNavigateToStep, onBackToTransactions, onOpenOrderDetail, onOpenLogisticsDetail }: CallBuyerPageProps) {
  const { state, dispatch } = useDashboardStore();
  const tx = state.transactions.find((t) => t.id === transactionId);
  const [action, setAction] = useState<"voice" | "sms">("voice");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  if (!tx) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Transaction not found.</p>
        <Button variant="outline" className="mt-2" onClick={onBackToTransactions}>Back to Transactions</Button>
      </div>
    );
  }

  const handleCall = async () => {
    setLoading(true);
    try {
      const res = await callBuyer({ transactionId, orderId: tx.orderId, action, dispatch });
      if (res.success) toast.success(action === "voice" ? "Call initiated (Twilio)" : "SMS sent");
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <FlowNavigation
        currentStep="call-buyer"
        transactionId={transactionId}
        onNavigateToStep={onNavigateToStep}
        onBackToTransactions={onBackToTransactions}
      />

      <FlowStepContext transactionId={transactionId} onOpenOrderDetail={onOpenOrderDetail} onOpenLogisticsDetail={onOpenLogisticsDetail} />

      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#A855F7]">
            <Phone className="h-5 w-5" />
            Step 2: Call Buyer
          </CardTitle>
          <p className="text-sm text-muted-foreground">Twilio voice/SMS. Logs to Enquiry. Links to Reserve Escrow.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant={action === "voice" ? "default" : "outline"}
              className={action === "voice" ? "bg-[#A855F7] hover:bg-purple-600" : ""}
              onClick={() => setAction("voice")}
            >
              <Phone className="h-4 w-4 mr-2" />
              Voice
            </Button>
            <Button
              variant={action === "sms" ? "default" : "outline"}
              className={action === "sms" ? "bg-[#A855F7] hover:bg-purple-600" : ""}
              onClick={() => setAction("sms")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS
            </Button>
          </div>
          <div>
            <label className="text-sm font-medium">Phone number</label>
            <Input
              className="mt-1 max-w-xs"
              placeholder="+1 234 567 8900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Button onClick={handleCall} disabled={loading} className="bg-[#A855F7] hover:bg-purple-600 text-white">
            {loading ? "…" : action === "voice" ? "Place call" : "Send SMS"}
          </Button>
          <div className="pt-4 flex justify-end">
            <Button onClick={() => onNavigateToStep("reserve-escrow")} className="bg-[#A855F7] hover:bg-purple-600 text-white">
              Continue to Step 3: Reserve Escrow →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
