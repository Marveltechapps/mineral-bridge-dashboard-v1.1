import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type { Order } from "../../../store/dashboardStore";

export function LCManager({
  order,
  banks,
  onIssueLC,
}: {
  order: Order;
  banks: string[];
  onIssueLC?: (lcNumber: string) => void;
}) {
  const [bank, setBank] = useState("");
  const [lcNumber, setLcNumber] = useState(order.lcNumber ?? "");

  const handleIssue = () => {
    const num = lcNumber.trim() || `LC-${order.id.slice(-6)}`;
    onIssueLC?.(num);
    setLcNumber(num);
  };

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg">Letter of Credit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Issuing Bank</Label>
          <Select value={bank} onValueChange={setBank}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select bank" />
            </SelectTrigger>
            <SelectContent>
              {banks.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>LC Number</Label>
          <Input
            placeholder="e.g. LC-789012"
            value={lcNumber}
            onChange={(e) => setLcNumber(e.target.value)}
          />
        </div>
        <Button
          className="bg-[#A855F7] hover:bg-purple-600 text-white"
          onClick={handleIssue}
        >
          Issue LC
        </Button>
        {order.lcNumber && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            ✓ LC {order.lcNumber} recorded for this order
          </p>
        )}
      </CardContent>
    </Card>
  );
}
