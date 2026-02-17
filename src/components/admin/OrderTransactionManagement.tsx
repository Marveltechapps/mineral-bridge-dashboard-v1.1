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
  ExternalLink,
  Plus,
  Upload,
  FileText,
  Phone
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
import { Textarea } from "../ui/textarea";
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
import { useAllOrders, useDashboardStore, getRegistryUserName, getOrderIsInternational, getTransactionIsInternational, normalizePhone, getCallHistoryForPhone } from "../../store/dashboardStore";
import type { Order, Transaction, CallHistoryEntry } from "../../store/dashboardStore";
import { toast } from "sonner";
import { Stepper6 } from "./orders/Stepper6";
import { OrderTable } from "./orders/OrderTable";
import { SettlementsTab } from "./orders/SettlementsTab";

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
  /** When opening the order sheet, open this tab (e.g. "testing" for Testing & Docs). */
  initialSheetTab?: string;
  /** Open full order detail page (Buyer/Seller management). */
  onOpenFullOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
  /** Navigate to Enquiry & Support (e.g. after Call Buyer). */
  onNavigateToEnquiries?: (userId?: string) => void;
  /** Navigate to Financial & Reporting (e.g. Reserve Escrow). */
  onNavigateToFinance?: () => void;
  /** Navigate to Logistics (e.g. Track). */
  onNavigateToLogistics?: (orderId?: string) => void;
  /** Navigate to Financial Transactions (full 6-step flow: Send QR → … → Release). */
  onNavigateToFinanceTransactions?: () => void;
}

const SHEET_TABS = ["overview", "flow", "communication", "testing", "sent", "transaction"] as const;
type SheetTab = (typeof SHEET_TABS)[number];

