import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useDashboardStore, getRegistryUserName } from "../../../store/dashboardStore";
import type { Transaction } from "../../../store/dashboardStore";

export interface SettlementsTabProps {
  onReleasePayment?: (tx: Transaction) => void;
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
}

export function SettlementsTab({
  onReleasePayment,
  onOpenOrderDetail,
}: SettlementsTabProps) {
  const { state } = useDashboardStore();

  const pendingSettlements = useMemo(
    () => state.transactions.filter((t) => t.status === "Pending"),
    [state.transactions]
  );

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Pending Settlements ({pendingSettlements.length})
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Each row = money safe, ready to send to seller. Click &quot;Release Payment&quot; to complete the settlement and mark the order done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                <TableHead className="font-semibold">Order ID</TableHead>
                <TableHead className="font-semibold">Transaction ID</TableHead>
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Mineral</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingSettlements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No pending settlements.
                  </TableCell>
                </TableRow>
              ) : (
                pendingSettlements.map((tx) => {
                  const order = [...state.buyOrders, ...state.sellOrders].find(
                    (o) => o.id === tx.orderId
                  );
                  return (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <button
                          type="button"
                          className="font-medium text-[#A855F7] hover:underline"
                          onClick={() =>
                            onOpenOrderDetail?.(tx.orderId, tx.orderType === "Buy" ? "buy" : "sell")
                          }
                        >
                          {tx.orderId}
                        </button>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                      <TableCell className="text-sm">
                        {order
                          ? getRegistryUserName(state.registryUsers, order.userId)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-sm">{tx.mineral}</TableCell>
                      <TableCell className="font-medium">{tx.finalAmount}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          className="bg-[#A855F7] hover:bg-purple-600"
                          onClick={() => onReleasePayment?.(tx)}
                        >
                          Release Payment
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
