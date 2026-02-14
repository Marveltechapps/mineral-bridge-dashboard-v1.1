import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { StatusBadge } from "../../ui/status-badge";
import { Search } from "lucide-react";
import { BuyActions } from "./BuyActions";
import { SellActions } from "./SellActions";
import { BuyFlow6 } from "./BuyFlow6";
import { SellFlow6 } from "./SellFlow6";
import { Badge } from "../../ui/badge";
import type { Order } from "../../../store/dashboardStore";
import { getRegistryUserName, getOrderIsInternational } from "../../../store/dashboardStore";
import type { RegistryUserRow } from "../../../store/dashboardStore";

export interface OrderTableProps {
  orders: Order[];
  registryUsers: RegistryUserRow[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  scopeFilter?: "all" | "domestic" | "international";
  onScopeFilterChange?: (value: "all" | "domestic" | "international") => void;
  onOpenDetails: (order: Order) => void;
  onOpenFullOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
  onCallBuyer?: (order: Order) => void;
  onReserveEscrow?: (order: Order) => void;
  onTrack?: (order: Order) => void;
  onRelease?: (order: Order) => void;
  dispatch?: React.Dispatch<import("../../../store/dashboardStore").DashboardAction>;
  /** When true, show 6-step pipeline (Step column + BuyFlow6/SellFlow6). */
  use6StepFlow?: boolean;
  /** Called when user completes a step (global step 1-6). */
  onStepComplete?: (globalStep: number) => void;
}

export function OrderTable({
  orders,
  registryUsers,
  searchTerm,
  onSearchChange,
  scopeFilter,
  onScopeFilterChange,
  onOpenDetails,
  onOpenFullOrderDetail,
  onCallBuyer,
  onReserveEscrow,
  onTrack,
  onRelease,
  dispatch,
  use6StepFlow,
  onStepComplete,
}: OrderTableProps) {
  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-base">{use6StepFlow ? "All Orders" : "All orders"}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {use6StepFlow ? "Each row = 1 customer order waiting for you. Click Send QR first, then Call Buyer, then Reserve $. View Order for full detail." : "Unified order pipeline. Orders managed in Buy/Sell Management."}
            </CardDescription>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Order ID, mineral, or buyer..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            {onScopeFilterChange && scopeFilter !== undefined && (
              <Select value={scopeFilter} onValueChange={onScopeFilterChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All orders</SelectItem>
                  <SelectItem value="domestic">Domestic only</SelectItem>
                  <SelectItem value="international">International only</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                {use6StepFlow && <TableHead className="font-semibold">Step</TableHead>}
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Order ID</TableHead>
                <TableHead className="font-semibold">User (Registry)</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Scope</TableHead>
                <TableHead className="font-semibold">Mineral & Quantity</TableHead>
                <TableHead className="font-semibold">Facility</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const isIntl = getOrderIsInternational(order, registryUsers);
                const user = getRegistryUserName(registryUsers, order.userId);
                const step = order.currentStep ?? 1;
                const globalStep = order.type === "Buy" ? step : 3 + step;
                return (
                  <TableRow key={order.id}>
                    {use6StepFlow && (
                      <TableCell>
                        <Badge variant={globalStep <= 3 ? "default" : "secondary"} className={globalStep <= 3 ? "bg-[#A855F7]" : ""}>
                          Step {globalStep}/6
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="font-medium text-[#A855F7] hover:underline"
                        onClick={() => onOpenFullOrderDetail?.(order.id, order.type === "Buy" ? "buy" : "sell")}
                      >
                        {order.id}
                      </button>
                    </TableCell>
                    <TableCell className="text-sm text-slate-700 dark:text-slate-300">
                      {user}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          order.type === "Buy"
                            ? "text-blue-600 dark:text-blue-400 font-medium"
                            : "text-amber-600 dark:text-amber-400 font-medium"
                        }
                      >
                        {order.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {isIntl ? "International" : "Domestic"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {order.mineral}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.qty} {order.unit}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.facility?.name ?? "—"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.aiEstimatedAmount}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 flex-wrap justify-end items-start">
                        {use6StepFlow ? (
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 min-w-[180px]">
                            {order.type === "Buy" ? (
                              <BuyFlow6
                                order={order}
                                onStepComplete={(completedStep) => onStepComplete?.(completedStep)}
                                onCallBuyer={onCallBuyer}
                                onReserveEscrow={onReserveEscrow}
                                dispatch={dispatch}
                              />
                            ) : (
                              <SellFlow6
                                order={order}
                                onStepComplete={(completedStep) => onStepComplete?.(completedStep)}
                                dispatch={dispatch}
                              />
                            )}
                          </div>
                        ) : (
                          <>
                            {order.type === "Buy" ? (
                              <BuyActions
                                order={order}
                                onCallBuyer={onCallBuyer}
                                onReserveEscrow={onReserveEscrow}
                                dispatch={dispatch}
                                onStepComplete={onStepComplete}
                              />
                            ) : (
                              <SellActions order={order} onTrack={onTrack} onRelease={onRelease} dispatch={dispatch} />
                            )}
                          </>
                        )}
                        <Button variant="outline" size="sm" onClick={() => onOpenDetails(order)}>
                          Details
                        </Button>
                        {onOpenFullOrderDetail && (
                          <Button variant="ghost" size="sm" className="text-[#A855F7]" onClick={() => onOpenFullOrderDetail(order.id, order.type === "Buy" ? "buy" : "sell")}>
                            View Order
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
