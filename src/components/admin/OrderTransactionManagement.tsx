import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye,
  RefreshCw,
  Ban,
  Download,
  Calendar,
  History,
  MessageSquare,
  FileCheck,
  Send,
  CreditCard,
  MapPin,
  Gem,
  Globe,
  ExternalLink
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAllOrders, useDashboardStore, getRegistryUserName, getOrderIsInternational, getTransactionIsInternational } from "../../store/dashboardStore";
import type { Order, Transaction } from "../../store/dashboardStore";
import { toast } from "sonner";

const ORDER_STATUSES = ["Order Submitted", "Awaiting Team Contact", "Sample Test Required", "Price Confirmed", "Payment Initiated", "Completed", "Cancelled"] as const;
/** Buy orders: no "Sample Test Required" — not a required status in buyer flow */
const BUY_ORDER_STATUSES = ["Order Submitted", "Awaiting Team Contact", "Price Confirmed", "Payment Initiated", "Completed", "Cancelled"] as const;

const BUY_FLOW_LABELS = ["Order Submitted", "Awaiting Team Contact", "Price Confirmed", "Payment Initiated", "Order Completed"] as const;
const SELL_FLOW_LABELS = ["Order Submitted", "Awaiting Team Contact", "Sample Test Required", "Price Confirmed", "Payment Initiated", "Order Completed"] as const;

function computeFlowStepsForOrder(order: Order, newStatus: string): { label: string; completed: boolean; active: boolean }[] {
  const labels = order.type === "Buy" ? [...BUY_FLOW_LABELS] : [...SELL_FLOW_LABELS];
  const statusToStep = newStatus === "Completed" ? "Order Completed" : newStatus;
  const activeIndex = labels.indexOf(statusToStep);
  return labels.map((label, i) => ({
    label,
    completed: activeIndex >= 0 && i < activeIndex,
    active: activeIndex >= 0 && i === activeIndex,
  }));
}

export interface OrderTransactionManagementProps {
  initialTransactionId?: string;
  /** Open full order detail page (Buyer/Seller management). */
  onOpenFullOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
}

