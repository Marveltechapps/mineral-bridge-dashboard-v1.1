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

export function TradeFinanceLC({
  onOpenOrderDetail,
}: {
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
}) {
  const { state } = useDashboardStore();
  const allOrders = useMemo(
    () => [...state.buyOrders, ...state.sellOrders],
    [state.buyOrders, state.sellOrders]
  );

  const lcRows = useMemo(() => {
    const withLc = allOrders.filter((o) => o.lcNumber);
    if (withLc.length > 0) {
      return withLc.map((o) => ({
        lcNumber: o.lcNumber!,
        orderId: o.id,
        type: o.type,
        issuingBank: "SBI India (SBIINBB107)",
        advisingBank: o.correspondentBank ?? "HSBC Switzerland (HBSGINZZ)",
        amount: o.aiEstimatedAmount ?? "—",
        currency: o.currency ?? "USD",
        expiry: "Mar 15, 2026",
        paymentTerms: o.paymentTerms ?? "T/T 30/70",
        status: "Active",
        documents: "3/3 presented",
        seller: getRegistryUserName(state.registryUsers, o.userId),
      }));
    }
    return [
      {
        lcNumber: "LC-456-2026",
        orderId: "S-ORD-8821",
        type: "Sell" as const,
        issuingBank: "SBI India (SBIINBB107)",
        advisingBank: "HSBC Switzerland (HBSGINZZ)",
        amount: "$725,000",
        currency: "USD",
        expiry: "Mar 15, 2026",
        paymentTerms: "T/T 30/70",
        status: "Active",
        documents: "3/3 presented",
        seller: "Samuel Osei",
      },
      {
        lcNumber: "LC-789-2026",
        orderId: "B-ORD-5489",
        type: "Buy" as const,
        issuingBank: "Zenith Bank Nigeria",
        advisingBank: "—",
        amount: "$1,120,000",
        currency: "USD",
        expiry: "Feb 28, 2026",
        paymentTerms: "D/P at sight",
        status: "Pending Issuance",
        documents: "0/3",
        seller: "—",
      },
    ];
  }, [allOrders, state.registryUsers]);

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-base">Letters of Credit ({lcRows.length} Active)</CardTitle>
        <Button className="bg-[#A855F7] hover:bg-purple-600">+ Issue New LC</Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                <TableHead className="font-semibold">LC#</TableHead>
                <TableHead className="font-semibold">Order</TableHead>
                <TableHead className="font-semibold">Issuing Bank</TableHead>
                <TableHead className="font-semibold">Advising Bank</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Payment Terms</TableHead>
                <TableHead className="font-semibold">Expiry</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Docs</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lcRows.map((row) => (
                <TableRow key={row.lcNumber}>
                  <TableCell className="font-mono text-[#A855F7]">{row.lcNumber}</TableCell>
                  <TableCell>
                    <button
                      type="button"
                      className="font-medium text-[#A855F7] hover:underline"
                      onClick={() => onOpenOrderDetail?.(row.orderId, row.type === "Sell" ? "sell" : "buy")}
                    >
                      {row.orderId}
                    </button>
                  </TableCell>
                  <TableCell className="text-sm">{row.issuingBank}</TableCell>
                  <TableCell className="text-sm">{row.advisingBank}</TableCell>
                  <TableCell className="font-medium">{row.amount} {row.currency}</TableCell>
                  <TableCell className="text-sm">{row.paymentTerms}</TableCell>
                  <TableCell className="text-sm">{row.expiry}</TableCell>
                  <TableCell>
                    <Badge className={row.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{row.documents}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">Amend</Button>
                    <Button size="sm" className="ml-1 bg-[#A855F7] hover:bg-purple-600">Release</Button>
                    <Button size="sm" variant="outline" className="ml-1">Docs</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
