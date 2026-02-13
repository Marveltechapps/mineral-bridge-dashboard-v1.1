"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { QrCode, Send, Truck } from "lucide-react";
import { QRGenerator } from "../../ui/QRGenerator";
import type { Order, SentToUser, DashboardAction } from "../../../store/dashboardStore";
import { toast } from "sonner";

const SENT_TYPES: SentToUser["type"][] = ["qr_or_bank", "transport_link", "sample_pickup_link", "lc_credit"];
const SENT_TYPE_LABELS: Record<SentToUser["type"], string> = {
  qr_or_bank: "Bank details / QR code",
  transport_link: "Logistics / transport link",
  sample_pickup_link: "Sample pickup link",
  lc_credit: "LC / credit",
};

export function SendToUserCard({
  order,
  dispatch,
  showQRGenerator = true,
  transactionId,
  onOpenLogistics,
}: {
  order: Order;
  dispatch: React.Dispatch<DashboardAction>;
  showQRGenerator?: boolean;
  /** Transaction ID for this order — shown so user sees the link to transactions. */
  transactionId?: string | null;
  /** Open logistics view for this order (e.g. switch to Logistics tab or navigate). */
  onOpenLogistics?: (orderId: string) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sentType, setSentType] = useState<SentToUser["type"]>("qr_or_bank");
  const [sentLabel, setSentLabel] = useState("");
  const [sentChannel, setSentChannel] = useState("App");
  const [sentDetail, setSentDetail] = useState("");

  const sentToUser = order.sentToUser ?? [];
  const value = order.orderSummary?.total ?? order.aiEstimatedAmount ?? "—";
  const currency = order.currency ?? "USD";
  const lcNumber = order.lcNumber;

  const handleRecordSent = () => {
    if (!sentLabel.trim()) {
      toast.error("Enter a label (e.g. Bank details link or QR code)");
      return;
    }
    const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const newSent: SentToUser = {
      type: sentType,
      label: sentLabel.trim(),
      date,
      channel: sentChannel.trim() || "App",
      detail: sentDetail.trim() || undefined,
    };
    dispatch({
      type: "UPDATE_ORDER",
      payload: { ...order, sentToUser: [...sentToUser, newSent] },
    });
    toast.success("Recorded sent to user", { description: "User will see this in the app." });
    setDialogOpen(false);
    setSentLabel("");
    setSentDetail("");
  };

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Send className="h-5 w-5 text-[#A855F7]" />
          Send QR or link to user
        </CardTitle>
        <CardDescription>
          Record what you send to the buyer/seller (QR code, bank details link, logistics link). This is reflected in the app for the user. Linked to this order, its transaction, and logistics.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-medium text-muted-foreground">Connected to:</span>
          <span className="text-xs">Order <strong>{order.id}</strong></span>
          {transactionId && (
            <>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs">Transaction <strong className="text-emerald-600 dark:text-emerald-400">{transactionId}</strong></span>
            </>
          )}
          {onOpenLogistics && (
            <>
              <span className="text-xs text-muted-foreground">·</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-[#A855F7]" onClick={() => onOpenLogistics(order.id)}>
                <Truck className="h-3.5 w-3 mr-1" />
                View logistics
              </Button>
            </>
          )}
        </div>
        {showQRGenerator && (
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50/50 dark:bg-slate-900/30">
            <p className="text-sm font-medium mb-3">Generate QR for this order (amount-based or LC-based)</p>
            <p className="text-xs text-muted-foreground mb-2">Amount-based: QR encodes payment amount + currency. For Sell, after LC is issued in dashboard, choose LC-based to encode LC number + amount.</p>
            <QRGenerator
              data={{
                orderId: order.id,
                value,
                amount: value,
                currency,
                lcNumber,
                nextStep: "team-contact",
                teamPhone: order.contactInfo?.phone ?? "",
              }}
            />
          </div>
        )}

        <Button
          className="w-full bg-[#A855F7] hover:bg-purple-600 gap-2"
          onClick={() => setDialogOpen(true)}
        >
          <QrCode className="h-4 w-4" />
          Record sent to user (QR / link)
        </Button>

        {sentToUser.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Already sent</p>
            <ul className="space-y-2">
              {sentToUser.map((s, i) => (
                <li key={i} className="text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{SENT_TYPE_LABELS[s.type]}</span>
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="text-xs text-muted-foreground">{s.date} · {s.channel}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Record sent to user</DialogTitle>
              <DialogDescription>
                What you record here is shown in the app to the user. Use &quot;Bank details / QR code&quot; for payment QR or bank link; use &quot;Logistics / transport link&quot; for tracking links.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Type</Label>
                <Select value={sentType} onValueChange={(v) => setSentType(v as SentToUser["type"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{SENT_TYPE_LABELS[t]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {sentType === "qr_or_bank" && (
                  <p className="text-xs text-muted-foreground mt-1.5">Use for bank details link or QR code. Put the link or code in Label / Detail.</p>
                )}
              </div>
              <div>
                <Label htmlFor="sent-label">Label</Label>
                <Input
                  id="sent-label"
                  value={sentLabel}
                  onChange={(e) => setSentLabel(e.target.value)}
                  placeholder={sentType === "qr_or_bank" ? "e.g. Bank details link or QR code" : "e.g. Logistics / tracking link"}
                />
              </div>
              <div>
                <Label htmlFor="sent-channel">Channel</Label>
                <Input id="sent-channel" value={sentChannel} onChange={(e) => setSentChannel(e.target.value)} placeholder="App / Email / SMS" />
              </div>
              <div>
                <Label htmlFor="sent-detail">Detail (optional)</Label>
                <Textarea id="sent-detail" value={sentDetail} onChange={(e) => setSentDetail(e.target.value)} placeholder="Additional info or link" rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleRecordSent}>
                Record sent
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
