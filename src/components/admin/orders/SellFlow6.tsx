import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type { Order } from "../../../store/dashboardStore";
import type { DashboardAction } from "../../../store/dashboardStore";
import { toast } from "sonner";

const LABS = [
  { value: "SGS-Ghana", label: "🔬 SGS Ghana" },
  { value: "SGS-Geneva", label: "🔬 SGS Geneva" },
  { value: "Deloitte", label: "🔬 Deloitte Labs" },
];

export interface SellFlow6Props {
  order: Order;
  onStepComplete: (nextStep: number) => void;
  onTrack?: (order: Order) => void;
  dispatch?: React.Dispatch<DashboardAction>;
}

export function SellFlow6({
  order,
  onStepComplete,
  onTrack,
  dispatch,
}: SellFlow6Props) {
  const [loading, setLoading] = useState(false);
  const [selectedLab, setSelectedLab] = useState(order.testingLab ?? "");
  const currentStep = order.currentStep ?? 1;
  const amount = order.aiEstimatedAmount ?? "—";

  const handleStep1 = async () => {
    if (!selectedLab) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success(`${selectedLab} assigned`, { description: `Order ${order.id} · Step 1 complete` });
    dispatch?.({ type: "SET_ORDER_TESTING", payload: { orderId: order.id, type: "Sell", testingLab: selectedLab } });
    const nextStep = Math.min(currentStep + 1, 3);
    dispatch?.({ type: "SET_ORDER_CURRENT_STEP", payload: { orderId: order.id, type: "Sell", step: nextStep } });
    onStepComplete(4);
  };

  const handleStep2 = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    const lcNum = `LC-${order.id.slice(-4)}`;
    toast.success(`LC ${lcNum} issued`, { description: "SBI → HSBC · Step 2 complete" });
    dispatch?.({ type: "SET_ORDER_LC", payload: { orderId: order.id, type: "Sell", lcNumber: lcNum } });
    const nextStep = Math.min(currentStep + 1, 3);
    dispatch?.({ type: "SET_ORDER_CURRENT_STEP", payload: { orderId: order.id, type: "Sell", step: nextStep } });
    onStepComplete(5);
  };

  const handleStep3 = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    toast.success(`${amount} released`, { description: "Transaction complete ✅" });
    dispatch?.({ type: "SET_ORDER_CURRENT_STEP", payload: { orderId: order.id, type: "Sell", step: 3 } });
    dispatch?.({
      type: "UPDATE_ORDER",
      payload: { ...order, escrowStatus: "Released", status: "Order Completed", currentStep: 3 },
    });
    onStepComplete(6);
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
          Step {currentStep}/3
        </span>
        <span className="text-slate-500 dark:text-slate-400 text-xs">Complete the step below</span>
      </div>
      {currentStep === 1 && (
        <div className="space-y-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 text-slate-900 dark:text-slate-100">
          <label className="text-xs font-semibold uppercase tracking-wider block">Choose Testing Lab</label>
          <Select value={selectedLab} onValueChange={setSelectedLab}>
            <SelectTrigger className="w-full h-10 rounded-lg border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 data-[placeholder]:text-slate-600 dark:data-[placeholder]:text-slate-300">
              <SelectValue placeholder="Select a lab (e.g. SGS Ghana)" />
            </SelectTrigger>
            <SelectContent>
              {LABS.map((lab) => (
                <SelectItem key={lab.value} value={lab.value}>
                  {lab.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleStep1}
            className="w-full h-11 bg-[#A855F7] hover:bg-purple-600 font-semibold rounded-lg"
            disabled={!selectedLab || loading}
          >
            {loading ? "🔬 Assigning..." : "🔬 1. Assign Testing Lab"}
          </Button>
        </div>
      )}
      {currentStep === 2 && (
        <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 text-slate-900 dark:text-slate-100">
          <Button onClick={handleStep2} className="w-full h-11 font-semibold rounded-lg" disabled={loading}>
            {loading ? "🏦 Issuing LC..." : "🏦 2. Issue LC"}
          </Button>
        </div>
      )}
      {currentStep === 3 && (
        <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 text-slate-900 dark:text-slate-100">
          <Button
            onClick={handleStep3}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold rounded-lg"
            disabled={loading}
          >
            {loading ? "💸 Releasing..." : `💸 3. Release ${amount}`}
          </Button>
        </div>
      )}
    </div>
  );
}
