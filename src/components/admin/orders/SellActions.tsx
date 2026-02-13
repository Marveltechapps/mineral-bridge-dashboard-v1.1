import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import type { Order } from "../../../store/dashboardStore";
import type { DashboardAction } from "../../../store/dashboardStore";

const TESTING_LABS = [
  { value: "sgs-mumbai", label: "SGS Testing (Mumbai)" },
  { value: "sgs-chennai", label: "SGS Chennai" },
  { value: "deloitte", label: "Deloitte Labs" },
];

export interface SellActionsProps {
  order: Order;
  onAssignTesting?: (orderId: string, lab: string) => void;
  onIssueLC?: (orderId: string, lcNumber: string) => void;
  onTrack?: (order: Order) => void;
  onRelease?: (order: Order) => void;
  dispatch?: React.Dispatch<DashboardAction>;
}

export function SellActions({
  order,
  onAssignTesting,
  onIssueLC,
  onTrack,
  onRelease,
  dispatch,
}: SellActionsProps) {
  const [testingLab, setTestingLab] = useState(order.testingLab ?? "");
  const [lcOpen, setLcOpen] = useState(false);
  const [lcNumber, setLcNumber] = useState(order.lcNumber ?? "");

  const handleAssignLab = () => {
    if (testingLab) {
      dispatch?.({
        type: "SET_ORDER_TESTING",
        payload: {
          orderId: order.id,
          type: "Sell",
          testingLab,
          testingResultSummary: undefined,
        },
      });
      onAssignTesting?.(order.id, testingLab);
    }
  };

  const handleIssueLC = () => {
    const num = lcNumber.trim() || `LC-${order.id.slice(-6)}`;
    dispatch?.({
      type: "SET_ORDER_LC",
      payload: { orderId: order.id, type: "Sell", lcNumber: num },
    });
    onIssueLC?.(order.id, num);
    setLcOpen(false);
  };

  return (
    <div className="flex gap-2 flex-wrap items-center">
      <Select value={testingLab} onValueChange={setTestingLab}>
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <SelectValue placeholder="Testing" />
        </SelectTrigger>
        <SelectContent>
          {TESTING_LABS.map((lab) => (
            <SelectItem key={lab.value} value={lab.value}>
              {lab.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" variant="outline" onClick={handleAssignLab}>
        Assign
      </Button>
      <Button size="sm" variant="outline" onClick={() => setLcOpen(true)}>
        🏦 Issue LC
      </Button>
      <Button size="sm" variant="outline" onClick={() => onTrack?.(order)}>
        🚚 Track
      </Button>
      <Button size="sm" variant="outline" onClick={() => onRelease?.(order)}>
        💸 Release
      </Button>
      <Dialog open={lcOpen} onOpenChange={setLcOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Issue Letter of Credit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>LC Number</Label>
              <Input
                placeholder="e.g. LC-789012"
                value={lcNumber}
                onChange={(e) => setLcNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLcOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#A855F7] hover:bg-purple-600"
              onClick={handleIssueLC}
            >
              Issue LC
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
