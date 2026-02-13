import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "./button";

export interface QRGeneratorData {
  orderId: string;
  value: string;
  nextStep?: string;
  teamPhone?: string;
}

export function QRGenerator({
  data,
  onGenerate,
  className,
}: {
  data: QRGeneratorData;
  onGenerate?: (payload: Record<string, unknown>) => void;
  className?: string;
}) {
  const [qrValue, setQrValue] = useState<string>("");

  const generateQR = () => {
    const payload = {
      type: "mineral-bridge-transaction",
      orderId: data.orderId,
      value: data.value,
      nextStep: data.nextStep ?? "team-contact",
      teamPhone: data.teamPhone ?? "+91-44-12345678",
    };
    setQrValue(JSON.stringify(payload));
    onGenerate?.(payload);
  };

  return (
    <div className={className ?? "space-y-4"}>
      <Button
        type="button"
        onClick={generateQR}
        className="bg-gradient-to-r from-[#A855F7] to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
      >
        Generate QR Code
      </Button>
      {qrValue && (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <QRCodeSVG value={qrValue} size={200} className="mx-auto" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Scan opens app → Transaction details + team call
          </p>
        </div>
      )}
    </div>
  );
}
