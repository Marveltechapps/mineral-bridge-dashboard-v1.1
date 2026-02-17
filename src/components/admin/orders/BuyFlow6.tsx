import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { QRGenerator } from "../../ui/QRGenerator";
import type { Order } from "../../../store/dashboardStore";
import type { DashboardAction } from "../../../store/dashboardStore";
import { toast } from "sonner";

export interface BuyFlow6Props {
  order: Order;
  onStepComplete: (nextStep: number) => void;
  onCallBuyer?: (order: Order) => void;
  onReserveEscrow?: (order: Order) => void;
  dispatch?: React.Dispatch<DashboardAction>;
}

export function BuyFlow6({
  order,
  onStepComplete,
  onCallBuyer,
  onReserveEscrow,
  dispatch,
}: BuyFlow6Props) {
  const [loading, setLoading] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const currentStep = order.currentStep ?? 1;
  const value = order.orderSummary?.total ?? order.aiEstimatedAmount ?? "—";
  const userName = order.contactInfo?.name ?? "Buyer";

  const handleStep1 = async () => {
    setQrOpen(true);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
  };

  const confirmQRSent = () => {
    setQrOpen(false);
    toast.success(`QR sent to ${userName}`, { description: "Step 1 complete" });
    const nextStep = Math.min(currentStep + 1, 3);
    dispatch?.({ type: "SET_ORDER_CURRENT_STEP", payload: { orderId: order.id, type: "Buy", step: nextStep } });
    onStepComplete(1);
  };

  const handleStep2 = async () => {
    setLoading(true);
    const phone = order.contactInfo?.phone ?? "";
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    toast.success(`Call logged! ${userName} contacted. Step 2 COMPLETE!`, { description: "Step 3 (Reserve $) unlocked" });
    dispatch?.({ type: "SET_ORDER_CURRENT_STEP", payload: { orderId: order.id, type: "Buy", step: 3 } });
    onStepComplete(3);
    if (phone?.trim()) {
      window.open(`tel:${phone.trim().replace(/\s/g, "")}`, "_self");
    } else if (onCallBuyer) {
      onCallBuyer(order);
    }
  };

  const handleStep3 = () => {
    if (onReserveEscrow) {
      onReserveEscrow(order);
      return;
    }
    setLoading(true);
    (async () => {
      await new Promise((r) => setTimeout(r, 1500));
      setLoading(false);
      toast.success(`${value} reserved`, { description: "Escrow reserved in Financials" });
      const nextStep = 3;
      dispatch?.({ type: "SET_ORDER_CURRENT_STEP", payload: { orderId: order.id, type: "Buy", step: nextStep } });
      dispatch?.({
        type: "UPDATE_ORDER",
        payload: { ...order, escrowStatus: "Reserved", currentStep: nextStep },
      });
      onStepComplete(3);
    })();
  };

  return (
    <div className="space-y-2 text-sm">
      <div className="text-xs text-slate-600 dark:text-slate-300 mb-1">Complete Step {currentStep}/3</div>
      {currentStep === 1 && (
        <>
          <Button
            onClick={handleStep1}
            className="w-full bg-[#A855F7] hover:bg-purple-600"
            disabled={loading}
          >
            {loading ? "Generating QR..." : "1. Send QR Notification"}
          </Button>
          <Dialog open={qrOpen} onOpenChange={setQrOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Send QR to buyer</DialogTitle>
              </DialogHeader>
              <QRGenerator
                method="amount"
                data={{
                  orderId: order.id,
                  value,
                  amount: value,
                  currency: order.currency ?? "USD",
                  nextStep: "team-contact",
                  teamPhone: order.contactInfo?.phone ?? undefined,
                }}
              />
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={confirmQRSent}>
                ✅ Mark as sent & complete Step 1
              </Button>
            </DialogContent>
          </Dialog>
        </>
      )}
      {currentStep === 2 && (
        <Button onClick={handleStep2} className="w-full h-14 text-base bg-[#A855F7] hover:bg-purple-600" disabled={loading}>
          {loading ? (
            <>
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Calling {userName}...
            </>
          ) : (
            `Call ${userName}${order.contactInfo?.phone ? ` (${order.contactInfo.phone})` : ""}`
          )}
        </Button>
      )}
      {currentStep === 3 && (
        <Button
          onClick={handleStep3}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          disabled={loading}
        >
          {loading ? "💰 Reserving..." : `💰 3. Reserve ${value}`}
        </Button>
      )}
    </div>
  );
}
