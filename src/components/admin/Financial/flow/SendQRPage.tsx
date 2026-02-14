import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { FlowNavigation } from "../../../financial/FlowNavigation";
import { useDashboardStore } from "../../../../store/dashboardStore";
import { sendQr } from "../../../../lib/financialApi";
import type { FinancialFlowStep } from "../../../../lib/financialApi";
import { QrCode, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

export interface SendQRPageProps {
  transactionId: string;
  onNavigateToStep: (step: FinancialFlowStep) => void;
  onBackToTransactions: () => void;
}

export function SendQRPage({ transactionId, onNavigateToStep, onBackToTransactions }: SendQRPageProps) {
  const { state, dispatch } = useDashboardStore();
  const tx = state.transactions.find((t) => t.id === transactionId);
  const [channel, setChannel] = useState<"email" | "whatsapp">("email");
  const [loading, setLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  if (!tx) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Transaction not found.</p>
        <Button variant="outline" className="mt-2" onClick={onBackToTransactions}>Back to Transactions</Button>
      </div>
    );
  }

  const handleGenerateAndSend = async () => {
    setLoading(true);
    try {
      const res = await sendQr({
        transactionId,
        orderId: tx.orderId,
        channel,
        dispatch,
      });
      if (res.success) {
        setQrUrl(res.qrData ?? null);
        toast.success("QR generated and sent", { description: `Via ${channel}` });
      }
    } catch {
      toast.error("Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <FlowNavigation
        currentStep="send-qr"
        transactionId={transactionId}
        onNavigateToStep={onNavigateToStep}
        onBackToTransactions={onBackToTransactions}
      />

      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#A855F7]">
            <QrCode className="h-5 w-5" />
            Step 1: Send QR
          </CardTitle>
          <p className="text-sm text-muted-foreground">Generate QR and send via Email or WhatsApp. Links to Call Buyer.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant={channel === "email" ? "default" : "outline"}
              className={channel === "email" ? "bg-[#A855F7] hover:bg-purple-600" : ""}
              onClick={() => setChannel("email")}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email (Resend)
            </Button>
            <Button
              variant={channel === "whatsapp" ? "default" : "outline"}
              className={channel === "whatsapp" ? "bg-[#A855F7] hover:bg-purple-600" : ""}
              onClick={() => setChannel("whatsapp")}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
          <Button onClick={handleGenerateAndSend} disabled={loading} className="bg-[#A855F7] hover:bg-purple-600 text-white">
            {loading ? "Sending…" : "Generate QR & Send"}
          </Button>
          {qrUrl && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-muted-foreground mb-2">QR for order link:</p>
              <QRCodeSVG value={qrUrl} size={128} level="M" />
              <p className="text-xs text-muted-foreground mt-2 break-all">{qrUrl}</p>
            </div>
          )}
          <div className="pt-4 flex justify-end">
            <Button onClick={() => onNavigateToStep("call-buyer")} className="bg-[#A855F7] hover:bg-purple-600 text-white">
              Continue to Step 2: Call Buyer →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
