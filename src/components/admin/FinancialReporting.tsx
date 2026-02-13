import { useMemo } from "react";
import { Download, Calendar, LayoutGrid, Wallet, FileText, Shield, TrendingUp } from "lucide-react";
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

export function FinancialReporting({
  onOpenOrderDetail,
}: {
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
}) {
  const { state } = useDashboardStore();

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

    return {
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

      {/* 6 Global metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
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
      </div>

      {/* 7 Tabs */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="transactions" className="gap-1.5 data-[state=active]:bg-[#A855F7] data-[state=active]:text-white">
            <LayoutGrid className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="escrow" className="gap-1.5 data-[state=active]:bg-[#A855F7] data-[state=active]:text-white">
            <Wallet className="h-4 w-4" />
            Escrow (Global)
          </TabsTrigger>
          <TabsTrigger value="lc" className="gap-1.5 data-[state=active]:bg-[#A855F7] data-[state=active]:text-white">
            <FileText className="h-4 w-4" />
            Trade Finance LC
          </TabsTrigger>
          <TabsTrigger value="incoterms" className="gap-1.5 data-[state=active]:bg-[#A855F7] data-[state=active]:text-white">
            Incoterms & Logistics
          </TabsTrigger>
          <TabsTrigger value="compliance" className="gap-1.5 data-[state=active]:bg-[#A855F7] data-[state=active]:text-white">
            <Shield className="h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="currency" className="gap-1.5 data-[state=active]:bg-[#A855F7] data-[state=active]:text-white">
            Multi-Currency
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-1.5 data-[state=active]:bg-[#A855F7] data-[state=active]:text-white">
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
          <IncotermsLogistics onOpenOrderDetail={onOpenOrderDetail} />
        </TabsContent>

        <TabsContent value="compliance" className="mt-4">
          <ComplianceRegulatory onOpenOrderDetail={onOpenOrderDetail} />
        </TabsContent>

        <TabsContent value="currency" className="mt-4">
          <MultiCurrencyReports />
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <RevenueAnalytics onOpenOrderDetail={onOpenOrderDetail} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
