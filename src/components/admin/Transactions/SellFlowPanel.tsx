import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { TestingPanel } from "./TestingPanel";
import { LCManager } from "./LCManager";
import type { Order } from "../../../store/dashboardStore";

const TESTING_LABS = [
  { value: "sgs-mumbai", label: "SGS Mumbai" },
  { value: "sgs-chennai", label: "SGS Chennai" },
  { value: "bureau-veritas", label: "Bureau Veritas" },
];

export function SellFlowPanel({
  order,
  onAssignTesting,
  onIssueLC,
}: {
  order: Order;
  onAssignTesting?: (lab: string, resultSummary?: string) => void;
  onIssueLC?: (lcNumber: string) => void;
}) {
  return (
    <div className="space-y-6">
      <TestingPanel
        order={order}
        labs={TESTING_LABS}
        onAssign={onAssignTesting}
      />
      <LCManager
        order={order}
        banks={["SBI India", "HSBC Switzerland", "Standard Chartered Ghana"]}
        onIssueLC={onIssueLC}
      />
    </div>
  );
}
