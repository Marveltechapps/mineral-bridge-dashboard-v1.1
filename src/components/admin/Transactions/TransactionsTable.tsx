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
import { QrCode } from "lucide-react";
import type { Order } from "../../../store/dashboardStore";
import { getRegistryUserName } from "../../../store/dashboardStore";
import type { LogisticsDetails } from "../../../store/dashboardStore";

export interface TransactionRow {
  id: string;
  type: "Buy" | "Sell";
  mineral: string;
  qty: string;
  unit: string;
  buyer: string;
  seller: string;
  status: string;
  value: string;
  lc: string;
  testing: string;
  logistics: string;
  order: Order;
}

export function TransactionsTable({
  rows,
  onRowClick,
  onViewFlow,
  onQRClick,
}: {
  rows: TransactionRow[];
  onRowClick?: (row: TransactionRow) => void;
  onViewFlow?: (row: TransactionRow) => void;
  onQRClick?: (row: TransactionRow) => void;
}) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-900/50">
            <TableHead className="font-semibold">ID</TableHead>
            <TableHead className="font-semibold">Mineral / Qty</TableHead>
            <TableHead className="font-semibold">Buyer / Seller</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Value</TableHead>
            <TableHead className="font-semibold">LC#</TableHead>
            <TableHead className="font-semibold">Testing</TableHead>
            <TableHead className="font-semibold">Logistics</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
              onClick={() => onRowClick?.(row)}
            >
              <TableCell className="font-medium text-[#A855F7]">{row.id}</TableCell>
              <TableCell>
                <span className="font-medium">{row.mineral}</span>
                <span className="text-muted-foreground text-sm ml-1">
                  {row.qty} {row.unit}
                </span>
              </TableCell>
              <TableCell className="text-sm">
                {row.buyer} → {row.seller}
              </TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell className="font-medium">{row.value}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{row.lc}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{row.testing}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{row.logistics}</TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#A855F7] hover:bg-purple-50 dark:hover:bg-purple-950/30"
                    onClick={() => onViewFlow?.(row)}
                  >
                    View Flow
                  </Button>
                  {row.type === "Buy" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#A855F7]"
                      onClick={() => onQRClick?.(row)}
                      title="Send QR or link to user"
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function buildTransactionRows(
  buyOrders: Order[],
  sellOrders: Order[],
  registryUsers: { id: string; name: string }[],
  logisticsDetails: Record<string, LogisticsDetails>
): TransactionRow[] {
  const all: TransactionRow[] = [];
  buyOrders.forEach((o) => {
    const buyer = getRegistryUserName(registryUsers, o.userId);
    const seller = o.sellerName ?? o.facility?.name ?? "—";
    const log = logisticsDetails[o.id];
    all.push({
      id: o.id,
      type: "Buy",
      mineral: o.mineral,
      qty: o.qty,
      unit: o.unit,
      buyer,
      seller,
      status: o.status,
      value: o.aiEstimatedAmount ?? o.orderSummary?.total ?? "—",
      lc: o.lcNumber ?? "—",
      testing: o.testingLab ? (o.testingLab + (o.testingResultSummary ? " (" + o.testingResultSummary + ")" : "")) : "Pending",
      logistics: log ? log.carrierName + " " + log.trackingNumber : "—",
      order: o,
    });
  });
  sellOrders.forEach((o) => {
    const seller = getRegistryUserName(registryUsers, o.userId);
    const buyer = o.facility?.name ?? "—";
    const log = logisticsDetails[o.id];
    all.push({
      id: o.id,
      type: "Sell",
      mineral: o.mineral,
      qty: o.qty,
      unit: o.unit,
      buyer,
      seller,
      status: o.status,
      value: o.aiEstimatedAmount ?? "—",
      lc: o.lcNumber ?? "—",
      testing: o.testingLab ? (o.testingLab + (o.testingResultSummary ? " (" + o.testingResultSummary + ")" : "")) : "Pending",
      logistics: log ? log.carrierName + " " + log.trackingNumber : "—",
      order: o,
    });
  });
  return all.sort((a, b) => (b.order.createdAt ?? "").localeCompare(a.order.createdAt ?? ""));
}
