import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type { Order } from "../../../store/dashboardStore";

export function TestingPanel({
  order,
  labs,
  onAssign,
}: {
  order: Order;
  labs: { value: string; label: string }[];
  onAssign?: (lab: string, resultSummary?: string) => void;
}) {
  const [selectedLab, setSelectedLab] = useState(order.testingLab ?? "");

  const handleAssign = () => {
    if (selectedLab) onAssign?.(selectedLab);
  };

  const hasResult = !!order.testingResultSummary;

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg">Assign Testing Lab</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedLab} onValueChange={setSelectedLab}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select lab" />
          </SelectTrigger>
          <SelectContent>
            {labs.map((lab) => (
              <SelectItem key={lab.value} value={lab.value}>
                {lab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="border-[#A855F7] text-[#A855F7] hover:bg-purple-50 dark:hover:bg-purple-950/30"
          onClick={handleAssign}
        >
          Assign Lab
        </Button>
        {hasResult && (
          <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              ✅ {order.testingResultSummary}
            </p>
            <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-emerald-700 dark:text-emerald-300">
              Download PDF
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
