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

export interface BuyActionsProps {
  order: Order;
  onOpenQR?: (order: Order) => void;
  onCallBuyer?: (order: Order) => void;
  onReserveEscrow?: (order: Order) => void;
}

export function BuyActions({
  order,
  onOpenQR,
  onCallBuyer,
  onReserveEscrow,
}: BuyActionsProps) {
  const [qrOpen, setQrOpen] = useState(false);
  const value = order.orderSummary?.total ?? order.aiEstimatedAmount ?? "—";

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
            data={{
              orderId: order.id,
              value,
              nextStep: "team-contact",
              teamPhone: order.contactInfo?.phone ?? undefined,
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
