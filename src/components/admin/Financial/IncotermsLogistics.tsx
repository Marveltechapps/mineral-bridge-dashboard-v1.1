import { useMemo } from "react";
import { useDashboardStore, getLogisticsDetailsForOrder } from "../../../store/dashboardStore";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

export function IncotermsLogistics({
  onOpenOrderDetail,
  onOpenLogisticsDetail,
}: {
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
  /** Open Logistics & details page for this order (not the order flow). */
  onOpenLogisticsDetail?: (orderId: string) => void;
}) {
  const { state } = useDashboardStore();
  const allOrders = useMemo(
    () => [...state.buyOrders, ...state.sellOrders],
    [state.buyOrders, state.sellOrders]
  );

  const rows = useMemo(() => {
    return allOrders
      .filter((o) => o.status !== "Cancelled" && o.status !== "Order Completed" && o.status !== "Completed")
      .slice(0, 8)
      .map((o) => {
        const log = getLogisticsDetailsForOrder(state, o.id);
        const incoterms = o.incoterms ?? (o.type === "Buy" ? "FOB Osei Terminal, Ghana" : "CIF Singapore");
        const origin = o.facility?.country === "Ghana" ? "Tema Port, Ghana" : o.facility?.address ?? "—";
        const dest = o.deliveryLocation?.country === "Switzerland" ? "Jebel Ali, Dubai" : o.deliveryLocation?.country ?? "—";
        return {
          orderId: o.id,
          type: o.type,
          incoterms,
          carrier: log?.carrierName ?? "Maersk Line",
          awbBl: log ? `AWB: ${log.trackingNumber}` : "BL: MAEU-58917456",
          origin,
          destination: dest || "Singapore Changi",
          status: log ? "In Transit (75%)" : "Pending",
          eta: "Feb 20, 2026",
        };
      });
  }, [allOrders, state]);

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-base">Incoterms & International Logistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                <TableHead className="font-semibold">Order</TableHead>
                <TableHead className="font-semibold">Incoterms</TableHead>
                <TableHead className="font-semibold">Carrier</TableHead>
                <TableHead className="font-semibold">AWB/BL</TableHead>
                <TableHead className="font-semibold">Origin</TableHead>
                <TableHead className="font-semibold">Destination</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">ETA</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No active logistics.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={row.orderId}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                    if (onOpenLogisticsDetail) onOpenLogisticsDetail(row.orderId);
                    else onOpenOrderDetail?.(row.orderId, row.type === "Buy" ? "buy" : "sell");
                  }}
                  >
                    <TableCell>
                      <span className="font-medium text-[#A855F7]">
                        {row.orderId}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{row.incoterms}</TableCell>
                    <TableCell className="text-sm">{row.carrier}</TableCell>
                    <TableCell className="text-sm font-mono">{row.awbBl}</TableCell>
                    <TableCell className="text-sm">{row.origin}</TableCell>
                    <TableCell className="text-sm">{row.destination}</TableCell>
                    <TableCell className="text-sm">{row.status}</TableCell>
                    <TableCell className="text-sm">{row.eta}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" className="bg-[#A855F7] hover:bg-purple-600">Track Live</Button>
                      <Button size="sm" variant="outline" className="ml-1">Docs</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
