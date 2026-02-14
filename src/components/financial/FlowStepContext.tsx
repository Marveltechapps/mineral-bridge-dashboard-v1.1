import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useDashboardStore, getLogisticsDetailsForOrder, getRegistryUserName } from "../../store/dashboardStore";
import { CreditCard, FlaskConical, Truck, ExternalLink } from "lucide-react";

export interface FlowStepContextProps {
  transactionId: string;
  /** Open full order detail (e.g. to see testing docs / upload). */
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
  /** Open Logistics page for this order. */
  onOpenLogisticsDetail?: (orderId: string) => void;
  className?: string;
}

/**
 * Shows transaction summary, test details, and logistics details on each Financial flow step page.
 */
export function FlowStepContext({
  transactionId,
  onOpenOrderDetail,
  onOpenLogisticsDetail,
  className,
}: FlowStepContextProps) {
  const { state } = useDashboardStore();
  const tx = state.transactions.find((t) => t.id === transactionId);
  const allOrders = [...state.buyOrders, ...state.sellOrders];
  const order = tx ? allOrders.find((o) => o.id === tx.orderId) : null;
  const logistics = order ? getLogisticsDetailsForOrder(state, order.id) : null;

  if (!tx) return null;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className ?? ""}`}>
      {/* Transaction */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[#A855F7]" />
            Transaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm">
          <p><span className="text-muted-foreground">ID</span> <span className="font-mono text-[#A855F7]">{tx.id}</span></p>
          <p><span className="text-muted-foreground">Order</span> <span className="font-medium">{tx.orderId}</span></p>
          <p><span className="text-muted-foreground">Amount</span> <span className="font-semibold text-emerald-600 dark:text-emerald-400">{tx.finalAmount} {tx.currency}</span></p>
          <p>
            <span className="text-muted-foreground">Status</span>{" "}
            <Badge variant="secondary" className={tx.status === "Completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : tx.status === "Failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}>
              {tx.status}
            </Badge>
          </p>
          {order && onOpenOrderDetail && (
            <Button variant="link" size="sm" className="h-auto p-0 text-[#A855F7] mt-1" onClick={() => onOpenOrderDetail(order.id, order.type === "Buy" ? "buy" : "sell")}>
              View order <ExternalLink className="h-3 w-3 ml-0.5 inline" />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Test details (from order) */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-[#A855F7]" />
            Test details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm">
          {order ? (
            <>
              {order.testingLab && <p><span className="text-muted-foreground">Lab</span> <span className="font-medium">{order.testingLab}</span></p>}
              {order.testingResultSummary && <p><span className="text-muted-foreground">Result</span> <span className="font-medium">{order.testingResultSummary}</span></p>}
              {order.testingReqs && order.testingReqs.length > 0 ? (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Documents</p>
                  <ul className="space-y-0.5">
                    {order.testingReqs.map((req, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="font-medium">{req.label}</span>
                        <Badge variant="secondary" className={req.status === "Uploaded" ? "bg-emerald-100 text-emerald-700 text-[10px]" : "bg-amber-100 text-amber-700 text-[10px]"}>{req.status}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-muted-foreground">No testing requirements yet.</p>
              )}
              {onOpenOrderDetail && (
                <Button variant="link" size="sm" className="h-auto p-0 text-[#A855F7] mt-1" onClick={() => onOpenOrderDetail(order.id, order.type === "Buy" ? "buy" : "sell")}>
                  Open testing & docs <ExternalLink className="h-3 w-3 ml-0.5 inline" />
                </Button>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">Order not found.</p>
          )}
        </CardContent>
      </Card>

      {/* Logistics details */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Truck className="h-4 w-4 text-[#A855F7]" />
            Logistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm">
          {order && logistics ? (
            <>
              <p><span className="text-muted-foreground">Carrier</span> <span className="font-medium">{logistics.carrierName}</span></p>
              <p><span className="text-muted-foreground">Tracking</span> <span className="font-mono text-xs">{logistics.trackingNumber || "—"}</span></p>
              {logistics.shippingAmount && (
                <p><span className="text-muted-foreground">Shipping amount</span> <span className="font-semibold text-emerald-600 dark:text-emerald-400">{logistics.shippingAmount} {logistics.shippingCurrency ?? "USD"}</span></p>
              )}
              {order.userId && <p className="text-xs text-muted-foreground">Linked to user: {getRegistryUserName(state.registryUsers, order.userId)}</p>}
              {logistics.contactEmail && <p><span className="text-muted-foreground">Contact</span> <span className="text-xs">{logistics.contactEmail}</span></p>}
              {onOpenLogisticsDetail && (
                <Button variant="link" size="sm" className="h-auto p-0 text-[#A855F7] mt-1" onClick={() => onOpenLogisticsDetail(order.id)}>
                  Open Logistics <ExternalLink className="h-3 w-3 ml-0.5 inline" />
                </Button>
              )}
            </>
          ) : order ? (
            <>
              <p className="text-muted-foreground">No logistics details for this order yet.</p>
              {onOpenLogisticsDetail && (
                <Button variant="link" size="sm" className="h-auto p-0 text-[#A855F7] mt-1" onClick={() => onOpenLogisticsDetail(order.id)}>
                  Open Logistics <ExternalLink className="h-3 w-3 ml-0.5 inline" />
                </Button>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">Order not found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