export function OrderTransactionManagement({ initialTransactionId, onOpenFullOrderDetail }: OrderTransactionManagementProps = {}) {
  const { state, dispatch } = useDashboardStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [orderForView, setOrderForView] = useState<Order | null>(null);
  const [orderForStatus, setOrderForStatus] = useState<Order | null>(null);
  const [orderForCancel, setOrderForCancel] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [mainTab, setMainTab] = useState<"orders" | "settlements">("orders");
  const [internationalFilter, setInternationalFilter] = useState<"all" | "domestic" | "international">("all");
  const [statusFilterSettlement, setStatusFilterSettlement] = useState<"all" | "Pending" | "Completed" | "Failed">("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [methodFilter, setMethodFilter] = useState<"all" | "Bank Transfer" | "Wise" | "Blockchain Settlement">("all");
  const allOrders = useAllOrders();
  const transactions = state.transactions;
  useEffect(() => {
    if (!initialTransactionId) return;
    const tx = state.transactions.find((t) => t.id === initialTransactionId);
    if (tx) {
      setMainTab("settlements");
      const order = allOrders.find((o) => o.id === tx.orderId);
      if (order) setOrderForView(order);
    }
  }, [initialTransactionId, state.transactions, allOrders]);
  const orders = useMemo(() => {
    let list = allOrders;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.mineral.toLowerCase().includes(q) ||
          o.facility?.name?.toLowerCase().includes(q)
      );
    }
    if (internationalFilter === "domestic") {
      list = list.filter((o) => !getOrderIsInternational(o, state.registryUsers));
    } else if (internationalFilter === "international") {
      list = list.filter((o) => getOrderIsInternational(o, state.registryUsers));
    }
    return list;
  }, [allOrders, searchTerm, internationalFilter, state.registryUsers]);

  const filteredTransactions = useMemo(() => {
    let list = transactions;
    if (internationalFilter === "domestic") {
      list = list.filter((tx) => !getTransactionIsInternational(tx, allOrders, state.registryUsers));
    } else if (internationalFilter === "international") {
      list = list.filter((tx) => getTransactionIsInternational(tx, allOrders, state.registryUsers));
    }
    if (statusFilterSettlement !== "all") {
      list = list.filter((tx) => tx.status === statusFilterSettlement);
    }
    if (methodFilter !== "all") {
      list = list.filter((tx) => tx.method === methodFilter);
    }
    if (dateRangeFilter !== "all") {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000;
      const monthStart = todayStart - 30 * 24 * 60 * 60 * 1000;
      list = list.filter((tx) => {
        const d = new Date(tx.date);
        const t = d.getTime();
        if (dateRangeFilter === "today") return t >= todayStart && t < todayStart + 24 * 60 * 60 * 1000;
        if (dateRangeFilter === "week") return t >= weekStart;
        if (dateRangeFilter === "month") return t >= monthStart;
        return true;
      });
    }
    return list;
  }, [transactions, internationalFilter, statusFilterSettlement, dateRangeFilter, methodFilter, allOrders, state.registryUsers]);

  const totalSettled = transactions.filter((t) => t.status === "Completed").reduce((s, t) => s + (parseFloat(t.finalAmount.replace(/[^0-9.-]/g, "")) || 0), 0);
  const pendingCount = transactions.filter((t) => t.status === "Pending").length;
  const completedCount = transactions.filter((t) => t.status === "Completed").length;
  const failedCount = transactions.filter((t) => t.status === "Failed").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders & Settlements</h1>
          <p className="text-muted-foreground">Unified order pipeline and payment settlements for Mineral Bridge. Orders are managed in Buy/Sell Management; here you see all orders and their settlement (payment) status.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as "orders" | "settlements")} className="w-full">
        <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
          <TabsTrigger value="orders" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
            <Gem className="h-4 w-4" />
            Orders (all buy & sell)
          </TabsTrigger>
          <TabsTrigger value="settlements" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
            <CreditCard className="h-4 w-4" />
            Settlements (payments)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Total volume (settled)</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${totalSettled >= 1e6 ? (totalSettled / 1e6).toFixed(2) + "M" : totalSettled.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Pending settlements</p>
                <h3 className="text-2xl font-bold text-amber-600">{pendingCount}</h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Active orders</p>
                <h3 className="text-2xl font-bold text-blue-600">{allOrders.length}</h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Disputed orders</p>
                <h3 className="text-2xl font-bold text-red-600">{state.disputes.length}</h3>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">All orders</CardTitle>
              <CardDescription className="text-muted-foreground">Unified list of buy and sell orders. Use Buy Management or Sell Management to focus on one side.</CardDescription>
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by Order ID, mineral, or facility..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={internationalFilter} onValueChange={(v) => setInternationalFilter(v as "all" | "domestic" | "international")}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All orders</SelectItem>
                      <SelectItem value="domestic">Domestic only</SelectItem>
                      <SelectItem value="international">International only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Status
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>User (Registry)</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Mineral & Quantity</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const isIntl = getOrderIsInternational(order, state.registryUsers);
                return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-emerald-600">{order.id}</TableCell>
                  <TableCell className="text-sm text-slate-700 dark:text-slate-300">
                    {getRegistryUserName(state.registryUsers, order.userId)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={order.type === "Buy" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20" : "bg-amber-50 text-amber-700 dark:bg-amber-900/20"}>
                      {order.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={isIntl ? "bg-violet-50 text-violet-700 dark:bg-violet-900/20 border-violet-200" : "bg-slate-50 text-slate-600 dark:bg-slate-800"}>
                      {isIntl ? "International" : "Domestic"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span className="font-medium text-slate-900 dark:text-slate-100">{order.mineral}</span>
                      <span className="text-xs text-muted-foreground">{order.qty} {order.unit}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{order.facility?.name ?? "—"}</TableCell>
                  <TableCell className="font-medium">{order.aiEstimatedAmount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`
                      ${order.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800" : ""}
                      ${order.status === "Awaiting Team Contact" || order.status === "Sample Test Required" ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800" : ""}
                      ${order.status === "Cancelled" ? "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700" : ""}
                    `}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{order.createdAt}</TableCell>
                <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 px-3"
                        onClick={(e) => { e.stopPropagation(); setOrderForView(order); }}
                      >
                        <Eye className="h-4 w-4" />
                        Details
                      </Button>
                      {onOpenFullOrderDetail && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 px-3 text-emerald-600 border-emerald-200"
                          onClick={(e) => { e.stopPropagation(); onOpenFullOrderDetail(order.id, order.type === "Buy" ? "buy" : "sell"); }}
                        >
                          Open in Order detail
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setOrderForView(order); }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View full details
                          </DropdownMenuItem>
                          {onOpenFullOrderDetail && (
                            <DropdownMenuItem onClick={() => onOpenFullOrderDetail(order.id, order.type === "Buy" ? "buy" : "sell")}>
                              Open in Order detail page
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => { setOrderForStatus(order); setNewStatus(order.status); }}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => setOrderForCancel(order)} disabled={order.status === "Cancelled"}>
                            <Ban className="mr-2 h-4 w-4" />
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="settlements" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Total settled</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${totalSettled >= 1e6 ? (totalSettled / 1e6).toFixed(2) + "M" : totalSettled.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Pending</p>
                <h3 className="text-2xl font-bold text-amber-600">{pendingCount}</h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Completed</p>
                <h3 className="text-2xl font-bold text-emerald-600">{completedCount}</h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Failed</p>
                <h3 className="text-2xl font-bold text-red-600">{failedCount}</h3>
              </CardContent>
            </Card>
          </div>
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Settlements (payments)</CardTitle>
              <CardDescription className="text-muted-foreground">Payment and settlement records linked to orders. Filter by scope, status, date range, and method.</CardDescription>
              <div className="flex flex-wrap gap-2 pt-2">
                <Select value={internationalFilter} onValueChange={(v) => setInternationalFilter(v as "all" | "domestic" | "international")}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All scope</SelectItem>
                    <SelectItem value="domestic">Domestic only</SelectItem>
                    <SelectItem value="international">International only</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilterSettlement} onValueChange={(v) => setStatusFilterSettlement(v as "all" | "Pending" | "Completed" | "Failed")}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateRangeFilter} onValueChange={(v) => setDateRangeFilter(v as "all" | "today" | "week" | "month")}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 days</SelectItem>
                    <SelectItem value="month">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={methodFilter} onValueChange={(v) => setMethodFilter(v as "all" | "Bank Transfer" | "Wise" | "Blockchain Settlement")}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All methods</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Wise">Wise</SelectItem>
                    <SelectItem value="Blockchain Settlement">Blockchain Settlement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Counterparty</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Mineral</TableHead>
                      <TableHead>Final amount</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Net</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date & time</TableHead>
                      <TableHead>Payout</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => {
                      const order = allOrders.find((o) => o.id === tx.orderId);
                      const txIntl = getTransactionIsInternational(tx, allOrders, state.registryUsers);
                      const payout = tx.payoutId ? state.payouts?.find((p) => p.id === tx.payoutId) : null;
                      return (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium text-emerald-600">{tx.id}</TableCell>
                          <TableCell className="text-sm">{tx.orderId}</TableCell>
                          <TableCell className="text-sm text-slate-700 dark:text-slate-300">{order ? getRegistryUserName(state.registryUsers, order.userId) : "—"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={tx.orderType === "Buy" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20" : "bg-amber-50 text-amber-700 dark:bg-amber-900/20"}>
                              {tx.orderType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={txIntl ? "bg-violet-50 text-violet-700 dark:bg-violet-900/20 border-violet-200" : "bg-slate-50 text-slate-600 dark:bg-slate-800"}>
                              {txIntl ? "International" : "Domestic"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{tx.mineral}</TableCell>
                          <TableCell className="font-medium">{tx.finalAmount}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{tx.serviceFee ?? "—"}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{tx.netAmount ?? "—"}</TableCell>
                          <TableCell className="text-sm">{tx.currency ?? "—"}</TableCell>
                          <TableCell className="text-sm">{tx.method ?? "—"}{tx.paymentChannel ? ` · ${tx.paymentChannel}` : ""}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={tx.status === "Completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20" : tx.status === "Pending" ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20" : "bg-slate-100 text-slate-600 dark:bg-slate-800"}>
                              {tx.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{tx.date ?? "—"}{tx.time ? ` ${tx.time}` : ""}</TableCell>
                          <TableCell className="text-xs">{payout ? <span className="text-emerald-600 dark:text-emerald-400" title={payout.label}>{payout.id}</span> : "—"}</TableCell>
                          <TableCell className="text-right">
                            {order && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1.5 px-3"
                                onClick={() => setOrderForView(order)}
                              >
                                <Eye className="h-4 w-4" />
                                View order
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Full order details – same depth as User Management detail flow */}
      <Sheet open={!!orderForView} onOpenChange={(open) => { if (!open) setOrderForView(null); }}>
        <SheetContent className="w-full sm:max-w-[800px] overflow-y-auto p-0 flex flex-col" key={orderForView?.id}>
          {orderForView ? (() => {
            const relatedTx = state.transactions.find((t) => t.orderId === orderForView.id);
            const orderIntl = getOrderIsInternational(orderForView, state.registryUsers);
            return (
              <div className="flex flex-col h-full">
                <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-6">
                  <SheetHeader className="mb-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <SheetTitle className="text-xl font-bold text-slate-900 dark:text-white">{orderForView.id}</SheetTitle>
                        <SheetDescription className="text-sm text-muted-foreground mt-1">
                          {orderForView.type} order · {getRegistryUserName(state.registryUsers, orderForView.userId)} · {orderForView.createdAt}
                        </SheetDescription>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <Badge variant="outline" className={orderForView.type === "Buy" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"}>
                            {orderForView.type}
                          </Badge>
                          <Badge variant="outline" className={orderIntl ? "bg-violet-50 text-violet-700 dark:bg-violet-900/20 border-violet-200" : "bg-slate-50 text-slate-600 dark:bg-slate-800"}>
                            <Globe className="h-3 w-3 mr-1 inline" />
                            {orderIntl ? "International" : "Domestic"}
                          </Badge>
                          <Badge className={
                            orderForView.status === "Completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            orderForView.status === "Cancelled" ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" :
                            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          }>
                            {orderForView.status}
                          </Badge>
                          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{orderForView.aiEstimatedAmount}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {onOpenFullOrderDetail && (
                          <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5" onClick={() => { onOpenFullOrderDetail(orderForView.id, orderForView.type === "Buy" ? "buy" : "sell"); setOrderForView(null); }}>
                            <ExternalLink className="h-4 w-4" />
                            Open in Order detail
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => { setOrderForStatus(orderForView); setOrderForView(null); }}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Update Status
                        </Button>
                        {orderForView.status !== "Cancelled" && (
                          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => { setOrderForCancel(orderForView); setOrderForView(null); }}>
                            <Ban className="h-4 w-4 mr-2" />
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </SheetHeader>
                </div>

                <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
                  <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg mx-6 mt-4 w-auto">
                    <TabsTrigger value="overview" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
                      <Gem className="h-4 w-4" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="flow" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
                      <History className="h-4 w-4" />
                      Flow & Status
                    </TabsTrigger>
                    <TabsTrigger value="communication" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Communication
                    </TabsTrigger>
                    <TabsTrigger value="testing" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
                      <FileCheck className="h-4 w-4" />
                      Testing & Docs
                    </TabsTrigger>
                    <TabsTrigger value="sent" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
                      <Send className="h-4 w-4" />
                      Sent to User
                    </TabsTrigger>
                    <TabsTrigger value="transaction" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
                      <CreditCard className="h-4 w-4" />
                      Related Transaction
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    <TabsContent value="overview" className="mt-0 space-y-6">
                      {orderIntl && (
                        <Card className="border-none shadow-sm border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-900/20">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Globe className="h-4 w-4 text-violet-600" />
                              International order
                            </CardTitle>
                            <CardDescription>Cross-border: buyer and facility/seller in different countries. Settlement may involve FX or international payment channel.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <p><span className="text-muted-foreground">Buyer country:</span> <span className="font-medium">{orderForView.buyerCountry ?? state.registryUsers.find((u) => u.id === orderForView.userId)?.country ?? "—"}</span></p>
                            <p><span className="text-muted-foreground">Facility / seller country:</span> <span className="font-medium">{orderForView.sellerCountry ?? orderForView.facility?.country ?? "—"}</span></p>
                            <p><span className="text-muted-foreground">Order currency:</span> <span className="font-medium">{orderForView.currency}</span></p>
                          </CardContent>
                        </Card>
                      )}
                      <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Order & user</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-muted-foreground">Order ID</Label>
                              <p className="font-mono font-medium text-emerald-600 dark:text-emerald-400">{orderForView.id}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">User (Registry)</Label>
                              <p className="font-medium">{getRegistryUserName(state.registryUsers, orderForView.userId)}</p>
                              {orderForView.userId && <p className="text-xs text-muted-foreground">{orderForView.userId}</p>}
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Type</Label>
                              <Badge variant="outline" className={orderForView.type === "Buy" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}>{orderForView.type}</Badge>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Status</Label>
                              <p className="font-medium">{orderForView.status}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Created</Label>
                              <p className="font-medium">{orderForView.createdAt}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Amount</Label>
                              <p className="font-bold text-emerald-600 dark:text-emerald-400">{orderForView.aiEstimatedAmount} {orderForView.currency}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2"><Gem className="h-4 w-4" /> Mineral & quantity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">Mineral</Label>
                            <p className="font-medium">{orderForView.mineral}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Quantity</Label>
                            <p className="font-medium">{orderForView.qty} {orderForView.unit}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Description</Label>
                            <p className="text-sm text-muted-foreground">{orderForView.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" /> Facility</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                          <p className="font-medium">{orderForView.facility?.name}</p>
                          <p className="text-muted-foreground">{orderForView.facility?.address}</p>
                          <p className="text-muted-foreground">{orderForView.facility?.country}</p>
                          {orderForView.facility?.contact && <p className="text-muted-foreground">Contact: {orderForView.facility.contact}</p>}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="flow" className="mt-0 space-y-6">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Flow steps</CardTitle>
                          <p className="text-xs text-muted-foreground">Order lifecycle. Update status from the header or via Orders list.</p>
                        </CardHeader>
                        <CardContent>
                          {orderForView.flowSteps?.length ? (
                            <div className="space-y-3">
                              {orderForView.flowSteps.map((s, i) => (
                                <div key={i} className="flex items-center gap-4">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                                    s.completed ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                    s.active ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                    "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                  }`}>
                                    {s.completed ? "✓" : i + 1}
                                  </div>
                                  <div className="flex-1">
                                    <p className={`font-medium ${s.active ? "text-slate-900 dark:text-white" : "text-muted-foreground"}`}>{s.label}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No flow steps recorded.</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="communication" className="mt-0 space-y-6">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Communication log</CardTitle>
                          <p className="text-xs text-muted-foreground">Events and admin actions for this order.</p>
                        </CardHeader>
                        <CardContent>
                          {orderForView.commLog?.length ? (
                            <div className="space-y-3">
                              {orderForView.commLog.map((c, i) => (
                                <div key={i} className="flex justify-between items-start gap-4 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                  <div>
                                    <p className="font-medium text-sm">{c.event}</p>
                                    {c.note && <p className="text-xs text-muted-foreground mt-0.5">{c.note}</p>}
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-xs font-medium text-muted-foreground">{c.admin}</p>
                                    <p className="text-xs text-muted-foreground">{c.date}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No communication log entries.</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="testing" className="mt-0 space-y-6">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Testing & documentation</CardTitle>
                          <p className="text-xs text-muted-foreground">Required tests and upload status.</p>
                        </CardHeader>
                        <CardContent>
                          {orderForView.testingReqs?.length ? (
                            <div className="space-y-2">
                              {orderForView.testingReqs.map((req, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                  <span className="font-medium text-sm">{req.label}</span>
                                  <Badge variant="secondary" className={req.status === "Uploaded" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}>
                                    {req.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No testing requirements for this order.</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="sent" className="mt-0 space-y-6">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Sent to user</CardTitle>
                          <p className="text-xs text-muted-foreground">Links and info sent via app (bank details, transport, QR, etc.).</p>
                        </CardHeader>
                        <CardContent>
                          {orderForView.sentToUser?.length ? (
                            <div className="space-y-3">
                              {orderForView.sentToUser.map((s, i) => (
                                <div key={i} className="py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">{s.type}</Badge>
                                    <span className="font-medium text-sm">{s.label}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">{s.date} · {s.channel}</p>
                                  {s.detail && <p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p>}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Nothing sent to user yet.</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="transaction" className="mt-0 space-y-6">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Related transaction</CardTitle>
                          <p className="text-xs text-muted-foreground">Settlement or payment linked to this order.</p>
                        </CardHeader>
                        <CardContent>
                          {relatedTx ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs text-muted-foreground">Transaction ID</Label>
                                  <p className="font-mono font-medium">{relatedTx.id}</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">Status</Label>
                                  <Badge className={relatedTx.status === "Completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : relatedTx.status === "Failed" ? "bg-red-100 text-red-700 dark:bg-red-900/30" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30"}>
                                    {relatedTx.status}
                                  </Badge>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">Final amount</Label>
                                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{relatedTx.finalAmount}</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">Method</Label>
                                  <p className="font-medium">{relatedTx.method}{relatedTx.paymentChannel ? ` · ${relatedTx.paymentChannel}` : ""}</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">Date & time</Label>
                                  <p className="text-sm">{relatedTx.date} {relatedTx.time}</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">Settlement note</Label>
                                  <p className="text-sm text-muted-foreground">{relatedTx.settlementNote}</p>
                                </div>
                              </div>
                              {(relatedTx.isInternational || relatedTx.payerCountry || relatedTx.beneficiaryCountry || relatedTx.sourceCurrency || relatedTx.fxRate) && (
                                <div className="p-3 rounded-md border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-900/20 space-y-2">
                                  <Label className="text-xs font-medium text-violet-700 dark:text-violet-300">International settlement</Label>
                                  {(relatedTx.payerCountry || relatedTx.beneficiaryCountry) && (
                                    <p className="text-sm">Payer: {relatedTx.payerCountry ?? "—"} → Beneficiary: {relatedTx.beneficiaryCountry ?? "—"}</p>
                                  )}
                                  {(relatedTx.sourceCurrency || relatedTx.targetCurrency) && (
                                    <p className="text-sm">Currency: {relatedTx.sourceCurrency ?? relatedTx.currency} → {relatedTx.targetCurrency ?? relatedTx.currency}</p>
                                  )}
                                  {relatedTx.fxRate && <p className="text-sm">FX rate: {relatedTx.fxRate}{relatedTx.fxRateDate ? ` (${relatedTx.fxRateDate})` : ""}</p>}
                                  {relatedTx.sanctionsResult && <p className="text-xs text-muted-foreground">Sanctions: {relatedTx.sanctionsResult}{relatedTx.sanctionsCheckedAt ? ` · ${relatedTx.sanctionsCheckedAt}` : ""}</p>}
                                </div>
                              )}
                              {relatedTx.paymentDetails && Object.keys(relatedTx.paymentDetails).length > 0 && (
                                <div>
                                  <Label className="text-xs text-muted-foreground">Payment details</Label>
                                  <div className="mt-1 p-3 bg-slate-50 dark:bg-slate-900 rounded-md text-xs space-y-1">
                                    {relatedTx.paymentDetails.accountName && <p>Account: {relatedTx.paymentDetails.accountName}</p>}
                                    {relatedTx.paymentDetails.bankName && <p>Bank: {relatedTx.paymentDetails.bankName}</p>}
                                    {relatedTx.paymentDetails.maskedAccount && <p>Masked: {relatedTx.paymentDetails.maskedAccount}</p>}
                                    {relatedTx.paymentDetails.reference && <p>Ref: {relatedTx.paymentDetails.reference}</p>}
                                    {relatedTx.paymentDetails.network && <p>Network: {relatedTx.paymentDetails.network}</p>}
                                    {relatedTx.paymentDetails.hash && <p className="font-mono truncate">Hash: {relatedTx.paymentDetails.hash}</p>}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No linked transaction for this order yet.</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            );
          })() : null}
        </SheetContent>
      </Sheet>

      <Dialog open={!!orderForStatus} onOpenChange={(open) => !open && setOrderForStatus(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>Change the status for {orderForStatus?.id}. This will sync across the dashboard and app.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                {(orderForStatus?.type === "Buy" ? BUY_ORDER_STATUSES : ORDER_STATUSES).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderForStatus(null)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => {
              if (!orderForStatus) return;
              const flowSteps = computeFlowStepsForOrder(orderForStatus, newStatus);
              dispatch({ type: "UPDATE_ORDER", payload: { ...orderForStatus, status: newStatus, flowSteps } });
              toast.success("Order status updated", { description: `${orderForStatus.id} → ${newStatus}. Pipeline updated.` });
              setOrderForStatus(null);
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!orderForCancel} onOpenChange={(open) => !open && setOrderForCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel order?</AlertDialogTitle>
            <AlertDialogDescription>This will cancel order {orderForCancel?.id}. The change will reflect in the app and dashboard.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => {
              if (!orderForCancel) return;
              dispatch({ type: "UPDATE_ORDER", payload: { ...orderForCancel, status: "Cancelled" } });
              toast.success("Order cancelled", { description: orderForCancel.id });
              setOrderForCancel(null);
            }}>Cancel Order</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}