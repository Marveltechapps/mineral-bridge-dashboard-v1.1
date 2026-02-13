import { useMemo, useState } from "react";
import { Download, Calendar, LayoutGrid, Wallet, FileText, Shield, TrendingUp, AlertCircle, HelpCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useDashboardStore } from "../../store/dashboardStore";
import { TransactionsDashboard } from "./Transactions/TransactionsDashboard";
import { InternationalEscrow } from "./Financial/InternationalEscrow";
import { TradeFinanceLC } from "./Financial/TradeFinanceLC";
import { IncotermsLogistics } from "./Financial/IncotermsLogistics";
import { ComplianceRegulatory } from "./Financial/ComplianceRegulatory";
import { MultiCurrencyReports } from "./Financial/MultiCurrencyReports";
import { RevenueAnalytics } from "./Financial/RevenueAnalytics";

const TAB_VALUES = ["transactions", "escrow", "lc", "incoterms", "compliance", "currency", "revenue"] as const;
type FinancialTab = (typeof TAB_VALUES)[number];

export function FinancialReporting({
  onOpenOrderDetail,
  onNavigateToEnquiries,
  onOpenLogisticsDetail,
}: {
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
  /** Open Enquiry & Support (for transactions/orders needing help). */
  onNavigateToEnquiries?: () => void;
  /** Open Logistics & details page for an order (from Incoterms table). */
  onOpenLogisticsDetail?: (orderId: string) => void;
}) {
  const { state } = useDashboardStore();
  const openEnquiriesCount = useMemo(() => state.enquiries.filter((e) => e.status !== "Resolved").length, [state.enquiries]);
  const [activeTab, setActiveTab] = useState<FinancialTab>("transactions");
  const [revenueOpenWithFailed, setRevenueOpenWithFailed] = useState(false);

  const metrics = useMemo(() => {
    const allOrders = [...state.buyOrders, ...state.sellOrders];
    const totalEscrow = allOrders
      .filter((o) => o.status !== "Cancelled" && o.status !== "Completed" && o.status !== "Order Completed")
      .reduce((s, o) => s + (parseFloat(String(o.aiEstimatedAmount ?? 0).replace(/[^0-9.-]/g, "")) || 0), 0);
    const lcCount = allOrders.filter((o) => o.lcNumber).length || 15;
    const pendingRelease = state.transactions
      .filter((t) => t.status === "Pending")
      .reduce((s, t) => s + (parseFloat(t.finalAmount.replace(/[^0-9.-]/g, "")) || 0), 0);
    const settledYtd = state.transactions
      .filter((t) => t.status === "Completed")
      .reduce((s, t) => s + (parseFloat(t.finalAmount.replace(/[^0-9.-]/g, "")) || 0), 0);
    const platformRevenue = state.transactions
      .filter((t) => t.status === "Completed")
      .reduce((s, t) => s + (parseFloat(t.serviceFee?.replace(/[^0-9.-]/g, "") || "0") || 0), 0);
    const incotermsFob = 62;
    const complianceOk = 98;
    const failedCount = state.transactions.filter((t) => t.status === "Failed").length;

    return {
      failedCount,
      totalEscrow: totalEscrow >= 1e6 ? `$${(totalEscrow / 1e6).toFixed(1)}M` : `$${totalEscrow.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      lcIssued: lcCount,
      pendingRelease: pendingRelease >= 1e6 ? `$${(pendingRelease / 1e6).toFixed(1)}M` : `$${pendingRelease.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      settledYtd: settledYtd >= 1e6 ? `$${(settledYtd / 1e6).toFixed(1)}M` : `$${settledYtd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      platformRevenue: platformRevenue >= 1e3 ? `$${(platformRevenue / 1e3).toFixed(0)}K` : `$${platformRevenue.toFixed(0)}`,
      incotermsFob: incotermsFob + "%",
      complianceOk: complianceOk + "%",
    };
  }, [state.buyOrders, state.sellOrders, state.transactions]);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Financial & Reporting</h1>
          <p className="text-muted-foreground mt-1">
            Complete international trade finance: Escrow, LC, Incoterms, SWIFT, Compliance, Multi-currency
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Select defaultValue="feb2026">
            <SelectTrigger className="w-[160px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jan2026">Jan 2026</SelectItem>
              <SelectItem value="feb2026">Feb 2026</SelectItem>
              <SelectItem value="ytd">YTD 2026</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="USD">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="GHS">GHS</SelectItem>
              <SelectItem value="CHF">CHF</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-[#A855F7] hover:bg-purple-600 text-white gap-2">
            <Download className="w-4 h-4" />
            Export All (CSV/PDF)
          </Button>
        </div>
      </div>

      {/* Global metrics (including Failed – click to view failed transactions) */}
      <div className="grid grid-cols-2 lg:grid-cols-7 gap-6">
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Total Escrow</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.totalEscrow}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">LC Issued</p>
            <p className="text-2xl font-bold text-[#A855F7]">{metrics.lcIssued}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Pending Release</p>
            <p className="text-2xl font-bold text-amber-600">{metrics.pendingRelease}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Settled YTD</p>
            <p className="text-2xl font-bold text-emerald-600">{metrics.settledYtd}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Incoterms FOB</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.incotermsFob}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Compliance OK</p>
            <p className="text-2xl font-bold text-emerald-600">{metrics.complianceOk}</p>
          </CardContent>
        </Card>
        <Card
          className={`border-slate-200 dark:border-slate-700 ${metrics.failedCount > 0 ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/30 cursor-pointer hover:bg-red-100/50 dark:hover:bg-red-900/20" : ""}`}
          role={metrics.failedCount > 0 ? "button" : undefined}
          onClick={() => metrics.failedCount > 0 && (setActiveTab("revenue"), setRevenueOpenWithFailed(true))}
        >
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Failed</p>
            <p className={`text-2xl font-bold ${metrics.failedCount > 0 ? "text-red-600" : "text-slate-900 dark:text-white"}`}>{metrics.failedCount}</p>
            {metrics.failedCount > 0 && <p className="text-xs text-red-600 mt-1">Click to view</p>}
          </CardContent>
        </Card>
      </div>

      {metrics.failedCount > 0 && (
        <div className="rounded-lg border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-medium">{metrics.failedCount} transaction(s) failed.</span>
            <span className="text-sm text-muted-foreground">Review and retry from the Revenue tab.</span>
          </div>
          <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/40" onClick={() => (setActiveTab("revenue"), setRevenueOpenWithFailed(true))}>
            View failed transactions
          </Button>
        </div>
      )}

      {openEnquiriesCount > 0 && onNavigateToEnquiries && (
        <div className="rounded-lg border-2 border-amber-200 dark:border-amber-900 bg-amber-50/80 dark:bg-amber-950/30 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <HelpCircle className="h-5 w-5 shrink-0" />
            <span className="font-medium">Transactions or orders need help or support.</span>
            <span className="text-sm text-muted-foreground">{openEnquiriesCount} open enquiry(s) in Enquiry & Support.</span>
          </div>
          <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/40" onClick={onNavigateToEnquiries}>
            View Enquiry & Support
          </Button>
        </div>
      )}

      {/* 7 Tabs - controlled so the active button reflects the visible page */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FinancialTab)} className="w-full">
        <TabsList className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="transactions" className="gap-1.5 data-[state=active]:bg-[#A855F7] data-[state=active]:text-white data-[state=active]:shadow-md">
            <LayoutGrid className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="escrow" className="gap-1.5 data-[state=active]:bg-[#A855F7] data-[state=active]:text-white data-[state=active]:shadow-md">
            <Wallet className="h-4 w-4" />
            Escrow (Global)
          </TabsTrigger>
          <TabsTrigger value="lc" className="gap-1.5 data-[state=active]:bg-[#A855F7] data-[state=active]:text-white data-[state=active]:shadow-md">
            <FileText className="h-4 w-4" />
            Trade Finance LC
          </TabsTrigger>
          <TabsTrigger value="incoterms" className="gap-1.5 data-[state=active]:bg-[#A855F7] data-[state=active]:text-white data-[state=active]:shadow-md">
            Incoterms & Logistics
          </TabsTrigger>
          <TabsTrigger value="compliance" className="gap-1.5 data-[state=active]:bg-[#A855F7] data-[state=active]:text-white data-[state=active]:shadow-md">
            <Shield className="h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="currency" className="gap-1.5 data-[state=active]:bg-[#A855F7] data-[state=active]:text-white data-[state=active]:shadow-md">
            Multi-Currency
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-1.5 data-[state=active]:bg-[#A855F7] data-[state=active]:text-white data-[state=active]:shadow-md">
            <TrendingUp className="h-4 w-4" />
            Revenue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4">
          <TransactionsDashboard onOpenOrderDetail={onOpenOrderDetail} />
        </TabsContent>

        <TabsContent value="escrow" className="mt-4">
          <InternationalEscrow
            onOpenOrderDetail={onOpenOrderDetail}
            onReleaseEscrow={(orderId) => {
              const tx = state.transactions.find((t) => t.orderId === orderId);
              if (tx) onOpenOrderDetail?.(orderId, tx.orderType === "Buy" ? "buy" : "sell");
            }}
          />
        </TabsContent>

        <TabsContent value="lc" className="mt-4">
          <TradeFinanceLC onOpenOrderDetail={onOpenOrderDetail} />
        </TabsContent>

        <TabsContent value="incoterms" className="mt-4">
          <IncotermsLogistics onOpenOrderDetail={onOpenOrderDetail} onOpenLogisticsDetail={onOpenLogisticsDetail} />
        </TabsContent>

        <TabsContent value="compliance" className="mt-4">
          <ComplianceRegulatory onOpenOrderDetail={onOpenOrderDetail} />
        </TabsContent>

        <TabsContent value="currency" className="mt-4">
          <MultiCurrencyReports />
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <RevenueAnalytics
            onOpenOrderDetail={onOpenOrderDetail}
            defaultStatusFilter={revenueOpenWithFailed ? "Failed" : undefined}
            onDefaultFilterConsumed={() => setRevenueOpenWithFailed(false)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
