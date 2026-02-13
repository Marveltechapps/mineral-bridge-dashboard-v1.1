import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import {
  Gem,
  History,
  MessageSquare,
  FileText,
  Send,
  CreditCard,
  MapPin,
  RefreshCw,
  Ban,
  Plus,
  Link2,
  Users,
  Gavel,
  HelpCircle,
  Truck,
  ExternalLink,
  Globe,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
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
import { useDashboardStore, getRegistryUserName, getLogisticsDetailsForOrder, getOrderIsInternational } from "../../store/dashboardStore";
import type { Order, OrderFlowStepData, OrderDeliveryLocation, SentToUser } from "../../store/dashboardStore";
import { toast } from "sonner";

type StepDialogType = "priceConfirmed" | "paymentInitiated" | "orderCompleted" | null;

const SENT_TYPES: SentToUser["type"][] = ["transport_link", "qr_or_bank", "sample_pickup_link", "lc_credit"];
const SENT_TYPE_LABELS: Record<SentToUser["type"], string> = {
  transport_link: "Logistics / transport link",
  qr_or_bank: "Bank details / QR or code",
  sample_pickup_link: "Sample pickup link",
  lc_credit: "LC / credit",
};

const ORDER_STATUSES = [
  "Order Submitted",
  "Awaiting Team Contact",
  "Sample Test Required",
  "Price Confirmed",
  "Payment Initiated",
  "Completed",
  "Cancelled",
] as const;

/** Buy orders: no "Sample Test Required" — sample/test docs come from seller or others; buyer flow skips that step */
const BUY_ORDER_STATUSES = [
  "Order Submitted",
  "Awaiting Team Contact",
  "Price Confirmed",
  "Payment Initiated",
  "Completed",
  "Cancelled",
] as const;

/** Flow step labels by order type. Buy has no "Sample Test Required". */
const BUY_FLOW_STEP_LABELS = ["Order Submitted", "Awaiting Team Contact", "Price Confirmed", "Payment Initiated", "Order Completed"] as const;
const SELL_FLOW_STEP_LABELS = ["Order Submitted", "Awaiting Team Contact", "Sample Test Required", "Price Confirmed", "Payment Initiated", "Order Completed"] as const;

type FlowStep = { label: string; completed: boolean; active: boolean };

function getFlowStepsForDisplay(order: Order, orderType: OrderDetailType): FlowStep[] {
  const stepLabels = orderType === "buy" ? [...BUY_FLOW_STEP_LABELS] : [...SELL_FLOW_STEP_LABELS];
  const status = order.status;
  if (status === "Cancelled") {
    return stepLabels.map((label) => ({ label, completed: false, active: false }));
  }
  const statusToStep = status === "Completed" ? "Order Completed" : status;
  const activeIndex = stepLabels.indexOf(statusToStep);
  return stepLabels.map((label, i) => ({
    label,
    completed: activeIndex >= 0 && i < activeIndex,
    active: activeIndex >= 0 && i === activeIndex,
  }));
}

function getOrderStatusColor(status: string) {
  if (status === "Completed" || status === "Settled")
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  if (status === "Cancelled")
    return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
}

export type OrderDetailType = "sell" | "buy";

export interface OrderDetailPageProps {
  orderId: string;
  type: OrderDetailType;
  onBack: () => void;
  onNavigateToUser?: (userId: string) => void;
  onNavigateToOrders?: (transactionId?: string) => void;
  onNavigateToEnquiries?: (userId?: string) => void;
  onNavigateToDisputes?: (orderId?: string) => void;
  onNavigateToLogistics?: (orderId?: string) => void;
}

export function OrderDetailPage({
  orderId,
  type,
  onBack,
  onNavigateToUser,
  onNavigateToOrders,
  onNavigateToEnquiries,
  onNavigateToDisputes,
  onNavigateToLogistics,
}: OrderDetailPageProps) {
  const { state, dispatch } = useDashboardStore();
  const [orderForStatus, setOrderForStatus] = useState<Order | null>(null);
  const [orderForCancel, setOrderForCancel] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [addCommOpen, setAddCommOpen] = useState(false);
  const [commEvent, setCommEvent] = useState("");
  const [commNote, setCommNote] = useState("");
  const [commAdmin, setCommAdmin] = useState("Admin");
  const [commContactMethod, setCommContactMethod] = useState<"Email" | "Mobile" | "">("");
  const [addSentOpen, setAddSentOpen] = useState(false);
  const [sentType, setSentType] = useState<SentToUser["type"]>("transport_link");
  const [sentLabel, setSentLabel] = useState("");
  const [sentChannel, setSentChannel] = useState("App");
  const [sentDetail, setSentDetail] = useState("");
  const [addTestingOpen, setAddTestingOpen] = useState(false);
  const [newTestingLabel, setNewTestingLabel] = useState("");
  const [stepDialog, setStepDialog] = useState<StepDialogType>(null);
  const [priceConfirmedFinalAmount, setPriceConfirmedFinalAmount] = useState("");
  const [priceConfirmedNote, setPriceConfirmedNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [orderCompletedNote, setOrderCompletedNote] = useState("");

  const orders = type === "sell" ? state.sellOrders : state.buyOrders;
  const order = orders.find((o) => o.id === orderId) ?? null;
  const relatedTx = order ? state.transactions.find((t) => t.orderId === order.id) : null;
  const orderDisputes = order ? state.disputes.filter((d) => d.orderId === order.id) : [];
  const userEnquiries = order?.userId ? state.enquiries.filter((e) => e.userId === order.userId) : [];
  const logistics = order ? getLogisticsDetailsForOrder(state, order.id) : null;
  const listLabel = type === "sell" ? "Sell Management" : "Buy Management";

  if (!order) {
    return (
      <div className="p-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button
                  type="button"
                  onClick={onBack}
                  className="text-xs font-medium text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  {listLabel}
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-medium text-slate-900 dark:text-white">
                Order {orderId}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card className="border-none shadow-sm">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Order not found.</p>
            <Button variant="outline" className="mt-4" onClick={onBack}>
              Back to {listLabel}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveStatus = () => {
    if (!orderForStatus) return;
    const orderType = orderForStatus.type === "Sell" ? "sell" : "buy";
    const stepLabels = orderType === "buy" ? [...BUY_FLOW_STEP_LABELS] : [...SELL_FLOW_STEP_LABELS];
    const statusToStep = newStatus === "Completed" ? "Order Completed" : newStatus;
    const activeIndex = stepLabels.indexOf(statusToStep);
    const flowSteps: FlowStep[] = stepLabels.map((label, i) => ({
      label,
      completed: activeIndex >= 0 && i < activeIndex,
      active: activeIndex >= 0 && i === activeIndex,
    }));
    const updated = {
      ...orderForStatus,
      status: newStatus,
      flowSteps,
    };
    dispatch({ type: "UPDATE_ORDER", payload: updated });
    toast.success("Order status updated", { description: `${orderForStatus.id} → ${newStatus}. Pipeline updated.` });
    setOrderForStatus(null);
  };

  const handleCancelOrder = () => {
    if (!orderForCancel) return;
    dispatch({ type: "UPDATE_ORDER", payload: { ...orderForCancel, status: "Cancelled" } });
    toast.success("Order cancelled", { description: orderForCancel.id });
    setOrderForCancel(null);
    onBack();
  };

  const applyStepAndAdvance = (o: Order, newStatus: string, stepData: Partial<OrderFlowStepData>) => {
    const orderType = o.type === "Sell" ? "sell" : "buy";
    const stepLabels = orderType === "buy" ? [...BUY_FLOW_STEP_LABELS] : [...SELL_FLOW_STEP_LABELS];
    const statusToStep = newStatus === "Completed" ? "Order Completed" : newStatus;
    const activeIndex = stepLabels.indexOf(statusToStep);
    const flowSteps: FlowStep[] = stepLabels.map((label, i) => ({
      label,
      completed: activeIndex >= 0 && i < activeIndex,
      active: activeIndex >= 0 && i === activeIndex,
    }));
    const updated: Order = {
      ...o,
      status: newStatus,
      flowSteps,
      flowStepData: { ...(o.flowStepData ?? {}), ...stepData },
    };
    dispatch({ type: "UPDATE_ORDER", payload: updated });
  };

  const handlePriceConfirmedSubmit = () => {
    if (!order || !priceConfirmedFinalAmount.trim()) {
      toast.error("Enter final amount");
      return;
    }
    const confirmedAt = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    applyStepAndAdvance(order, "Price Confirmed", {
      priceConfirmed: {
        finalAmount: priceConfirmedFinalAmount.trim(),
        currency: order.currency,
        confirmedAt,
        note: priceConfirmedNote.trim() || undefined,
      },
    });
    toast.success("Price confirmed", { description: `Final amount: ${priceConfirmedFinalAmount.trim()} ${order.currency}` });
    setStepDialog(null);
    setPriceConfirmedFinalAmount("");
    setPriceConfirmedNote("");
  };

  const handlePaymentInitiatedSubmit = () => {
    if (!order) return;
    const initiatedAt = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    applyStepAndAdvance(order, "Payment Initiated", {
      paymentInitiated: {
        method: paymentMethod,
        reference: paymentReference.trim() || undefined,
        initiatedAt,
        note: paymentNote.trim() || undefined,
      },
    });
    toast.success("Payment initiated", { description: paymentMethod });
    setStepDialog(null);
    setPaymentReference("");
    setPaymentNote("");
  };

  const handleOrderCompletedSubmit = () => {
    if (!order) return;
    const completedAt = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    applyStepAndAdvance(order, "Completed", {
      orderCompleted: { completedAt, note: orderCompletedNote.trim() || undefined },
    });
    toast.success("Order completed", { description: order.id });
    setStepDialog(null);
    setOrderCompletedNote("");
  };

  const flowStepsForPipeline = getFlowStepsForDisplay(order, type);
  const nextStepAction = () => {
    if (order.status === "Cancelled") return;
    setOrderForStatus(order);
    setNewStatus(order.status);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-medium text-muted-foreground hover:text-emerald-600 transition-colors"
              >
                {listLabel}
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xs font-medium text-slate-900 dark:text-white">
              {order.id}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header - Order summary (card style, consistent with dashboard) */}
      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{order.id}</h1>
                <Badge className={getOrderStatusColor(order.status)}>{order.status}</Badge>
                <Badge variant="outline" className={type === "sell" ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" : "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"}>
                  {type === "sell" ? "Sell" : "Buy"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {getRegistryUserName(state.registryUsers, order.userId)} · {order.createdAt}
              </p>
              <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mt-1">
                {order.mineral} · {order.qty} {order.unit}
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {order.aiEstimatedAmount} {order.currency}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {order.status !== "Cancelled" && (
                <Button size="default" className="bg-emerald-600 hover:bg-emerald-700" onClick={nextStepAction}>
                  Complete Next Step →
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => { setOrderForStatus(order); setNewStatus(order.status); }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Status
              </Button>
              {order.status !== "Cancelled" && (
                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => setOrderForCancel(order)}>
                  <Ban className="h-4 w-4 mr-2" />
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order progress (card style - flow lives in Orders & Settlements; here only a summary) */}
      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Order progress</CardTitle>
          <CardDescription>Current step for this order. Full pipeline is in Orders &amp; Settlements.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {flowStepsForPipeline.map((s, i) => (
              <div key={s.label} className="flex items-center gap-1.5 flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                    s.completed ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : s.active ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {s.completed ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-medium max-w-[90px] truncate ${s.active ? "text-slate-900 dark:text-white" : "text-muted-foreground"}`}>{s.label}</span>
                {i < flowStepsForPipeline.length - 1 && <span className="text-muted-foreground/60 mx-0.5">→</span>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs: Detail (single detailed view), Financial, Activity - no duplicate flow from other sections */}
      <Tabs defaultValue="detail" className="w-full">
        <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 gap-1 rounded-lg w-auto">
          <TabsTrigger value="detail" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
            <Gem className="h-4 w-4" /> Order detail
          </TabsTrigger>
          <TabsTrigger value="transaction" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
            <CreditCard className="h-4 w-4" /> Financial &amp; transaction
          </TabsTrigger>
          <TabsTrigger value="activity" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
            <MessageSquare className="h-4 w-4" /> Activity &amp; docs
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 space-y-6">
          <TabsContent value="detail" className="mt-0 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Order &amp; user</CardTitle>
                <CardDescription>Core order and registry user. Open User Management to manage the user.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Order ID</Label>
                    <p className="font-mono font-medium text-emerald-600 dark:text-emerald-400">{order.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">User (Registry)</Label>
                    <p className="font-medium">{getRegistryUserName(state.registryUsers, order.userId)}</p>
                    {order.userId && <p className="text-xs text-muted-foreground">{order.userId}</p>}
                    {order.userId && onNavigateToUser && (
                      <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-emerald-600" onClick={() => onNavigateToUser(order.userId!)}>
                        <Users className="h-3.5 w-3.5 mr-1" />
                        View in User Management
                      </Button>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <p className="font-medium">{order.status}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Created</Label>
                    <p className="font-medium">{order.createdAt}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Amount</Label>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      {order.aiEstimatedAmount} {order.currency}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {getOrderIsInternational(order, state.registryUsers) && (
              <Card className="border-none shadow-sm border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-900/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="h-4 w-4 text-violet-600" />
                    International order
                  </CardTitle>
                  <CardDescription>Cross-border: buyer and facility/seller in different countries. Settlement may involve FX or international payment channel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Buyer country:</span> <span className="font-medium">{order.buyerCountry ?? state.registryUsers.find((u) => u.id === order.userId)?.country ?? "—"}</span></p>
                  <p><span className="text-muted-foreground">Facility / seller country:</span> <span className="font-medium">{order.sellerCountry ?? order.facility?.country ?? "—"}</span></p>
                  <p><span className="text-muted-foreground">Order currency:</span> <span className="font-medium">{order.currency}</span></p>
                </CardContent>
              </Card>
            )}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Gem className="h-4 w-4" /> Mineral &amp; quantity
                </CardTitle>
                <CardDescription>Product and quantity for this order.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Mineral</Label>
                  <p className="font-medium">{order.mineral}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Quantity</Label>
                  <p className="font-medium">
                    {order.qty} {order.unit}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="text-sm text-muted-foreground">{order.description}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Facility
                </CardTitle>
                <CardDescription>Delivery or collection facility for this order.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="font-medium">{order.facility?.name}</p>
                <p className="text-muted-foreground">{order.facility?.address}</p>
                <p className="text-muted-foreground">{order.facility?.country}</p>
                {order.facility?.contact && (
                  <p className="text-muted-foreground">Contact: {order.facility.contact}</p>
                )}
              </CardContent>
            </Card>

            {type === "buy" && (order.shippingAddress ?? order.deliveryLocation ?? order.contactInfo ?? order.paymentMethod ?? order.estimatedDeliveryDate ?? order.orderSummary ?? order.sellerName ?? order.deliveryType ?? order.mineralForm ?? order.institutionalPermitNumber != null) && (
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Buy order details</CardTitle>
                  <CardDescription>All details from app buy flow: delivery, shipping, contact, institutional buyer, payment and order summary.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.sellerName && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Seller</Label>
                      <p className="font-medium text-sm mt-0.5">{order.sellerName}</p>
                    </div>
                  )}
                  {order.mineralForm && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Mineral form / type</Label>
                      <p className="font-medium text-sm mt-0.5">{order.mineralForm}</p>
                    </div>
                  )}
                  {order.deliveryType && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Delivery type</Label>
                      <p className="font-medium text-sm mt-0.5">{order.deliveryType}</p>
                    </div>
                  )}
                  {order.deliveryLocation ? (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Delivery location</Label>
                      <div className="text-sm space-y-0.5">
                        {order.deliveryLocation.facilityName && <p className="font-medium">{order.deliveryLocation.facilityName}</p>}
                        {order.deliveryLocation.streetAddress && <p className="text-muted-foreground">{order.deliveryLocation.streetAddress}</p>}
                        <p className="text-muted-foreground">
                          {[order.deliveryLocation.city, order.deliveryLocation.stateRegion, order.deliveryLocation.postalCode].filter(Boolean).join(", ")}
                          {order.deliveryLocation.country && ` ${order.deliveryLocation.country}`}
                        </p>
                        {order.deliveryLocation.contactPhone && <p className="text-muted-foreground">Contact: {order.deliveryLocation.contactPhone}</p>}
                        {order.deliveryLocation.email && <p className="text-muted-foreground">{order.deliveryLocation.email}</p>}
                      </div>
                    </div>
                  ) : order.shippingAddress ? (
                    <div>
                      <Label className="text-xs text-muted-foreground">Ship to</Label>
                      <p className="font-medium text-sm mt-0.5">{order.shippingAddress}</p>
                    </div>
                  ) : null}
                  {order.estimatedDeliveryDate && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Estimated delivery date</Label>
                      <p className="font-medium text-sm mt-0.5">{order.estimatedDeliveryDate}</p>
                    </div>
                  )}
                  {order.contactInfo && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Contact info</Label>
                      <p className="font-medium text-sm">{order.contactInfo.name}</p>
                      <p className="text-xs text-muted-foreground">{order.contactInfo.email}</p>
                      <p className="text-xs text-muted-foreground">{order.contactInfo.phone}</p>
                      {order.contactInfo.companyName && (
                        <>
                          <p className="text-xs text-muted-foreground mt-2 font-medium">Company</p>
                          <p className="text-sm">{order.contactInfo.companyName}</p>
                        </>
                      )}
                      {order.contactInfo.taxIdEin && (
                        <>
                          <p className="text-xs text-muted-foreground font-medium">Tax ID / EIN</p>
                          <p className="text-sm font-mono">{order.contactInfo.taxIdEin}</p>
                        </>
                      )}
                      {order.contactInfo.institutionalBuyerCategory && (
                        <>
                          <p className="text-xs text-muted-foreground font-medium">Institutional buyer category</p>
                          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{order.contactInfo.institutionalBuyerCategory}</p>
                        </>
                      )}
                    </div>
                  )}
                  {order.institutionalPermitNumber != null && order.institutionalPermitNumber !== "" && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Institutional permit number</Label>
                      <p className="font-medium text-sm mt-0.5 font-mono">{order.institutionalPermitNumber}</p>
                    </div>
                  )}
                  {order.paymentMethod && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Payment method</Label>
                      <p className="font-medium text-sm mt-0.5">{order.paymentMethod}</p>
                    </div>
                  )}
                  {order.orderSummary && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <Label className="text-xs text-muted-foreground">Order summary</Label>
                      <div className="mt-1 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{order.orderSummary.subtotalLabel ? `Subtotal (${order.orderSummary.subtotalLabel})` : "Subtotal"}</span>
                          <span className="font-medium">{order.orderSummary.subtotal} {order.orderSummary.currency}</span>
                        </div>
                        {order.orderSummary.tax != null && order.orderSummary.tax !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax</span>
                            <span className="font-medium">{order.orderSummary.tax} {order.orderSummary.currency}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Secure Transport</span>
                          <span className="font-medium">{order.orderSummary.shippingCost} {order.orderSummary.currency}</span>
                        </div>
                        {order.orderSummary.platformFee != null && order.orderSummary.platformFee !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Platform Fee{order.orderSummary.platformFeePercent != null ? ` (${order.orderSummary.platformFeePercent}%)` : ""}
                            </span>
                            <span className="font-medium">{order.orderSummary.platformFee} {order.orderSummary.currency}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                          <span>Total Due</span>
                          <span>{order.orderSummary.total} {order.orderSummary.currency}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {order.escrowProtected && (
                    <div className="rounded-md border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-3">
                      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Escrow Protected</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Funds are not released to the seller until the custody transfer is cryptographically verified.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick actions</CardTitle>
                <CardDescription>Update status or cancel this order. Changes sync across the dashboard and app.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setOrderForStatus(order); setNewStatus(order.status); }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update status
                </Button>
                {order.status !== "Cancelled" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => setOrderForCancel(order)}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Cancel order
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-0 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">Communication</CardTitle>
                  <CardDescription>Record when the team contacts the user (by email or mobile), price updates, and other actions.</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => { setCommEvent(""); setCommNote(""); setCommAdmin("Admin"); setCommContactMethod(""); setAddCommOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add log entry
                </Button>
              </CardHeader>
              <CardContent>
                {order.commLog?.length ? (
                  <div className="space-y-0">
                    {order.commLog.map((c, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-start gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{c.event}</p>
                          {c.contactMethod && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">Contacted via: {c.contactMethod}</p>}
                          {c.note && <p className="text-xs text-muted-foreground mt-0.5">{c.note}</p>}
                        </div>
                        <div className="text-right shrink-0 text-xs">
                          <p className="font-medium text-muted-foreground">{c.admin}</p>
                          <p className="text-muted-foreground">{c.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                    <MessageSquare className="h-10 w-10 mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">No communication log entries yet.</p>
                    <Button size="sm" variant="outline" onClick={() => { setCommEvent(""); setCommNote(""); setCommAdmin("Admin"); setCommContactMethod(""); setAddCommOpen(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add log entry
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">
                    {type === "buy" ? "Documents for this order" : "Testing &amp; docs"}
                  </CardTitle>
                  <CardDescription>
                    {type === "buy"
                      ? "Documents (assay, compliance, B/L, etc.) come from the seller or other parties (lab, verifier, third party). The buyer does not upload — track when each is received for this order."
                      : "Seller uploads required tests and documentation. Add requirements then mark as uploaded when the seller submits."}
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => { setNewTestingLabel(""); setAddTestingOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  {type === "buy" ? "Add document type" : "Add requirement"}
                </Button>
              </CardHeader>
              <CardContent>
                {order.testingReqs?.length ? (
                  <div className="space-y-0">
                    {order.testingReqs.map((req, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                      >
                        <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{req.label}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={
                              req.status === "Uploaded"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            }
                          >
                            {type === "buy" && req.status === "Uploaded" ? "Received" : req.status}
                          </Badge>
                          {req.status === "Pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                              onClick={() => {
                                const updatedReqs = (order.testingReqs ?? []).map((r) =>
                                  r.label === req.label ? { ...r, status: "Uploaded" as const } : r
                                );
                                dispatch({ type: "UPDATE_ORDER", payload: { ...order, testingReqs: updatedReqs } });
                                toast.success(
                                  type === "buy" ? "Marked as received" : "Marked as uploaded",
                                  { description: req.label }
                                );
                              }}
                            >
                              {type === "buy" ? "Mark as received" : "Mark as uploaded"}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                    <FileText className="h-10 w-10 mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">
                      {type === "buy"
                        ? "No document types to track yet. Add types you expect from the seller or other parties (lab, verifier, etc.). Buyer does not upload."
                        : "No testing requirements yet. Add documents or checks for the seller to upload."}
                    </p>
                    <Button size="sm" variant="outline" onClick={() => { setNewTestingLabel(""); setAddTestingOpen(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      {type === "buy" ? "Add document type" : "Add requirement"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">Sent to user</CardTitle>
                  <CardDescription>Record what you send to the user — bank details link, QR code, logistics link. Use &quot;Record sent&quot; and choose the type. This is reflected in the app for the user. Linked to this order and its transaction and logistics.</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => { setSentType("transport_link"); setSentLabel(""); setSentChannel("App"); setSentDetail(""); setAddSentOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Record sent
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-3 py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-4">
                  <span className="text-xs font-medium text-muted-foreground">Connected to:</span>
                  <span className="text-xs">Order <strong>{order.id}</strong></span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs">
                    Transaction: {relatedTx ? <strong className="text-emerald-600 dark:text-emerald-400">{relatedTx.id}</strong> : "None linked"}
                  </span>
                  {onNavigateToLogistics && (
                    <>
                      <span className="text-xs text-muted-foreground">·</span>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs text-[#A855F7]" onClick={() => onNavigateToLogistics(order.id)}>
                        <Truck className="h-3.5 w-3 mr-1" />
                        {logistics ? "View logistics" : "Open Logistics"}
                      </Button>
                    </>
                  )}
                </div>
                {order.sentToUser?.length ? (
                  <div className="space-y-0">
                    {order.sentToUser.map((s, i) => (
                      <div
                        key={i}
                        className="py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {SENT_TYPE_LABELS[s.type]}
                          </Badge>
                          <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{s.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {s.date} · {s.channel}
                        </p>
                        {s.detail && (
                          <p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                    <Send className="h-10 w-10 mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">Nothing sent to user yet. Record when you send links or details.</p>
                    <Button size="sm" variant="outline" onClick={() => { setSentType("transport_link"); setSentLabel(""); setSentChannel("App"); setSentDetail(""); setAddSentOpen(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Record sent
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Link2 className="h-4 w-4" /> Linked across dashboard</CardTitle>
                <CardDescription>This order connects to User Management, Orders &amp; Settlements, Enquiry &amp; Support, Disputes, and Logistics.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">User</p>
                      <p className="text-xs text-muted-foreground">{order.userId ? `${getRegistryUserName(state.registryUsers, order.userId)} · ${order.userId}` : "Not linked"}</p>
                    </div>
                  </div>
                  {onNavigateToUser && order.userId && <Button variant="outline" size="sm" onClick={() => onNavigateToUser(order.userId)}>View in User Management</Button>}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">Transaction</p>
                      <p className="text-xs text-muted-foreground">{relatedTx ? `${relatedTx.id} · ${relatedTx.finalAmount}` : "No settlement linked"}</p>
                    </div>
                  </div>
                  {onNavigateToOrders && <Button variant="outline" size="sm" onClick={() => onNavigateToOrders(relatedTx?.id)}>{relatedTx ? "View in Orders &amp; Settlements" : "Open Orders &amp; Settlements"}</Button>}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <Gavel className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">Disputes</p>
                      <p className="text-xs text-muted-foreground">{orderDisputes.length > 0 ? `${orderDisputes.length} dispute(s)` : "None"}</p>
                    </div>
                  </div>
                  {onNavigateToDisputes && <Button variant="outline" size="sm" onClick={() => onNavigateToDisputes(order.id)}>View Disputes</Button>}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">Enquiries</p>
                      <p className="text-xs text-muted-foreground">{userEnquiries.length > 0 ? `${userEnquiries.length} ticket(s)` : "None"}</p>
                    </div>
                  </div>
                  {onNavigateToEnquiries && <Button variant="outline" size="sm" onClick={() => onNavigateToEnquiries(order.userId)}>Enquiry &amp; Support</Button>}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">Logistics</p>
                      <p className="text-xs text-muted-foreground">{logistics ? `${logistics.carrierName} · ${logistics.trackingNumber}` : "No record"}</p>
                    </div>
                  </div>
                  {onNavigateToLogistics && <Button variant="outline" size="sm" onClick={() => onNavigateToLogistics(order.id)}>{logistics ? "View Logistics" : "Open Logistics"}</Button>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transaction" className="mt-0 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Related transaction</CardTitle>
                <CardDescription>Settlement or payment linked to this order. Link or create settlements in Orders &amp; Settlements.</CardDescription>
              </CardHeader>
              <CardContent>
                {relatedTx ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Transaction ID</Label>
                        <p className="font-mono font-medium text-emerald-600 dark:text-emerald-400">{relatedTx.id}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Status</Label>
                        <Badge
                          className={
                            relatedTx.status === "Completed"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30"
                              : relatedTx.status === "Failed"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30"
                          }
                        >
                          {relatedTx.status}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Final amount</Label>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">
                          {relatedTx.finalAmount}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Method</Label>
                        <p className="font-medium">{relatedTx.method}{relatedTx.paymentChannel ? ` · ${relatedTx.paymentChannel}` : ""}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Date &amp; time</Label>
                        <p className="text-sm">
                          {relatedTx.date} {relatedTx.time}
                        </p>
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
                    {relatedTx.paymentDetails &&
                      Object.keys(relatedTx.paymentDetails).length > 0 && (
                        <div>
                          <Label className="text-xs text-muted-foreground">Payment details</Label>
                          <div className="mt-1 p-3 bg-slate-50 dark:bg-slate-900 rounded-md text-xs space-y-1">
                            {relatedTx.paymentDetails.accountName && (
                              <p>Account: {relatedTx.paymentDetails.accountName}</p>
                            )}
                            {relatedTx.paymentDetails.bankName && (
                              <p>Bank: {relatedTx.paymentDetails.bankName}</p>
                            )}
                            {relatedTx.paymentDetails.maskedAccount && (
                              <p>Masked: {relatedTx.paymentDetails.maskedAccount}</p>
                            )}
                            {relatedTx.paymentDetails.reference && (
                              <p>Ref: {relatedTx.paymentDetails.reference}</p>
                            )}
                            {relatedTx.paymentDetails.network && (
                              <p>Network: {relatedTx.paymentDetails.network}</p>
                            )}
                            {relatedTx.paymentDetails.hash && (
                              <p className="font-mono truncate">
                                Hash: {relatedTx.paymentDetails.hash}</p>
                            )}
                          </div>
                        </div>
                      )}
                    {onNavigateToOrders && (
                      <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" onClick={() => onNavigateToOrders(relatedTx.id)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View in Orders &amp; Settlements
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                    <CreditCard className="h-10 w-10 mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">No settlement linked to this order yet. Create or link one in Orders &amp; Settlements.</p>
                    {onNavigateToOrders && (
                      <Button size="sm" variant="outline" onClick={() => onNavigateToOrders()}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Orders &amp; Settlements
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Update Status Dialog */}
      <Dialog open={!!orderForStatus} onOpenChange={(open) => !open && setOrderForStatus(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update order status</DialogTitle>
            <DialogDescription>
              Change the status for {orderForStatus?.id}. This will sync across the dashboard and app.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {(type === "buy" ? BUY_ORDER_STATUSES : ORDER_STATUSES).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderForStatus(null)}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveStatus}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Price Confirmed — enter final amount */}
      <Dialog open={stepDialog === "priceConfirmed"} onOpenChange={(open) => !open && setStepDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Price confirmed</DialogTitle>
            <DialogDescription>Enter the final agreed amount for this order. The pipeline will move to this step.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="final-amount">Final amount (required)</Label>
              <Input
                id="final-amount"
                value={priceConfirmedFinalAmount}
                onChange={(e) => setPriceConfirmedFinalAmount(e.target.value)}
                placeholder={order?.aiEstimatedAmount ? `e.g. ${order.aiEstimatedAmount}` : "e.g. $1,118,500"}
              />
              {order && <p className="text-xs text-muted-foreground mt-1">Currency: {order.currency}</p>}
            </div>
            <div>
              <Label htmlFor="price-note">Note (optional)</Label>
              <Textarea id="price-note" value={priceConfirmedNote} onChange={(e) => setPriceConfirmedNote(e.target.value)} placeholder="e.g. After negotiation" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStepDialog(null)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handlePriceConfirmedSubmit}>
              Confirm &amp; move to Price Confirmed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Initiated */}
      <Dialog open={stepDialog === "paymentInitiated"} onOpenChange={(open) => !open && setStepDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment initiated</DialogTitle>
            <DialogDescription>Record payment method and reference. The pipeline will move to this step.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Payment method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Wise">Wise</SelectItem>
                  <SelectItem value="Blockchain Settlement">Blockchain Settlement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment-ref">Reference (optional)</Label>
              <Input id="payment-ref" value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="e.g. TX-REF-123" />
            </div>
            <div>
              <Label htmlFor="payment-note">Note (optional)</Label>
              <Textarea id="payment-note" value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStepDialog(null)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handlePaymentInitiatedSubmit}>
              Confirm &amp; move to Payment Initiated
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Completed */}
      <Dialog open={stepDialog === "orderCompleted"} onOpenChange={(open) => !open && setStepDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order completed</DialogTitle>
            <DialogDescription>Mark this order as completed. The pipeline will close this step.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="completed-note">Note (optional)</Label>
              <Textarea id="completed-note" value={orderCompletedNote} onChange={(e) => setOrderCompletedNote(e.target.value)} placeholder="e.g. Delivered and signed" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStepDialog(null)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleOrderCompletedSubmit}>
              Confirm &amp; complete order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Alert */}
      <AlertDialog open={!!orderForCancel} onOpenChange={(open) => !open && setOrderForCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel order?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel order {orderForCancel?.id}. The change will reflect in the app and
              dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleCancelOrder}
            >
              Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add communication log entry */}
      <Dialog open={addCommOpen} onOpenChange={setAddCommOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add communication log entry</DialogTitle>
            <DialogDescription>Record when the team contacts the user (email or mobile) or other events. It will appear in the Communication tab.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="comm-event">Event</Label>
              <Input id="comm-event" value={commEvent} onChange={(e) => setCommEvent(e.target.value)} placeholder="e.g. Team contacted user" />
            </div>
            <div>
              <Label>Contacted via (optional)</Label>
              <Select value={commContactMethod || "none"} onValueChange={(v) => setCommContactMethod(v === "none" ? "" : (v as "Email" | "Mobile"))}>
                <SelectTrigger><SelectValue placeholder="Email or Mobile" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">—</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Use when recording that the team contacted the user.</p>
            </div>
            <div>
              <Label htmlFor="comm-note">Note (optional)</Label>
              <Textarea id="comm-note" value={commNote} onChange={(e) => setCommNote(e.target.value)} placeholder="Details..." rows={2} />
            </div>
            <div>
              <Label htmlFor="comm-admin">Admin</Label>
              <Input id="comm-admin" value={commAdmin} onChange={(e) => setCommAdmin(e.target.value)} placeholder="Admin" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCommOpen(false)}>Cancel</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                if (!commEvent.trim() || !order) return;
                const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                const newEntry = {
                  event: commEvent.trim(),
                  admin: commAdmin.trim() || "Admin",
                  date,
                  note: commNote.trim() || undefined,
                  ...(commContactMethod ? { contactMethod: commContactMethod } : {}),
                };
                const updated = { ...order, commLog: [...(order.commLog ?? []), newEntry] };
                dispatch({ type: "UPDATE_ORDER", payload: updated });
                toast.success("Log entry added");
                setAddCommOpen(false);
                setCommEvent("");
                setCommNote("");
                setCommContactMethod("");
              }}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record sent to user */}
      <Dialog open={addSentOpen} onOpenChange={setAddSentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record sent to user</DialogTitle>
            <DialogDescription>What you record here is shown in the app to the user. Bank details link: use type &quot;Bank details / QR or code&quot; and put the link in Label or Detail. QR code: same type; put QR image link or code in Detail.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Type</Label>
              <Select value={sentType} onValueChange={(v) => setSentType(v as SentToUser["type"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{SENT_TYPE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {sentType === "qr_or_bank" && (
                <p className="text-xs text-muted-foreground mt-1.5">Use for bank details link or QR code. Put the link or code in Label / Detail below. App will show this to the user.</p>
              )}
            </div>
            <div>
              <Label htmlFor="sent-label">Label</Label>
              <Input id="sent-label" value={sentLabel} onChange={(e) => setSentLabel(e.target.value)} placeholder={sentType === "qr_or_bank" ? "e.g. Bank details link or QR code" : sentType === "transport_link" ? "e.g. Logistics / tracking link" : "e.g. Description"} />
            </div>
            <div>
              <Label htmlFor="sent-channel">Channel</Label>
              <Input id="sent-channel" value={sentChannel} onChange={(e) => setSentChannel(e.target.value)} placeholder="App / Email / SMS" />
            </div>
            <div>
              <Label htmlFor="sent-detail">Detail (optional)</Label>
              <Textarea id="sent-detail" value={sentDetail} onChange={(e) => setSentDetail(e.target.value)} placeholder="Additional info" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSentOpen(false)}>Cancel</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                if (!sentLabel.trim() || !order) return;
                const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                const newSent: SentToUser = { type: sentType, label: sentLabel.trim(), date, channel: sentChannel.trim() || "App", detail: sentDetail.trim() || undefined };
                const updated = { ...order, sentToUser: [...(order.sentToUser ?? []), newSent] };
                dispatch({ type: "UPDATE_ORDER", payload: updated });
                toast.success("Recorded sent to user");
                setAddSentOpen(false);
                setSentLabel("");
                setSentDetail("");
              }}
            >
              Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add testing requirement / document type from seller */}
      <Dialog open={addTestingOpen} onOpenChange={setAddTestingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {type === "buy" ? "Add document type" : "Add testing requirement"}
            </DialogTitle>
            <DialogDescription>
              {type === "buy"
                ? "Add a document type to track. Documents come from the seller or other parties (lab, verifier, etc.). Mark as received when you have it — buyer does not upload."
                : "Add a document or check for the seller to upload. Mark as uploaded when received."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="testing-label">
              {type === "buy" ? "Document type" : "Requirement name"}
            </Label>
            <Input
              id="testing-label"
              value={newTestingLabel}
              onChange={(e) => setNewTestingLabel(e.target.value)}
              placeholder={type === "buy" ? "e.g. Assay Certificate, Lab report, Bill of Lading" : "e.g. Assay Certificate, Export Compliance"}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTestingOpen(false)}>Cancel</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                if (!newTestingLabel.trim() || !order) return;
                const newReq = { label: newTestingLabel.trim(), status: "Pending" as const };
                const updated = { ...order, testingReqs: [...(order.testingReqs ?? []), newReq] };
                dispatch({ type: "UPDATE_ORDER", payload: updated });
                toast.success(type === "buy" ? "Document type added" : "Requirement added", { description: newReq.label });
                setAddTestingOpen(false);
                setNewTestingLabel("");
              }}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
