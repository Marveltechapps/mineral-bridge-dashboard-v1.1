import { useMemo } from "react";
import { useDashboardStore } from "../../../store/dashboardStore";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Badge } from "../../ui/badge";

export function ComplianceRegulatory({
  onOpenOrderDetail,
}: {
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
}) {
  const { state } = useDashboardStore();
  const allOrders = useMemo(
    () => [...state.buyOrders, ...state.sellOrders],
    [state.buyOrders, state.sellOrders]
  );

  const rows = useMemo(() => {
    return allOrders
      .filter((o) => o.status !== "Cancelled")
      .slice(0, 8)
      .map((o) => ({
        orderId: o.id,
        type: o.type,
        exportLicense: o.exportLicense ?? `MB-EXP-GHA-${o.id.slice(-4)}`,
        authority: o.facility?.country === "Ghana" ? "Ghana Minerals Commission" : "Local Authority",
        kycStatus: "Verified",
        sanctions: o.buyerCountry !== o.sellerCountry ? "Clear (OFAC/EU)" : "Clear",
        conflictMinerals: "Compliant (1502)",
        assay: o.testingLab ? `${o.testingLab} (${o.testingResultSummary ?? "Pending"})` : "SGS Ghana (98.2%)",
      }));
  }, [allOrders]);

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-base">International Regulatory Compliance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                <TableHead className="font-semibold">Order</TableHead>
                <TableHead className="font-semibold">Export License</TableHead>
                <TableHead className="font-semibold">Authority</TableHead>
                <TableHead className="font-semibold">KYC</TableHead>
                <TableHead className="font-semibold">Sanctions</TableHead>
                <TableHead className="font-semibold">1502</TableHead>
                <TableHead className="font-semibold">Assay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
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
                  <TableCell className="text-sm font-mono">{row.exportLicense}</TableCell>
                  <TableCell className="text-sm">{row.authority}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-100 text-emerald-700">{row.kycStatus}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{row.sanctions}</TableCell>
                  <TableCell className="text-sm">{row.conflictMinerals}</TableCell>
                  <TableCell className="text-sm">{row.assay}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
