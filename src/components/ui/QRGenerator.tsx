import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "./button";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export interface QRGeneratorData {
  orderId: string;
  /** Display amount (e.g. "$1,120,000"). Used for amount-based QR. */
  value: string;
  /** Explicit amount for payment QR (same as value or numeric). */
  amount?: string;
  /** Currency (e.g. USD). Default USD. */
  currency?: string;
  /** LC number when issued (Sell). Enables LC-based QR. */
  lcNumber?: string;
  nextStep?: string;
  teamPhone?: string;
}

export type QRGenerationMethod = "amount" | "lc";

export function QRGenerator({
  data,
  method: controlledMethod,
  onGenerate,
  className,
}: {
  data: QRGeneratorData;
  /** When provided (e.g. "lc" for Sell with LC), use this method. When "amount" or unset, use amount-based. */
  method?: QRGenerationMethod;
  onGenerate?: (payload: Record<string, unknown>) => void;
  className?: string;
}) {
  const [qrValue, setQrValue] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<QRGenerationMethod>(controlledMethod ?? (data.lcNumber ? "lc" : "amount"));
  const method = controlledMethod ?? selectedMethod;

  const amount = data.amount ?? data.value;
  const currency = data.currency ?? "USD";
  const hasLC = !!data.lcNumber;

  const generateQR = () => {
    const base = {
      orderId: data.orderId,
      amount,
      currency,
      nextStep: data.nextStep ?? "team-contact",
      teamPhone: data.teamPhone ?? "",
    };
    const payload =
      method === "lc" && data.lcNumber
        ? { ...base, type: "mineral-bridge-lc" as const, lcNumber: data.lcNumber }
        : { ...base, type: "mineral-bridge-payment" as const };
    setQrValue(JSON.stringify(payload));
    onGenerate?.(payload);
  };

  return (
    <div className={className ?? "space-y-4"}>
      {hasLC && controlledMethod == null && (
        <div className="space-y-2">
          <Label>QR by</Label>
          <Select value={method} onValueChange={(v) => setSelectedMethod(v as QRGenerationMethod)}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amount">Amount (payment) — {amount} {currency}</SelectItem>
              <SelectItem value="lc">LC — {data.lcNumber}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <Button
        type="button"
        onClick={generateQR}
        className="bg-gradient-to-r from-[#A855F7] to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
      >
        {method === "lc" && data.lcNumber
          ? `Generate QR (LC: ${data.lcNumber})`
          : `Generate QR (Amount: ${amount} ${currency})`}
      </Button>
      {qrValue && (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <QRCodeSVG value={qrValue} size={200} className="mx-auto" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {method === "lc" && data.lcNumber
              ? `LC ${data.lcNumber} · ${amount} ${currency} — scan in app`
              : `Payment ${amount} ${currency} — scan in app`}
          </p>
        </div>
      )}
    </div>
  );
}