export function OrderTransactionManagement({
  initialTransactionId,
  initialSheetTab,
  onOpenFullOrderDetail,
  onNavigateToEnquiries,
  onNavigateToFinance,
  onNavigateToLogistics,
  onNavigateToFinanceTransactions,
}: OrderTransactionManagementProps = {}) {
  const { state, dispatch } = useDashboardStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [orderForView, setOrderForView] = useState<Order | null>(null);
  const [sheetTab, setSheetTab] = useState<SheetTab>("overview");
  const [orderForStatus, setOrderForStatus] = useState<Order | null>(null);
  const [orderForCancel, setOrderForCancel] = useState<Order | null>(null);
  const [orderForReserve, setOrderForReserve] = useState<Order | null>(null);
  const [releaseConfirmTx, setReleaseConfirmTx] = useState<Transaction | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [mainTab, setMainTab] = useState<"orders" | "settlements">("orders");
  const [activeStep6, setActiveStep6] = useState(1);
  const [internationalFilter, setInternationalFilter] = useState<"all" | "domestic" | "international">("all");
  const [statusFilterSettlement, setStatusFilterSettlement] = useState<"all" | "Pending" | "Completed" | "Failed">("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [methodFilter, setMethodFilter] = useState<"all" | "Bank Transfer" | "Wise" | "Blockchain Settlement">("all");
  const [newTestingLabel, setNewTestingLabel] = useState("");
  const [addTestingOpen, setAddTestingOpen] = useState(false);
  const [logCallOpen, setLogCallOpen] = useState(false);
  const [logCallNote, setLogCallNote] = useState("");
  const [logCallAdmin, setLogCallAdmin] = useState("Admin");
  const allOrders = useAllOrders();
  const transactions = state.transactions;
  // Only open sheet when initialTransactionId is set/changed — do NOT depend on state.transactions/allOrders
  // (they are new refs every render and would cause the effect to run in a loop and keep re-opening the sheet).
  useEffect(() => {
    if (!initialTransactionId) return;
    const tx = state.transactions.find((t) => t.id === initialTransactionId);
    if (tx) {
      setMainTab("settlements");
      const order = allOrders.find((o) => o.id === tx.orderId);
      if (order) setOrderForView(order);
      const tab = initialSheetTab && SHEET_TABS.includes(initialSheetTab as SheetTab) ? (initialSheetTab as SheetTab) : "overview";
      setSheetTab(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only react to initialTransactionId
  }, [initialTransactionId, initialSheetTab]);
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

  const activeOrdersCount = useMemo(
    () => allOrders.filter((o) => o.status !== "Completed" && o.status !== "Order Completed" && o.status !== "Cancelled").length,
    [allOrders]
  );

  const handleReleasePayment = (tx: Transaction) => {
    dispatch({ type: "UPDATE_TRANSACTION", payload: { ...tx, status: "Completed" } });
    const order = allOrders.find((o) => o.id === tx.orderId);
    if (order) {
      const labels = order.type === "Buy" ? [...BUY_FLOW_LABELS] : [...SELL_FLOW_LABELS];
      const flowSteps = labels.map((label) => ({ label, completed: true, active: false }));
      dispatch({
        type: "UPDATE_ORDER",
        payload: { ...order, status: "Completed", flowSteps, currentStep: 6 },
      });
    }
    setReleaseConfirmTx(null);
    toast.success("Payment released", { description: `${tx.finalAmount} sent. Order ${tx.orderId} completed.` });
  };

  const handleCallBuyer = (order: Order) => {
    const phone = order.contactInfo?.phone ?? state.registryUsers.find((u) => u.id === order.userId)?.phone;
    const name = order.contactInfo?.name ?? state.registryUsers.find((u) => u.id === order.userId)?.name ?? "Buyer";
    if (phone?.trim()) {
      window.open(`tel:${phone.trim().replace(/\s/g, "")}`, "_self");
      dispatch({ type: "SET_ORDER_CURRENT_STEP", payload: { orderId: order.id, type: "Buy", step: 2 } });
      toast.success(`Opening call to ${name}`, { description: "Step 2 in progress" });
    } else {
      toast.error("No phone number", { description: "Add buyer phone in order or registry to call." });
    }
  };

  const handleReserveConfirm = () => {
    if (!orderForReserve) return;
    const value = orderForReserve.orderSummary?.total ?? orderForReserve.aiEstimatedAmount ?? "—";
    dispatch({
      type: "UPDATE_ORDER",
      payload: { ...orderForReserve, escrowStatus: "Reserved", currentStep: 3 },
    });
    dispatch({ type: "SET_ORDER_CURRENT_STEP", payload: { orderId: orderForReserve.id, type: "Buy", step: 3 } });
    toast.success(`${value} reserved`, { description: "Escrow reserved. Step 3 complete." });
    setOrderForReserve(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders & Settlements</h1>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </Button>
          <Button size="sm" className="bg-[#A855F7] hover:bg-purple-600 text-white gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="p-3 flex flex-col gap-0.5">
            <p className="text-xs text-muted-foreground">Total volume</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              ${totalSettled >= 1e6 ? (totalSettled / 1e6).toFixed(2) + "M" : totalSettled.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="p-3 flex flex-col gap-0.5">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-xl font-bold text-blue-600">{activeOrdersCount}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="p-3 flex flex-col gap-0.5">
            <p className="text-xs text-muted-foreground">Pending release</p>
            <p className="text-xl font-bold text-amber-600">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="p-3 flex flex-col gap-0.5">
            <p className="text-xs text-muted-foreground">Disputed</p>
            <p className="text-xl font-bold text-red-600">{state.disputes.length}</p>
          </CardContent>
        </Card>
      </div>

      <Stepper6 activeStep={activeStep6} onStepChange={setActiveStep6} />
        {onNavigateToFinanceTransactions && (
          <p className="text-sm text-muted-foreground -mt-2 flex items-center gap-2">
            Run the full 6-step flow (Send QR → Call Buyer → … → Release) in
            <Button variant="link" size="sm" className="h-auto p-0 text-[#A855F7] font-medium" onClick={onNavigateToFinanceTransactions}>
              Financial & Reporting → Transactions
            </Button>
          </p>
        )}

      <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as "orders" | "settlements")} className="w-full">
        <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <TabsTrigger value="orders" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#A855F7] dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-purple-400 gap-2">
            <Gem className="h-4 w-4" />
            All Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="settlements" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#A855F7] dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-purple-400 gap-2">
            <CreditCard className="h-4 w-4" />
            Settlements ({pendingCount} pending)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <OrderTable
            orders={orders}
            registryUsers={state.registryUsers}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            scopeFilter={internationalFilter}
            onScopeFilterChange={(v) => setInternationalFilter(v)}
            onOpenDetails={(order) => {
              onOpenFullOrderDetail?.(order.id, order.type === "Buy" ? "buy" : "sell");
              setOrderForView(null);
            }}
            onOpenFullOrderDetail={onOpenFullOrderDetail}
            onCallBuyer={handleCallBuyer}
            onReserveEscrow={(order) => setOrderForReserve(order)}
            onTrack={(order) => onNavigateToLogistics?.(order.id)}
            onRelease={(order) => {
              const tx = state.transactions.find((t) => t.orderId === order.id);
              if (tx) onNavigateToFinance?.();
            }}
            dispatch={dispatch}
            use6StepFlow
            onStepComplete={(completedStep) => setActiveStep6(Math.min(completedStep + 1, 6))}
          />
        </TabsContent>

        <TabsContent value="settlements" className="mt-6 space-y-6">
          <SettlementsTab
            onReleasePaymentRequest={(tx) => setReleaseConfirmTx(tx)}
            onOpenOrderDetail={onOpenFullOrderDetail}
          />
          <Card className="border-slate-200 dark:border-slate-700">
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
                                onClick={() => {
                                  onOpenFullOrderDetail?.(order.id, order.type === "Buy" ? "buy" : "sell");
                                  setOrderForView(null);
                                }}
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

      {/* Reserve escrow confirmation */}
      <AlertDialog open={!!orderForReserve} onOpenChange={(open) => { if (!open) setOrderForReserve(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reserve in escrow?</AlertDialogTitle>
            <AlertDialogDescription>
              {orderForReserve && (
                <>
                  Reserve {orderForReserve.orderSummary?.total ?? orderForReserve.aiEstimatedAmount ?? "—"} for order {orderForReserve.id}? Money will be marked as reserved and step 3 complete.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReserveConfirm} className="bg-[#A855F7] hover:bg-purple-600">
              Reserve $
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Release payment confirmation */}
      <AlertDialog open={!!releaseConfirmTx} onOpenChange={(open) => { if (!open) setReleaseConfirmTx(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Release payment?</AlertDialogTitle>
            <AlertDialogDescription>
              {releaseConfirmTx && (
                <>
                  Release {releaseConfirmTx.finalAmount} to seller for order {releaseConfirmTx.orderId}? This will complete the settlement and mark the order done.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => releaseConfirmTx && handleReleasePayment(releaseConfirmTx)} className="bg-emerald-600 hover:bg-emerald-700">
              Release Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                            View Order
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

                <Tabs value={sheetTab} onValueChange={(v) => setSheetTab(v as SheetTab)} className="flex-1 flex flex-col min-h-0">
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
                      {(() => {
                        const orderPhone = orderForView.contactInfo?.phone ?? state.registryUsers.find((u) => u.id === orderForView.userId)?.phone;
                        const callHistoryForNumber = orderPhone ? getCallHistoryForPhone(state, orderPhone) : [];
                        return orderPhone && callHistoryForNumber.length > 0 ? (
                          <Card className="border-none shadow-sm">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <Phone className="h-4 w-4 text-emerald-600" />
                                Call history for this number ({orderPhone})
                              </CardTitle>
                              <p className="text-xs text-muted-foreground">All contacts to this phone across orders.</p>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {callHistoryForNumber.map((ch) => (
                                  <li key={ch.id} className="flex justify-between items-start gap-4 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 text-sm">
                                    <div>
                                      <p className="font-medium capitalize">{ch.type}</p>
                                      {ch.contextLabel && <p className="text-xs text-muted-foreground">{ch.contextLabel}</p>}
                                      {ch.note && <p className="text-xs text-muted-foreground mt-0.5">{ch.note}</p>}
                                    </div>
                                    <div className="text-right shrink-0 text-xs text-muted-foreground">
                                      {ch.admin} · {new Date(ch.at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ) : null;
                      })()}
                      <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between gap-4">
                          <div>
                            <CardTitle className="text-base">Communication log</CardTitle>
                            <p className="text-xs text-muted-foreground">Events and admin actions for this order.</p>
                          </div>
                          {orderForView.contactInfo?.phone ?? state.registryUsers.find((u) => u.id === orderForView.userId)?.phone ? (
                            <Button size="sm" variant="outline" className="gap-2" onClick={() => { setLogCallNote(""); setLogCallAdmin("Admin"); setLogCallOpen(true); }}>
                              <Phone className="h-4 w-4" />
                              Log call
                            </Button>
                          ) : null}
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
                        <CardHeader className="pb-2 flex flex-row items-start justify-between gap-4">
                          <div>
                            <CardTitle className="text-base">Testing & documentation</CardTitle>
                            <CardDescription className="text-xs">Add requirements and upload related documents here.</CardDescription>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => { setNewTestingLabel(""); setAddTestingOpen(true); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add requirement
                          </Button>
                        </CardHeader>
                        <CardContent>
                          {orderForView.testingReqs?.length ? (
                            <div className="space-y-0">
                              {orderForView.testingReqs.map((req, i) => (
                                <div key={i} className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                  <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{req.label}</span>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="secondary" className={req.status === "Uploaded" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}>
                                      {req.status}
                                    </Badge>
                                    {req.status === "Uploaded" && (req as { uploadedFileName?: string }).uploadedFileName && (
                                      <span className="text-xs text-muted-foreground">({(req as { uploadedFileName?: string }).uploadedFileName})</span>
                                    )}
                                    <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium border border-emerald-200 bg-transparent px-3 py-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 dark:border-emerald-800">
                                      <input
                                        type="file"
                                        className="sr-only"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (!file || !orderForView) return;
                                          const updatedReqs = (orderForView.testingReqs ?? []).map((r) =>
                                            r.label === req.label ? { ...r, status: "Uploaded" as const, uploadedFileName: file.name } : r
                                          );
                                          dispatch({ type: "UPDATE_ORDER", payload: { ...orderForView, testingReqs: updatedReqs } });
                                          toast.success("Document uploaded", { description: `${req.label}: ${file.name}` });
                                          e.target.value = "";
                                        }}
                                      />
                                      <Upload className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                                      <span>{req.status === "Uploaded" ? "Replace file" : "Choose file"}</span>
                                    </label>
                                    {req.status === "Pending" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-slate-600 border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/20"
                                        onClick={() => {
                                          const updatedReqs = (orderForView.testingReqs ?? []).map((r) =>
                                            r.label === req.label ? { ...r, status: "Uploaded" as const } : r
                                          );
                                          dispatch({ type: "UPDATE_ORDER", payload: { ...orderForView, testingReqs: updatedReqs } });
                                          toast.success("Marked as uploaded", { description: req.label });
                                        }}
                                      >
                                        Mark as uploaded
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-8 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                              <FileText className="h-10 w-10 mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                              <p className="text-sm text-muted-foreground mb-3">No testing requirements yet. Add document types, then upload files.</p>
                              <Button size="sm" variant="outline" onClick={() => { setNewTestingLabel(""); setAddTestingOpen(true); }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add requirement
                              </Button>
                            </div>
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

      <Dialog open={addTestingOpen} onOpenChange={setAddTestingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add testing requirement</DialogTitle>
            <DialogDescription>Add a document or check for the seller to upload. Then use &quot;Choose file&quot; to upload.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="testing-label-sheet">Requirement name</Label>
            <Input
              id="testing-label-sheet"
              value={newTestingLabel}
              onChange={(e) => setNewTestingLabel(e.target.value)}
              placeholder="e.g. Assay Certificate, Lab report, Export Compliance"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTestingOpen(false)}>Cancel</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                if (!newTestingLabel.trim() || !orderForView) return;
                const newReq = { label: newTestingLabel.trim(), status: "Pending" as const };
                const updated = { ...orderForView, testingReqs: [...(orderForView.testingReqs ?? []), newReq] };
                dispatch({ type: "UPDATE_ORDER", payload: updated });
                toast.success("Requirement added", { description: newReq.label });
                setAddTestingOpen(false);
                setNewTestingLabel("");
              }}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={logCallOpen} onOpenChange={setLogCallOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log call</DialogTitle>
            <DialogDescription>Record that you called this order&apos;s contact. Saved to call history (by number) and to this order&apos;s communication log.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="log-call-note-sheet">Note (optional)</Label>
              <Textarea id="log-call-note-sheet" value={logCallNote} onChange={(e) => setLogCallNote(e.target.value)} placeholder="e.g. Discussed delivery date" rows={2} className="resize-none mt-2" />
            </div>
            <div>
              <Label htmlFor="log-call-admin-sheet">Admin</Label>
              <Input id="log-call-admin-sheet" value={logCallAdmin} onChange={(e) => setLogCallAdmin(e.target.value)} placeholder="Admin" className="mt-2" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogCallOpen(false)}>Cancel</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                if (!orderForView) return;
                const phone = orderForView.contactInfo?.phone ?? state.registryUsers.find((u) => u.id === orderForView.userId)?.phone;
                if (!phone?.trim()) {
                  toast.error("No phone number for this order.");
                  return;
                }
                const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                const commEntry = { event: "Call logged", admin: logCallAdmin.trim() || "Admin", date, note: logCallNote.trim() || undefined, contactMethod: "Mobile" as const };
                const chEntry: CallHistoryEntry = {
                  id: `ch-${Date.now()}`,
                  phoneNumber: phone.trim(),
                  normalizedPhone: normalizePhone(phone),
                  orderId: orderForView.id,
                  userId: orderForView.userId,
                  contextLabel: `${orderForView.id} (${orderForView.contactInfo?.name ?? getRegistryUserName(state.registryUsers, orderForView.userId) ?? "—"})`,
                  at: new Date().toISOString(),
                  note: logCallNote.trim() || undefined,
                  admin: logCallAdmin.trim() || "Admin",
                  contactMethod: "Mobile",
                  type: "call",
                };
                dispatch({ type: "ADD_CALL_HISTORY", payload: chEntry });
                dispatch({ type: "UPDATE_ORDER", payload: { ...orderForView, commLog: [...(orderForView.commLog ?? []), commEntry] } });
                toast.success("Call logged");
                setLogCallOpen(false);
                setLogCallNote("");
              }}
            >
              Log call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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