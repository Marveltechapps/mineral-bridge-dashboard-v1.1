import { useMemo, useState } from "react";
import { useDashboardStore, getRegistryUserName } from "../../../store/dashboardStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Badge } from "../../ui/badge";

export function RevenueAnalytics({
  onOpenOrderDetail,
}: {
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
}) {
  const { state } = useDashboardStore();
  const [statusFilter, setStatusFilter] = useState<"all" | "Pending" | "Completed" | "Failed">("all");

  const { grossRevenue, platformFees, netMargin } = useMemo(() => {
    const completed = state.transactions.filter((t) => t.status === "Completed");
    const gross = completed.reduce((s, t) => s + (parseFloat(t.finalAmount.replace(/[^0-9.-]/g, "")) || 0), 0);
    const fees = completed.reduce((s, t) => s + (parseFloat(t.serviceFee?.replace(/[^0-9.-]/g, "") || "0") || 0), 0);
    return {
      grossRevenue: gross >= 1e6 ? `$${(gross / 1e6).toFixed(1)}M` : `$${gross.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      platformFees: fees >= 1e3 ? `$${(fees / 1e3).toFixed(0)}K` : `$${fees.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      netMargin: gross ? ((fees / gross) * 100).toFixed(1) + "%" : "0%",
    };
  }, [state.transactions]);

  const revenueBySource = useMemo(() => [
    { label: "Platform Fees", value: "$245K", color: "text-[#A855F7]" },
    { label: "Testing Fees", value: "$18K", color: "text-emerald-600" },
    { label: "Logistics", value: "$12K", color: "text-blue-600" },
    { label: "Bank Charges", value: "$8K", color: "text-amber-600" },
  ], []);

  const topMinerals = useMemo(() => {
    const byMineral: Record<string, number> = {};
    state.transactions.filter((t) => t.status === "Completed").forEach((t) => {
      byMineral[t.mineral] = (byMineral[t.mineral] ?? 0) + (parseFloat(t.finalAmount.replace(/[^0-9.-]/g, "")) || 0);
    });
    return Object.entries(byMineral)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([mineral, amount]) => ({ mineral, value: amount >= 1e3 ? `$${(amount / 1e3).toFixed(0)}K` : `$${amount.toFixed(0)}` }));
  }, [state.transactions]);

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-base">P&L Summary (Feb 2026)</CardTitle>
            <CardDescription>Gross revenue, platform fees, net margin</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Daily</Button>
            <Button size="sm" className="bg-[#A855F7] hover:bg-purple-600">Weekly</Button>
            <Button variant="outline" size="sm">Monthly</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 p-4 text-center">
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{grossRevenue}</div>
              <div className="text-sm text-muted-foreground">Gross Revenue</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#A855F7]">{platformFees}</div>
              <div className="text-sm text-muted-foreground">Platform Fees</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{netMargin}</div>
              <div className="text-sm text-muted-foreground">Net Margin</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-base">Revenue Sources (YTD 2026)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl">
              {revenueBySource.map((r) => (
                <div key={r.label} className="text-center">
                  <div className={`text-xl font-bold ${r.color}`}>{r.value}</div>
                  <div className="text-sm text-muted-foreground">{r.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-base">Top Minerals by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMinerals.length ? topMinerals.map((m) => (
                <div key={m.mineral} className="flex justify-between">
                  <span>{m.mineral}</span>
                  <span className="font-bold">{m.value}</span>
                </div>
              )) : (
                <div className="text-sm text-muted-foreground">No completed transactions yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base">Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-14">CSV Export</Button>
            <Button variant="outline" className="h-14">PDF Summary</Button>
            <Button variant="outline" className="h-14">Mineral Breakdown</Button>
            <Button variant="outline" className="h-14">Bank Statements</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base">Settlement Queue</CardTitle>
          <CardDescription>All payment and settlement records.</CardDescription>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | "Pending" | "Completed" | "Failed")}>
            <SelectTrigger className="w-[140px] mt-2">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Order Ref</TableHead>
                  <TableHead>Final amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.transactions
                  .filter((t) => statusFilter === "all" || t.status === statusFilter)
                  .map((tx) => {
                    const order = [...state.buyOrders, ...state.sellOrders].find((o) => o.id === tx.orderId);
                    return (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">{tx.id}</TableCell>
                        <TableCell className="text-sm">{order ? getRegistryUserName(state.registryUsers, order.userId) : "—"}</TableCell>
                        <TableCell>
                          <button
                            type="button"
                            className="text-[#A855F7] hover:underline font-medium"
                            onClick={() => onOpenOrderDetail?.(tx.orderId, tx.orderType === "Buy" ? "buy" : "sell")}
                          >
                            {tx.orderId}
                          </button>
                        </TableCell>
                        <TableCell className="font-medium">{tx.finalAmount}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={tx.status === "Completed" ? "bg-emerald-50 text-emerald-700" : tx.status === "Failed" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}>
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => onOpenOrderDetail?.(tx.orderId, tx.orderType === "Buy" ? "buy" : "sell")}>
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base">Reconciliation</CardTitle>
          <CardDescription>Settlement batches (payouts).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payout ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Total amount</TableHead>
                  <TableHead># Transactions</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(state.payouts ?? []).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-[#A855F7]">{p.id}</TableCell>
                    <TableCell className="text-sm">{p.date}</TableCell>
                    <TableCell className="text-sm">{p.label}</TableCell>
                    <TableCell className="font-medium">${p.totalAmount}</TableCell>
                    <TableCell>{p.transactionCount}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={p.status === "Reconciled" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}>
                        {p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {(!state.payouts || state.payouts.length === 0) && (
            <p className="text-sm text-muted-foreground py-6 text-center">No settlement batches yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
