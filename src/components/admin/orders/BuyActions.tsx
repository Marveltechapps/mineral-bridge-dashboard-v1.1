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

export interface BuyActionsProps {
  order: Order;
  onOpenQR?: (order: Order) => void;
  onCallBuyer?: (order: Order) => void;
  onReserveEscrow?: (order: Order) => void;
  dispatch?: React.Dispatch<DashboardAction>;
  onStepComplete?: (step: number) => void;
}

export function BuyActions({
  order,
  onOpenQR,
  onCallBuyer,
  onReserveEscrow,
  dispatch,
  onStepComplete,
}: BuyActionsProps) {
  const [qrOpen, setQrOpen] = useState(false);
  const value = order.orderSummary?.total ?? order.aiEstimatedAmount ?? "—";
  const userName = order.contactInfo?.name ?? "Buyer";
  const currentStep = order.currentStep ?? 1;

  const handleCopyLink = () => {
    const link = `${typeof window !== "undefined" ? window.location.origin : ""}/order/${order.id}`;
    navigator.clipboard.writeText(link).then(
      () => toast.success("Link copied", { description: "Share with buyer" }),
      () => toast.error("Could not copy")
    );
  };

  const handleMarkAsSent = () => {
    const nextStep = Math.min(currentStep + 1, 3);
    dispatch?.({ type: "SET_ORDER_CURRENT_STEP", payload: { orderId: order.id, type: "Buy", step: nextStep } });
    onStepComplete?.(1);
    toast.success(`QR sent to ${userName}`, { description: "Step 1 complete" });
    setQrOpen(false);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        size="sm"
        className="bg-[#A855F7] hover:bg-purple-600 text-white"
        onClick={() => {
          setQrOpen(true);
          onOpenQR?.(order);
        }}
      >
        📱 Send QR
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onCallBuyer?.(order)}
      >
        📞 Call Buyer
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onReserveEscrow?.(order)}
      >
        💰 Reserve Escrow
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
          <div className="flex flex-col gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              Copy link
            </Button>
            {(dispatch != null || onStepComplete != null) && (
              <Button className="bg-emerald-600 hover:bg-emerald-700" size="sm" onClick={handleMarkAsSent}>
                ✅ Mark as sent & complete Step 1
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
