import { useMemo } from "react";
import { useDashboardStore, getRegistryUserName } from "../../../store/dashboardStore";
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
import { Badge } from "../../ui/badge";

export function InternationalEscrow({
  onOpenOrderDetail,
  onReleaseEscrow,
}: {
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
  onReleaseEscrow?: (orderId: string) => void;
}) {
  const { state } = useDashboardStore();
  const allOrders = useMemo(
    () => [...state.buyOrders, ...state.sellOrders],
    [state.buyOrders, state.sellOrders]
  );

  const escrowRows = useMemo(() => {
    return allOrders
      .filter(
        (o) =>
          o.status !== "Cancelled" &&
          o.status !== "Completed" &&
          o.status !== "Order Completed"
      )
      .map((o) => {
        const user = getRegistryUserName(state.registryUsers, o.userId);
        const country = state.registryUsers.find((u) => u.id === o.userId)?.country ?? o.facility?.country ?? "—";
        const amount = o.aiEstimatedAmount ?? o.orderSummary?.total ?? "—";
        const escrowStatus = o.escrowStatus ?? (o.status === "Payment Initiated" ? "Reserved" : "Pending Release");
        const bank = o.paymentMethod ?? "SBI India";
        const swift = o.swift ?? "SBIINBB107";
        const correspondent = o.correspondentBank ?? "HSBC Switzerland (HBSGINZZ)";
        const incoterms = o.incoterms ?? (o.type === "Buy" ? "FOB Osei Terminal" : "CIF Singapore");
        return {
          orderId: o.id,
          type: o.type,
          party: `${user} (${country})`,
          amount,
          currency: o.currency ?? "USD",
          bank: `${bank} (${swift})`,
          correspondent,
          status: escrowStatus,
          incoterms,
        };
      })
      .slice(0, 10);
  }, [allOrders, state.registryUsers]);

  const summary = useMemo(() => {
    let reserved = 0;
    let pendingRelease = 0;
    escrowRows.forEach((r) => {
      const n = parseFloat(String(r.amount).replace(/[^0-9.-]/g, ""));
      if (r.status === "Reserved") reserved += n;
      else pendingRelease += n;
    });
    return {
      reserved: reserved >= 1e6 ? `$${(reserved / 1e6).toFixed(1)}M` : `$${reserved.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      pendingRelease: pendingRelease >= 1e6 ? `$${(pendingRelease / 1e6).toFixed(1)}M` : `$${pendingRelease.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
    };
  }, [escrowRows]);

  const byCountry = useMemo(() => {
    const map: Record<string, number> = {};
    escrowRows.forEach((r) => {
      const country = r.party.includes("Ghana") ? "Ghana (FOB)" : r.party.includes("Switzerland") ? "Switzerland (CIF)" : "Other";
      const n = parseFloat(String(r.amount).replace(/[^0-9.-]/g, ""));
      map[country] = (map[country] ?? 0) + n;
    });
    return Object.entries(map).map(([label, val]) => ({
      label,
      value: val >= 1e6 ? `$${(val / 1e6).toFixed(1)}M` : `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
    }));
  }, [escrowRows]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base">International Escrow Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                  <TableHead className="font-semibold">Order ID</TableHead>
                  <TableHead className="font-semibold">Party</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Currency</TableHead>
                  <TableHead className="font-semibold">Bank</TableHead>
                  <TableHead className="font-semibold">Incoterms</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escrowRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No active escrow orders.
                    </TableCell>
                  </TableRow>
                ) : (
                  escrowRows.map((row) => (
                    <TableRow key={row.orderId}>
                      <TableCell>
                        <button
                          type="button"
                          className="font-medium text-[#A855F7] hover:underline"
                          onClick={() => onOpenOrderDetail?.(row.orderId, row.type === "Buy" ? "buy" : "sell")}
                        >
                          {row.orderId}
                        </button>
                      </TableCell>
                      <TableCell className="text-sm">{row.party}</TableCell>
                      <TableCell className="font-medium">{row.amount}</TableCell>
                      <TableCell className="text-sm">{row.currency}</TableCell>
                      <TableCell className="text-sm">{row.bank}</TableCell>
                      <TableCell className="text-sm">{row.incoterms}</TableCell>
                      <TableCell>
                        <Badge variant={row.status === "Reserved" ? "default" : "secondary"} className={row.status === "Reserved" ? "bg-[#A855F7]" : "bg-amber-100 text-amber-700"}>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => onOpenOrderDetail?.(row.orderId, row.type === "Buy" ? "buy" : "sell")}>
                          View Order
                        </Button>
                        {row.status === "Pending Release" && (
                          <Button size="sm" className="ml-1 bg-[#A855F7] hover:bg-purple-600" onClick={() => onReleaseEscrow?.(row.orderId)}>
                            💸 Release
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base">Escrow Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 p-4 text-center">
            <div>
              <div className="text-3xl font-bold text-[#A855F7]">{summary.reserved}</div>
              <div className="text-sm text-muted-foreground">Reserved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">{summary.pendingRelease}</div>
              <div className="text-sm text-muted-foreground">Pending Release</div>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
            <p className="text-sm font-medium mb-2">By jurisdiction</p>
            <div className="grid grid-cols-2 gap-4 text-center">
              {byCountry.length ? byCountry.map((c) => (
                <div key={c.label}>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{c.value}</div>
                  <div className="text-xs text-muted-foreground">{c.label}</div>
                </div>
              )) : (
                <div className="col-span-2 text-sm text-muted-foreground">No data</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
