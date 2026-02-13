import { useMemo } from "react";
import { useAllOrders } from "../../../store/dashboardStore";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { cn } from "../../ui/utils";

const PIPELINE_STEPS = [
  { key: "Order Submitted", label: "Order Submitted" },
  { key: "Team Contact", label: "Team Contact" },
  { key: "Price Confirmed", label: "Price Confirmed" },
  { key: "Payment/LC", label: "Payment/LC" },
  { key: "Testing", label: "Testing" },
  { key: "Logistics", label: "Logistics" },
  { key: "Settled", label: "Settled" },
];

export function TransactionStepper() {
  const allOrders = useAllOrders();

  const counts = useMemo(() => {
    const orderSubmitted = allOrders.filter(
      (o) => o.status === "Order Submitted" || o.status === "Submitted"
    ).length;
    const teamContact = allOrders.filter(
      (o) => o.status === "Awaiting Team Contact"
    ).length;
    const priceConfirmed = allOrders.filter(
      (o) => o.status === "Price Confirmed"
    ).length;
    const paymentLc = allOrders.filter(
      (o) => o.status === "Payment Initiated"
    ).length;
    const testing = allOrders.filter(
      (o) =>
        o.status === "Sample Test Required" ||
        o.status?.toLowerCase().includes("test")
    ).length;
    const logistics = allOrders.filter((o) => {
      // Could derive from logisticsDetails if needed
      return false;
    }).length;
    const settled = allOrders.filter(
      (o) => o.status === "Completed" || o.status === "Order Completed"
    ).length;

    return [
      orderSubmitted,
      teamContact,
      priceConfirmed,
      paymentLc,
      testing,
      logistics,
      settled,
    ];
  }, [allOrders]);

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Transaction Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {PIPELINE_STEPS.map((step, i) => (
            <div
              key={step.key}
              className="text-center min-w-[90px] shrink-0"
            >
              <div
                className={cn(
                  "w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold text-sm",
                  counts[i] > 0
                    ? "bg-[#A855F7]/20 text-[#A855F7] border-2 border-[#A855F7]/40"
                    : "bg-slate-100 dark:bg-slate-800 text-muted-foreground"
                )}
              >
                {counts[i]}
              </div>
              <div className="text-xs mt-2 text-muted-foreground whitespace-nowrap">
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
